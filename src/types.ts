export type VerificationTier = 'tier_3_audited' | 'tier_2_registered' | 'tier_1_basic' | 'unverified';

export type BusinessType = 'manufacturer' | 'wholesaler' | 'distributor' | 'exporter' | 'agro_processor' | 'logistics';

export type LanguageCode = 'en' | 'pt' | 'fr' | 'sw' | 'ar';

export type CurrencyCode = 'USD' | 'AOA' | 'NGN' | 'KES' | 'ZAR' | 'XOF' | 'EGP' | 'GHS' | 'RWF';

export interface ProductItem {
  id: string;
  name: string;
  namePt?: string;
  nameFr?: string;
  nameSw?: string;
  nameAr?: string;
  category: string;
  description: string;
  unitPriceUSD: number;
  moq: string; // e.g. "500 units", "5 tons"
  leadTimeDays: number;
  specifications: string[];
  imageUrl: string;
}

export interface VerificationEvidence {
  tier: VerificationTier;
  registeredEntityName: string;
  registrationNumber: string;
  registrarAuthority: string; // e.g., "Guichet Único de Empresa (GUE) - Angola", "Corporate Affairs Commission (CAC) - Nigeria"
  registrationYear: number;
  phoneVerified: boolean;
  emailVerified: boolean;
  physicalSiteAudited: boolean;
  auditDate: string; // e.g., "2026-09-12"
  auditorName?: string;
  independentCertifications: string[]; // e.g., ["ISO 22000:2018", "HACCP", "SABS Verified"]
  selfClaimedCertifications: string[]; // Clearly distinguished from independent facts!
  verificationBadgeUrl?: string;
  suspiciousReportsCount: number;
}

export interface TradeReadiness {
  afcftaRegistered: boolean;
  countriesServed: string[];
  exportExperienceYears: number;
  incoterms: Array<'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DAP'>;
  acceptedPaymentMethods: Array<'Letter of Credit (LC)' | 'Mobile Money (M-Pesa/MoMo/Multicaixa)' | 'Trade Escrow / AfriTrade' | 'Bank Wire (SWIFT)' | 'Cash on Delivery (Local)'>;
  tradeDocumentsReady: string[]; // ["AfCFTA Certificate of Origin", "Commercial Invoice with HS Code", "Phytosanitary Certificate"]
  mainCorridors: string[]; // e.g., ["Luanda - Windhoek Corridor", "Mombasa - Kigali Corridor"]
}

export interface BusinessListing {
  id: string;
  name: string;
  tagline: string;
  taglinePt?: string;
  taglineFr?: string;
  taglineSw?: string;
  taglineAr?: string;
  country: string;
  countryCode: string; // 'AO', 'KE', 'NG', 'ZA', 'CI', 'EG', 'RW', 'TZ', 'MZ', 'GH'
  city: string;
  address: string;
  gpsCoordinates?: { lat: number; lng: number };
  primaryLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  businessType: BusinessType;
  industry: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  website?: string;
  yearEstablished: number;
  employeeCount: string;
  verification: VerificationEvidence;
  tradeReadiness: TradeReadiness;
  products: ProductItem[];
  about: string;
  aboutPt?: string;
  aboutFr?: string;
  aboutSw?: string;
  aboutAr?: string;
  coverImage: string;
  logoImage: string;
  rating: number;
  reviewCount: number;
  claimedByOwner: boolean;
  viewsCount: number;
  whatsappClicksCount: number;
  rfqsReceivedCount: number;
  isSMEStorefront?: boolean;
  securityPin?: string;
  reviews?: BusinessReview[];
}

export interface BusinessReview {
  id: string;
  authorName: string;
  authorCompany?: string;
  authorRole: 'buyer' | 'seller';
  rating: number; // 1 to 5 stars (4-5: Good, 3: Neutral, 1-2: Bad)
  comment: string;
  createdAt: string;
  verifiedTransaction?: boolean;
}

export interface SourcingRequest {
  id: string;
  title: string;
  titlePt?: string;
  titleFr?: string;
  titleSw?: string;
  titleAr?: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  buyerCountryCode: string;
  targetDestination: string;
  category: string;
  quantityNeeded: string;
  targetBudgetUSD: number;
  requiredCertifications: string[];
  preferredIncoterm: string;
  deadlineDate: string;
  description: string;
  postedDate: string;
  status: 'open' | 'under_review' | 'closed';
  whatsappContact: string;
  quotationsReceivedCount: number;
}

export interface SupplierQuotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  unitPriceUSD: number;
  totalPriceUSD: number;
  moq: string;
  leadTimeDays: number;
  incoterm: string;
  paymentTerms: string;
  afcftaTariffEligible: boolean;
  notes: string;
  submittedDate: string;
}

export interface SuspiciousListingReport {
  id: string;
  businessId: string;
  businessName: string;
  reason: 'false_registration' | 'wrong_location' | 'unresponsive_fraud' | 'expired_cert' | 'other';
  description: string;
  reporterContact: string;
  createdAt: string;
  status: 'investigating' | 'resolved' | 'dismissed';
}

export type TradeActivityType = 'verification' | 'sourcing_posted' | 'trade_match';

export interface TradeActivityItem {
  id: string;
  type: TradeActivityType;
  title: string;
  description: string;
  country: string;
  countryCode: string;
  timestamp: string;
  valueUSD?: number;
  partnerCountry?: string;
  verifiedBadge?: string;
}

export interface TradeDocumentTemplate {
  id: string;
  title: string;
  category: string;
  standard: string;
  description: string;
  fileType: string;
  fieldsIncluded: string[];
  content: string;
}

export type UserRole = 'super_admin' | 'merchant' | 'buyer';
export type UserStatus = 'active' | 'suspended' | 'pending_review';

export interface PlatformUserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  countryCode?: string;
  organizationName?: string;
  businessId?: string;
  securityPin?: string;
  verificationTier?: VerificationTier;
  createdAt: string;
  lastLoginAt?: string;
  notes?: string;
}

