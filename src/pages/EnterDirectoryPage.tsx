import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LogIn,
  ShieldCheck,
  Building2,
  ArrowRight,
  UserCheck,
  Lock,
  Phone,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { BusinessListing, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALL_AFRICAN_COUNTRIES, getAfricanCountryByName } from '../utils/africanCountries';

interface EnterDirectoryPageProps {
  businesses: BusinessListing[];
  onLoginSuccess: (userType: 'merchant' | 'buyer', business?: BusinessListing, name?: string) => void;
  onNavigate: (tab: string) => void;
  currentUser?: { role: 'merchant' | 'buyer'; business?: BusinessListing; name?: string } | null;
  onSignOut?: () => void;
  currentLang?: LanguageCode;
}

export const EnterDirectoryPage: React.FC<EnterDirectoryPageProps> = ({
  businesses,
  onLoginSuccess,
  onNavigate,
  currentUser,
  onSignOut,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [role, setRole] = useState<'merchant' | 'buyer'>('buyer');
  const [selectedBizId, setSelectedBizId] = useState(businesses[0]?.id || '');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantCountry, setNewMerchantCountry] = useState('Angola');
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'merchant') {
      let matched = businesses.find((b) => b.id === selectedBizId);
      if (!matched && newMerchantName.trim()) {
        // Quick merchant creation when directory was empty
        const countryData = getAfricanCountryByName(newMerchantCountry);
        matched = {
          id: `biz-${Date.now()}`,
          name: newMerchantName.trim(),
          tagline: 'Verified African Commercial Enterprise',
          country: countryData.name,
          countryCode: countryData.code,
          city: `${countryData.name} Commercial Hub`,
          address: `${countryData.name}`,
          primaryLanguage: countryData.primaryLang,
          supportedLanguages: ['en', countryData.primaryLang],
          businessType: 'manufacturer',
          industry: 'Industrial & Commercial Supply',
          phone: phone || '+244923000000',
          whatsappNumber: phone || '+244923000000',
          email: 'contact@enterprise.com',
          yearEstablished: 2022,
          employeeCount: '25-50 employees',
          verification: {
            tier: 'tier_2_registered',
            registeredEntityName: newMerchantName.trim(),
            registrationNumber: `REG-${Date.now().toString().slice(-6)}`,
            registrarAuthority: countryData.authority,
            registrationYear: 2022,
            phoneVerified: true,
            emailVerified: true,
            physicalSiteAudited: false,
            auditDate: new Date().toISOString().split('T')[0],
            independentCertifications: ['National Commercial Registry Matched'],
            selfClaimedCertifications: ['AfCFTA Export Readiness'],
            suspiciousReportsCount: 0,
          },
          tradeReadiness: {
            afcftaRegistered: true,
            countriesServed: [newMerchantCountry, 'Regional Economic Community'],
            exportExperienceYears: 3,
            incoterms: ['FOB', 'CIF'],
            acceptedPaymentMethods: ['Trade Escrow / AfriTrade', 'Bank Wire (SWIFT)', 'Mobile Money (M-Pesa/MoMo/Multicaixa)'],
            tradeDocumentsReady: ['Certificate of Origin', 'Commercial Invoice'],
            mainCorridors: [`${newMerchantCountry} Cross-Border Trade Corridor`],
          },
          products: [],
          about: `${newMerchantName.trim()} is an African enterprise registered in ${newMerchantCountry}.`,
          coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          logoImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
          rating: 5.0,
          reviewCount: 0,
          claimedByOwner: true,
          viewsCount: 1,
          whatsappClicksCount: 0,
          rfqsReceivedCount: 0,
          reviews: [],
        };
      }
      setSignedIn(true);
      setTimeout(() => {
        onLoginSuccess('merchant', matched);
        onNavigate('sme-hub');
      }, 700);
    } else {
      const name = buyerOrg.trim() || 'Pan-African Commercial Buyer';
      setSignedIn(true);
      setTimeout(() => {
        onLoginSuccess('buyer', undefined, name);
        onNavigate('marketplace');
      }, 700);
    }
  };

  // If already logged in, show authenticated account management view
  if (currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto space-y-6 pt-4"
      >
        <div className="bg-neutral-950 rounded-3xl p-8 space-y-5 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300 px-2.5 py-1 rounded-lg font-bold">
              {currentUser.role === 'merchant' ? 'Verified Merchant Account' : 'Commercial Buyer Account'}
            </span>
            <div className="text-base font-bold text-white tracking-tight pt-1">
              {currentUser.business ? currentUser.business.name : currentUser.name || 'Authenticated User'}
            </div>
            {currentUser.business && (
              <p className="text-xs text-neutral-400 font-mono">
                {currentUser.business.city}, {currentUser.business.country} · Registry: {currentUser.business.verification.registrationNumber}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-mono">{t.sessionSecurity}</span>
              <span className="text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                {t.activeVerified}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-mono">{t.afcftaTradeAuthority}</span>
              <span className="text-white font-semibold">Enabled</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser.role === 'merchant' ? (
              <button
                type="button"
                onClick={() => onNavigate('sme-hub')}
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Manage Digital Storefront
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Go to B2B Marketplace
              </button>
            )}

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer"
              >
                {t.navSignOut}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md mx-auto space-y-6 pt-4"
    >
      {/* Page Header */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-3 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
          <LogIn className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed pt-1">
          {t.enterDirectoryDesc}
        </p>

        {/* Role Segmented Switcher */}
        <div className="pt-2 flex rounded-2xl bg-neutral-900 p-1">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'buyer'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.commercialBuyer}
          </button>
          <button
            type="button"
            onClick={() => setRole('merchant')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'merchant'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.verifiedBusiness}
          </button>
        </div>
      </div>

      {signedIn ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-950 rounded-3xl p-8 text-center space-y-3 shadow-2xl"
        >
          <CheckCircle2 className="w-10 h-10 text-white mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-white">Authentication Verified</h3>
          <p className="text-xs text-neutral-400">
            Routing to your secure dashboard...
          </p>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSignIn}
          className="bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl text-xs"
        >
          {role === 'merchant' ? (
            businesses.length > 0 ? (
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">{t.selectVerifiedBusiness}</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl cursor-pointer"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.country})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Enterprise Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newMerchantName}
                    onChange={(e) => setNewMerchantName(e.target.value)}
                    placeholder="e.g. Luanda Food Packaging SARL"
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl font-medium focus:ring-1 focus:ring-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Operating Country (All 54 African Nations)</label>
                  <select
                    value={newMerchantCountry}
                    onChange={(e) => setNewMerchantCountry(e.target.value)}
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl cursor-pointer"
                  >
                    {ALL_AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )
          ) : (
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">{t.buyerOrgName}</label>
              <input
                type="text"
                required
                value={buyerOrg}
                onChange={(e) => setBuyerOrg(e.target.value)}
                placeholder="e.g. African Commercial Enterprise Ltd"
                className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl font-medium focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">{t.phoneWhatsApp}</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+244 923 000 000"
                className="w-full bg-neutral-900 text-white pl-9 pr-3.5 py-2.5 rounded-xl font-mono focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">{t.pinPasscode}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="w-full bg-neutral-900 text-white pl-9 pr-3.5 py-2.5 rounded-xl font-mono focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>{t.enterDirectoryPortal}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center space-y-1">
            <span className="text-neutral-500">{t.needToRegister} </span>
            <button
              type="button"
              onClick={() => onNavigate('list-business')}
              className="text-white hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
            >
              <span>{t.listBusinessSignUp}</span>
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
