import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  poweredBy: string;

  // Nav
  navDirectory: string;
  navSaved: string;
  navB2BRFQs: string;
  navPostTender: string;
  navStorefront: string;
  navResources: string;
  navTrustHub: string;
  navTradeAdvisor: string;
  navListBusiness: string;
  navSignIn: string;
  navSignOut: string;
  guestMode: string;
  langLabel: string;
  currencyLabel: string;

  // Filters & Search
  filterBy: string;
  allCountries: string;
  allSectors: string;
  verifiedOnly: string;
  afcftaDutyFree: string;
  showingSuppliers: string;
  verifiedSuppliersCount: string;
  noBusinessesMatched: string;
  noBusinessesDesc: string;
  resetFilters: string;
  aiSearchSubtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  resetSearch: string;
  listening: string;
  matchInsight: string;
  afcftaInsight: string;

  // Business Card & Trust Score
  trustScore: string;
  tier3Badge: string;
  tier2Badge: string;
  tier1Badge: string;
  unverifiedBadge: string;
  save: string;
  saved: string;
  saveSupplier: string;
  savedToFavorites: string;
  saveToFavorites: string;
  removeFromFavorites: string;
  signInToSave: string;
  verifiedID: string;
  leadProduct: string;
  moqLabel: string;
  exports: string;
  whatsAppBtn: string;
  quoteBtn: string;
  fullDossier: string;
  verificationInsights: string;
  verifiedCerts: string;
  liveSync: string;
  goodReviews: string;
  badReviews: string;
  reviews: string;
  writeReview: string;
  rateThisBusiness: string;
  iAmBuyer: string;
  iAmSeller: string;
  yourName: string;
  companyOptional: string;
  reviewPlaceholder: string;
  postReview: string;
  cancel: string;
  reviewSuccess: string;
  viewAllReviews: string;
  officialRegistryCheck: string;
  contactAuthentication: string;
  physicalSiteCheck: string;
  auditTimestamp: string;
  afcftaReady: string;

  // Saved Tab
  savedFavoriteSuppliers: string;
  exploreMoreSuppliers: string;
  noSavedSuppliersYet: string;
  noSavedSuppliersDesc: string;
  browseDirectory: string;

  // Access Gate
  accessRestricted: string;
  signInOrSignUp: string;
  accessRestrictedDesc: string;
  enterDirectorySignIn: string;
  listBusinessSignUp: string;
  continueBrowsing: string;

  // Marketplace & RFQ
  b2bMarketplaceTitle: string;
  b2bMarketplaceDesc: string;
  postSourcingRequestBtn: string;
  sectorFilter: string;
  openTenderBadge: string;
  targetVolume: string;
  targetBudget: string;
  destination: string;
  deadline: string;
  requiredCerts: string;
  bidsReceived: string;
  submitQuotationBtn: string;
  compareQuotesBtn: string;
  negotiateWhatsApp: string;

  // Post RFQ
  backToMarketplace: string;
  procurementTender: string;
  postRFQDesc: string;
  productRequirement: string;
  yourNameTitle: string;
  companyOrg: string;
  buyerCountry: string;
  deliveryDestination: string;
  categoryIndustry: string;
  orderVolume: string;
  targetUnitPrice: string;
  preferredIncoterm: string;
  tenderDeadline: string;
  whatsAppNegotiation: string;
  technicalSpecs: string;
  publishRFQBtn: string;

  // Submit Quote & Compare
  backToTender: string;
  supplierBidSubmission: string;
  selectVerifiedCompany: string;
  unitPriceUSD: string;
  minOrderQty: string;
  leadTimeDays: string;
  incotermOffered: string;
  paymentSecurityTerms: string;
  technicalNotes: string;
  submitBidBtn: string;
  compareTenderSummary: string;
  buyerLabel: string;
  noBidsYet: string;
  firstBidPrompt: string;
  bestPrice: string;
  afcftaEligible: string;

  // Corridor Advisor
  backToDirectory: string;
  advisorDesc: string;
  originCountry: string;
  destCountry: string;
  hsCodeCategory: string;
  tradeVolume: string;
  calculateFeasibility: string;
  tariffAssessment: string;
  customsDocs: string;
  logisticsCorridor: string;
  paymentSecurity: string;

  // Trust Hub & Resources
  verificationArchitecture: string;
  trustHubDesc: string;
  corridorAdvisorBtn: string;
  downloadTemplatesBtn: string;
  resourceHubDesc: string;
  downloadTemplate: string;
  copyTemplate: string;
  copied: string;

  // SME Storefront
  digitalStorefrontBuilder: string;
  liveStorefront: string;
  editStorefront: string;
  storefrontAnalytics: string;
  shareWhatsAppBtn: string;
  downloadQRCode: string;
  saveLiveChanges: string;

  // Enter Directory / Account
  enterDirectoryTitle: string;
  enterDirectoryDesc: string;
  verifiedBusiness: string;
  commercialBuyer: string;
  selectVerifiedBusiness: string;
  buyerOrgName: string;
  phoneWhatsApp: string;
  pinPasscode: string;
  enterDirectoryPortal: string;
  needToRegister: string;
  listBusinessHere: string;
  sessionSecurity: string;
  activeVerified: string;
  afcftaTradeAuthority: string;
  goToStorefront: string;
  viewB2BMarketplace: string;
  signOutDirectory: string;

  // List Business
  sellerOnboarding: string;
  sellerOnboardingDesc: string;
  companyLegalName: string;
  registrationNumber: string;
  registryAuthority: string;
  countryLabel: string;
  cityLocation: string;
  sectorIndustry: string;
  leadProductName: string;
  wholesalePriceUSD: string;
  moqPlaceholder: string;
  afcftaExporterToggle: string;
  submitRegistration: string;
  businessRegisteredSuccess: string;
  viewInDirectory: string;
  manageStorefront: string;

  // Detail Page
  reportDiscrepancy: string;
  claimOwnership: string;
  shareProfile: string;
  contactWhatsApp: string;
  tabVerification: string;
  tabReviews: string;
  tabProducts: string;
  tabTrade: string;
  tabInquiry: string;
  govIncorporationCheck: string;
  regEntityName: string;
  sovereignRegistrar: string;
  regYear: string;
  auditSiteInspection: string;
  physicalFactoryAudit: string;
  independentCertifications: string;
  addProductBtn: string;
  editProduct: string;
  deleteProduct: string;
  saveProductLive: string;
  launchWhatsAppChat: string;

  // Claim & Report
  backToProfile: string;
  claimProfileTitle: string;
  claimProfileDesc: string;
  claimSubmitBtn: string;
  claimSubmittedSuccess: string;
  reportProfileTitle: string;
  reportProfileDesc: string;
  reportSubmitBtn: string;
  reportSubmittedSuccess: string;

  // Transaction Success Confirmation
  rfqPublishedSuccessTitle: string;
  rfqPublishedSuccessDesc: string;
  viewInMarketplace: string;
  postAnotherTender: string;
  quoteSubmittedSuccessTitle: string;
  quoteSubmittedSuccessDesc: string;
  viewTendersList: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appName: 'AfriTrade Trust',
    appTagline: 'Pan-African Verified Business & B2B Trade Network',
    poweredBy: 'powered by',

    navDirectory: 'Directory',
    navSaved: 'Saved',
    navB2BRFQs: 'B2B RFQs',
    navPostTender: 'Post Tender',
    navStorefront: 'Storefront',
    navResources: 'Resources',
    navTrustHub: 'Trust Hub',
    navTradeAdvisor: 'Trade Advisor',
    navListBusiness: 'List Business',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',
    guestMode: 'Guest Mode',
    langLabel: 'Lang:',
    currencyLabel: 'Currency:',

    filterBy: 'Filter By:',
    allCountries: 'All African Countries',
    allSectors: 'All Sectors',
    verifiedOnly: 'Verified Only',
    afcftaDutyFree: 'AfCFTA Duty-Free',
    showingSuppliers: 'Showing',
    verifiedSuppliersCount: 'verified suppliers',
    noBusinessesMatched: 'No businesses matched',
    noBusinessesDesc: 'Broaden search terms or clear active filters.',
    resetFilters: 'Reset Filters',
    aiSearchSubtitle: '✅ Verified African Suppliers & Goods',
    searchPlaceholder: 'Search suppliers, e.g. "Packaging manufacturers in Angola exporting to Namibia"...',
    searchBtn: 'Search',
    resetSearch: 'Reset',
    listening: 'Listening...',
    matchInsight: 'Match Insight',
    afcftaInsight: 'AfCFTA Tariff Insight',

    trustScore: 'Trust Score',
    tier3Badge: 'Tier 3 · Audited',
    tier2Badge: 'Tier 2 · Registered',
    tier1Badge: 'Tier 1 · Basic',
    unverifiedBadge: 'Unverified',
    save: 'Save',
    saved: 'Saved',
    saveSupplier: 'Save Supplier',
    savedToFavorites: 'Saved to Favorites',
    saveToFavorites: 'Save to Favorite Suppliers',
    removeFromFavorites: 'Remove from Saved Favorite Suppliers',
    signInToSave: 'Sign in to save favorite suppliers',
    verifiedID: 'Verified ID',
    leadProduct: 'Lead Product',
    moqLabel: 'MOQ',
    exports: 'Exports:',
    whatsAppBtn: 'WhatsApp',
    quoteBtn: 'Quote',
    fullDossier: 'Full Dossier',
    verificationInsights: 'Verification Insights',
    verifiedCerts: 'verified certs',
    liveSync: 'Live Sync:',
    goodReviews: 'Good',
    badReviews: 'Bad',
    reviews: 'Reviews',
    writeReview: 'Write Review',
    rateThisBusiness: 'Rate this Business:',
    iAmBuyer: 'I am a Buyer',
    iAmSeller: 'I am a Seller / Partner',
    yourName: 'Your Name',
    companyOptional: 'Company (optional)',
    reviewPlaceholder: 'Write your trade experience (quality, MOQ, delivery, AfCFTA documentation)...',
    postReview: 'Post Review',
    cancel: 'Cancel',
    reviewSuccess: 'Review published! Trust score recalculated in real-time.',
    viewAllReviews: 'View all',
    officialRegistryCheck: 'Official Company Registry',
    contactAuthentication: 'Contact Authentication',
    physicalSiteCheck: 'Physical Site Verification',
    auditTimestamp: 'Audit Timestamp',
    afcftaReady: 'AfCFTA Cross-Border Ready',

    savedFavoriteSuppliers: 'Saved Favorite Suppliers',
    exploreMoreSuppliers: 'Explore More Suppliers',
    noSavedSuppliersYet: 'No saved suppliers yet',
    noSavedSuppliersDesc: 'Save verified African suppliers to your procurement shortlist by clicking the bookmark icon on any business card.',
    browseDirectory: 'Browse Verified Directory',

    accessRestricted: 'Access Restricted · Members Only',
    signInOrSignUp: 'Sign In or Sign Up to Access',
    accessRestrictedDesc: 'Without sign in or sign up, users can only see the verified business directory. Please sign in or list your business to unlock B2B tenders, digital storefronts, trade documentation templates, and the trust hub.',
    enterDirectorySignIn: 'Enter Directory (Sign In)',
    listBusinessSignUp: 'List Your Business (Sign Up)',
    continueBrowsing: 'Continue browsing Verified Directory',

    b2bMarketplaceTitle: 'Pan-African B2B Sourcing Marketplace',
    b2bMarketplaceDesc: 'Publish procurement tenders, compare supplier quotes side-by-side, and contract directly with African manufacturers.',
    postSourcingRequestBtn: 'Post Sourcing Request',
    sectorFilter: 'Sector:',
    openTenderBadge: 'Open Tender',
    targetVolume: 'Target Volume:',
    targetBudget: 'Target Budget:',
    destination: 'Delivery Destination:',
    deadline: 'Tender Deadline:',
    requiredCerts: 'Required Certifications:',
    bidsReceived: 'Bids Received',
    submitQuotationBtn: 'Submit Quotation',
    compareQuotesBtn: 'Compare Quotes',
    negotiateWhatsApp: 'Negotiate via WhatsApp',

    backToMarketplace: 'Back to Sourcing Marketplace',
    procurementTender: 'Procurement Tender',
    postRFQDesc: 'Broadcast your procurement demand to verified manufacturers and agro-processors across Africa. Receive competitive quotations with AfCFTA logistics terms.',
    productRequirement: 'Product Sourcing Requirement *',
    yourNameTitle: 'Your Name / Title *',
    companyOrg: 'Enterprise / Organization',
    buyerCountry: 'Your Country (Buyer Origin)',
    deliveryDestination: 'Target Destination Port / City *',
    categoryIndustry: 'Product Category / Industry',
    orderVolume: 'Order Quantity / Volume *',
    targetUnitPrice: 'Target Unit Budget ($ USD)',
    preferredIncoterm: 'Preferred Incoterm',
    tenderDeadline: 'Submission Deadline',
    whatsAppNegotiation: 'WhatsApp Contact for Direct Negotiation *',
    technicalSpecs: 'Technical Specifications & Terms',
    publishRFQBtn: 'Publish Sourcing Request',

    backToTender: 'Back to Tender',
    supplierBidSubmission: 'Supplier Bid Submission',
    selectVerifiedCompany: 'Select Your Verified Company *',
    unitPriceUSD: 'Unit Price ($ USD) *',
    minOrderQty: 'Minimum Order Quantity (MOQ) *',
    leadTimeDays: 'Production Lead Time (Days)',
    incotermOffered: 'Incoterm Offered',
    paymentSecurityTerms: 'Payment Security Terms',
    technicalNotes: 'Technical Notes & Certifications',
    submitBidBtn: 'Submit Official Bid',
    compareTenderSummary: 'Quotation Comparison Dossier',
    buyerLabel: 'Buyer:',
    noBidsYet: 'No supplier bids submitted yet for this tender.',
    firstBidPrompt: 'Are you a verified African manufacturer? Submit the first official quotation.',
    bestPrice: 'Best Price',
    afcftaEligible: 'AfCFTA Duty-Free Eligible',

    backToDirectory: 'Back to Directory',
    advisorDesc: 'Evaluate AfCFTA preferential tariff eligibility, customs clearance documentation, and secure settlement pathways between African markets.',
    originCountry: 'Supplier Country (Origin)',
    destCountry: 'Buyer Country (Destination)',
    hsCodeCategory: 'Product HS Code / Category',
    tradeVolume: 'Transaction Volume ($ USD)',
    calculateFeasibility: 'Calculate Corridor Feasibility',
    tariffAssessment: 'AfCFTA Tariff Assessment',
    customsDocs: 'Required Customs Documentation',
    logisticsCorridor: 'Logistics Corridor & Transit Time',
    paymentSecurity: 'Recommended Payment & Settlement',

    verificationArchitecture: 'Verification Architecture',
    trustHubDesc: 'AfriTrade Trust validates official incorporation records, physical production sites, and export documentation to eliminate unverified intermediaries across Africa.',
    corridorAdvisorBtn: 'AfCFTA Corridor Advisor',
    downloadTemplatesBtn: 'Download Trade Templates',
    resourceHubDesc: 'Download standardized customs and logistics templates for cross-border African commerce, including AfCFTA Certificates of Origin, Ocean Bills of Lading, and Commercial Invoices.',
    downloadTemplate: 'Download Template',
    copyTemplate: 'Copy to Clipboard',
    copied: 'Copied',

    digitalStorefrontBuilder: 'Digital Storefront Builder',
    liveStorefront: 'Live Storefront',
    editStorefront: 'Edit Storefront',
    storefrontAnalytics: 'Storefront Analytics',
    shareWhatsAppBtn: 'Share on WhatsApp',
    downloadQRCode: 'Download QR Code',
    saveLiveChanges: 'Save Changes Live',

    enterDirectoryTitle: 'Enter Directory',
    enterDirectoryDesc: 'Sign in to manage your verified digital presence, track inbound RFQs, or access commercial procurement tools.',
    verifiedBusiness: 'Verified Business',
    commercialBuyer: 'Commercial Buyer',
    selectVerifiedBusiness: 'Select Verified Business',
    buyerOrgName: 'Buyer Organization / Name',
    phoneWhatsApp: 'Phone / WhatsApp Number',
    pinPasscode: 'PIN / Security Code',
    enterDirectoryPortal: 'Enter Directory Portal',
    needToRegister: 'Need to register your business?',
    listBusinessHere: 'List your business here',
    sessionSecurity: 'Session Security',
    activeVerified: 'Active & Verified',
    afcftaTradeAuthority: 'AfCFTA Trade Authority',
    goToStorefront: 'Go to My Digital Storefront',
    viewB2BMarketplace: 'View Pan-African B2B Marketplace',
    signOutDirectory: 'Sign Out of Directory',

    sellerOnboarding: 'Seller Onboarding',
    sellerOnboardingDesc: 'Join thousands of verified African manufacturers, processors, and exporters. Get discovered by cross-border buyers and receive direct WhatsApp procurement inquiries.',
    companyLegalName: 'Registered Company Legal Name *',
    registrationNumber: 'National Registry Number *',
    registryAuthority: 'Sovereign Registration Authority',
    countryLabel: 'Country of Incorporation',
    cityLocation: 'City / Industrial Zone *',
    sectorIndustry: 'Primary Industry Sector',
    leadProductName: 'Lead Wholesale Product Title *',
    wholesalePriceUSD: 'Wholesale Unit Price ($ USD) *',
    moqPlaceholder: 'Minimum Order Quantity (e.g. 1,000 units)',
    afcftaExporterToggle: 'Our business complies with AfCFTA Rules of Origin for preferential export tariffs',
    submitRegistration: 'Complete Verification & Register Listing',
    businessRegisteredSuccess: 'Business Successfully Registered',
    viewInDirectory: 'View in Directory',
    manageStorefront: 'Manage Storefront',

    reportDiscrepancy: 'Report Discrepancy',
    claimOwnership: 'Claim Ownership',
    shareProfile: 'Share Profile',
    contactWhatsApp: 'Contact on WhatsApp',
    tabVerification: 'Verification Dossier',
    tabReviews: 'Reviews & Trust Score',
    tabProducts: 'Wholesale Products',
    tabTrade: 'Cross-Border & AfCFTA',
    tabInquiry: 'WhatsApp Inquiry Composer',
    govIncorporationCheck: 'Government Incorporation Check',
    regEntityName: 'Registered Entity Name',
    sovereignRegistrar: 'Sovereign Registrar',
    regYear: 'Registration Year',
    auditSiteInspection: 'Audit & Site Inspection Record',
    physicalFactoryAudit: 'Physical Factory / Facility Audit',
    independentCertifications: 'Independent Certifications',
    addProductBtn: 'Add Wholesale Product',
    editProduct: 'Edit',
    deleteProduct: 'Delete',
    saveProductLive: 'Save Product Live',
    launchWhatsAppChat: 'Launch WhatsApp Chat',

    backToProfile: 'Back to Business Profile',
    claimProfileTitle: 'Verify & Claim Business Ownership',
    claimProfileDesc: 'Verify authorized representation of this enterprise to manage listings, tenders, and storefront.',
    claimSubmitBtn: 'Verify & Claim Entity',
    claimSubmittedSuccess: 'Ownership Claim Submitted',
    reportProfileTitle: 'Report Suspicious Entity or Discrepancy',
    reportProfileDesc: 'Help protect the pan-African trade network. Flagging initiates independent verification review.',
    reportSubmitBtn: 'Submit Discrepancy Report',
    reportSubmittedSuccess: 'Discrepancy Report Logged',

    rfqPublishedSuccessTitle: 'Tender Successfully Published',
    rfqPublishedSuccessDesc: 'Your procurement requirement has been broadcast to verified African suppliers and cached for offline access.',
    viewInMarketplace: 'View in Tender Marketplace',
    postAnotherTender: 'Post Another Requirement',
    quoteSubmittedSuccessTitle: 'Commercial Bid Successfully Submitted',
    quoteSubmittedSuccessDesc: 'Your verified commercial offer has been recorded and delivered to the procurement team.',
    viewTendersList: 'Return to Marketplace',
  },

  fr: {
    appName: 'AfriTrade Trust',
    appTagline: 'Réseau Panafricain d\'Entreprises Vérifiées & Commerce B2B',
    poweredBy: 'propulsé par',

    navDirectory: 'Répertoire',
    navSaved: 'Favoris',
    navB2BRFQs: 'Appels d\'offres',
    navPostTender: 'Publier appel',
    navStorefront: 'Vitrine PME',
    navResources: 'Ressources',
    navTrustHub: 'Pôle Confiance',
    navTradeAdvisor: 'Conseiller commercial',
    navListBusiness: 'Inscrire entreprise',
    navSignIn: 'Connexion',
    navSignOut: 'Déconnexion',
    guestMode: 'Mode Invité',
    langLabel: 'Langue:',
    currencyLabel: 'Devise:',

    filterBy: 'Filtrer par:',
    allCountries: 'Tous les pays africains',
    allSectors: 'Tous les secteurs',
    verifiedOnly: 'Vérifiés uniquement',
    afcftaDutyFree: 'ZLECAf Hors-Taxe',
    showingSuppliers: 'Affichage de',
    verifiedSuppliersCount: 'fournisseurs vérifiés',
    noBusinessesMatched: 'Aucune entreprise trouvée',
    noBusinessesDesc: 'Élargissez vos critères ou réinitialisez les filtres actifs.',
    resetFilters: 'Réinitialiser les filtres',
    aiSearchSubtitle: '✅ Fournisseurs & Biens Africains Vérifiés',
    searchPlaceholder: 'Rechercher des fournisseurs, ex: "Fabricants d\'emballages en Côte d\'Ivoire exportant vers le Sénégal"...',
    searchBtn: 'Rechercher',
    resetSearch: 'Effacer',
    listening: 'Écoute en cours...',
    matchInsight: 'Aperçu Correspondance',
    afcftaInsight: 'Analyse Tarifaire ZLECAf',

    trustScore: 'Score de Confiance',
    tier3Badge: 'Niveau 3 · Audité',
    tier2Badge: 'Niveau 2 · Enregistré',
    tier1Badge: 'Niveau 1 · Basique',
    unverifiedBadge: 'Non vérifié',
    save: 'Enregistrer',
    saved: 'Enregistré',
    saveSupplier: 'Sauvegarder',
    savedToFavorites: 'Enregistré aux favoris',
    saveToFavorites: 'Ajouter aux fournisseurs favoris',
    removeFromFavorites: 'Retirer des favoris',
    signInToSave: 'Connectez-vous pour enregistrer vos favoris',
    verifiedID: 'ID Vérifié',
    leadProduct: 'Produit Phare',
    moqLabel: 'QMC (MOQ)',
    exports: 'Exportations:',
    whatsAppBtn: 'WhatsApp',
    quoteBtn: 'Devis',
    fullDossier: 'Dossier Complet',
    verificationInsights: 'Détails de Vérification',
    verifiedCerts: 'certificats vérifiés',
    liveSync: 'Sync Direct:',
    goodReviews: 'Positifs',
    badReviews: 'Critiques',
    reviews: 'Avis',
    writeReview: 'Laisser un avis',
    rateThisBusiness: 'Évaluez cette entreprise:',
    iAmBuyer: 'Je suis Acheteur',
    iAmSeller: 'Je suis Vendeur / Partenaire',
    yourName: 'Votre Nom',
    companyOptional: 'Entreprise (optionnel)',
    reviewPlaceholder: 'Partagez votre expérience commerciale (qualité, MOQ, respect des délais, conformité ZLECAf)...',
    postReview: 'Publier l\'avis',
    cancel: 'Annuler',
    reviewSuccess: 'Avis publié ! Le score de confiance a été recalculé en temps réel.',
    viewAllReviews: 'Voir les',
    officialRegistryCheck: 'Registre Officiel du Commerce',
    contactAuthentication: 'Authentification des Coordonnées',
    physicalSiteCheck: 'Vérification du Site Physique',
    auditTimestamp: 'Horodatage d\'Audit',
    afcftaReady: 'Prêt pour l\'Export ZLECAf',

    savedFavoriteSuppliers: 'Fournisseurs Favoris Enregistrés',
    exploreMoreSuppliers: 'Découvrir d\'autres fournisseurs',
    noSavedSuppliersYet: 'Aucun fournisseur enregistré',
    noSavedSuppliersDesc: 'Enregistrez des fabricants africains vérifiés dans votre liste d\'achats en cliquant sur l\'icône de marque-page.',
    browseDirectory: 'Parcourir le répertoire vérifié',

    accessRestricted: 'Accès Réservé · Membres Uniquement',
    signInOrSignUp: 'Connectez-vous ou inscrivez-vous pour accéder',
    accessRestrictedDesc: 'Sans connexion, les utilisateurs peuvent uniquement consulter le répertoire. Connectez-vous ou inscrivez votre entreprise pour débloquer les appels d\'offres B2B, vitrines et modèles douaniers.',
    enterDirectorySignIn: 'Accéder au Portail (Connexion)',
    listBusinessSignUp: 'Inscrire votre entreprise (Inscription)',
    continueBrowsing: 'Continuer la navigation dans le répertoire',

    b2bMarketplaceTitle: 'Marché d\'Approvisionnement Panafricain B2B',
    b2bMarketplaceDesc: 'Publiez des appels d\'offres, comparez les offres des fournisseurs et contractualisez directement avec des usines africaines.',
    postSourcingRequestBtn: 'Publier un Appel d\'Offres',
    sectorFilter: 'Secteur:',
    openTenderBadge: 'Appel Ouvert',
    targetVolume: 'Volume Souhaité:',
    targetBudget: 'Budget Cible:',
    destination: 'Destination de Livraison:',
    deadline: 'Date Limite:',
    requiredCerts: 'Certifications Requises:',
    bidsReceived: 'Offres Reçues',
    submitQuotationBtn: 'Soumettre un Devis',
    compareQuotesBtn: 'Comparer les Devis',
    negotiateWhatsApp: 'Négocier sur WhatsApp',

    backToMarketplace: 'Retour au Marché B2B',
    procurementTender: 'Appel d\'Offres Commercial',
    postRFQDesc: 'Diffusez votre besoin d\'achat auprès de fabricants et transformateurs certifiés en Afrique. Recevez des devis compétitifs aux normes ZLECAf.',
    productRequirement: 'Besoin d\'approvisionnement *',
    yourNameTitle: 'Votre Nom / Fonction *',
    companyOrg: 'Entreprise / Organisation',
    buyerCountry: 'Votre Pays (Origine acheteur)',
    deliveryDestination: 'Port ou Ville de Destination *',
    categoryIndustry: 'Catégorie de Produits / Secteur',
    orderVolume: 'Quantité / Volume Requis *',
    targetUnitPrice: 'Prix Unitaire Cible ($ USD)',
    preferredIncoterm: 'Incoterm Souhaité',
    tenderDeadline: 'Date Limite de Soumission',
    whatsAppNegotiation: 'Contact WhatsApp pour Négociation Directe *',
    technicalSpecs: 'Spécifications Techniques et Conditions',
    publishRFQBtn: 'Publier l\'Appel d\'Offres',

    backToTender: 'Retour à l\'Appel d\'Offres',
    supplierBidSubmission: 'Dépôt d\'Offre Fournisseur',
    selectVerifiedCompany: 'Sélectionnez votre Entreprise Vérifiée *',
    unitPriceUSD: 'Prix Unitaire ($ USD) *',
    minOrderQty: 'Quantité Minimale de Commande (QMC) *',
    leadTimeDays: 'Délai de Production (Jours)',
    incotermOffered: 'Incoterm Proposé',
    paymentSecurityTerms: 'Conditions de Sécurisation des Paiements',
    technicalNotes: 'Notes Techniques & Certifications',
    submitBidBtn: 'Déposer l\'Offre Officielle',
    compareTenderSummary: 'Dossier Comparatif des Devis',
    buyerLabel: 'Acheteur:',
    noBidsYet: 'Aucune offre soumise pour cet appel d\'offres pour le moment.',
    firstBidPrompt: 'Êtes-vous un producteur africain certifié ? Déposez la première cotation officielle.',
    bestPrice: 'Meilleur Prix',
    afcftaEligible: 'Éligible ZLECAf Franchise Douanière',

    backToDirectory: 'Retour au Répertoire',
    advisorDesc: 'Évaluez l\'éligibilité tarifaire préférentielle ZLECAf, les pièces douanières requises et les corridors logistiques fiables.',
    originCountry: 'Pays Fournisseur (Origine)',
    destCountry: 'Pays Acheteur (Destination)',
    hsCodeCategory: 'Code SH / Catégorie de Produit',
    tradeVolume: 'Volume de la Transaction ($ USD)',
    calculateFeasibility: 'Calculer la Faisabilité du Corridor',
    tariffAssessment: 'Évaluation Douanière ZLECAf',
    customsDocs: 'Documents Douaniers Obligatoires',
    logisticsCorridor: 'Corridor Logistique & Délais de Transit',
    paymentSecurity: 'Modes de Paiement & Séquestre Recommandés',

    verificationArchitecture: 'Architecture de Vérification',
    trustHubDesc: 'AfriTrade Trust valide les statuts légaux d\'enregistrement, les sites réels de production et les documents d\'export pour éliminer les intermédiaires non vérifiés en Afrique.',
    corridorAdvisorBtn: 'Conseiller Corridors ZLECAf',
    downloadTemplatesBtn: 'Télécharger Modèles Commerciaux',
    resourceHubDesc: 'Téléchargez des modèles conformes pour le commerce africain : Certificat d\'Origine ZLECAf, Facture Commerciale avec Code SH et Connaissement Maritime.',
    downloadTemplate: 'Télécharger le Modèle',
    copyTemplate: 'Copier dans le Presse-papier',
    copied: 'Copié',

    digitalStorefrontBuilder: 'Créateur de Vitrine Digitale',
    liveStorefront: 'Vitrine Active',
    editStorefront: 'Modifier la Vitrine',
    storefrontAnalytics: 'Statistiques de la Vitrine',
    shareWhatsAppBtn: 'Partager sur WhatsApp',
    downloadQRCode: 'Télécharger le QR Code',
    saveLiveChanges: 'Enregistrer en Direct',

    enterDirectoryTitle: 'Accès Répertoire',
    enterDirectoryDesc: 'Connectez-vous pour gérer votre présence numérique vérifiée, suivre vos demandes et accéder aux outils commerciaux.',
    verifiedBusiness: 'Entreprise Vérifiée',
    commercialBuyer: 'Acheteur Professionnel',
    selectVerifiedBusiness: 'Sélectionner l\'Entreprise',
    buyerOrgName: 'Organisation / Nom de l\'Acheteur',
    phoneWhatsApp: 'Numéro Téléphone / WhatsApp',
    pinPasscode: 'Code PIN / Sécurité',
    enterDirectoryPortal: 'Accéder au Portail',
    needToRegister: 'Vous devez inscrire votre entreprise ?',
    listBusinessHere: 'Inscrivez-la ici',
    sessionSecurity: 'Sécurité de la Session',
    activeVerified: 'Actif & Vérifié',
    afcftaTradeAuthority: 'Autorisation Commerce ZLECAf',
    goToStorefront: 'Aller à ma Vitrine Digitale',
    viewB2BMarketplace: 'Consulter le Marché B2B Panafricain',
    signOutDirectory: 'Déconnexion du Répertoire',

    sellerOnboarding: 'Intégration Fournisseur',
    sellerOnboardingDesc: 'Rejoignez des milliers de fabricants, transformateurs et exportateurs africains vérifiés. Soyez visible auprès d\'acheteurs panafricains.',
    companyLegalName: 'Raison Sociale Enregistrée *',
    registrationNumber: 'Numéro de Registre de Commerce *',
    registryAuthority: 'Autorité Publique d\'Enregistrement',
    countryLabel: 'Pays de Domiciliation',
    cityLocation: 'Ville / Zone Industrielle *',
    sectorIndustry: 'Secteur d\'Activité Principal',
    leadProductName: 'Nom du Produit Phare *',
    wholesalePriceUSD: 'Prix de Gros Unitaire ($ USD) *',
    moqPlaceholder: 'Quantité Minimale (ex: 1 000 unités)',
    afcftaExporterToggle: 'Notre entreprise respecte les règles d\'origine ZLECAf pour bénéficier des tarifs préférentiels',
    submitRegistration: 'Valider la Vérification et Inscrire l\'Entreprise',
    businessRegisteredSuccess: 'Entreprise Enregistrée avec Succès',
    viewInDirectory: 'Voir dans le Répertoire',
    manageStorefront: 'Gérer la Vitrine',

    reportDiscrepancy: 'Signaler une Anomalie',
    claimOwnership: 'Revendiquer la Propriété',
    shareProfile: 'Partager le Profil',
    contactWhatsApp: 'Contacter sur WhatsApp',
    tabVerification: 'Dossier de Vérification',
    tabReviews: 'Avis & Score de Confiance',
    tabProducts: 'Produits de Gros',
    tabTrade: 'Commerce Transfrontalier & ZLECAf',
    tabInquiry: 'Formulaire de Demande WhatsApp',
    govIncorporationCheck: 'Vérification de l\'Immatriculation',
    regEntityName: 'Dénomination Légale',
    sovereignRegistrar: 'Registre Souverain',
    regYear: 'Année de Création',
    auditSiteInspection: 'Rapport d\'Audit & Inspection Physique',
    physicalFactoryAudit: 'Audit de l\'Usine / Entrepôt',
    independentCertifications: 'Certifications Indépendantes',
    addProductBtn: 'Ajouter un Produit de Gros',
    editProduct: 'Modifier',
    deleteProduct: 'Supprimer',
    saveProductLive: 'Sauvegarder en Direct',
    launchWhatsAppChat: 'Ouvrir la Conversation WhatsApp',

    backToProfile: 'Retour au profil de l\'entreprise',
    claimProfileTitle: 'Revendiquer la propriété de l\'entreprise',
    claimProfileDesc: 'Confirmez votre mandat officiel pour gérer les produits, les appels d\'offres et votre vitrine.',
    claimSubmitBtn: 'Vérifier & Revendiquer l\'Entité',
    claimSubmittedSuccess: 'Demande de propriété soumise',
    reportProfileTitle: 'Signaler une entité suspecte ou divergence',
    reportProfileDesc: 'Maintenez l\'intégrité du réseau AfriTrade. Les signalements déclenchent un audit indépendant.',
    reportSubmitBtn: 'Envoyer le rapport de divergence',
    reportSubmittedSuccess: 'Signalement enregistré avec succès',

    rfqPublishedSuccessTitle: 'Appel d’offres publié avec succès',
    rfqPublishedSuccessDesc: 'Votre demande d’approvisionnement a été diffusée auprès des fournisseurs africains vérifiés et mise en cache hors-ligne.',
    viewInMarketplace: 'Voir dans le marché des appels',
    postAnotherTender: 'Publier un autre besoin',
    quoteSubmittedSuccessTitle: 'Offre commerciale soumise avec succès',
    quoteSubmittedSuccessDesc: 'Votre proposition commerciale vérifiée a été enregistrée et transmise à l’acheteur.',
    viewTendersList: 'Retour au marché',
  },

  pt: {
    appName: 'AfriTrade Trust',
    appTagline: 'Rede Pan-Africana de Empresas Verificadas e Comércio B2B',
    poweredBy: 'desenvolvido por',

    navDirectory: 'Directório',
    navSaved: 'Guardados',
    navB2BRFQs: 'Concursos B2B',
    navPostTender: 'Publicar concurso',
    navStorefront: 'Montra PME',
    navResources: 'Recursos',
    navTrustHub: 'Hub Confiança',
    navTradeAdvisor: 'Consultor de Comércio',
    navListBusiness: 'Registar empresa',
    navSignIn: 'Entrar',
    navSignOut: 'Sair',
    guestMode: 'Modo Convidado',
    langLabel: 'Idioma:',
    currencyLabel: 'Moeda:',

    filterBy: 'Filtrar por:',
    allCountries: 'Todos os Países Africanos',
    allSectors: 'Todos os Sectores',
    verifiedOnly: 'Apenas Verificados',
    afcftaDutyFree: 'ZCLCA / Isento de Direitos',
    showingSuppliers: 'A apresentar',
    verifiedSuppliersCount: 'fornecedores verificados',
    noBusinessesMatched: 'Nenhuma empresa encontrada',
    noBusinessesDesc: 'Alargue os termos de pesquisa ou limpe os filtros activos.',
    resetFilters: 'Repor Filtros',
    aiSearchSubtitle: '✅ Fornecedores e Produtos Africanos Verificados',
    searchPlaceholder: 'Pesquisar fornecedores, ex: "Fabricante de embalagens em Angola que exporta para Namíbia"...',
    searchBtn: 'Buscar',
    resetSearch: 'Limpar',
    listening: 'A escutar...',
    matchInsight: 'Análise de Correspondência',
    afcftaInsight: 'Parecer Pautal AfCFTA / ZCLCA',

    trustScore: 'Índice de Confiança',
    tier3Badge: 'Nível 3 · Auditado',
    tier2Badge: 'Nível 2 · Registado',
    tier1Badge: 'Nível 1 · Básico',
    unverifiedBadge: 'Não verificado',
    save: 'Guardar',
    saved: 'Guardado',
    saveSupplier: 'Guardar Fornecedor',
    savedToFavorites: 'Guardado nos Favoritos',
    saveToFavorites: 'Guardar nos Fornecedores Favoritos',
    removeFromFavorites: 'Remover dos Favoritos',
    signInToSave: 'Inicie sessão para guardar fornecedores favoritos',
    verifiedID: 'ID Verificado',
    leadProduct: 'Produto Principal',
    moqLabel: 'Qtd. Mín. (MOQ)',
    exports: 'Exportações:',
    whatsAppBtn: 'WhatsApp',
    quoteBtn: 'Cotação',
    fullDossier: 'Dossier Completo',
    verificationInsights: 'Critérios de Verificação',
    verifiedCerts: 'certificados verificados',
    liveSync: 'Sincronização em Directo:',
    goodReviews: 'Positivas',
    badReviews: 'Críticas',
    reviews: 'Avaliações',
    writeReview: 'Escrever Avaliação',
    rateThisBusiness: 'Avalie esta Empresa:',
    iAmBuyer: 'Sou Comprador',
    iAmSeller: 'Sou Vendedor / Parceiro',
    yourName: 'O seu Nome',
    companyOptional: 'Empresa (opcional)',
    reviewPlaceholder: 'Descreva a sua experiência comercial (qualidade do produto, prazos, documentação AfCFTA)...',
    postReview: 'Publicar Avaliação',
    cancel: 'Cancelar',
    reviewSuccess: 'Avaliação publicada! Índice de confiança recalculado em tempo real.',
    viewAllReviews: 'Ver todas as',
    officialRegistryCheck: 'Registo Comercial Oficial',
    contactAuthentication: 'Autenticação de Contactos',
    physicalSiteCheck: 'Auditoria às Instalações Físicas',
    auditTimestamp: 'Registo Temporal de Auditoria',
    afcftaReady: 'Pronto para Exportar na ZCLCA',

    savedFavoriteSuppliers: 'Fornecedores Favoritos Guardados',
    exploreMoreSuppliers: 'Explorar mais fornecedores',
    noSavedSuppliersYet: 'Ainda não tem fornecedores guardados',
    noSavedSuppliersDesc: 'Guarde fabricantes africanos verificados na sua lista de compras clicando no marcador em qualquer cartão.',
    browseDirectory: 'Navegar no Directório Verificado',

    accessRestricted: 'Acesso Restrito · Apenas Membros',
    signInOrSignUp: 'Inicie Sessão ou Registe-se para Aceder',
    accessRestrictedDesc: 'Sem início de sessão, os utilizadores apenas podem consultar o directório. Inicie sessão para desbloquear concursos B2B, montras digitais e minutas aduaneiras.',
    enterDirectorySignIn: 'Entrar no Directório (Login)',
    listBusinessSignUp: 'Registar Empresa (Inscrição)',
    continueBrowsing: 'Continuar a navegar no directório',

    b2bMarketplaceTitle: 'Mercado Pan-Africano de Compras B2B',
    b2bMarketplaceDesc: 'Publique concursos de aquisição, compare cotações de fornecedores e contrate directamente com fábricas africanas.',
    postSourcingRequestBtn: 'Publicar Pedido de Compra',
    sectorFilter: 'Sector:',
    openTenderBadge: 'Concurso Aberto',
    targetVolume: 'Volume Pretendido:',
    targetBudget: 'Orçamento Alvo:',
    destination: 'Destino de Entrega:',
    deadline: 'Prazo Limite:',
    requiredCerts: 'Certificações Exigidas:',
    bidsReceived: 'Propostas Recebidas',
    submitQuotationBtn: 'Enviar Cotação',
    compareQuotesBtn: 'Comparar Cotações',
    negotiateWhatsApp: 'Negociar por WhatsApp',

    backToMarketplace: 'Voltar ao Mercado B2B',
    procurementTender: 'Concurso de Aprovisionamento',
    postRFQDesc: 'Divulgue a sua necessidade de compra a transformadores e indústrias verificadas em toda a África. Obtenha cotações com termos AfCFTA.',
    productRequirement: 'Necessidade de Aprovisionamento *',
    yourNameTitle: 'O seu Nome / Cargo *',
    companyOrg: 'Empresa / Organização',
    buyerCountry: 'O seu País (Origem Comprador)',
    deliveryDestination: 'Porto ou Cidade de Destino *',
    categoryIndustry: 'Categoria de Produto / Sector',
    orderVolume: 'Quantidade / Volume Encomendado *',
    targetUnitPrice: 'Preço Unitário Alvo ($ USD)',
    preferredIncoterm: 'Incoterm Pretendido',
    tenderDeadline: 'Data Limite para Propostas',
    whatsAppNegotiation: 'Contacto WhatsApp para Negociação Directa *',
    technicalSpecs: 'Especificações Técnicas e Requisitos',
    publishRFQBtn: 'Publicar Pedido de Compra',

    backToTender: 'Voltar ao Concurso',
    supplierBidSubmission: 'Submissão de Proposta de Fornecimento',
    selectVerifiedCompany: 'Seleccione a sua Empresa Verificada *',
    unitPriceUSD: 'Preço Unitário ($ USD) *',
    minOrderQty: 'Quantidade Mínima de Encomenda (MOQ) *',
    leadTimeDays: 'Prazo de Produção (Dias)',
    incotermOffered: 'Incoterm Oferecido',
    paymentSecurityTerms: 'Termos de Segurança de Pagamento',
    technicalNotes: 'Notas Técnicas e Certificados',
    submitBidBtn: 'Submeter Proposta Oficial',
    compareTenderSummary: 'Dossier de Comparação de Cotações',
    buyerLabel: 'Comprador:',
    noBidsYet: 'Nenhuma proposta submetida até ao momento para este concurso.',
    firstBidPrompt: 'É um fabricante africano certificado? Envie a primeira proposta oficial.',
    bestPrice: 'Melhor Preço',
    afcftaEligible: 'Elegível para Isenção Pautal AfCFTA',

    backToDirectory: 'Voltar ao Directório',
    advisorDesc: 'Avalie o enquadramento pautal preferencial da ZCLCA, documentos alfandegários exigidos e corredores logísticos comprovados.',
    originCountry: 'País Fornecedor (Origem)',
    destCountry: 'País Comprador (Destino)',
    hsCodeCategory: 'Código Pautal SH / Categoria',
    tradeVolume: 'Volume da Transacção ($ USD)',
    calculateFeasibility: 'Calcular Viabilidade do Corredor',
    tariffAssessment: 'Enquadramento Pautal ZCLCA',
    customsDocs: 'Documentação Aduaneira Obrigatória',
    logisticsCorridor: 'Corredores Logísticos e Tempo de Trânsito',
    paymentSecurity: 'Modos de Pagamento e Escrow Recomendados',

    verificationArchitecture: 'Arquitectura de Verificação',
    trustHubDesc: 'A AfriTrade Trust valida registos comerciais governamentais, fábricas operacionais e documentos aduaneiros para erradicar intermediários não verificados em África.',
    corridorAdvisorBtn: 'Consultor de Corredores ZCLCA',
    downloadTemplatesBtn: 'Descarregar Minutas Comerciais',
    resourceHubDesc: 'Descarregue minutas oficiais de comércio africano: Certificado de Origem AfCFTA, Factura Comercial com Código SH e Conhecimento de Embarque.',
    downloadTemplate: 'Descarregar Minuta',
    copyTemplate: 'Copiar para Área de Transferência',
    copied: 'Copiado',

    digitalStorefrontBuilder: 'Criador de Montra Digital',
    liveStorefront: 'Montra em Directo',
    editStorefront: 'Editar Montra',
    storefrontAnalytics: 'Métricas da Montra',
    shareWhatsAppBtn: 'Partilhar no WhatsApp',
    downloadQRCode: 'Descarregar Código QR',
    saveLiveChanges: 'Guardar Alterações em Directo',

    enterDirectoryTitle: 'Aceder ao Directório',
    enterDirectoryDesc: 'Inicie sessão para gerir a sua presença verificada, responder a cotações e aceder a ferramentas comerciais.',
    verifiedBusiness: 'Empresa Verificada',
    commercialBuyer: 'Comprador Comercial',
    selectVerifiedBusiness: 'Seleccionar Empresa Verificada',
    buyerOrgName: 'Organização / Nome do Comprador',
    phoneWhatsApp: 'Número de Telefone / WhatsApp',
    pinPasscode: 'Código PIN / Segurança',
    enterDirectoryPortal: 'Aceder ao Portal',
    needToRegister: 'Precisa de registar a sua empresa?',
    listBusinessHere: 'Registe-a aqui',
    sessionSecurity: 'Segurança da Sessão',
    activeVerified: 'Activo e Verificado',
    afcftaTradeAuthority: 'Habilitação Comercial ZCLCA',
    goToStorefront: 'Ir para a minha Montra Digital',
    viewB2BMarketplace: 'Ver Mercado Pan-Africano B2B',
    signOutDirectory: 'Terminar Sessão no Directório',

    sellerOnboarding: 'Inscrição de Fornecedor',
    sellerOnboardingDesc: 'Junte-se a milhares de produtores, fábricas e exportadores africanos verificados. Receba contactos directos de compradores.',
    companyLegalName: 'Denominação Social Registada *',
    registrationNumber: 'Número de Registo Comercial *',
    registryAuthority: 'Autoridade Pública de Registo',
    countryLabel: 'País de Constituição',
    cityLocation: 'Cidade / Pólo Industrial *',
    sectorIndustry: 'Sector de Actividade Principal',
    leadProductName: 'Produto Principal de Venda por Grosso *',
    wholesalePriceUSD: 'Preço Unitário por Grosso ($ USD) *',
    moqPlaceholder: 'Quantidade Mínima (ex: 1.000 unidades)',
    afcftaExporterToggle: 'A nossa empresa cumpre as Regras de Origem da ZCLCA para beneficiar de tarifas preferenciais',
    submitRegistration: 'Concluir Verificação e Registar Empresa',
    businessRegisteredSuccess: 'Empresa Registada com Sucesso',
    viewInDirectory: 'Ver no Directório',
    manageStorefront: 'Gerir Montra',

    reportDiscrepancy: 'Denunciar Discrepância',
    claimOwnership: 'Reivindicar Titularidade',
    shareProfile: 'Partilhar Perfil',
    contactWhatsApp: 'Contactar por WhatsApp',
    tabVerification: 'Dossier de Verificação',
    tabReviews: 'Avaliações e Confiança',
    tabProducts: 'Produtos por Grosso',
    tabTrade: 'Comércio Transfronteiriço & ZCLCA',
    tabInquiry: 'Compositor de Mensagens WhatsApp',
    govIncorporationCheck: 'Verificação de Registo Comercial',
    regEntityName: 'Nome da Entidade Registada',
    sovereignRegistrar: 'Registo Soberano',
    regYear: 'Ano de Registo',
    auditSiteInspection: 'Auditoria e Inspecção Física',
    physicalFactoryAudit: 'Inspecção a Fábrica e Armazém',
    independentCertifications: 'Certificações Independentes',
    addProductBtn: 'Adicionar Produto por Grosso',
    editProduct: 'Editar',
    deleteProduct: 'Eliminar',
    saveProductLive: 'Guardar Produto em Directo',
    launchWhatsAppChat: 'Abrir Conversa WhatsApp',

    backToProfile: 'Voltar ao Perfil da Empresa',
    claimProfileTitle: 'Reivindicar Propriedade da Empresa',
    claimProfileDesc: 'Verifique a sua representação legal para gerir catálogo, concursos e a sua montra digital.',
    claimSubmitBtn: 'Verificar & Reivindicar Entidade',
    claimSubmittedSuccess: 'Reivindicação de Propriedade Submetida',
    reportProfileTitle: 'Reportar Entidade Suspeita ou Divergência',
    reportProfileDesc: 'Proteja a integridade da rede comercial africana. As denúncias acionam auditoria independente.',
    reportSubmitBtn: 'Submeter Relatório de Divergência',
    reportSubmittedSuccess: 'Denúncia Registada com Sucesso',

    rfqPublishedSuccessTitle: 'Concurso Publicado com Sucesso',
    rfqPublishedSuccessDesc: 'O seu requisito de aquisição foi transmitido a fornecedores africanos verificados e guardado em cache offline.',
    viewInMarketplace: 'Ver no Mercado de Concursos',
    postAnotherTender: 'Publicar Novo Requisito',
    quoteSubmittedSuccessTitle: 'Proposta Comercial Submetida com Sucesso',
    quoteSubmittedSuccessDesc: 'A sua proposta comercial verificada foi registada e encaminhada para a equipa de compras.',
    viewTendersList: 'Voltar ao Mercado',
  },

  sw: {
    appName: 'AfriTrade Trust',
    appTagline: 'Mtandao wa Biashara Zilizothibitishwa za Kiafrika na B2B',
    poweredBy: 'inaendeshwa na',

    navDirectory: 'Orodha',
    navSaved: 'Vilivyohifadhiwa',
    navB2BRFQs: 'Zabuni za B2B',
    navPostTender: 'Weka zabuni',
    navStorefront: 'Duka la SME',
    navResources: 'Nyenzo',
    navTrustHub: 'Kituo cha Uaminifu',
    navTradeAdvisor: 'Mshauri wa Biashara',
    navListBusiness: 'Sajili Biashara',
    navSignIn: 'Ingia',
    navSignOut: 'Toka',
    guestMode: 'Hali ya Mgeni',
    langLabel: 'Lugha:',
    currencyLabel: 'Sarafu:',

    filterBy: 'Chuja kwa:',
    allCountries: 'Nchi Zote za Afrika',
    allSectors: 'Sekta Zote',
    verifiedOnly: 'Zilizothibitishwa Pekee',
    afcftaDutyFree: 'AfCFTA Bila Ushuru',
    showingSuppliers: 'Inaonyesha',
    verifiedSuppliersCount: 'wauzaji waliothibitishwa',
    noBusinessesMatched: 'Hakuna biashara iliyopatikana',
    noBusinessesDesc: 'Panua maneno ya utafutaji au weka upya vichujio.',
    resetFilters: 'Weka Upya Vichujio',
    aiSearchSubtitle: '✅ Wauzaji na Bidhaa Zilizothibitishwa za Kiafrika',
    searchPlaceholder: 'Tafuta wauzaji, mfano: "Watengenezaji wa vifungashio nchini Kenya wanaosafirisha nje"...',
    searchBtn: 'Tafuta',
    resetSearch: 'Weka Upya',
    listening: 'Inasikiliza...',
    matchInsight: 'Uchambuzi wa Mechi',
    afcftaInsight: 'Ushauri wa Ushuru wa AfCFTA',

    trustScore: 'Kiwango cha Uaminifu',
    tier3Badge: 'Daraja la 3 · Imekaguliwa',
    tier2Badge: 'Daraja la 2 · Imesajiliwa',
    tier1Badge: 'Daraja la 1 · Msingi',
    unverifiedBadge: 'Haijathibitishwa',
    save: 'Hifadhi',
    saved: 'Imehifadhiwa',
    saveSupplier: 'Hifadhi Muuzaji',
    savedToFavorites: 'Imehifadhiwa kwenye Vipendwa',
    saveToFavorites: 'Hifadhi kwenye Wauzaji Vipendwa',
    removeFromFavorites: 'Ondoa kwenye Vipendwa',
    signInToSave: 'Ingia ili kuhifadhi wauzaji vipendwa',
    verifiedID: 'Kitambulisho Kilichothibitishwa',
    leadProduct: 'Bidhaa Kuu',
    moqLabel: 'Kiwango cha Chini (MOQ)',
    exports: 'Inasafirisha:',
    whatsAppBtn: 'WhatsApp',
    quoteBtn: 'Nukuu',
    fullDossier: 'Taarifa Kamili',
    verificationInsights: 'Vigezo vya Uhakiki',
    verifiedCerts: 'vyeti vilivyothibitishwa',
    liveSync: 'Upatanisho wa Moja kwa Moja:',
    goodReviews: 'Nzuri',
    badReviews: 'Mbaya',
    reviews: 'Tathmini',
    writeReview: 'Andika Tathmini',
    rateThisBusiness: 'Kadiria Biashara Hii:',
    iAmBuyer: 'Mimi ni Mnunuzi',
    iAmSeller: 'Mimi ni Muuzaji / Mshirika',
    yourName: 'Jina Lako',
    companyOptional: 'Kampuni (hiari)',
    reviewPlaceholder: 'Eleza uzoefu wako wa kibiashara (ubora wa bidhaa, utoaji, nyaraka za AfCFTA)...',
    postReview: 'Tuma Tathmini',
    cancel: 'Ghairi',
    reviewSuccess: 'Tathmini imechapishwa! Kiwango cha uaminifu kimehesabiwa upya mara moja.',
    viewAllReviews: 'Tazama zote',
    officialRegistryCheck: 'Usajili Rasmi wa Serikali',
    contactAuthentication: 'Uthibitisho wa Mawasiliano',
    physicalSiteCheck: 'Ukaguzi wa Kiwanda na Eneo',
    auditTimestamp: 'Muda wa Ukaguzi Rasmi',
    afcftaReady: 'Tayari Kusafirisha Chini ya AfCFTA',

    savedFavoriteSuppliers: 'Wauzaji Vipendwa Waliohifadhiwa',
    exploreMoreSuppliers: 'Gundua wauzaji zaidi',
    noSavedSuppliersYet: 'Hujauhifadhi wauzaji bado',
    noSavedSuppliersDesc: 'Hifadhi wazalishaji waliothibitishwa wa Kiafrika kwa kubofya alama ya alamisho kwenye kadi yoyote.',
    browseDirectory: 'Vinjari Orodha Iliyothibitishwa',

    accessRestricted: 'Ufikiaji Umezuiliwa · Wanachama Pekee',
    signInOrSignUp: 'Ingia au Jisajili ili Kupata Ufikiaji',
    accessRestrictedDesc: 'Bila kuingia, watumiaji wanaweza tu kutazama orodha ya biashara. Ingia au sajili biashara yako ili kufungua zabuni za B2B, maduka ya mtandaoni na nyaraka za forodha.',
    enterDirectorySignIn: 'Ingia Kwenye Orodha (Ingia)',
    listBusinessSignUp: 'Sajili Biashara Yako (Jisajili)',
    continueBrowsing: 'Endelea kutazama Orodha Iliyothibitishwa',

    b2bMarketplaceTitle: 'Soko la Manunuzi la B2B Barani Afrika',
    b2bMarketplaceDesc: 'Chapisha maombi ya ununuzi, linganisha nukuu za bei na uingie mikataba moja kwa moja na viwanda vya Kiafrika.',
    postSourcingRequestBtn: 'Tuma Ombi la Manunuzi',
    sectorFilter: 'Sekta:',
    openTenderBadge: 'Zabuni Wazi',
    targetVolume: 'Kiasi Kinachohitajika:',
    targetBudget: 'Bajeti Inayolengwa:',
    destination: 'Mji / Bandari ya Kufikisha:',
    deadline: 'Mwisho wa Kupokea:',
    requiredCerts: 'Vyeti Vinavyohitajika:',
    bidsReceived: 'Nukuu Zilizopokelewa',
    submitQuotationBtn: 'Tuma Nukuu ya Bei',
    compareQuotesBtn: 'Linganisha Nukuu',
    negotiateWhatsApp: 'Jadiliana kupitia WhatsApp',

    backToMarketplace: 'Rudi kwenye Soko la B2B',
    procurementTender: 'Zabuni ya Ununuzi',
    postRFQDesc: 'Tangaza mahitaji yako ya manunuzi kwa wazalishaji na wasindikaji waliothibitishwa kote Afrika. Pokea nukuu zenye masharti ya AfCFTA.',
    productRequirement: 'Mahitaji ya Bidhaa *',
    yourNameTitle: 'Jina Lako / Wadhifa *',
    companyOrg: 'Kampuni / Shirika',
    buyerCountry: 'Nchi Yako (Asili ya Mnunuzi)',
    deliveryDestination: 'Bandari au Mji Unaoelekezwa *',
    categoryIndustry: 'Kitengo cha Bidhaa / Sekta',
    orderVolume: 'Kiasi cha Bidhaa *',
    targetUnitPrice: 'Kiwango cha Bei kwa Kipimo ($ USD)',
    preferredIncoterm: 'Incoterm Inayopendelewa',
    tenderDeadline: 'Tarehe ya Mwisho ya Kutuma',
    whatsAppNegotiation: 'Mawasiliano ya WhatsApp kwa Mazungumzo ya Moja kwa Moja *',
    technicalSpecs: 'Vipimo vya Kiufundi na Masharti',
    publishRFQBtn: 'Chapisha Ombi la Manunuzi',

    backToTender: 'Rudi kwenye Zabuni',
    supplierBidSubmission: 'Uwasilishaji wa Nukuu ya Muuzaji',
    selectVerifiedCompany: 'Chagua Kampuni Yako Iliyothibitishwa *',
    unitPriceUSD: 'Bei kwa Kipimo ($ USD) *',
    minOrderQty: 'Kiwango cha Chini cha Kuagiza (MOQ) *',
    leadTimeDays: 'Muda wa Uzalishaji (Siku)',
    incotermOffered: 'Incoterm Inayotolewa',
    paymentSecurityTerms: 'Masharti ya Malipo Salama',
    technicalNotes: 'Maelezo ya Kiufundi na Vyeti',
    submitBidBtn: 'Wasilisha Nukuu Rasmi',
    compareTenderSummary: 'Uchambuzi wa Kulinganisha Nukuu',
    buyerLabel: 'Mnunuzi:',
    noBidsYet: 'Hakuna nukuu za wauzaji zilizowasilishwa bado kwa zabuni hii.',
    firstBidPrompt: 'Je, wewe ni mtengenezaji wa Kiafrika aliyethibitishwa? Tuma nukuu ya kwanza rasmi.',
    bestPrice: 'Bei Bora Zaidi',
    afcftaEligible: 'Inastahiki Msamaha wa Ushuru wa AfCFTA',

    backToDirectory: 'Rudi kwenye Orodha',
    advisorDesc: 'Kagua kustahiki kwa ushuru wa upendeleo wa AfCFTA, nyaraka za forodha na njia bora za usafirishaji.',
    originCountry: 'Nchi ya Muuzaji (Asili)',
    destCountry: 'Nchi ya Mnunuzi (Inakoelekea)',
    hsCodeCategory: 'Msimbo wa HS / Kitengo cha Bidhaa',
    tradeVolume: 'Kiasi cha Muamala ($ USD)',
    calculateFeasibility: 'Hesabu Uwezekano wa Njia ya Biashara',
    tariffAssessment: 'Tathmini ya Ushuru ya AfCFTA',
    customsDocs: 'Nyaraka Zinazohitajika za Forodha',
    logisticsCorridor: 'Njia ya Usafirishaji na Muda wa Safari',
    paymentSecurity: 'Njia Salama za Malipo Zinazopendekezwa',

    verificationArchitecture: 'Muundo wa Uhakiki na Uaminifu',
    trustHubDesc: 'AfriTrade Trust inathibitisha usajili rasmi wa serikali, viwanda halisi na nyaraka za forodha ili kuondoa madalali wasioidhinishwa barani Afrika.',
    corridorAdvisorBtn: 'Mshauri wa Njia za AfCFTA',
    downloadTemplatesBtn: 'Pakua Vielelezo vya Biashara',
    resourceHubDesc: 'Pakua vielelezo sanifu vya forodha na biashara ya Kiafrika: Cheti cha Asili cha AfCFTA, Ankara ya Biashara na Hati ya Upakiaji.',
    downloadTemplate: 'Pakua Kielelezo',
    copyTemplate: 'Nakili kwenye Ubao',
    copied: 'Imenakiliwa',

    digitalStorefrontBuilder: 'Kijenzi cha Duka la Kidijitali',
    liveStorefront: 'Duka la Moja kwa Moja',
    editStorefront: 'Hariri Duka',
    storefrontAnalytics: 'Takwimu za Duka',
    shareWhatsAppBtn: 'Shiriki kwenye WhatsApp',
    downloadQRCode: 'Pakua Msimbo wa QR',
    saveLiveChanges: 'Hifadhi Mabadiliko Mara Moja',

    enterDirectoryTitle: 'Kuingia Kwenye Orodha',
    enterDirectoryDesc: 'Ingia ili kusimamia wasifu wako uliothibitishwa, kufuatilia maombi ya bei na kupata zana za manunuzi.',
    verifiedBusiness: 'Biashara Iliyothibitishwa',
    commercialBuyer: 'Mnunuzi wa Kibiashara',
    selectVerifiedBusiness: 'Chagua Biashara Iliyothibitishwa',
    buyerOrgName: 'Jina la Shirika / Mnunuzi',
    phoneWhatsApp: 'Nambari ya Simu / WhatsApp',
    pinPasscode: 'Nambari ya Siri (PIN)',
    enterDirectoryPortal: 'Ingia Kwenye Tovuti',
    needToRegister: 'Unahitaji kusajili biashara yako?',
    listBusinessHere: 'Isajili hapa',
    sessionSecurity: 'Usalama wa Wasifu',
    activeVerified: 'Inafanya Kazi na Imethibitishwa',
    afcftaTradeAuthority: 'Uidhinishaji wa Biashara ya AfCFTA',
    goToStorefront: 'Nenda kwenye Duka Langu la Kidijitali',
    viewB2BMarketplace: 'Tazama Soko la Panafrika la B2B',
    signOutDirectory: 'Toka kwenye Orodha',

    sellerOnboarding: 'Usajili wa Muuzaji',
    sellerOnboardingDesc: 'Jiunge na maelfu ya watengenezaji, wasindikaji na wasafirishaji bidhaa nje waliothibitishwa barani Afrika.',
    companyLegalName: 'Jina Rasmi la Kisheria la Kampuni *',
    registrationNumber: 'Nambari ya Usajili wa Kampuni *',
    registryAuthority: 'Mamlaka ya Serikali ya Usajili',
    countryLabel: 'Nchi ya Usajili',
    cityLocation: 'Mji / Eneo la Viwanda *',
    sectorIndustry: 'Sekta Kuu ya Biashara',
    leadProductName: 'Kichwa cha Bidhaa Kuu ya Jumla *',
    wholesalePriceUSD: 'Bei ya Jumla kwa Kipimo ($ USD) *',
    moqPlaceholder: 'Kiwango cha Chini (mfano vitengo 1,000)',
    afcftaExporterToggle: 'Biashara yetu inazingatia Kanuni za Asili za AfCFTA ili kupata msamaha wa ushuru',
    submitRegistration: 'Kamilisha Uhakiki na Sajili Biashara',
    businessRegisteredSuccess: 'Biashara Imesajiliwa Kikamilifu',
    viewInDirectory: 'Tazama Kwenye Orodha',
    manageStorefront: 'Simamia Duka',

    reportDiscrepancy: 'Ripoti Dosari',
    claimOwnership: 'Dai Umiliki wa Wasifu',
    shareProfile: 'Shiriki Wasifu',
    contactWhatsApp: 'Wasiliana kwa WhatsApp',
    tabVerification: 'Hati za Uhakiki',
    tabReviews: 'Tathmini na Uaminifu',
    tabProducts: 'Bidhaa za Jumla',
    tabTrade: 'Biashara ya Mipakani na AfCFTA',
    tabInquiry: 'Mtunzi wa Ujumbe wa WhatsApp',
    govIncorporationCheck: 'Ukaguzi wa Usajili wa Serikali',
    regEntityName: 'Jina la Shirika Lililosajiliwa',
    sovereignRegistrar: 'Msajili Rasmi',
    regYear: 'Mwaka wa Usajili',
    auditSiteInspection: 'Kumbukumbu ya Ukaguzi wa Kiwanda',
    physicalFactoryAudit: 'Ukaguzi wa Kiwanda na Ghala',
    independentCertifications: 'Vyeti Huru vya Viwango',
    addProductBtn: 'Ongeza Bidhaa ya Jumla',
    editProduct: 'Hariri',
    deleteProduct: 'Futa',
    saveProductLive: 'Hifadhi Bidhaa Mara Moja',
    launchWhatsAppChat: 'Fungua Mazungumzo ya WhatsApp',

    backToProfile: 'Rudi kwenye Wasifu wa Biashara',
    claimProfileTitle: 'Thibitisha na Dai Umiliki wa Biashara',
    claimProfileDesc: 'Thibitisha mamlaka yako ya kusimamia orodha ya bidhaa, zabuni na duka la kidijitali.',
    claimSubmitBtn: 'Thibitisha na Dai Kampuni Hii',
    claimSubmittedSuccess: 'Ombi la Umiliki Limewasilishwa',
    reportProfileTitle: 'Ripoti Kampuni ya Kutiliwa Shaka au Ulaghai',
    reportProfileDesc: 'Linda usalama wa mtandao wa biashara wa Afrika. Taarifa huchochea ukaguzi maalum.',
    reportSubmitBtn: 'Wasilisha Ripoti ya Shaka',
    reportSubmittedSuccess: 'Ripoti ya Shaka Imerekodiwa',

    rfqPublishedSuccessTitle: 'Zabuni Imechapishwa Kikamilifu',
    rfqPublishedSuccessDesc: 'Mahitaji yako ya manunuzi yametangazwa kwa wasambazaji waliothibitishwa kote Afrika na kuhifadhiwa kwa matumizi bila mtandao.',
    viewInMarketplace: 'Tazama kwenye Soko la Zabuni',
    postAnotherTender: 'Weka Mahitaji Mengine',
    quoteSubmittedSuccessTitle: 'Nukuu ya Biashara Imewasilishwa Kikamilifu',
    quoteSubmittedSuccessDesc: 'Ofa yako rasmi imerekodiwa na kutumwa kwa wanunuzi.',
    viewTendersList: 'Rudi kwenye Soko la Zabuni',
  },

  ar: {
    appName: 'AfriTrade Trust',
    appTagline: 'منصة اكتشاف وتجارة الشركات الأفريقية الموثوقة B2B',
    poweredBy: 'بدعم من',

    navDirectory: 'الدليل',
    navSaved: 'المحفوظات',
    navB2BRFQs: 'مناقصات B2B',
    navPostTender: 'طرح مناقصة',
    navStorefront: 'المتجر الرقمي',
    navResources: 'الموارد',
    navTrustHub: 'مركز الثقة',
    navTradeAdvisor: 'المستشار التجاري',
    navListBusiness: 'تسجيل شركة',
    navSignIn: 'تسجيل الدخول',
    navSignOut: 'تسجيل الخروج',
    guestMode: 'وضع الزائر',
    langLabel: 'اللغة:',
    currencyLabel: 'العملة:',

    filterBy: 'تصفية حسب:',
    allCountries: 'جميع الدول الأفريقية',
    allSectors: 'جميع القطاعات',
    verifiedOnly: 'الموثقة فقط',
    afcftaDutyFree: 'معفى جمركياً (AfCFTA)',
    showingSuppliers: 'عرض',
    verifiedSuppliersCount: 'مورداً موثقاً',
    noBusinessesMatched: 'لم يتم العثور على شركات مطابقة',
    noBusinessesDesc: 'يرجى توسيع نطاق البحث أو إعادة ضبط خيارات التصفية.',
    resetFilters: 'إعادة ضبط التصفية',
    aiSearchSubtitle: '✅ الموردون والسلع الأفريقية الموثقة رسمياً',
    searchPlaceholder: 'ابحث عن الموردين، مثل: "مصنعو التغليف في أنغولا للتصدير إلى ناميبيا"...',
    searchBtn: 'بحث',
    resetSearch: 'مسح',
    listening: 'جاري الاستماع...',
    matchInsight: 'تحليل المطابقة',
    afcftaInsight: 'رأي التعرفة الجمركية AfCFTA',

    trustScore: 'مؤشر الثقة',
    tier3Badge: 'المستوى 3 · مدقق ومعتمد',
    tier2Badge: 'المستوى 2 · مسجل رسمياً',
    tier1Badge: 'المستوى 1 · هوية موثقة',
    unverifiedBadge: 'غير موثق',
    save: 'حفظ',
    saved: 'محفوظ',
    saveSupplier: 'حفظ المورد',
    savedToFavorites: 'تم الحفظ في المفضلة',
    saveToFavorites: 'حفظ في قائمة الموردين المفضلين',
    removeFromFavorites: 'إزالة من المفضلة',
    signInToSave: 'يرجى تسجيل الدخول لحفظ الموردين المفضلين',
    verifiedID: 'رقم السجل الموثق',
    leadProduct: 'المنتج الرئيسي',
    moqLabel: 'الحد الأدنى (MOQ)',
    exports: 'التصدير إلى:',
    whatsAppBtn: 'واتساب',
    quoteBtn: 'طلب عرض سعر',
    fullDossier: 'الملف الكامل',
    verificationInsights: 'معايير التوثيق الميداني',
    verifiedCerts: 'شهادات معتمدة',
    liveSync: 'تزامن مباشر:',
    goodReviews: 'إيجابية',
    badReviews: 'سلبية',
    reviews: 'التقييمات',
    writeReview: 'كتابة تقييم',
    rateThisBusiness: 'تقييم هذه المنشأة:',
    iAmBuyer: 'أنا مشتري',
    iAmSeller: 'أنا بائع / شريك',
    yourName: 'اسمك الكريم',
    companyOptional: 'اسم الشركة (اختياري)',
    reviewPlaceholder: 'شارك تجربتك التجارية (جودة المنتجات، التزام الشحن، وثائق AfCFTA)...',
    postReview: 'نشر التقييم',
    cancel: 'إلغاء',
    reviewSuccess: 'تم نشر التقييم بنجاح! تم تحديث مؤشر الثقة لحظياً.',
    viewAllReviews: 'عرض جميع الـ',
    officialRegistryCheck: 'السجل التجاري الحكومي الرسمي',
    contactAuthentication: 'توثيق قنوات الاتصال والواتساب',
    physicalSiteCheck: 'المعاينة الميدانية للمصنع والمنشأة',
    auditTimestamp: 'تاريخ التدقيق الرسمي',
    afcftaReady: 'جاهز للتجارة الحرة الأفريقية (AfCFTA)',

    savedFavoriteSuppliers: 'الموردون المفضلون المحفوظون',
    exploreMoreSuppliers: 'استكشاف المزيد من الموردين',
    noSavedSuppliersYet: 'لا يوجد موردون محفوظون حتى الآن',
    noSavedSuppliersDesc: 'احفظ المصانع والشركات الأفريقية الموثقة في قائمتك بالنقر على رمز الحفظ في أي بطاقة.',
    browseDirectory: 'تصفح الدليل الموثق',

    accessRestricted: 'الوصول مخصص للأعضاء المسجلين فقط',
    signInOrSignUp: 'يرجى تسجيل الدخول أو الاشتراك للمتابعة',
    accessRestrictedDesc: 'بدون تسجيل الدخول، يمكن للمستخدمين تصفح دليل الشركات الموثقة فقط. يرجى تسجيل الدخول أو إدراج شركتك للوصول إلى مناقصات B2B والمتاجر الرقمية ونماذج التجارة الحرة.',
    enterDirectorySignIn: 'الدخول إلى المنصة (تسجيل الدخول)',
    listBusinessSignUp: 'تسجيل شركتك (إنشاء حساب)',
    continueBrowsing: 'متابعة تصفح الدليل الموثق مجاناً',

    b2bMarketplaceTitle: 'سوق التوريد والمشتريات الأفريقية B2B',
    b2bMarketplaceDesc: 'اطرح مناقصات الشراء، وقارن عروض الأسعار جنباً إلى جنب، وتعاقد مباشرة مع المصانع الأفريقية الموثقة.',
    postSourcingRequestBtn: 'طرح طلب شراء / مناقصة',
    sectorFilter: 'القطاع:',
    openTenderBadge: 'مناقصة مفتوحة',
    targetVolume: 'الكمية المطلوبة:',
    targetBudget: 'الميزانية المستهدفة:',
    destination: 'وجهة التسليم:',
    deadline: 'الموعد النهائي:',
    requiredCerts: 'الشهادات المطلوبة:',
    bidsReceived: 'عروض الأسعار المستلمة',
    submitQuotationBtn: 'تقديم عرض سعر',
    compareQuotesBtn: 'مقارنة العروض',
    negotiateWhatsApp: 'التفاوض المباشر عبر واتساب',

    backToMarketplace: 'العودة إلى سوق B2B',
    procurementTender: 'مناقصة توريد تجارية',
    postRFQDesc: 'انشر طلبك التجاري إلى آلاف المصانع والشركات الزراعية الموثقة عبر القارة الأفريقية بأسعار منافسة.',
    productRequirement: 'المنتج أو السلعة المطلوبة *',
    yourNameTitle: 'الاسم الكريم / المسمى الوظيفي *',
    companyOrg: 'اسم المؤسسة / الشركة',
    buyerCountry: 'بلد المشتري (جهة الطلب)',
    deliveryDestination: 'ميناء أو مدينة التسليم *',
    categoryIndustry: 'قطاع السلعة / الصناعة',
    orderVolume: 'الكمية الإجمالية المطلوبة *',
    targetUnitPrice: 'السعر التقديري المستهدف للوحدة ($ USD)',
    preferredIncoterm: 'شروط الشحن والتسليم المفضلة (Incoterm)',
    tenderDeadline: 'الموعد النهائي لاستلام العروض',
    whatsAppNegotiation: 'رقم واتساب للتفاوض التجاري المباشر *',
    technicalSpecs: 'المواصفات الفنية والشروط',
    publishRFQBtn: 'نشر طلب الشراء',

    backToTender: 'العودة إلى المناقصة',
    supplierBidSubmission: 'تقديم عرض سعر المورد',
    selectVerifiedCompany: 'اختر شركتك المعتمدة *',
    unitPriceUSD: 'سعر الوحدة ($ USD) *',
    minOrderQty: 'الحد الأدنى للطلب (MOQ) *',
    leadTimeDays: 'مدة التجهيز والإنتاج (بالأيام)',
    incotermOffered: 'شرط التسليم المعروض (Incoterm)',
    paymentSecurityTerms: 'شروط وضمانات السداد',
    technicalNotes: 'المواصفات الفنية والشهادات',
    submitBidBtn: 'إرسال العرض الرسمي',
    compareTenderSummary: 'ملف مقارنة عروض الأسعار',
    buyerLabel: 'المشتري:',
    noBidsYet: 'لم يتم تقديم عروض أسعار لهذه المناقصة حتى الآن.',
    firstBidPrompt: 'هل أنت مصنع أفريقي معتمد؟ كن أول من يقدم عرض سعر رسمي.',
    bestPrice: 'أفضل سعر',
    afcftaEligible: 'مؤهل للإعفاء الجمركي التام (AfCFTA)',

    backToDirectory: 'العودة إلى الدليل',
    advisorDesc: 'تحليل الأهلية للتعرفة الجمركية التفضيلية AfCFTA، والوثائق المطلوبة، وممرات الشحن اللوجستية الأكثر أماناً.',
    originCountry: 'بلد المورد (المصدر)',
    destCountry: 'بلد المشتري (المستورد)',
    hsCodeCategory: 'الرمز الجمركي HS Code / الفئة',
    tradeVolume: 'حجم الصفقة الإجمالي ($ USD)',
    calculateFeasibility: 'حساب جدوى ومسار التجارة',
    tariffAssessment: 'تقييم التعرفة الجمركية AfCFTA',
    customsDocs: 'الوثائق الجمركية الإلزامية',
    logisticsCorridor: 'ممرات الشحن اللوجستي وفترة الترانزيت',
    paymentSecurity: 'حلول السداد الموصى بها وخدمات الضمان',

    verificationArchitecture: 'منظومة التوثيق والاعتماد',
    trustHubDesc: 'تقوم AfriTrade Trust بالتحقق الميداني من السجلات الحكومية والمصانع وشهادات المنشأ لمنع الوسطاء غير المعتمدين.',
    corridorAdvisorBtn: 'مستشار ممرات AfCFTA',
    downloadTemplatesBtn: 'تحميل النماذج التجارية',
    resourceHubDesc: 'تحميل نماذج العقود والوثائق الجمركية الموحدة للتجارة البينية الأفريقية: شهادة المنشأ AfCFTA، الفاتورة التجارية، وبوليصة الشحن.',
    downloadTemplate: 'تحميل النموذج',
    copyTemplate: 'نسخ إلى الحافظة',
    copied: 'تم النسخ',

    digitalStorefrontBuilder: 'منشئ المتاجر الرقمية',
    liveStorefront: 'المتجر المباشر',
    editStorefront: 'تعديل المتجر',
    storefrontAnalytics: 'إحصائيات المتجر',
    shareWhatsAppBtn: 'مشاركة عبر واتساب',
    downloadQRCode: 'تحميل رمز QR',
    saveLiveChanges: 'حفظ التغييرات فوراً',

    enterDirectoryTitle: 'بوابة الدخول',
    enterDirectoryDesc: 'سجل دخولك لإدارة ملفك التجاري الموثق، ومتابعة طلبات التوريد، والوصول إلى أدوات التجارة.',
    verifiedBusiness: 'شركة موثقة',
    commercialBuyer: 'مشتري تجاري',
    selectVerifiedBusiness: 'اختر الشركة الموثقة',
    buyerOrgName: 'اسم المنشأة / المشتري',
    phoneWhatsApp: 'رقم الهاتف / الواتساب',
    pinPasscode: 'رمز المرور السري (PIN)',
    enterDirectoryPortal: 'الدخول إلى المنصة',
    needToRegister: 'هل ترغب في تسجيل منشأتك؟',
    listBusinessHere: 'سجل شركتك هنا',
    sessionSecurity: 'حماية الجلسة',
    activeVerified: 'نشط وموثق',
    afcftaTradeAuthority: 'صلاحية التجارة AfCFTA',
    goToStorefront: 'الانتقال إلى متجري الرقمي',
    viewB2BMarketplace: 'تصفح سوق B2B الأفريقي',
    signOutDirectory: 'تسجيل الخروج',

    sellerOnboarding: 'تسجيل الموردين والمصانع',
    sellerOnboardingDesc: 'انضم إلى آلاف المصانع والشركات الزراعية والمصدرين المعتمدين في أفريقيا لتلقي طلبات الشراء عبر واتساب.',
    companyLegalName: 'الاسم القانوني المسجل للمنشأة *',
    registrationNumber: 'رقم السجل التجاري الوطني *',
    registryAuthority: 'الجهة الحكومية المختصة بالتسجيل',
    countryLabel: 'دولة التأسيس',
    cityLocation: 'المدينة / المنطقة الصناعية *',
    sectorIndustry: 'القطاع الصناعي الرئيسي',
    leadProductName: 'اسم المنتج الرئيسي للجملة *',
    wholesalePriceUSD: 'سعر الوحدة بالجملة ($ USD) *',
    moqPlaceholder: 'الحد الأدنى للطلب (مثال: 1,000 وحدة)',
    afcftaExporterToggle: 'تلتزم منشأتنا بقواعد المنشأ الخاصة باتفاقية AfCFTA للاستفادة من الإعفاء الجمركي',
    submitRegistration: 'إتمام التوثيق وتسجيل المنشأة',
    businessRegisteredSuccess: 'تم تسجيل المنشأة بنجاح',
    viewInDirectory: 'عرض في الدليل',
    manageStorefront: 'إدارة المتجر',

    reportDiscrepancy: 'إبلاغ عن مخالفة',
    claimOwnership: 'المطالبة بملكية الحساب',
    shareProfile: 'مشاركة الملف',
    contactWhatsApp: 'تواصل عبر واتساب',
    tabVerification: 'ملف التوثيق الحكومي',
    tabReviews: 'التقييمات ومؤشر الثقة',
    tabProducts: 'منتجات الجملة',
    tabTrade: 'التجارة عبر الحدود و AfCFTA',
    tabInquiry: 'منشئ استفسارات واتساب',
    govIncorporationCheck: 'التحقق من السجل التجاري الرسمي',
    regEntityName: 'الاسم القانوني للمنشأة',
    sovereignRegistrar: 'السجل التجاري الرسمي',
    regYear: 'سنة التأسيس والتسجيل',
    auditSiteInspection: 'سجل المعاينة والتدقيق الميداني',
    physicalFactoryAudit: 'معاينة المصنع والمستودعات',
    independentCertifications: 'الشهادات الدولية المعتمدة',
    addProductBtn: 'إضافة منتج جملة جديد',
    editProduct: 'تعديل',
    deleteProduct: 'حذف',
    saveProductLive: 'حفظ المنتج فوراً',
    launchWhatsAppChat: 'بدء محادثة واتساب المباشرة',

    backToProfile: 'الرجوع إلى الملف التعريفي للشركة',
    claimProfileTitle: 'تأكيد ملكية وإدارة الشركة',
    claimProfileDesc: 'أثبت صفتك التمثيلية الرسمية للمنشأة لإدارة كتالوج المنتجات والمناقصات والمتجر الرقمي.',
    claimSubmitBtn: 'توثيق وتأكيد ملكية المنشأة',
    claimSubmittedSuccess: 'تم تقديم طلب تثبيت الملكية بنجاح',
    reportProfileTitle: 'الإبلاغ عن منشأة مشبوهة أو بيانات غير صحيحة',
    reportProfileDesc: 'حماية نزاهة شبكة التجارة الأفريقية. يؤدي أي إبلاغ إلى بدء تدقيق وتحقيق ميداني مستقل.',
    reportSubmitBtn: 'إرسال تقرير المخالفة',
    reportSubmittedSuccess: 'تم تسجيل البلاغ وبدء التدقيق',

    rfqPublishedSuccessTitle: 'تم طرح المناقصة بنجاح',
    rfqPublishedSuccessDesc: 'تم بث متطلبات الشراء الخاصة بكم إلى الموردين الأفارقة المعتمدين وحفظها في الذاكرة للعمل دون اتصال.',
    viewInMarketplace: 'عرض في سوق المناقصات',
    postAnotherTender: 'طرح متطلب شراء آخر',
    quoteSubmittedSuccessTitle: 'تم تقديم عرض الأسعار بنجاح',
    quoteSubmittedSuccessDesc: 'تم تسجيل عرضكم التجاري المعتمد وتسليمه إلى فريق المشتريات.',
    viewTendersList: 'الرجوع إلى سوق المناقصات',
  },
};
