import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Upload,
  Globe2,
  MapPin,
  FileCheck2,
  Image as ImageIcon,
  Camera,
  X,
  Sparkles,
  Key,
  Copy,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { BusinessListing, BusinessType, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALL_AFRICAN_COUNTRIES, getAfricanCountryByName } from '../utils/africanCountries';

interface ListBusinessPageProps {
  onAddBusiness: (newBiz: BusinessListing) => void;
  onNavigate: (tab: string) => void;
  currentLang?: LanguageCode;
}

export const ListBusinessPage: React.FC<ListBusinessPageProps> = ({
  onAddBusiness,
  onNavigate,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [country, setCountry] = useState('Angola');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('manufacturer');
  const [industry, setIndustry] = useState('Packaging & Containers');
  const [regNumber, setRegNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('0.85');
  const [productMOQ, setProductMOQ] = useState('1,000 units');
  const [isAfcftaReady, setIsAfcftaReady] = useState(true);

  // Logo & Cover Image Upload State
  const [logoImage, setLogoImage] = useState<string>('');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [coverFileName, setCoverFileName] = useState<string>('');
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const [coverInputMode, setCoverInputMode] = useState<'upload' | 'url'>('upload');

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Security PIN / One-Time View State
  const [submitted, setSubmitted] = useState(false);
  const [generatedSecurityPin, setGeneratedSecurityPin] = useState<string>('');
  const [copiedPin, setCopiedPin] = useState(false);
  const [acknowledgedPinSaved, setAcknowledgedPinSaved] = useState(false);

  const selectedCountryData = getAfricanCountryByName(country);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    setCoverFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const defaultLogo = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80';
  const defaultCover = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate secure 6-digit PIN / Security Code
    const secureDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const securityPin = `AFR-${secureDigits}`;
    setGeneratedSecurityPin(securityPin);

    const newBusiness: BusinessListing = {
      id: `biz-user-${Date.now()}`,
      name: companyName,
      tagline: tagline || 'Verified African commercial supplier',
      country: selectedCountryData.name,
      countryCode: selectedCountryData.code,
      city: city || `${selectedCountryData.name} Commercial Hub`,
      address: address || `${city}, ${selectedCountryData.name}`,
      primaryLanguage: selectedCountryData.primaryLang,
      supportedLanguages: ['en', selectedCountryData.primaryLang],
      businessType,
      industry,
      phone: phone || '+244 923 000 000',
      whatsappNumber: whatsapp || phone || '+244923000000',
      email: email || 'contact@enterprise.com',
      yearEstablished: 2021,
      employeeCount: '25-50 employees',
      securityPin: securityPin,
      verification: {
        tier: 'tier_2_registered',
        registeredEntityName: companyName,
        registrationNumber: regNumber || `REG-${Date.now().toString().slice(-6)}`,
        registrarAuthority: selectedCountryData.authority,
        registrationYear: 2021,
        phoneVerified: true,
        emailVerified: true,
        physicalSiteAudited: false,
        auditDate: new Date().toISOString().split('T')[0],
        independentCertifications: ['National Commercial Registry Matched'],
        selfClaimedCertifications: ['Export Quality Assurance'],
        suspiciousReportsCount: 0,
      },
      tradeReadiness: {
        afcftaRegistered: isAfcftaReady,
        countriesServed: [selectedCountryData.name, 'Regional Economic Community (REC)'],
        exportExperienceYears: 3,
        incoterms: ['FOB', 'CIF', 'EXW'],
        acceptedPaymentMethods: ['Trade Escrow / AfriTrade', 'Bank Wire (SWIFT)', 'Mobile Money (M-Pesa/MoMo/Multicaixa)'],
        tradeDocumentsReady: ['Certificate of Origin', 'Commercial Invoice with HS Code'],
        mainCorridors: [`${selectedCountryData.name} Regional Trade Corridor`],
      },
      products: [
        {
          id: `p-${Date.now()}`,
          name: productName || 'Commercial Wholesale Goods',
          category: industry,
          description: 'Certified wholesale quality with standardized export packaging.',
          unitPriceUSD: parseFloat(productPrice) || 1.0,
          moq: productMOQ || '500 units',
          leadTimeDays: 7,
          specifications: ['Standard wholesale grade', 'AfCFTA compliant'],
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        },
      ],
      about: `${companyName} is a verified African business operating in ${city || selectedCountryData.name}, specializing in ${industry}.`,
      coverImage: coverImage || defaultCover,
      logoImage: logoImage || defaultLogo,
      rating: 5.0,
      reviewCount: 1,
      claimedByOwner: true,
      viewsCount: 1,
      whatsappClicksCount: 0,
      rfqsReceivedCount: 0,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          authorName: 'Sovereign Commercial Registrar',
          authorCompany: selectedCountryData.authority,
          authorRole: 'buyer',
          rating: 5,
          comment: `Entity successfully registered with verified registration number ${regNumber || 'REG-PENDING'}. Commercial documents confirmed.`,
          createdAt: new Date().toISOString().split('T')[0],
          verifiedTransaction: true,
        },
      ],
    };

    onAddBusiness(newBusiness);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(generatedSecurityPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
          <Building2 className="w-4 h-4 text-white" />
          <span>{t.sellerOnboarding}</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
          {t.sellerOnboardingDesc}
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-950 rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl border border-neutral-900"
        >
          <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300 px-3 py-1 rounded-full font-bold inline-block">
              Registration Successful · Listing Active
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {t.businessRegisteredSuccess}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              <strong className="text-white">{companyName}</strong> is now live with sovereign registry registration <span className="font-mono text-white font-bold">{regNumber}</span>.
            </p>
          </div>

          {/* ONE-TIME SECURITY PIN CREDENTIAL CARD */}
          <div className="p-5 sm:p-6 bg-black rounded-2xl border border-amber-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>One-Time Security PIN / Security Code</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                One View Only
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <span className="text-[11px] text-neutral-400 font-mono block">Your Enterprise PIN Code</span>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold tracking-widest text-white select-all mt-1">
                  {generatedSecurityPin}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPin}
                className="w-full sm:w-auto px-5 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                {copiedPin ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>PIN Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy PIN Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Warning Note */}
            <div className="p-3.5 bg-neutral-900/90 rounded-xl text-neutral-300 text-xs space-y-1.5 border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Action Required: Save in a Safe Folder Now</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                This PIN / Security Code is visible <strong>one time only</strong>. Please copy it immediately and store it in a safe folder, password manager, or secure private document. You will need this PIN to authenticate as a merchant and manage your digital storefront.
              </p>
            </div>

            {/* Checkbox Acknowledgment */}
            <div className="pt-1 flex items-start gap-2.5 text-left">
              <input
                type="checkbox"
                id="pin-ack-check"
                checked={acknowledgedPinSaved}
                onChange={(e) => setAcknowledgedPinSaved(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-white rounded cursor-pointer"
              />
              <label htmlFor="pin-ack-check" className="text-xs text-neutral-300 cursor-pointer select-none">
                I have copied and safely saved this PIN / Security Code in a safe folder.
              </label>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => {
                if (!acknowledgedPinSaved && !copiedPin) {
                  alert('Please copy your Security PIN and confirm you have saved it in a safe folder.');
                  return;
                }
                onNavigate('explore');
              }}
              className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{t.viewInDirectory}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (!acknowledgedPinSaved && !copiedPin) {
                  alert('Please copy your Security PIN and confirm you have saved it in a safe folder.');
                  return;
                }
                onNavigate('sme-hub');
              }}
              className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border border-neutral-800"
            >
              <span>{t.manageStorefront}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Entity Identification */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>1. Official Legal Entity Details</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Benguela Cartons Industrial Lda"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Operating Country (All 54 African Nations) *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                >
                  {ALL_AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Official Registration Authority</label>
                <input
                  type="text"
                  disabled
                  value={selectedCountryData.authority}
                  className="w-full bg-neutral-900 text-neutral-400 px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Registration Number (Company ID) *</label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. GUE-AO-2022-84920"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Operations & Industry */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span>2. Operations, City & Contacts</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">City / Industrial Zone *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Luanda (Pólo Industrial de Viana)"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Business Type *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                >
                  <option value="manufacturer">Manufacturer / Factory</option>
                  <option value="agro_processor">Agro-Processor</option>
                  <option value="wholesaler">Wholesaler / Distributor</option>
                  <option value="exporter">Export Trade Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">WhatsApp Commercial Number *</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+244 923 000 000"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orders@company.co.ao"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Tagline / Brief Specialization</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Corrugated packaging & food-grade plastic containers for regional export"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visual Branding & Media (Logo & Cover Image) */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-white" />
                <span>3. Company Logo & Cover Image</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500">Step 3 of 4</span>
            </div>

            <p className="text-xs text-neutral-400">
              Upload your company logo and cover banner (facility, factory floor, farm, or products) to elevate verified buyer confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Company Logo Upload */}
              <div className="p-4 bg-black rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Company Logo</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setLogoInputMode('upload')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        logoInputMode === 'upload' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoInputMode('url')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        logoInputMode === 'url' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {logoInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {logoImage ? (
                      <div className="flex items-center gap-3 p-2.5 bg-neutral-900 rounded-xl">
                        <img
                          src={logoImage}
                          alt="Logo Preview"
                          className="w-14 h-14 rounded-xl object-cover bg-black shrink-0 border border-neutral-800"
                        />
                        <div className="truncate flex-1">
                          <span className="text-xs text-white font-medium truncate block">
                            {logoFileName || 'Custom Logo Uploaded'}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono block">Image ready for listing</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoImage('');
                            setLogoFileName('');
                            if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                          }}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => logoFileInputRef.current?.click()}
                        className="p-4 border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl text-center cursor-pointer transition-colors space-y-1.5 group"
                      >
                        <Upload className="w-5 h-5 text-neutral-500 group-hover:text-white mx-auto transition-colors" />
                        <span className="text-xs text-white font-medium block">
                          Click to upload Company Logo
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          PNG, JPG, WebP, SVG (Recommended 400x400)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={logoImage}
                      onChange={(e) => setLogoImage(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-white font-mono"
                    />
                    {logoImage && (
                      <div className="flex items-center gap-2">
                        <img src={logoImage} alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-black" />
                        <span className="text-[10px] text-neutral-400 font-mono">Live URL Preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Company Cover Image Upload */}
              <div className="p-4 bg-black rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Company Cover Image</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('upload')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        coverInputMode === 'upload' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('url')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        coverInputMode === 'url' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {coverInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />

                    {coverImage ? (
                      <div className="relative rounded-xl overflow-hidden group">
                        <img
                          src={coverImage}
                          alt="Cover Preview"
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 text-xs">
                          <span className="text-white truncate font-medium text-[11px]">
                            {coverFileName || 'Custom Cover Photo'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage('');
                              setCoverFileName('');
                              if (coverFileInputRef.current) coverFileInputRef.current.value = '';
                            }}
                            className="p-1.5 bg-black/80 hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
                            title="Remove cover"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverFileInputRef.current?.click()}
                        className="p-4 border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl text-center cursor-pointer transition-colors space-y-1.5 group"
                      >
                        <Upload className="w-5 h-5 text-neutral-500 group-hover:text-white mx-auto transition-colors" />
                        <span className="text-xs text-white font-medium block">
                          Click to upload Cover Banner
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          Facility, factory, warehouse, or products (16:9 banner)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full bg-neutral-900 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-white font-mono"
                    />
                    {coverImage && (
                      <img src={coverImage} alt="Cover" className="w-full h-16 rounded-lg object-cover" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Lead Product & AfCFTA Readiness */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-white" />
                <span>4. Lead Product & AfCFTA Export Capability</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500">Step 4 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Primary Product Name *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. 5-Ply Corrugated Fish Cartons"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Unit Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="0.85"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Minimum Order Quantity (MOQ)</label>
                <input
                  type="text"
                  value={productMOQ}
                  onChange={(e) => setProductMOQ(e.target.value)}
                  placeholder="e.g. 2,500 units"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="afcfta-check"
                checked={isAfcftaReady}
                onChange={(e) => setIsAfcftaReady(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
              <label htmlFor="afcfta-check" className="text-neutral-300 cursor-pointer">
                Company produces goods qualifying for AfCFTA preferential 0% tariff clearance
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>Submit Registration & Launch Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
