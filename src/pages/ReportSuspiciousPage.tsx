import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, ShieldAlert, CheckCircle2, Building2 } from 'lucide-react';
import { BusinessListing, LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface ReportSuspiciousPageProps {
  business: BusinessListing;
  onBack: () => void;
  onSubmitReport: (report: any) => void;
  currentLang?: LanguageCode;
}

export const ReportSuspiciousPage: React.FC<ReportSuspiciousPageProps> = ({
  business,
  onBack,
  onSubmitReport,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [reason, setReason] = useState('fake_registration');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      businessId: business.id,
      businessName: business.name,
      reason,
      details,
      reporterEmail,
      date: new Date().toISOString(),
    });
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
          <ShieldAlert className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {t.reportProfileDesc}
        </p>

        <div className="bg-neutral-900/60 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-500">Target Entity</span>
          <p className="text-sm font-bold text-white">{business.name}</p>
          <p className="text-xs text-neutral-400 font-mono">
            {business.city}, {business.country} · Registry: {business.verification.registrationNumber}
          </p>
        </div>

        {submitted ? (
          <div className="bg-neutral-900/80 p-6 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-white mx-auto" />
            <h3 className="text-sm font-bold text-white">{t.reportSubmittedSuccess}</h3>
            <p className="text-xs text-neutral-400">
              Our regional verification team in {business.country} will inspect the registered authority records within 24 hours.
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
              <label className="text-xs font-mono uppercase text-neutral-400">Discrepancy Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-xl cursor-pointer"
              >
                <option value="fake_registration">Invalid Commercial Registration Number</option>
                <option value="unresponsive_contact">Invalid Phone / WhatsApp Contact</option>
                <option value="impersonation">Entity Impersonation or Misleading Ownership</option>
                <option value="false_export_claim">False AfCFTA or Export Capacity Claims</option>
                <option value="payment_fraud">Escrow or Payment Irregularities</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-400">Audit Evidence / Notes</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                rows={4}
                placeholder="Describe what occurred, dates of communication, or national registry discrepancy..."
                className="w-full bg-neutral-900 text-white text-xs p-3.5 rounded-xl placeholder-neutral-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-400">Reporter Work Email (Confidential)</label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                required
                placeholder="compliance@enterprise.com"
                className="w-full bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-neutral-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
            >
              {t.reportSubmitBtn}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
