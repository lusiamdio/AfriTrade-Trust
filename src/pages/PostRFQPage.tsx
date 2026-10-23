import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  CheckCircle2,
  Sparkles,
  Building2,
  Coins,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { SourcingRequest, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALL_AFRICAN_COUNTRIES, getAfricanCountryByName } from '../utils/africanCountries';

interface PostRFQPageProps {
  onBack: () => void;
  onSubmitRFQ: (rfq: Partial<SourcingRequest>) => void;
  currentLang?: LanguageCode;
}

export const PostRFQPage: React.FC<PostRFQPageProps> = ({
  onBack,
  onSubmitRFQ,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [title, setTitle] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [country, setCountry] = useState('Angola');
  const [destination, setDestination] = useState('Porto de Luanda');
  const [category, setCategory] = useState('Packaging & Containers');
  const [quantity, setQuantity] = useState('10,000 units');
  const [budgetUSD, setBudgetUSD] = useState('0.85');
  const [incoterm, setIncoterm] = useState('CIF');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Motion-based success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Partial<SourcingRequest> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !buyerName) return;

    const countryData = getAfricanCountryByName(country);
    const newRFQ: Partial<SourcingRequest> = {
      title,
      buyerName,
      buyerCompany: buyerCompany || 'African Enterprise',
      buyerCountry: countryData.name,
      buyerCountryCode: countryData.code,
      targetDestination: destination,
      category,
      quantityNeeded: quantity,
      targetBudgetUSD: parseFloat(budgetUSD) || 1.0,
      requiredCertifications: ['Registered Entity', 'AfCFTA Preferential Conformance'],
      preferredIncoterm: incoterm,
      deadlineDate: deadline,
      description: description || 'Seeking verified African supplier with cross-border delivery capacity.',
      status: 'open',
      whatsappContact: whatsapp || '+244923000000',
    };

    onSubmitRFQ(newRFQ);
    setSubmittedData(newRFQ);
    setIsSubmitted(true);
  };

  const handleResetForAnother = () => {
    setTitle('');
    setDescription('');
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {isSubmitted && submittedData ? (
          /* Subtle Motion-based Success Animation Workflow */
          <motion.div
            key="rfq-success"
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
                <CheckCircle2 className="w-10 h-10 text-black stroke-[2.2]" />
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
                <span>Pan-African Tender Network</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {t.rfqPublishedSuccessTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                {t.rfqPublishedSuccessDesc}
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
                    {t.productRequirement}
                  </span>
                  <span className="font-bold text-white text-sm">{submittedData.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-neutral-300 font-mono text-[10px] shrink-0 font-semibold">
                  {submittedData.category}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.orderVolume}</span>
                  <span className="text-white font-semibold font-mono">{submittedData.quantityNeeded}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.targetUnitPrice}</span>
                  <span className="text-white font-semibold font-mono">${submittedData.targetBudgetUSD} / unit</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.preferredIncoterm}</span>
                  <span className="text-white font-semibold font-mono">{submittedData.preferredIncoterm}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-mono text-[10px]">{t.deliveryDestination}</span>
                  <span className="text-white font-semibold truncate block">{submittedData.targetDestination}</span>
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
                <span>{t.viewInMarketplace}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postAnotherTender}</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Normal Post RFQ Form */
          <motion.div
            key="rfq-form"
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
              <span>{t.backToMarketplace}</span>
            </button>

            <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
                <Package className="w-4 h-4 text-white" />
                <span>{t.procurementTender}</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                {t.postRFQDesc}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-4 text-xs shadow-xl">
              <div>
                <label className="block text-neutral-400 mb-1">{t.productRequirement}</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 15,000 Food-grade corrugated cartons for fish export"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t.yourNameTitle}</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Eng. Mateus da Costa"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t.companyOrg}</label>
                  <input
                    type="text"
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="Benguela Fishery Coop"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t.buyerCountry}</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    {ALL_AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t.deliveryDestination}</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Porto de Namibe"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t.orderVolume}</label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="15,000 units"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t.targetUnitPrice}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetUSD}
                    onChange={(e) => setBudgetUSD(e.target.value)}
                    placeholder="0.80"
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t.preferredIncoterm}</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  >
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="FOB">FOB (Free on Board)</option>
                    <option value="DAP">DAP (Delivered at Place)</option>
                    <option value="EXW">EXW (Ex-Works Factory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t.whatsAppNegotiation}</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+244 923 112 233"
                  className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t.technicalSpecs}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cold storage temperature limits, ISO 22000 requirements, pallet specs..."
                  className="w-full bg-black text-white p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>{t.publishRFQBtn}</span>
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
