import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Upload, Building2 } from 'lucide-react';
import { BusinessListing, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface ClaimListingPageProps {
  business: BusinessListing;
  onBack: () => void;
  onClaimSubmitted: (businessId: string) => void;
  currentLang?: LanguageCode;
}

export const ClaimListingPage: React.FC<ClaimListingPageProps> = ({
  business,
  onBack,
  onClaimSubmitted,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [claimantName, setClaimantName] = useState('');
  const [claimantRole, setClaimantRole] = useState('Managing Director');
  const [officialEmail, setOfficialEmail] = useState('');
  const [proofType, setProofType] = useState('certificate_of_incorporation');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaimSubmitted(business.id);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto space-y-6 pt-2"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t.backToProfile}</span>
      </button>

      <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {t.claimProfileDesc}
        </p>

        <div className="bg-neutral-900/60 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-500">Claiming Profile</span>
          <p className="text-sm font-bold text-white">{business.name}</p>
          <p className="text-xs text-neutral-400 font-mono">
            {business.city}, {business.country} · {business.verification.registrarAuthority}
          </p>
        </div>

        {submitted ? (
          <div className="bg-neutral-900/80 p-6 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-white mx-auto" />
            <h3 className="text-sm font-bold text-white">{t.claimSubmittedSuccess}</h3>
            <p className="text-xs text-neutral-400">
              An OTP and confirmation token has been dispatched to {officialEmail || 'your verified contact'}. Upon review, administrative rights will activate in your Storefront manager.
            </p>
            <button
              onClick={onBack}
              className="mt-3 px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 cursor-pointer"
            >
              {t.backToProfile}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-400">Your Full Legal Name</label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                required
                placeholder="e.g. Manuel dos Santos"
                className="w-full bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-neutral-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400">Executive Title</label>
                <select
                  value={claimantRole}
                  onChange={(e) => setClaimantRole(e.target.value)}
                  className="w-full bg-neutral-900 text-white text-xs px-3 py-2.5 rounded-xl cursor-pointer"
                >
                  <option value="Managing Director">Managing Director / CEO</option>
                  <option value="Head of Sales">Head of B2B Sales</option>
                  <option value="Operations Director">Operations Director</option>
                  <option value="Legal Counsel">Authorized Legal Counsel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400">Corporate Domain Email</label>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  required
                  placeholder="director@enterprise.com"
                  className="w-full bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-neutral-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-400">Verification Document</label>
              <select
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
                className="w-full bg-neutral-900 text-white text-xs px-3 py-2.5 rounded-xl cursor-pointer"
              >
                <option value="certificate_of_incorporation">Certificate of Commercial Incorporation / NIF</option>
                <option value="board_resolution">Power of Attorney / Board Resolution</option>
                <option value="utility_bill">Physical Facility Lease / Tax Clearance</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 text-center space-y-2">
              <Upload className="w-5 h-5 text-neutral-400 mx-auto" />
              <p className="text-xs text-neutral-300 font-medium">Attach official document scan or PDF</p>
              <p className="text-[10px] text-neutral-500 font-mono">Max 15MB · PDF, JPEG, PNG</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
            >
              {t.claimSubmitBtn}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
