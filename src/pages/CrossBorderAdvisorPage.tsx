import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  Globe,
  ArrowRight,
  TrendingUp,
  Building2,
  DollarSign,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALL_AFRICAN_COUNTRIES } from '../utils/africanCountries';

interface CrossBorderAdvisorPageProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

export const CrossBorderAdvisorPage: React.FC<CrossBorderAdvisorPageProps> = ({
  currentLang,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [supplierCountry, setSupplierCountry] = useState('Angola');
  const [buyerCountry, setBuyerCountry] = useState('Namibia');
  const [productCategory, setProductCategory] = useState('Packaging & Containers');
  const [loading, setLoading] = useState(false);
  const [adviceData, setAdviceData] = useState<any>(null);

  const handleConsultAdvisor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/trade-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierCountry,
          buyerCountry,
          productCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdviceData(data);
      } else {
        fallbackAdvice();
      }
    } catch {
      fallbackAdvice();
    } finally {
      setLoading(false);
    }
  };

  const fallbackAdvice = () => {
    setAdviceData({
      applicableAgreement: `${supplierCountry} - ${buyerCountry} Bilateral & AfCFTA Trade Protocol`,
      tariffAdvantage: '0% Preferential Import Duty under AfCFTA Rules of Origin (Criterion: Wholly Produced or Substantially Transformed).',
      requiredDocuments: [
        'AfCFTA Certificate of Origin (Form B)',
        'Commercial Invoice with 6-digit HS Code classification',
        'Consignment Note / Bill of Lading (CMR or Ocean BL)',
        'Phytosanitary / Quality Conformity Inspection Certificate',
      ],
      paymentSafetyAdvice: 'Utilize Pan-African Payment and Settlement System (PAPSS) in local currency or verified Letter of Credit with milestone release upon port clearance.',
      estimatedTransitDays: 5,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto space-y-6 pt-2"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t.backToDirectory}</span>
      </button>

      {/* Hero Header */}
      <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {t.advisorDesc}
        </p>
      </div>

      {/* Corridor Query Form */}
      <form onSubmit={handleConsultAdvisor} className="bg-neutral-950 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-neutral-400">{t.originCountry}</label>
            <select
              value={supplierCountry}
              onChange={(e) => setSupplierCountry(e.target.value)}
              className="w-full bg-neutral-900 text-white text-xs px-3 py-2.5 rounded-xl cursor-pointer"
            >
              {ALL_AFRICAN_COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-neutral-400">{t.destCountry}</label>
            <select
              value={buyerCountry}
              onChange={(e) => setBuyerCountry(e.target.value)}
              className="w-full bg-neutral-900 text-white text-xs px-3 py-2.5 rounded-xl cursor-pointer"
            >
              {ALL_AFRICAN_COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-neutral-400">{t.hsCodeCategory}</label>
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-neutral-500"
            placeholder="e.g. Food-grade packaging, Solar inverters, Shea butter..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing AfCFTA Trade Corridors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.calculateFeasibility}</span>
            </>
          )}
        </button>
      </form>

      {/* Results Dossier */}
      {adviceData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white tracking-tight">AfCFTA Corridor Assessment</h2>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              {supplierCountry} → {buyerCountry}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-900/70 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Trade Regime</span>
              <p className="text-xs font-semibold text-white">{adviceData.applicableAgreement}</p>
            </div>

            <div className="bg-neutral-900/70 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400">{t.tariffAssessment}</span>
              <p className="text-xs text-neutral-300">{adviceData.tariffAdvantage}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
              <FileCheck2 className="w-4 h-4 text-white" />
              <span>{t.customsDocs}</span>
            </div>
            <div className="space-y-2">
              {adviceData.requiredDocuments.map((doc: string, idx: number) => (
                <div key={idx} className="bg-neutral-900/60 p-3 rounded-xl flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-neutral-200">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/70 p-4 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-neutral-400">{t.paymentSecurity}</span>
            <p className="text-xs text-neutral-300 leading-relaxed">{adviceData.paymentSafetyAdvice}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
