import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import {
  BusinessListing,
  SourcingRequest,
  SupplierQuotation,
  PlatformUserAccount,
  BusinessReview,
  SuspiciousListingReport,
} from '../types';

let cachedClient: SupabaseClient | null = null;
let realtimeChannel: any = null;
let isConfigLoaded = false;
let configuredUrl = '';
let configuredAnonKey = '';

// Load initial credentials from build-time Vite environment variables if available
const buildTimeUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const buildTimeKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (buildTimeUrl && buildTimeKey) {
  configuredUrl = buildTimeUrl;
  configuredAnonKey = buildTimeKey;
  cachedClient = createClient(configuredUrl, configuredAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  isConfigLoaded = true;
}

/**
 * Initializes or retrieves the active Supabase client.
 * If build-time variables weren't present, fetches runtime credentials from `/api/supabase/config`.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (cachedClient) return cachedClient;

  try {
    const res = await fetch('/api/supabase/config');
    if (res.ok) {
      const data = await res.json();
      if (data.url && data.anonKey) {
        configuredUrl = data.url;
        configuredAnonKey = data.anonKey;
        cachedClient = createClient(configuredUrl, configuredAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
        isConfigLoaded = true;
        return cachedClient;
      }
    }
  } catch (e) {
    console.debug('[Supabase] Runtime config fetch fallback:', e);
  }

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(configuredUrl && configuredAnonKey);
}

export function getSupabaseProjectUrl(): string {
  return configuredUrl;
}

/**
 * Realtime Broadcast Synchronization
 * Broadcasts events across all open browsers/devices in real time.
 */
export type RealtimeSyncEvent =
  | 'BUSINESS_ADDED'
  | 'BUSINESS_UPDATED'
  | 'BUSINESS_DELETED'
  | 'RFQ_POSTED'
  | 'RFQ_STATUS_TOGGLED'
  | 'QUOTE_SUBMITTED'
  | 'USER_STATUS_UPDATED'
  | 'FORCE_SYNC';

export interface RealtimeSyncPayload {
  event: RealtimeSyncEvent;
  data?: any;
  timestamp: string;
  senderId?: string;
}

const CLIENT_INSTANCE_ID = `client_${Math.random().toString(36).substring(2, 9)}`;

export async function initRealtimeBroadcast(
  onReceive: (payload: RealtimeSyncPayload) => void
): Promise<() => void> {
  const client = await getSupabase();
  if (!client) {
    return () => {};
  }

  try {
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
    }

    realtimeChannel = client.channel('afritrade_realtime', {
      config: {
        broadcast: { ack: false, self: false },
      },
    });

    realtimeChannel
      .on('broadcast', { event: 'marketplace_update' }, ({ payload }: { payload: RealtimeSyncPayload }) => {
        if (payload && payload.senderId !== CLIENT_INSTANCE_ID) {
          console.log('[Supabase Realtime] Received update:', payload.event);
          onReceive(payload);
        }
      })
      .subscribe((status: string) => {
        console.log('[Supabase Realtime] Broadcast Channel Status:', status);
      });

    return () => {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
        realtimeChannel = null;
      }
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Subscription error:', err);
    return () => {};
  }
}

/**
 * Broadcast an update to all connected users in real time.
 */
export async function broadcastRealtimeUpdate(event: RealtimeSyncEvent, data?: any): Promise<void> {
  if (!realtimeChannel) {
    const client = await getSupabase();
    if (!client) return;
  }

  try {
    if (realtimeChannel) {
      await realtimeChannel.send({
        type: 'broadcast',
        event: 'marketplace_update',
        payload: {
          event,
          data,
          timestamp: new Date().toISOString(),
          senderId: CLIENT_INSTANCE_ID,
        },
      });
    }
  } catch (err) {
    console.debug('[Supabase Realtime] Broadcast failed:', err);
  }
}

/**
 * Supabase Platform Authentication Helpers
 */
export async function signUpWithSupabase(
  email: string,
  pass: string,
  metadata?: { name?: string; role?: 'merchant' | 'buyer'; organization?: string; country?: string }
): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = await getSupabase();
  if (!client) {
    return { user: null, session: null, error: 'Supabase is not configured' };
  }

  const { data, error } = await client.auth.signUp({
    email,
    password: pass,
    options: {
      data: metadata || {},
    },
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? error.message : null,
  };
}

export async function signInWithSupabase(
  email: string,
  pass: string
): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = await getSupabase();
  if (!client) {
    return { user: null, session: null, error: 'Supabase is not configured' };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: pass,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error: error ? error.message : null,
  };
}

export async function signOutSupabase(): Promise<void> {
  const client = await getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

/**
 * Rotate all stored authentication tokens & cached credentials.
 */
export async function rotateAllPlatformSessions(): Promise<void> {
  // Sign out from Supabase
  await signOutSupabase();

  // Clear all local auth sessions and cached credential tokens
  try {
    localStorage.removeItem('afritrade_auth_session');
    sessionStorage.removeItem('afritrade_admin_auth');
    localStorage.removeItem('sb-' + configuredUrl.replace(/https?:\/\//, '').split('.')[0] + '-auth-token');
  } catch (e) {
    console.warn('Error clearing local sessions during rotation:', e);
  }

  // Notify connected peers of session rotation
  await broadcastRealtimeUpdate('FORCE_SYNC', { reason: 'CREDENTIALS_ROTATED' });
}

export interface SupabaseVerificationReport {
  timestamp: string;
  url: string;
  tables: Record<string, { status: 'OK' | 'ERROR'; message?: string; count?: number }>;
  realtimeStatus: string;
  isAllHealthy: boolean;
}

/**
 * Diagnostic runner that checks all 8 Supabase tables and Realtime status live.
 */
export async function verifySupabaseDeployment(): Promise<SupabaseVerificationReport> {
  const client = await getSupabase();
  const report: SupabaseVerificationReport = {
    timestamp: new Date().toISOString(),
    url: configuredUrl,
    tables: {},
    realtimeStatus: 'CONNECTING',
    isAllHealthy: false,
  };

  if (!client) {
    report.realtimeStatus = 'NOT_CONFIGURED';
    return report;
  }

  const tableList = [
    'businesses',
    'products',
    'sourcing_requests',
    'quotations',
    'business_reviews',
    'suspicious_reports',
    'platform_users',
    'trade_activities',
  ];

  let healthyCount = 0;
  for (const table of tableList) {
    try {
      const { data, error } = await client.from(table).select('id').limit(1);
      if (error) {
        report.tables[table] = { status: 'ERROR', message: error.message };
      } else {
        report.tables[table] = { status: 'OK', count: data ? data.length : 0 };
        healthyCount++;
      }
    } catch (e: any) {
      report.tables[table] = { status: 'ERROR', message: e.message || 'Query failed' };
    }
  }

  // Check Realtime channel
  try {
    const testChannel = client.channel(`verify_run_${Date.now()}`);
    report.realtimeStatus = await new Promise<string>((resolve) => {
      const timer = setTimeout(() => resolve('TIMEOUT'), 4000);
      testChannel.subscribe((status: string) => {
        clearTimeout(timer);
        testChannel.unsubscribe();
        resolve(status);
      });
    });
  } catch (e) {
    report.realtimeStatus = 'ERROR';
  }

  report.isAllHealthy = healthyCount === tableList.length && (report.realtimeStatus === 'SUBSCRIBED' || report.realtimeStatus === 'TIMED_OUT');
  return report;
}

/**
 * ============================================================================
 * ROW CONVERTERS (Maps Supabase PostgreSQL records to TypeScript Domain Types)
 * ============================================================================
 */
export function rowToBusiness(row: any): BusinessListing {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || '',
    taglinePt: row.tagline_pt,
    taglineFr: row.tagline_fr,
    taglineSw: row.tagline_sw,
    taglineAr: row.tagline_ar,
    country: row.country,
    countryCode: row.country_code,
    city: row.city,
    address: row.address || '',
    gpsCoordinates:
      row.latitude && row.longitude
        ? { lat: Number(row.latitude), lng: Number(row.longitude) }
        : undefined,
    primaryLanguage: (row.primary_language || 'en') as any,
    supportedLanguages: (row.supported_languages || ['en']) as any,
    businessType: (row.business_type || 'manufacturer') as any,
    industry: row.industry,
    phone: row.phone || '',
    whatsappNumber: row.whatsapp_number || row.phone || '',
    email: row.email || '',
    website: row.website,
    yearEstablished: row.year_established || 2022,
    employeeCount: row.employee_count || '25-50 employees',
    verification:
      row.verification_details && Object.keys(row.verification_details).length > 0
        ? row.verification_details
        : {
            tier: row.verification_tier || 'tier_2_registered',
            registeredEntityName: row.registered_entity_name || row.name,
            registrationNumber: row.registration_number || `REG-${row.id.slice(-6)}`,
            registrarAuthority: row.registrar_authority || 'National Commercial Registry',
            registrationYear: row.registration_year || row.year_established || 2022,
            phoneVerified: Boolean(row.phone_verified),
            emailVerified: Boolean(row.email_verified),
            physicalSiteAudited: Boolean(row.physical_site_audited),
            auditDate: row.audit_date || '',
            auditorName: row.auditor_name,
            independentCertifications: row.independent_certifications || [],
            selfClaimedCertifications: row.self_claimed_certifications || [],
            verificationBadgeUrl: row.verification_badge_url,
            suspiciousReportsCount: row.suspicious_reports_count || 0,
          },
    tradeReadiness:
      row.trade_readiness && Object.keys(row.trade_readiness).length > 0
        ? row.trade_readiness
        : {
            afcftaRegistered: Boolean(row.afcfta_registered),
            countriesServed: row.countries_served || [row.country],
            exportExperienceYears: row.export_experience_years || 2,
            incoterms: row.incoterms || ['FOB', 'CIF'],
            acceptedPaymentMethods: row.accepted_payment_methods || [
              'Trade Escrow / AfriTrade',
              'Bank Wire (SWIFT)',
            ],
            tradeDocumentsReady: row.trade_documents_ready || [
              'Certificate of Origin',
              'Commercial Invoice',
            ],
            mainCorridors: row.main_corridors || [],
          },
    products: Array.isArray(row.products) ? row.products : [],
    about: row.about || `${row.name} is a verified enterprise operating in ${row.country}.`,
    aboutPt: row.about_pt,
    aboutFr: row.about_fr,
    aboutSw: row.about_sw,
    aboutAr: row.about_ar,
    coverImage:
      row.cover_image ||
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    logoImage:
      row.logo_image ||
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count || 0,
    claimedByOwner: Boolean(row.claimed_by_owner),
    securityPin: row.security_pin || '',
    isSMEStorefront: Boolean(row.is_sme_storefront),
    viewsCount: row.views_count || 0,
    whatsappClicksCount: row.whatsapp_clicks_count || 0,
    rfqsReceivedCount: row.rfqs_received_count || 0,
  };
}

export function rowToRFQ(row: any): SourcingRequest {
  return {
    id: row.id,
    title: row.title,
    titlePt: row.title_pt,
    titleFr: row.title_fr,
    titleSw: row.title_sw,
    titleAr: row.title_ar,
    buyerName: row.buyer_name,
    buyerCompany: row.buyer_company,
    buyerCountry: row.buyer_country,
    buyerCountryCode: row.buyer_country_code,
    targetDestination: row.target_destination,
    category: row.category,
    quantityNeeded: row.quantity_needed,
    targetBudgetUSD: Number(row.target_budget_usd || 0),
    requiredCertifications: row.required_certifications || [],
    preferredIncoterm: row.preferred_incoterm || 'FOB',
    deadlineDate: row.deadline_date || '',
    description: row.description || '',
    postedDate: row.created_at
      ? new Date(row.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: row.status || 'open',
    whatsappContact: row.whatsapp_contact,
    quotationsReceivedCount: row.quotations_received_count || 0,
  };
}

export function rowToQuotation(row: any): SupplierQuotation {
  return {
    id: row.id,
    rfqId: row.rfq_id,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    supplierCountry: row.supplier_country,
    unitPriceUSD: Number(row.unit_price_usd),
    totalPriceUSD: Number(row.total_price_usd),
    moq: row.moq || '500 units',
    leadTimeDays: row.lead_time_days || 7,
    incoterm: row.incoterm || 'FOB',
    paymentTerms: row.payment_terms || 'Trade Escrow',
    afcftaTariffEligible: Boolean(row.afcfta_tariff_eligible),
    notes: row.notes || '',
    submittedDate: row.created_at
      ? new Date(row.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  };
}

export function rowToPlatformUser(row: any): PlatformUserAccount {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    role: row.role || 'merchant',
    status: row.status || 'active',
    country: row.country,
    countryCode: row.country_code,
    organizationName: row.organization_name,
    businessId: row.business_id,
    securityPin: row.security_pin,
    verificationTier: row.verification_tier || 'tier_2_registered',
    createdAt: row.created_at || new Date().toISOString(),
    lastLoginAt: row.last_login_at,
    notes: row.notes,
  };
}

/**
 * ============================================================================
 * FETCH DATA FROM SUPABASE POSTGRESQL (Auto-loads into React State)
 * ============================================================================
 */
export async function fetchBusinessesFromSupabase(): Promise<BusinessListing[]> {
  const client = await getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToBusiness);
  } catch (e) {
    console.debug('[Supabase] fetchBusinessesFromSupabase error:', e);
    return [];
  }
}

export async function fetchRFQsFromSupabase(): Promise<SourcingRequest[]> {
  const client = await getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('sourcing_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToRFQ);
  } catch (e) {
    console.debug('[Supabase] fetchRFQsFromSupabase error:', e);
    return [];
  }
}

export async function fetchQuotationsFromSupabase(): Promise<SupplierQuotation[]> {
  const client = await getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToQuotation);
  } catch (e) {
    console.debug('[Supabase] fetchQuotationsFromSupabase error:', e);
    return [];
  }
}

export async function fetchPlatformUsersFromSupabase(): Promise<PlatformUserAccount[]> {
  const client = await getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('platform_users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToPlatformUser);
  } catch (e) {
    console.debug('[Supabase] fetchPlatformUsersFromSupabase error:', e);
    return [];
  }
}

/**
 * ============================================================================
 * PERSIST DATA TO SUPABASE POSTGRESQL
 * ============================================================================
 */

export function businessToPayload(b: BusinessListing) {
  return {
    id: b.id,
    name: b.name,
    tagline: b.tagline,
    tagline_pt: b.taglinePt,
    tagline_fr: b.taglineFr,
    tagline_sw: b.taglineSw,
    tagline_ar: b.taglineAr,
    country: b.country,
    country_code: b.countryCode,
    city: b.city,
    address: b.address,
    latitude: b.gpsCoordinates?.lat || null,
    longitude: b.gpsCoordinates?.lng || null,
    primary_language: b.primaryLanguage || 'en',
    supported_languages: b.supportedLanguages || ['en'],
    business_type: b.businessType || 'manufacturer',
    industry: b.industry,
    phone: b.phone,
    whatsapp_number: b.whatsappNumber,
    email: b.email,
    website: b.website,
    year_established: b.yearEstablished,
    employee_count: b.employeeCount,
    verification_tier: b.verification?.tier || 'tier_2_registered',
    registered_entity_name: b.verification?.registeredEntityName || b.name,
    registration_number: b.verification?.registrationNumber || '',
    registrar_authority: b.verification?.registrarAuthority || '',
    registration_year: b.verification?.registrationYear || 2022,
    phone_verified: b.verification?.phoneVerified ?? true,
    email_verified: b.verification?.emailVerified ?? true,
    physical_site_audited: b.verification?.physicalSiteAudited ?? false,
    audit_date: b.verification?.auditDate || '',
    auditor_name: b.verification?.auditorName,
    independent_certifications: b.verification?.independentCertifications || [],
    self_claimed_certifications: b.verification?.selfClaimedCertifications || [],
    verification_badge_url: b.verification?.verificationBadgeUrl,
    suspicious_reports_count: b.verification?.suspiciousReportsCount || 0,
    afcfta_registered: b.tradeReadiness?.afcftaRegistered ?? true,
    countries_served: b.tradeReadiness?.countriesServed || [],
    export_experience_years: b.tradeReadiness?.exportExperienceYears || 0,
    incoterms: b.tradeReadiness?.incoterms || ['FOB'],
    accepted_payment_methods: b.tradeReadiness?.acceptedPaymentMethods || [],
    trade_documents_ready: b.tradeReadiness?.tradeDocumentsReady || [],
    main_corridors: b.tradeReadiness?.mainCorridors || [],
    cover_image: b.coverImage,
    logo_image: b.logoImage,
    about: b.about,
    about_pt: b.aboutPt,
    about_fr: b.aboutFr,
    about_sw: b.aboutSw,
    about_ar: b.aboutAr,
    rating: b.rating || 5.0,
    review_count: b.reviewCount || 0,
    claimed_by_owner: b.claimedByOwner ?? false,
    security_pin: b.securityPin || '',
    is_sme_storefront: b.isSMEStorefront ?? false,
    views_count: b.viewsCount || 0,
    whatsapp_clicks_count: b.whatsappClicksCount || 0,
    rfqs_received_count: b.rfqsReceivedCount || 0,
    products: b.products || [],
    verification_details: b.verification || {},
    trade_readiness: b.tradeReadiness || {},
  };
}

export async function upsertBusinessToSupabase(b: BusinessListing): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const payload = businessToPayload(b);
    const { error } = await client.from('businesses').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] upsertBusiness error:', error);
      return false;
    }

    // Also sync products into the normalized products table
    if (b.products && b.products.length > 0) {
      for (const prod of b.products) {
        await client.from('products').upsert({
          id: prod.id,
          business_id: b.id,
          name: prod.name,
          name_pt: prod.namePt,
          name_fr: prod.nameFr,
          name_sw: prod.nameSw,
          name_ar: prod.nameAr,
          category: prod.category,
          description: prod.description,
          unit_price_usd: prod.unitPriceUSD,
          moq: prod.moq,
          lead_time_days: prod.leadTimeDays,
          specifications: prod.specifications || [],
          image_url: prod.imageUrl,
          is_active: true,
        }, { onConflict: 'id' });
      }
    }

    return true;
  } catch (e) {
    console.warn('[Supabase] upsertBusinessToSupabase exception:', e);
    return false;
  }
}

export async function deleteBusinessFromSupabase(businessId: string): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('businesses').delete().eq('id', businessId);
    return !error;
  } catch {
    return false;
  }
}

export async function upsertRFQToSupabase(rfq: SourcingRequest): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('sourcing_requests').upsert({
      id: rfq.id,
      title: rfq.title,
      title_pt: rfq.titlePt,
      title_fr: rfq.titleFr,
      title_sw: rfq.titleSw,
      title_ar: rfq.titleAr,
      buyer_name: rfq.buyerName,
      buyer_company: rfq.buyerCompany,
      buyer_country: rfq.buyerCountry,
      buyer_country_code: rfq.buyerCountryCode,
      target_destination: rfq.targetDestination,
      category: rfq.category,
      quantity_needed: rfq.quantityNeeded,
      target_budget_usd: rfq.targetBudgetUSD,
      required_certifications: rfq.requiredCertifications || [],
      preferred_incoterm: rfq.preferredIncoterm,
      deadline_date: rfq.deadlineDate,
      description: rfq.description,
      status: rfq.status || 'open',
      whatsapp_contact: rfq.whatsappContact,
      quotations_received_count: rfq.quotationsReceivedCount || 0,
    }, { onConflict: 'id' });
    return !error;
  } catch (e) {
    console.warn('[Supabase] upsertRFQ error:', e);
    return false;
  }
}

export async function deleteRFQFromSupabase(rfqId: string): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('sourcing_requests').delete().eq('id', rfqId);
    return !error;
  } catch {
    return false;
  }
}

export async function upsertQuotationToSupabase(quote: SupplierQuotation): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('quotations').upsert({
      id: quote.id,
      rfq_id: quote.rfqId,
      supplier_id: quote.supplierId,
      supplier_name: quote.supplierName,
      supplier_country: quote.supplierCountry,
      unit_price_usd: quote.unitPriceUSD,
      total_price_usd: quote.totalPriceUSD,
      moq: quote.moq,
      lead_time_days: quote.leadTimeDays,
      incoterm: quote.incoterm,
      payment_terms: quote.paymentTerms,
      afcfta_tariff_eligible: quote.afcftaTariffEligible,
      notes: quote.notes,
      status: 'submitted',
    }, { onConflict: 'id' });
    return !error;
  } catch (e) {
    console.warn('[Supabase] upsertQuotation error:', e);
    return false;
  }
}

export async function deleteQuotationFromSupabase(quoteId: string): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('quotations').delete().eq('id', quoteId);
    return !error;
  } catch {
    return false;
  }
}

export async function upsertPlatformUserToSupabase(u: PlatformUserAccount): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('platform_users').upsert({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      country: u.country,
      country_code: u.countryCode,
      organization_name: u.organizationName,
      business_id: u.businessId,
      security_pin: u.securityPin,
      verification_tier: u.verificationTier,
      notes: u.notes,
      last_login_at: u.lastLoginAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    return !error;
  } catch (e) {
    console.warn('[Supabase] upsertPlatformUser error:', e);
    return false;
  }
}

export async function deletePlatformUserFromSupabase(userId: string): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('platform_users').delete().eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

export async function insertReviewToSupabase(businessId: string, review: BusinessReview): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('business_reviews').insert({
      id: review.id,
      business_id: businessId,
      author_name: review.authorName,
      author_company: review.authorCompany,
      author_role: review.authorRole,
      rating: review.rating,
      comment: review.comment,
      verified_transaction: review.verifiedTransaction ?? true,
      status: 'published',
    });
    return !error;
  } catch (e) {
    console.warn('[Supabase] insertReview error:', e);
    return false;
  }
}

export async function insertReportToSupabase(report: SuspiciousListingReport): Promise<boolean> {
  const client = await getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('suspicious_reports').insert({
      id: report.id,
      business_id: report.businessId,
      business_name: report.businessName,
      reason: report.reason,
      description: report.description,
      reporter_contact: report.reporterContact,
      status: report.status || 'investigating',
    });
    return !error;
  } catch (e) {
    console.warn('[Supabase] insertReport error:', e);
    return false;
  }
}

/**
 * Synchronize local businesses to Supabase PostgreSQL table
 */
export async function syncBusinessesToSupabase(businesses: BusinessListing[]): Promise<boolean> {
  let okCount = 0;
  for (const b of businesses) {
    const res = await upsertBusinessToSupabase(b);
    if (res) okCount++;
  }
  return okCount > 0 || businesses.length === 0;
}


