import React, { useState, useEffect, useMemo } from 'react';
import {
  BusinessListing,
  SourcingRequest,
  SupplierQuotation,
  LanguageCode,
  CurrencyCode,
  BusinessReview,
  PlatformUserAccount,
  SuspiciousListingReport,
} from './types';
import { AISearchBar } from './components/AISearchBar';
import { BusinessCard } from './components/BusinessCard';
import { B2BMarketplace } from './components/B2BMarketplace';
import { SMEStorefrontBuilder } from './components/SMEStorefrontBuilder';
import { ResourceHub } from './components/ResourceHub';
import { TrustHubView } from './components/TrustHubView';
import { SideCenterMenu } from './components/SideCenterMenu';
import { MotionBackground } from './components/MotionBackground';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TRANSLATIONS } from './i18n/translations';
import { saveMarketplaceCache, loadMarketplaceCache } from './utils/offlineDataCache';
import { ALL_AFRICAN_COUNTRIES } from './utils/africanCountries';
import {
  loadPlatformUsers,
  savePlatformUsers,
  loadSuspiciousReports,
  saveSuspiciousReports,
} from './utils/superAdminStorage';
import {
  initRealtimeBroadcast,
  broadcastRealtimeUpdate,
  RealtimeSyncPayload,
  isSupabaseConfigured,
  fetchBusinessesFromSupabase,
  fetchRFQsFromSupabase,
  fetchQuotationsFromSupabase,
  fetchPlatformUsersFromSupabase,
  upsertBusinessToSupabase,
  upsertRFQToSupabase,
  upsertQuotationToSupabase,
  upsertPlatformUserToSupabase,
  insertReviewToSupabase,
  insertReportToSupabase,
  syncBusinessesToSupabase,
} from './utils/supabaseClient';

// Webpages (Transformed from all modals into dedicated full webpages)
import { EnterDirectoryPage } from './pages/EnterDirectoryPage';
import { ListBusinessPage } from './pages/ListBusinessPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { PostRFQPage } from './pages/PostRFQPage';
import { SubmitQuotePage } from './pages/SubmitQuotePage';
import { CompareQuotesPage } from './pages/CompareQuotesPage';
import { CrossBorderAdvisorPage } from './pages/CrossBorderAdvisorPage';
import { ReportSuspiciousPage } from './pages/ReportSuspiciousPage';
import { ClaimListingPage } from './pages/ClaimListingPage';
import { SuperAdminPortalPage } from './pages/SuperAdminPortalPage';

import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  SlidersHorizontal,
  Globe,
  X,
  Lock,
  LogIn,
  Bookmark,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { detectBrowserLanguage, saveLanguagePreference } from './utils/languageDetector';
import { getDefaultReviewsForBusiness } from './utils/trustScore';

export default function App() {
  // Localization & Preferences with Browser Auto-Detection
  const [detectionNotice, setDetectionNotice] = useState<{
    shown: boolean;
    lang: LanguageCode;
    locale: string;
  } | null>(null);

  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const res = detectBrowserLanguage();
    return res.detectedLang;
  });

  useEffect(() => {
    const res = detectBrowserLanguage();
    if (res.isAutoDetected) {
      setDetectionNotice({
        shown: true,
        lang: res.detectedLang,
        locale: res.matchedLocale,
      });
      const timer = setTimeout(() => {
        setDetectionNotice((prev) => (prev ? { ...prev, shown: false } : null));
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelectLang = (newLang: LanguageCode) => {
    setCurrentLang(newLang);
    saveLanguagePreference(newLang);
    setDetectionNotice(null);
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);

  // Webpage Navigation State
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Dedicated webpage context state
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListing | null>(null);
  const [activeRFQForQuote, setActiveRFQForQuote] = useState<SourcingRequest | null>(null);
  const [activeRFQForCompare, setActiveRFQForCompare] = useState<SourcingRequest | null>(null);
  const [targetBusinessForAction, setTargetBusinessForAction] = useState<BusinessListing | null>(null);

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState<{
    role: 'merchant' | 'buyer';
    business?: BusinessListing;
    name?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('afritrade_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Data Collections with Offline Storage & Synchronization (clean, no mock data)
  const [businesses, setBusinesses] = useState<BusinessListing[]>(() => {
    return loadMarketplaceCache().businesses;
  });

  const [sourcingRequests, setSourcingRequests] = useState<SourcingRequest[]>(() => {
    return loadMarketplaceCache().sourcingRequests;
  });

  const [quotations, setQuotations] = useState<SupplierQuotation[]>(() => {
    return loadMarketplaceCache().quotations;
  });

  // Super Admin Governance State (Users Access & Dispute Reports)
  const [platformUsers, setPlatformUsers] = useState<PlatformUserAccount[]>(() => {
    return loadPlatformUsers(loadMarketplaceCache().businesses);
  });

  const [suspiciousReports, setSuspiciousReports] = useState<SuspiciousListingReport[]>(() => {
    return loadSuspiciousReports();
  });

  useEffect(() => {
    savePlatformUsers(platformUsers);
  }, [platformUsers]);

  useEffect(() => {
    saveSuspiciousReports(suspiciousReports);
  }, [suspiciousReports]);

  // Automatically persist all collections into offline PWA storage
  useEffect(() => {
    saveMarketplaceCache(businesses, sourcingRequests, quotations);
  }, [businesses, sourcingRequests, quotations]);

  // Realtime Supabase Broadcast listener & multi-client sync
  const [supabaseRealtimeConnected, setSupabaseRealtimeConnected] = useState<boolean>(false);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    initRealtimeBroadcast((payload: RealtimeSyncPayload) => {
      switch (payload.event) {
        case 'BUSINESS_ADDED':
          if (payload.data && payload.data.id) {
            setBusinesses((prev) => {
              if (prev.some((b) => b.id === payload.data.id)) return prev;
              return [payload.data, ...prev];
            });
          }
          break;
        case 'BUSINESS_UPDATED':
          if (payload.data && payload.data.id) {
            setBusinesses((prev) =>
              prev.map((b) => (b.id === payload.data.id ? payload.data : b))
            );
          }
          break;
        case 'RFQ_POSTED':
          if (payload.data && payload.data.id) {
            setSourcingRequests((prev) => {
              if (prev.some((r) => r.id === payload.data.id)) return prev;
              return [payload.data, ...prev];
            });
          }
          break;
        case 'QUOTE_SUBMITTED':
          if (payload.data && payload.data.id) {
            setQuotations((prev) => {
              if (prev.some((q) => q.id === payload.data.id)) return prev;
              return [payload.data, ...prev];
            });
          }
          break;
        case 'FORCE_SYNC':
          if (payload.data?.reason === 'CREDENTIALS_ROTATED') {
            setCurrentUser(null);
          }
          break;
      }
    }).then((unsub) => {
      cleanup = unsub;
      setSupabaseRealtimeConnected(true);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Hydrate data from Supabase PostgreSQL on startup
  useEffect(() => {
    let isMounted = true;
    async function hydrateFromSupabase() {
      try {
        const [remoteBiz, remoteRFQs, remoteQuotes, remoteUsers] = await Promise.all([
          fetchBusinessesFromSupabase(),
          fetchRFQsFromSupabase(),
          fetchQuotationsFromSupabase(),
          fetchPlatformUsersFromSupabase(),
        ]);

        if (!isMounted) return;

        if (remoteBiz.length > 0) {
          setBusinesses((localBiz) => {
            const map = new Map<string, BusinessListing>();
            localBiz.forEach((b) => map.set(b.id, b));
            remoteBiz.forEach((b) => map.set(b.id, b));
            return Array.from(map.values());
          });
        }

        if (remoteRFQs.length > 0) {
          setSourcingRequests((localRFQs) => {
            const map = new Map<string, SourcingRequest>();
            localRFQs.forEach((r) => map.set(r.id, r));
            remoteRFQs.forEach((r) => map.set(r.id, r));
            return Array.from(map.values());
          });
        }

        if (remoteQuotes.length > 0) {
          setQuotations((localQuotes) => {
            const map = new Map<string, SupplierQuotation>();
            localQuotes.forEach((q) => map.set(q.id, q));
            remoteQuotes.forEach((q) => map.set(q.id, q));
            return Array.from(map.values());
          });
        }

        if (remoteUsers.length > 0) {
          setPlatformUsers((localUsers) => {
            const map = new Map<string, PlatformUserAccount>();
            localUsers.forEach((u) => map.set(u.id, u));
            remoteUsers.forEach((u) => map.set(u.id, u));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        console.debug('[Supabase Initial Load Error]', e);
      }
    }

    hydrateFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);


  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [afcftaAdvice, setAfcftaAdvice] = useState<string | undefined>(undefined);
  const [aiMatchMap, setAiMatchMap] = useState<Record<string, string>>({});

  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);
  const [filterAfcftaOnly, setFilterAfcftaOnly] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('afritrade_businesses_v2', JSON.stringify(businesses));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [businesses]);

  useEffect(() => {
    try {
      localStorage.setItem('afritrade_rfqs_v2', JSON.stringify(sourcingRequests));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [sourcingRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('afritrade_quotes_v2', JSON.stringify(quotations));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [quotations]);

  // Bookmarking System: Authenticated buyers can save favorite suppliers
  const [savedBusinessIds, setSavedBusinessIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('afritrade_saved_suppliers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleBookmark = (businessId: string) => {
    setSavedBusinessIds((prev) => {
      const next = prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId];
      try {
        localStorage.setItem('afritrade_saved_suppliers', JSON.stringify(next));
      } catch (e) {
        console.warn('Storage sync error:', e);
      }
      return next;
    });
  };

  // Synchronized Real-Time Reviews Handler
  const handleAddReview = (businessId: string, review: BusinessReview) => {
    let updatedBusinessTarget: BusinessListing | null = null;
    setBusinesses((prev) => {
      const updated = prev.map((b) => {
        if (b.id === businessId) {
          const existingReviews = b.reviews && b.reviews.length > 0
            ? b.reviews
            : getDefaultReviewsForBusiness(b);
          const newReviews = [review, ...existingReviews];
          const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
          const newRating = Number((sum / newReviews.length).toFixed(1));
          const updatedBiz: BusinessListing = {
            ...b,
            reviews: newReviews,
            rating: newRating,
            reviewCount: newReviews.length,
          };
          updatedBusinessTarget = updatedBiz;
          return updatedBiz;
        }
        return b;
      });
      try {
        localStorage.setItem('afritrade_businesses_v2', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync error:', e);
      }
      return updated;
    });

    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness((prev) => {
        if (!prev) return null;
        const existingReviews = prev.reviews && prev.reviews.length > 0
          ? prev.reviews
          : getDefaultReviewsForBusiness(prev);
        const newReviews = [review, ...existingReviews];
        const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
        const newRating = Number((sum / newReviews.length).toFixed(1));
        return {
          ...prev,
          reviews: newReviews,
          rating: newRating,
          reviewCount: newReviews.length,
        };
      });
    }

    // Persist review and updated business to Supabase
    insertReviewToSupabase(businessId, review).catch(console.warn);
    if (updatedBusinessTarget) {
      upsertBusinessToSupabase(updatedBusinessTarget).catch(console.warn);
      broadcastRealtimeUpdate('BUSINESS_UPDATED', updatedBusinessTarget);
    }
  };

  const savedBusinesses = useMemo(() => {
    return businesses.filter((b) => savedBusinessIds.includes(b.id));
  }, [businesses, savedBusinessIds]);

  // AI Natural Language Search Handler
  const handleAISearch = async (queryText: string) => {
    setSearchQuery(queryText);
    setIsSearchingAI(true);
    setActiveTab('explore');

    const businessSummaries = businesses.map((b) => ({
      id: b.id,
      name: b.name,
      country: b.country,
      city: b.city,
      industry: b.industry,
      products: b.products.map((p) => p.name),
      verificationTier: b.verification.tier,
      certifications: b.verification.independentCertifications,
      countriesServed: b.tradeReadiness.countriesServed,
      afcftaRegistered: b.tradeReadiness.afcftaRegistered,
    }));

    try {
      const res = await fetch('/api/ai/natural-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language: currentLang,
          businessSummaries,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setParsedIntent(data.parsedIntent);
        setAfcftaAdvice(data.afcftaAdvice);

        if (Array.isArray(data.matches)) {
          const matchReasons: Record<string, string> = {};
          data.matches.forEach((m: any) => {
            if (m.id && m.reason) {
              matchReasons[m.id] = m.reason;
            }
          });
          setAiMatchMap(matchReasons);
        }
      } else {
        performLocalHeuristicSearch(queryText);
      }
    } catch {
      performLocalHeuristicSearch(queryText);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const performLocalHeuristicSearch = (queryText: string) => {
    const q = queryText.toLowerCase();
    const matchReasons: Record<string, string> = {};

    let detectedProduct = '';
    let detectedCountry = '';
    let detectedExport = '';

    if (q.includes('packag') || q.includes('embalagen') || q.includes('carton') || q.includes('caixa')) {
      detectedProduct = 'Packaging & Containers';
    }
    if (q.includes('angola')) detectedCountry = 'Angola';
    if (q.includes('kenya') || q.includes('quénia')) detectedCountry = 'Kenya';
    if (q.includes('nigeria') || q.includes('nigéria')) detectedCountry = 'Nigeria';
    if (q.includes('namibia') || q.includes('namíbia')) detectedExport = 'Namibia';

    businesses.forEach((b) => {
      const bText = (
        b.name +
        ' ' +
        b.tagline +
        ' ' +
        b.country +
        ' ' +
        b.industry +
        ' ' +
        b.tradeReadiness.countriesServed.join(' ') +
        ' ' +
        b.products.map((p) => p.name).join(' ')
      ).toLowerCase();

      const words = q.split(/\s+/).filter((w) => w.length > 2);
      const matchesAllWords = words.some((w) => bText.includes(w));

      if (matchesAllWords) {
        matchReasons[b.id] = `Verified in ${b.country}. Serves ${b.tradeReadiness.countriesServed.slice(0, 2).join(', ')}.`;
      }
    });

    setParsedIntent({
      productCategory: detectedProduct,
      originCountry: detectedCountry,
      destinationCountry: detectedExport,
      mustBeVerified: true,
      interpretation: `Filtered suppliers with capabilities matching "${queryText}"`,
    });
    setAfcftaAdvice(
      'AfCFTA preferential 0% import duty applies when accompanied by Form B Certificate of Origin.'
    );
    setAiMatchMap(matchReasons);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setParsedIntent(null);
    setAfcftaAdvice(undefined);
    setAiMatchMap({});
  };

  // Filtered Businesses
  const displayedBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      if (Object.keys(aiMatchMap).length > 0 && !aiMatchMap[b.id]) {
        return false;
      }

      if (searchQuery && Object.keys(aiMatchMap).length === 0) {
        const text = (
          b.name +
          ' ' +
          b.tagline +
          ' ' +
          b.country +
          ' ' +
          b.industry +
          ' ' +
          b.tradeReadiness.countriesServed.join(' ') +
          ' ' +
          b.products.map((p) => p.name).join(' ')
        ).toLowerCase();

        const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const matches = words.every((w) => text.includes(w));
        if (!matches) return false;
      }

      if (filterCountry !== 'all' && b.country !== filterCountry) {
        return false;
      }

      if (filterType !== 'all') {
        if (filterType === 'manufacturer' && b.businessType !== 'manufacturer') return false;
        if (filterType === 'agro_processor' && b.businessType !== 'agro_processor') return false;
        if (filterType === 'wholesaler' && b.businessType !== 'wholesaler') return false;
      }

      if (filterVerifiedOnly && b.verification.tier === 'unverified') {
        return false;
      }

      if (filterAfcftaOnly && !b.tradeReadiness.afcftaRegistered) {
        return false;
      }

      return true;
    });
  }, [businesses, searchQuery, aiMatchMap, filterCountry, filterType, filterVerifiedOnly, filterAfcftaOnly]);

  const handleTrackWhatsAppClick = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? { ...b, whatsappClicksCount: b.whatsappClicksCount + 1 }
          : b
      )
    );
  };

  const handlePostNewRFQ = (newRfq: Partial<SourcingRequest>) => {
    const fullRFQ: SourcingRequest = {
      id: `rfq-${Date.now()}`,
      title: newRfq.title || 'Procurement Tender',
      buyerName: newRfq.buyerName || 'Verified Buyer',
      buyerCompany: newRfq.buyerCompany || 'Commercial Enterprise',
      buyerCountry: newRfq.buyerCountry || 'Angola',
      buyerCountryCode: newRfq.buyerCountryCode || 'AO',
      targetDestination: newRfq.targetDestination || 'Main Port',
      category: newRfq.category || 'Packaging & Containers',
      quantityNeeded: newRfq.quantityNeeded || '1,000 units',
      targetBudgetUSD: newRfq.targetBudgetUSD || 1.0,
      requiredCertifications: newRfq.requiredCertifications || ['Registered Entity'],
      preferredIncoterm: newRfq.preferredIncoterm || 'CIF',
      deadlineDate: newRfq.deadlineDate || '2026-12-31',
      description: newRfq.description || '',
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open',
      whatsappContact: newRfq.whatsappContact || '+244923000000',
      quotationsReceivedCount: 0,
    };

    setSourcingRequests([fullRFQ, ...sourcingRequests]);
    upsertRFQToSupabase(fullRFQ).catch(console.warn);
    broadcastRealtimeUpdate('RFQ_POSTED', fullRFQ);
  };

  const handleSubmitQuotation = (newQuote: Partial<SupplierQuotation>) => {
    const fullQuote: SupplierQuotation = {
      id: `quote-${Date.now()}`,
      rfqId: newQuote.rfqId || '',
      supplierId: newQuote.supplierId || '',
      supplierName: newQuote.supplierName || 'Verified Supplier',
      supplierCountry: newQuote.supplierCountry || 'Angola',
      unitPriceUSD: newQuote.unitPriceUSD || 1.0,
      totalPriceUSD: newQuote.totalPriceUSD || 1000,
      moq: newQuote.moq || '500 units',
      leadTimeDays: newQuote.leadTimeDays || 7,
      incoterm: newQuote.incoterm || 'FOB',
      paymentTerms: newQuote.paymentTerms || 'Trade Escrow',
      afcftaTariffEligible: Boolean(newQuote.afcftaTariffEligible),
      notes: newQuote.notes || '',
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setQuotations([fullQuote, ...quotations]);
    upsertQuotationToSupabase(fullQuote).catch(console.warn);
    broadcastRealtimeUpdate('QUOTE_SUBMITTED', fullQuote);
    setSourcingRequests((prev) =>
      prev.map((r) =>
        r.id === fullQuote.rfqId
          ? { ...r, quotationsReceivedCount: (r.quotationsReceivedCount || 0) + 1 }
          : r
      )
    );
  };

  const handleAddNewBusiness = (newBiz: BusinessListing, targetTab?: string) => {
    setBusinesses((prev) => [newBiz, ...prev]);
    setSelectedBusiness(newBiz);
    const sessionData = { role: 'merchant' as const, business: newBiz };
    setCurrentUser(sessionData);

    const newMerchantUser: PlatformUserAccount = {
      id: `usr-merch-${newBiz.id}`,
      name: newBiz.verification.registeredEntityName || newBiz.name,
      email: newBiz.email || 'contact@enterprise.com',
      phone: newBiz.whatsappNumber || newBiz.phone || '+244 923 000 000',
      role: 'merchant',
      status: 'active',
      country: newBiz.country,
      countryCode: newBiz.countryCode,
      organizationName: newBiz.name,
      businessId: newBiz.id,
      securityPin: newBiz.securityPin,
      verificationTier: newBiz.verification.tier,
      createdAt: new Date().toISOString(),
      notes: `Registered enterprise in ${newBiz.city}, ${newBiz.country}.`,
    };
    setPlatformUsers((prev) => [newMerchantUser, ...prev]);

    try {
      localStorage.setItem('afritrade_auth_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
    if (targetTab) {
      setActiveTab(targetTab);
    }

    // Persist to Supabase in real-time
    upsertBusinessToSupabase(newBiz).catch(console.warn);
    upsertPlatformUserToSupabase(newMerchantUser).catch(console.warn);

    broadcastRealtimeUpdate('BUSINESS_ADDED', newBiz);
  };

  const defaultSMEStore = currentUser?.business || businesses[0];

  const handleUpdateBusiness = (updated: BusinessListing) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    if (selectedBusiness?.id === updated.id) {
      setSelectedBusiness(updated);
    }
    if (currentUser?.business?.id === updated.id) {
      const updatedUser = { ...currentUser, business: updated };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('afritrade_auth_session', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('Storage sync error:', e);
      }
    }

    // Persist to Supabase
    upsertBusinessToSupabase(updated).catch(console.warn);

    broadcastRealtimeUpdate('BUSINESS_UPDATED', updated);
  };

  const handleDirectWhatsAppText = (phone: string, text: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Navigation Helpers to Webpages
  const openBusinessDetailWebpage = (b: BusinessListing) => {
    setSelectedBusiness(b);
    setActiveTab('business-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPostRFQWebpage = () => {
    setActiveTab('post-rfq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCompareQuotesWebpage = (rfq: SourcingRequest) => {
    setActiveRFQForCompare(rfq);
    setActiveTab('compare-quotes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSubmitQuoteWebpage = (rfq: SourcingRequest) => {
    setActiveRFQForQuote(rfq);
    setActiveTab('submit-quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openReportWebpage = (b: BusinessListing) => {
    setTargetBusinessForAction(b);
    setActiveTab('report-suspicious');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openClaimWebpage = (b: BusinessListing) => {
    setTargetBusinessForAction(b);
    setActiveTab('claim-business');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('afritrade_auth_session');
    } catch (e) {
      console.warn('Storage error:', e);
    }
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-white selection:text-black relative pb-12">
      {/* Motion Graphics Objects & Background */}
      <MotionBackground />

      {/* Side-Center Minimizable Menu */}
      <SideCenterMenu
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrentCurrency}
        savedCount={savedBusinessIds.length}
      />

      {/* Offline Status & Local Cache Indicator */}
      <OfflineIndicator currentLang={currentLang} />

      {/* Auto-Detection Notification Banner */}
      <AnimatePresence>
        {detectionNotice?.shown && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto px-4 pt-3 relative z-30"
          >
            <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-white font-bold block truncate">
                    {detectionNotice.lang === 'fr'
                      ? 'Langue détectée automatiquement : Français'
                      : detectionNotice.lang === 'pt'
                      ? 'Idioma detectado automaticamente: Português'
                      : detectionNotice.lang === 'sw'
                      ? 'Lugha iliyotambuliwa kiotomatiki: Kiswahili'
                      : 'Language auto-detected'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Browser locale: {detectionNotice.locale}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectLang('en')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  {detectionNotice.lang === 'fr'
                    ? 'Passer en anglais'
                    : detectionNotice.lang === 'pt'
                    ? 'Mudar para inglês'
                    : 'Switch to English'}
                </button>
                <button
                  type="button"
                  onClick={() => setDetectionNotice(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area (Webpages) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
        {/* WEBPAGE 1: DIRECTORY EXPLORATION */}
        {activeTab === 'explore' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <AISearchBar
              currentLang={currentLang}
              onSearch={handleAISearch}
              isLoading={isSearchingAI}
              activeQuery={searchQuery}
              onClear={handleClearSearch}
              parsedIntent={parsedIntent}
              afcftaAdvice={afcftaAdvice}
            />

            {/* Filter Toolbar (Zero Borders) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-neutral-400 font-mono flex items-center gap-1.5 uppercase text-[11px] font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                  {t.filterBy}
                </span>

                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="bg-neutral-900 text-white font-medium px-3 py-2 rounded-xl cursor-pointer hover:bg-neutral-850 transition-colors"
                >
                  <option value="all">{t.allCountries}</option>
                  {ALL_AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-neutral-900 text-white font-medium px-3 py-2 rounded-xl cursor-pointer hover:bg-neutral-850 transition-colors"
                >
                  <option value="all">{t.allSectors}</option>
                  <option value="manufacturer">Manufacturers</option>
                  <option value="agro_processor">Agro-Processors</option>
                  <option value="wholesaler">Wholesalers</option>
                </select>

                <button
                  type="button"
                  onClick={() => setFilterVerifiedOnly((v) => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-semibold ${
                    filterVerifiedOnly
                      ? 'bg-white text-black shadow-md'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.verifiedOnly}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterAfcftaOnly((v) => !v)}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-semibold ${
                    filterAfcftaOnly
                      ? 'bg-white text-black shadow-md'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{t.afcftaDutyFree}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('list-business');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-neutral-200 text-black font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>List Business</span>
                </button>

                <div className="text-neutral-400 font-mono text-[11px] pl-1">
                  {t.showingSuppliers} <strong className="text-white font-bold">{displayedBusinesses.length}</strong> {t.verifiedSuppliersCount}
                </div>
              </div>
            </div>

            {/* Businesses Grid */}
            {businesses.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-neutral-950 rounded-3xl space-y-6 shadow-2xl border border-neutral-900">
                <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-xl">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-neutral-300 font-mono text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>DIRECTORY DASHBOARD · 0 BUSINESSES</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    No Businesses Listed in Directory Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    The directory dashboard currently contains no businesses. Verified African enterprises will appear here once you and other users list their businesses.
                  </p>
                </div>

                <div className="flex items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('list-business');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>List Your Business</span>
                  </button>
                </div>
              </div>
            ) : displayedBusinesses.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 rounded-3xl space-y-3 shadow-2xl">
                <Building2 className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-white">{t.noBusinessesMatched}</p>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {t.noBusinessesDesc}
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    currentLang={currentLang}
                    currentCurrency={currentCurrency}
                    lowDataMode={lowDataMode}
                    onOpenDetails={openBusinessDetailWebpage}
                    onQuickWhatsApp={(b) => {
                      handleTrackWhatsAppClick(b.id);
                      openBusinessDetailWebpage(b);
                    }}
                    onQuickQuote={openBusinessDetailWebpage}
                    onReportSuspicious={openReportWebpage}
                    aiMatchReason={aiMatchMap[biz.id]}
                    isBookmarked={savedBusinessIds.includes(biz.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onAddReview={handleAddReview}
                    currentUser={currentUser}
                    onRequireAuth={() => {
                      setActiveTab('enter-directory');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* WEBPAGE: SAVED FAVORITE SUPPLIERS TAB */}
        {currentUser && activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Saved Toolbar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-white fill-white" />
                <span className="text-neutral-400 font-mono text-[11px] uppercase font-semibold">
                  {t.savedFavoriteSuppliers}
                </span>
                <span className="bg-white text-black font-mono font-bold px-2 py-0.5 rounded-full text-[10px]">
                  {savedBusinesses.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  {t.exploreMoreSuppliers}
                </button>
              </div>
            </div>

            {savedBusinesses.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 rounded-3xl space-y-3 shadow-2xl">
                <Bookmark className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-xs font-semibold text-neutral-300">{t.noSavedSuppliersYet}</p>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {t.noSavedSuppliersDesc}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {t.browseDirectory}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    currentLang={currentLang}
                    currentCurrency={currentCurrency}
                    lowDataMode={lowDataMode}
                    onOpenDetails={openBusinessDetailWebpage}
                    onQuickWhatsApp={(b) => {
                      handleTrackWhatsAppClick(b.id);
                      openBusinessDetailWebpage(b);
                    }}
                    onQuickQuote={openBusinessDetailWebpage}
                    onReportSuspicious={openReportWebpage}
                    aiMatchReason={aiMatchMap[biz.id]}
                    isBookmarked={savedBusinessIds.includes(biz.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onAddReview={handleAddReview}
                    currentUser={currentUser}
                    onRequireAuth={() => {
                      setActiveTab('enter-directory');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ACCESS GATE FOR UNREGISTERED / UNSIGNED-IN USERS */}
        {!currentUser && !['explore', 'business-detail', 'enter-directory', 'list-business'].includes(activeTab) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto py-12 px-4"
          >
            <div className="bg-neutral-950 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase bg-neutral-900 text-neutral-300 px-3 py-1 rounded-lg font-bold">
                  {t.accessRestricted}
                </span>
                <p className="text-sm font-semibold text-white tracking-tight">
                  {t.signInOrSignUp}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {t.accessRestrictedDesc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('enter-directory');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.enterDirectorySignIn}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('list-business');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t.listBusinessSignUp}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-neutral-500 hover:text-white underline cursor-pointer"
                >
                  {t.continueBrowsing}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* WEBPAGE 2: PAN-AFRICAN B2B MARKETPLACE */}
        {currentUser && activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <B2BMarketplace
              sourcingRequests={sourcingRequests}
              quotations={quotations}
              businesses={businesses}
              currentLang={currentLang}
              currentCurrency={currentCurrency}
              onPostNewRFQ={handlePostNewRFQ}
              onSubmitQuotation={handleSubmitQuotation}
              onDirectWhatsApp={handleDirectWhatsAppText}
              onNavigateToPostRFQ={openPostRFQWebpage}
              onNavigateToCompare={openCompareQuotesWebpage}
              onNavigateToSubmitQuote={openSubmitQuoteWebpage}
            />
          </motion.div>
        )}

        {/* WEBPAGE 3: SME DIGITAL STOREFRONT BUILDER */}
        {currentUser && activeTab === 'sme-hub' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <SMEStorefrontBuilder
              currentLang={currentLang}
              currentCurrency={currentCurrency}
              myStore={currentUser?.business || defaultSMEStore}
              onUpdateStore={handleUpdateBusiness}
              onOpenWhatsApp={(b) => openBusinessDetailWebpage(b)}
              onNavigateToListBusiness={() => {
                setActiveTab('list-business');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        )}

        {/* WEBPAGE 4: RESOURCE HUB */}
        {currentUser && activeTab === 'resources' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ResourceHub currentLang={currentLang} />
          </motion.div>
        )}

        {/* WEBPAGE 5: TRUST & AfCFTA HUB (WITH TRADE ACTIVITY FEED) */}
        {currentUser && activeTab === 'trust' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <TrustHubView
              currentLang={currentLang}
              onOpenTradeAdvisor={() => setActiveTab('trade-advisor')}
              onOpenSMEStorefront={() => setActiveTab('sme-hub')}
              onOpenResourceHub={() => setActiveTab('resources')}
            />
          </motion.div>
        )}

        {/* WEBPAGE 6: ENTER DIRECTORY (SIGN IN / SIGN OUT) */}
        {activeTab === 'enter-directory' && (
          <EnterDirectoryPage
            businesses={businesses}
            currentUser={currentUser}
            currentLang={currentLang}
            onSignOut={handleSignOut}
            onLoginSuccess={(role, business, name) => {
              const sessionData = { role, business, name };
              setCurrentUser(sessionData);
              try {
                localStorage.setItem('afritrade_auth_session', JSON.stringify(sessionData));
              } catch (e) {
                console.warn('Storage error:', e);
              }
            }}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* WEBPAGE 7: LIST YOUR BUSINESS (SIGN UP & ONBOARDING) */}
        {activeTab === 'list-business' && (
          <ListBusinessPage
            onAddBusiness={handleAddNewBusiness}
            currentLang={currentLang}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* WEBPAGE 8: BUSINESS DETAIL WEBPAGE */}
        {activeTab === 'business-detail' && selectedBusiness && (
          <BusinessDetailPage
            business={selectedBusiness}
            currentCurrency={currentCurrency}
            currentLang={currentLang}
            onBack={() => setActiveTab('explore')}
            onOpenReport={openReportWebpage}
            onOpenClaim={openClaimWebpage}
            onTrackInquiry={handleTrackWhatsAppClick}
            onUpdateBusiness={handleUpdateBusiness}
            isBookmarked={savedBusinessIds.includes(selectedBusiness.id)}
            onToggleBookmark={handleToggleBookmark}
            onAddReview={handleAddReview}
            currentUser={currentUser}
            onRequireAuth={() => {
              setActiveTab('enter-directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* WEBPAGE 9: POST TENDER / SOURCING REQUEST WEBPAGE */}
        {currentUser && activeTab === 'post-rfq' && (
          <PostRFQPage
            currentLang={currentLang}
            onBack={() => setActiveTab('marketplace')}
            onSubmitRFQ={handlePostNewRFQ}
          />
        )}

        {/* WEBPAGE 10: COMPARE QUOTATIONS WEBPAGE */}
        {currentUser && activeTab === 'compare-quotes' && activeRFQForCompare && (
          <CompareQuotesPage
            rfq={activeRFQForCompare}
            quotations={quotations}
            businesses={businesses}
            currentCurrency={currentCurrency}
            currentLang={currentLang}
            onBack={() => setActiveTab('marketplace')}
            onSubmitQuoteRedirect={(rfq) => openSubmitQuoteWebpage(rfq)}
            onDirectWhatsApp={handleDirectWhatsAppText}
          />
        )}

        {/* WEBPAGE 11: SUBMIT QUOTATION WEBPAGE */}
        {currentUser && activeTab === 'submit-quote' && activeRFQForQuote && (
          <SubmitQuotePage
            rfq={activeRFQForQuote}
            businesses={businesses}
            currentLang={currentLang}
            onBack={() => setActiveTab('marketplace')}
            onSubmitQuotation={handleSubmitQuotation}
          />
        )}

        {/* WEBPAGE 12: CROSS-BORDER CORRIDOR ADVISOR WEBPAGE */}
        {currentUser && activeTab === 'trade-advisor' && (
          <CrossBorderAdvisorPage
            currentLang={currentLang}
            onBack={() => setActiveTab('explore')}
          />
        )}

        {/* WEBPAGE 13: REPORT SUSPICIOUS LISTING WEBPAGE */}
        {activeTab === 'report-suspicious' && targetBusinessForAction && (
          <ReportSuspiciousPage
            business={targetBusinessForAction}
            currentLang={currentLang}
            onBack={() => {
              if (selectedBusiness) {
                setActiveTab('business-detail');
              } else {
                setActiveTab('explore');
              }
            }}
            onSubmitReport={(rep) => {
              const newReport: SuspiciousListingReport = {
                id: `rep-${Date.now()}`,
                businessId: rep.businessId,
                businessName: rep.businessName,
                reason: rep.reason || 'other',
                description: rep.details || '',
                reporterContact: rep.reporterEmail || '',
                createdAt: new Date().toISOString(),
                status: 'investigating',
              };
              setSuspiciousReports((prev) => [newReport, ...prev]);
              insertReportToSupabase(newReport).catch(console.warn);
            }}
          />
        )}

        {/* WEBPAGE 14: CLAIM BUSINESS WEBPAGE */}
        {activeTab === 'claim-business' && targetBusinessForAction && (
          <ClaimListingPage
            business={targetBusinessForAction}
            currentLang={currentLang}
            onBack={() => {
              if (selectedBusiness) {
                setActiveTab('business-detail');
              } else {
                setActiveTab('explore');
              }
            }}
            onClaimSubmitted={(id) => {
              setBusinesses((prev) => {
                const updated = prev.map((b) => (b.id === id ? { ...b, claimedByOwner: true } : b));
                const target = updated.find((b) => b.id === id);
                if (target) {
                  upsertBusinessToSupabase(target).catch(console.warn);
                  broadcastRealtimeUpdate('BUSINESS_UPDATED', target);
                  if (selectedBusiness?.id === id) {
                    setSelectedBusiness(target);
                  }
                }
                return updated;
              });
            }}
          />
        )}

        {/* WEBPAGE 15: SUPER ADMIN PORTAL (FULL ACCESS & DATA MANAGEMENT) */}
        {activeTab === 'super-admin' && (
          <SuperAdminPortalPage
            businesses={businesses}
            sourcingRequests={sourcingRequests}
            quotations={quotations}
            reports={suspiciousReports}
            users={platformUsers}
            onUpdateBusinesses={(list) => {
              setBusinesses(list);
              syncBusinessesToSupabase(list).catch(console.warn);
              broadcastRealtimeUpdate('BUSINESS_UPDATED');
            }}
            onUpdateSourcingRequests={(rfqList) => {
              setSourcingRequests(rfqList);
              for (const rfq of rfqList) {
                upsertRFQToSupabase(rfq).catch(console.warn);
              }
              broadcastRealtimeUpdate('RFQ_POSTED');
            }}
            onUpdateQuotations={(quoteList) => {
              setQuotations(quoteList);
              for (const q of quoteList) {
                upsertQuotationToSupabase(q).catch(console.warn);
              }
              broadcastRealtimeUpdate('QUOTE_SUBMITTED');
            }}
            onUpdateReports={(repList) => {
              setSuspiciousReports(repList);
            }}
            onUpdateUsers={(userList) => {
              setPlatformUsers(userList);
              for (const u of userList) {
                upsertPlatformUserToSupabase(u).catch(console.warn);
              }
            }}
            onBackToDirectory={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-xs text-neutral-500 font-mono tracking-wide relative z-10 space-y-3">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('super-admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white transition-all text-[11px] font-semibold cursor-pointer border border-neutral-800 hover:border-neutral-700 shadow-sm group"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Admin Portal</span>
          </button>
        </div>

        <p>
          {t.poweredBy}{' '}
          <a
            href="https://www.afritradeos.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors font-medium"
          >
            www.afritradeos.co.za
          </a>
        </p>
      </footer>
    </div>
  );
}

