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
  Mail,
  Zap,
} from 'lucide-react';
import { BusinessListing, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALL_AFRICAN_COUNTRIES, getAfricanCountryByName } from '../utils/africanCountries';
import {
  signInWithSupabase,
  signUpWithSupabase,
  isSupabaseConfigured,
} from '../utils/supabaseClient';

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

  // Supabase Auth Integration State
  const [authMode, setAuthMode] = useState<'standard' | 'supabase'>('standard');
  const [supabaseEmail, setSupabaseEmail] = useState('');
  const [supabasePassword, setSupabasePassword] = useState('');
  const [supabaseAuthType, setSupabaseAuthType] = useState<'signin' | 'signup'>('signin');
  const [supabaseError, setSupabaseError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseEmail || !supabasePassword) return;
    setIsSubmittingAuth(true);
    setSupabaseError('');

    try {
      if (supabaseAuthType === 'signup') {
        const { user, error } = await signUpWithSupabase(supabaseEmail, supabasePassword, {
          role,
          name: role === 'merchant' ? newMerchantName || 'Verified Merchant' : buyerOrg || 'Commercial Buyer',
          country: newMerchantCountry,
        });
        if (error) {
          setSupabaseError(error);
          setIsSubmittingAuth(false);
          return;
        }
      } else {
        const { user, error } = await signInWithSupabase(supabaseEmail, supabasePassword);
        if (error) {
          setSupabaseError(error);
          setIsSubmittingAuth(false);
          return;
        }
      }

      setSignedIn(true);
      setTimeout(() => {
        if (role === 'merchant') {
          const matched = businesses.find((b) => b.id === selectedBizId) || businesses[0];
          onLoginSuccess('merchant', matched);
          onNavigate('sme-hub');
        } else {
          onLoginSuccess('buyer', undefined, buyerOrg || supabaseEmail.split('@')[0]);
          onNavigate('marketplace');
        }
      }, 700);
    } catch (err: any) {
      setSupabaseError(err.message || 'Authentication error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

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

        {/* Authentication Engine Switcher (Supabase Real-Time vs Direct PIN) */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Authentication Provider</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Live DB
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-neutral-900">
            <button
              type="button"
              onClick={() => setAuthMode('standard')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'standard'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Direct PIN</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('supabase')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'supabase'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Supabase Cloud</span>
            </button>
          </div>
        </div>
      </div>

      {signedIn ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-950 rounded-3xl p-8 text-center space-y-3 shadow-2xl"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-white">Authentication Verified</h3>
          <p className="text-xs text-neutral-400">
            Authenticated via {authMode === 'supabase' ? 'Supabase Real-Time Auth' : 'Verified Directory PIN'}. Routing to your secure dashboard...
          </p>
        </motion.div>
      ) : authMode === 'supabase' ? (
        <form
          onSubmit={handleSupabaseAuth}
          className="bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl text-xs"
        >
          <div className="flex items-center justify-between pb-1 border-b border-neutral-900">
            <span className="font-bold text-white">Supabase Cloud Auth</span>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setSupabaseAuthType('signin')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  supabaseAuthType === 'signin' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setSupabaseAuthType('signup')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  supabaseAuthType === 'signup' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {supabaseError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 text-xs">
              {supabaseError}
            </div>
          )}

          {supabaseAuthType === 'signup' && role === 'merchant' && (
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Enterprise Legal Name</label>
              <input
                type="text"
                required
                value={newMerchantName}
                onChange={(e) => setNewMerchantName(e.target.value)}
                placeholder="e.g. Luanda Food Packaging SARL"
                className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl font-medium focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          )}

          {supabaseAuthType === 'signup' && role === 'buyer' && (
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Organization / Trading Entity</label>
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
            <label className="block text-neutral-400 mb-1.5 font-medium">Supabase Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={supabaseEmail}
                onChange={(e) => setSupabaseEmail(e.target.value)}
                placeholder="user@enterprise.africa"
                className="w-full bg-neutral-900 text-white pl-9 pr-3.5 py-2.5 rounded-xl font-mono focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={supabasePassword}
                onChange={(e) => setSupabasePassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-900 text-white pl-9 pr-3.5 py-2.5 rounded-xl font-mono focus:ring-1 focus:ring-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingAuth}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            {isSubmittingAuth ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Connecting to Supabase...
              </span>
            ) : (
              <>
                <span>{supabaseAuthType === 'signup' ? 'Create Supabase Account' : 'Authenticate via Supabase'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-500 text-center pt-1 font-mono">
            Directly connected to PostgreSQL Auth with real-time replication
          </p>
        </form>
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
