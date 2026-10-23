import { BusinessListing, SourcingRequest, SupplierQuotation } from '../types';

export interface OfflineAction {
  id: string;
  type: 'POST_RFQ' | 'SUBMIT_QUOTE' | 'ADD_BUSINESS' | 'CLAIM_LISTING' | 'SUBMIT_REPORT';
  payload: any;
  timestamp: string;
}

export interface OfflineStorageSnapshot {
  version: number;
  lastUpdated: string;
  businesses: BusinessListing[];
  sourcingRequests: SourcingRequest[];
  quotations: SupplierQuotation[];
}

const STORAGE_KEYS = {
  BUSINESSES: 'afritrade_user_directory_v7',
  RFQS: 'afritrade_user_rfqs_v7',
  QUOTES: 'afritrade_user_quotes_v7',
  SAVED_IDS: 'afritrade_user_saved_v7',
  OUTBOX: 'afritrade_user_outbox_v7',
  CACHE_META: 'afritrade_user_meta_v7',
  VERSION: 'afritrade_storage_version_v7',
};

/**
 * Guarantee 100% clean directory on v7 boot.
 * Completely purges any legacy mock data from the user's browser localStorage.
 */
export function initializeCleanDirectoryStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const currentVer = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (currentVer !== '7.0') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('afritrade') || k.includes('business') || k.includes('rfq') || k.includes('mock'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {
          // ignore
        }
      });
      localStorage.setItem(STORAGE_KEYS.VERSION, '7.0');
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, '[]');
      localStorage.setItem(STORAGE_KEYS.RFQS, '[]');
      localStorage.setItem(STORAGE_KEYS.QUOTES, '[]');
      console.log('[Storage] Clean slate initialized. Directory has 0 businesses.');
    }
  } catch (e) {
    console.warn('[Storage] Clean directory init error:', e);
  }
}

// Run immediately on script evaluation
initializeCleanDirectoryStorage();

/**
 * Save current marketplace dataset into local persistence cache
 */
export function saveMarketplaceCache(
  businesses: BusinessListing[],
  rfqs: SourcingRequest[],
  quotes: SupplierQuotation[]
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(rfqs));
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    localStorage.setItem(
      STORAGE_KEYS.CACHE_META,
      JSON.stringify({
        lastUpdated: new Date().toISOString(),
        businessCount: businesses.length,
        rfqCount: rfqs.length,
        quoteCount: quotes.length,
      })
    );
  } catch (err) {
    console.warn('[OfflineCache] Could not persist marketplace data:', err);
  }
}

/**
 * Read cached marketplace dataset from local persistence.
 * Returns empty lists [] if no user has listed a business yet.
 */
export function loadMarketplaceCache(): {
  businesses: BusinessListing[];
  sourcingRequests: SourcingRequest[];
  quotations: SupplierQuotation[];
  metadata: { lastUpdated: string; businessCount: number; rfqCount: number; quoteCount: number } | null;
} {
  try {
    const rawBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    const rawRfq = localStorage.getItem(STORAGE_KEYS.RFQS);
    const rawQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
    const rawMeta = localStorage.getItem(STORAGE_KEYS.CACHE_META);

    return {
      businesses: rawBiz ? JSON.parse(rawBiz) : [],
      sourcingRequests: rawRfq ? JSON.parse(rawRfq) : [],
      quotations: rawQuotes ? JSON.parse(rawQuotes) : [],
      metadata: rawMeta ? JSON.parse(rawMeta) : null,
    };
  } catch (err) {
    console.warn('[OfflineCache] Error reading cached marketplace data:', err);
    return {
      businesses: [],
      sourcingRequests: [],
      quotations: [],
      metadata: null,
    };
  }
}

/**
 * Completely wipe all marketplace and directory data from the device
 */
export function clearAllDirectoryData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });
    localStorage.setItem(STORAGE_KEYS.VERSION, '7.0');
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, '[]');
    localStorage.setItem(STORAGE_KEYS.RFQS, '[]');
    localStorage.setItem(STORAGE_KEYS.QUOTES, '[]');
    console.log('[OfflineCache] All directory data completely wiped.');
  } catch (e) {
    console.warn('[OfflineCache] Could not wipe directory data:', e);
  }
}

/**
 * Export real directory data as JSON string for backup/sharing
 */
export function exportDirectoryJSON(
  businesses: BusinessListing[],
  rfqs: SourcingRequest[],
  quotes: SupplierQuotation[]
): string {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    platform: 'AfriTrade Trust',
    version: '7.0',
    businesses,
    sourcingRequests: rfqs,
    quotations: quotes,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Import real directory data from JSON string
 */
export function importDirectoryJSON(rawJSON: string): {
  businesses: BusinessListing[];
  sourcingRequests: SourcingRequest[];
  quotations: SupplierQuotation[];
} {
  try {
    const parsed = JSON.parse(rawJSON);
    const businesses = Array.isArray(parsed.businesses) ? parsed.businesses : [];
    const sourcingRequests = Array.isArray(parsed.sourcingRequests) ? parsed.sourcingRequests : [];
    const quotations = Array.isArray(parsed.quotations) ? parsed.quotations : [];

    saveMarketplaceCache(businesses, sourcingRequests, quotations);
    return { businesses, sourcingRequests, quotations };
  } catch (e) {
    throw new Error('Invalid JSON format for directory import');
  }
}

/**
 * Queue an offline transaction (e.g. quote submission or RFQ post when offline)
 */
export function queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): void {
  try {
    const existing: OfflineAction[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.OUTBOX) || '[]'
    );
    const newAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    existing.push(newAction);
    localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(existing));
    console.log('[OfflineCache] Action queued for sync:', newAction.type);
  } catch (e) {
    console.warn('[OfflineCache] Could not queue offline action:', e);
  }
}

/**
 * Get count of pending offline transactions
 */
export function getPendingOfflineActionsCount(): number {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.OUTBOX) || '[]');
    return existing.length;
  } catch {
    return 0;
  }
}

/**
 * Clear queued outbox actions after sync
 */
export function clearOfflineActions(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OUTBOX);
  } catch (e) {
    console.warn('[OfflineCache] Could not clear outbox:', e);
  }
}
