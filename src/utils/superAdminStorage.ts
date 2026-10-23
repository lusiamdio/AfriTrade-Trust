import { BusinessListing, PlatformUserAccount, SuspiciousListingReport } from '../types';

const USERS_STORAGE_KEY = 'afritrade_platform_users_v2';
const REPORTS_STORAGE_KEY = 'afritrade_reports_v2';
export const MASTER_ADMIN_PASSKEY = 'AFRI-ADMIN-2026';

export function generateRandomPin(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AFR-${code}`;
}

export function loadPlatformUsers(businesses: BusinessListing[]): PlatformUserAccount[] {
  let storedUsers: PlatformUserAccount[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      storedUsers = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse stored platform users:', e);
  }

  // Ensure default super admin exists
  const hasSuperAdmin = storedUsers.some((u) => u.role === 'super_admin');
  if (!hasSuperAdmin) {
    const defaultSuperAdmin: PlatformUserAccount = {
      id: 'usr-admin-master',
      name: 'Pan-African Sovereign Administrator',
      email: 'admin@afritradeos.co.za',
      phone: '+27 11 884 0000',
      role: 'super_admin',
      status: 'active',
      country: 'South Africa',
      countryCode: 'ZA',
      organizationName: 'AfriTrade OS Sovereign Trust Authority',
      securityPin: MASTER_ADMIN_PASSKEY,
      createdAt: '2026-01-01T00:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      notes: 'Master Super Admin with root access to all directory data, user permissions, and AfCFTA compliance.',
    };
    storedUsers.unshift(defaultSuperAdmin);
  }

  // Synchronize merchants from listed businesses
  businesses.forEach((biz) => {
    const existingIndex = storedUsers.findIndex((u) => u.businessId === biz.id || (u.organizationName === biz.name && u.role === 'merchant'));
    if (existingIndex >= 0) {
      // Keep in sync with business details
      storedUsers[existingIndex] = {
        ...storedUsers[existingIndex],
        organizationName: biz.name,
        country: biz.country,
        countryCode: biz.countryCode,
        phone: biz.whatsappNumber || biz.phone || storedUsers[existingIndex].phone,
        email: biz.email || storedUsers[existingIndex].email,
        securityPin: biz.securityPin || storedUsers[existingIndex].securityPin || generateRandomPin(),
        verificationTier: biz.verification.tier,
      };
    } else {
      // Create new merchant user record
      const newMerchantUser: PlatformUserAccount = {
        id: `usr-merch-${biz.id}`,
        name: biz.verification.registeredEntityName || biz.name,
        email: biz.email || 'contact@enterprise.com',
        phone: biz.whatsappNumber || biz.phone || '+244 923 000 000',
        role: 'merchant',
        status: 'active',
        country: biz.country,
        countryCode: biz.countryCode,
        organizationName: biz.name,
        businessId: biz.id,
        securityPin: biz.securityPin || generateRandomPin(),
        verificationTier: biz.verification.tier,
        createdAt: new Date().toISOString(),
        notes: `Registered enterprise in ${biz.city}, ${biz.country}. Official Registrar: ${biz.verification.registrarAuthority}.`,
      };
      storedUsers.push(newMerchantUser);
    }
  });

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
  } catch (e) {
    console.warn('Failed to save synchronized users:', e);
  }

  return storedUsers;
}

export function savePlatformUsers(users: PlatformUserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save platform users:', e);
  }
}

export function loadSuspiciousReports(): SuspiciousListingReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse reports:', e);
  }
  return [];
}

export function saveSuspiciousReports(reports: SuspiciousListingReport[]): void {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('Failed to save reports:', e);
  }
}
