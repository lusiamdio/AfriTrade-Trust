import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Coins,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { SourcingRequest, SupplierQuotation, BusinessListing, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateRealtimeTrustScore } from '../utils/trustScore';

interface SubmitQuotePageProps {
  rfq: SourcingRequest;
  businesses: BusinessListing[];
  onBack: () => void;
  onSubmitQuotation: (quote: Partial<SupplierQuotation>) => void;
  currentLang?: LanguageCode;
}

export const SubmitQuotePage: React.FC<SubmitQuotePageProps> = ({
  rfq,
  businesses,
  onBack,
  onSubmitQuotation,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [supplierId, setSupplierId] = useState(businesses[0]?.id || '');
  const [unitPriceUSD, setUnitPriceUSD] = useState('');
  const [moq, setMOQ] = useState(rfq.quantityNeeded || '1,000 units');
  const [leadTime, setLeadTime] = useState('7');
  const [incoterm, setIncoterm] = useState('FOB');
  const [paymentTerms, setPaymentTerms] = useState('Trade Escrow / Letter of Credit');
  const [notes, setNotes] = useState('Direct factory delivery under AfCFTA preferential tariff documentation.');

  // Motion-based success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Partial<SupplierQuotation> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitPriceUSD) return;

    const supp = businesses.find((b) => b.id === supplierId) || businesses[0];
    const unitPrice = parseFloat(unitPriceUSD);
    const parsedQty = parseFloat(rfq.quantityNeeded.replace(/[^0-9.]/g, '')) || 1000;

    const newQuote: Partial<SupplierQuotation> = {
      rfqId: rfq.id,
      supplierId: supp ? supp.id : 'supp_direct',
      supplierName: supp ? supp.name : 'Verified African Supplier',
      supplierCountry: supp ? supp.country : rfq.buyerCountry,
      unitPriceUSD: unitPrice,
      totalPriceUSD: unitPrice * parsedQty,
      moq,
      leadTimeDays: parseInt(leadTime, 10) || 7,
      incoterm,
      paymentTerms,
      afcftaTariffEligible: supp ? supp.tradeReadiness.afcftaRegistered : true,
      notes,
    };

    onSubmitQuotation(newQuote);
    setSubmittedData(newQuote);
    setIsSubmitted(true);
  };

  const handleResetForAnother = () => {
    setUnitPriceUSD('');
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {isSubmitted && submittedData ? (
          /* Subtle Motion-based Success Animation Workflow */
          <motion.div
            key="quote-success"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-neutral-950 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Background radiant ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Ripple motion animation ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.45, 1.8],
                  opacity: [0.6, 0.2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 rounded-full bg-white/20"
              />
              <motion.div
                animate={{
                  scale: [1, 1.25, 1.5],
                  opacity: [0.5, 0.15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  delay: 0.4,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 rounded-full bg-white/25"
              />

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 18,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl relative z-10"
              >
                <ShieldCheck className="w-10 h-10 text-black stroke-[2.2]" />
              </motion.div>
            </div>

            {/* Success Heading & Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="space-y-2 relative z-10"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-neutral-300 font-mono text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Pan-African Verified Bid Logged</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {t.quoteSubmittedSuccessTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                {t.quoteSubmittedSuccessDesc}
              </p>
            </motion.div>

            {/* Transaction Receipt Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="bg-black/80 rounded-2xl p-5 text-left space-y-3 relative z-10 text-xs shadow-inner"
            >
              <div className="flex items-start justify-between gap-3 border-b border-neutral-900 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {t.compareTenderSummary}
                  </span>
                  <span className="font-bold text-white text-sm">{rfq.title}</span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    {t.buyerLabel}: {rfq.buyerCompany} ({rfq.buyerCountry})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-neutral-300 font-mono text-[10px] shrink-0 font-semibold">
                  {submittedData.supplierName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.unitPriceUSD}</span>
                  <span className="text-white font-semibold font-mono">${submittedData.unitPriceUSD} / unit</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.minOrderQty}</span>
                  <span className="text-white font-semibold font-mono">{submittedData.moq}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.leadTimeDays}</span>
                  <span className="text-white font-semibold font-mono">{submittedData.leadTimeDays} days</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.incotermOffered}</span>
                  <span className="text-white font-semibold font-mono">{submittedData.incoterm}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10"
            >
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.viewTendersList}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Revise Quotation</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Normal Submit Quote Form */
          <motion.div
            key="quote-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{t.backToTender}</span>
            </button>

            <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
                <FileText className="w-4 h-4 text-white" />
                <span>{t.supplierBidSubmission}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">{rfq.title}</h2>
              <div className="text-xs text-neutral-400 space-y-1">
                <p>
                  {t.buyerLabel}: <span className="text-white font-medium">{rfq.buyerCompany}</span> ({rfq.buyerCountry})
                </p>
                <p>
                  {t.deliveryDestination}: <span className="text-white font-mono">{rfq.targetDestination}</span>
                </p>
                <p>
                  {t.orderVolume}: <span className="text-white font-mono font-bold">{rfq.quantityNeeded}</span> · {t.targetUnitPrice}: <span className="text-white font-mono font-bold">${rfq.targetBudgetUSD}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-4 text-xs shadow-xl">
              {businesses.length > 0 && (
                <div>
                  <label className="block text-neutral-400 mb-1">{t.selectVerifiedCompany}</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.country}) - Score: {calculateRealtimeTrustScore(b).score}%
                      </option>
                    ))}

                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t.unitPriceUSD}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitPriceUSD}
                    onChange={(e) => setUnitPriceUSD(e.target.value)}
                    placeholder="e.g. 0.75"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">{t.minOrderQty}</label>
                  <input
                    type="text"
                    value={moq}
                    onChange={(e) => setMOQ(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t.leadTimeDays}</label>
                  <input
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">{t.incotermOffered}</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  >
                    <option value="FOB">FOB (Free on Board)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="DAP">DAP (Delivered at Place)</option>
                    <option value="EXW">EXW (Ex-Works Factory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t.paymentSecurityTerms}</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t.technicalNotes}</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>{t.submitBidBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
