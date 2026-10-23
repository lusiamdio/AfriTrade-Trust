import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Award,
  Globe2,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TradeActivityFeed } from './TradeActivityFeed';
import { TRANSLATIONS } from '../i18n/translations';

interface TrustHubViewProps {
  currentLang: LanguageCode;
  onOpenTradeAdvisor: () => void;
  onOpenSMEStorefront: () => void;
  onOpenResourceHub?: () => void;
}

const NATIONAL_REGISTRIES = [
  { country: 'Angola', code: 'AO', registrar: 'Guichet Único da Empresa (GUE) / INAPEM', badge: 'Tier 3 Audited' },
  { country: 'Kenya', code: 'KE', registrar: 'Business Registration Service (BRS) / KEBS', badge: 'Tier 3 Audited' },
  { country: 'Nigeria', code: 'NG', registrar: 'Corporate Affairs Commission (CAC) / SON', badge: 'Tier 3 Audited' },
  { country: 'South Africa', code: 'ZA', registrar: 'Companies and Intellectual Property Commission (CIPC) / SABS', badge: 'Tier 3 Audited' },
  { country: 'Côte d’Ivoire', code: 'CI', registrar: 'Centre de Promotion des Investissements (CEPICI)', badge: 'Tier 3 Audited' },
  { country: 'Rwanda', code: 'RW', registrar: 'Rwanda Development Board (RDB) / RSB', badge: 'Tier 2 Registered' },
  { country: 'Mozambique', code: 'MZ', registrar: 'Balcão de Atendimento Único (BAÚ) / INNOQ', badge: 'Tier 2 Registered' },
  { country: 'Egypt', code: 'EG', registrar: 'General Authority for Investment (GAFI) / EOS', badge: 'Tier 3 Audited' },
  { country: 'Ghana', code: 'GH', registrar: 'Registrar General’s Department (RGD) / GSA', badge: 'Tier 2 Registered' },
  { country: 'Tanzania', code: 'TZ', registrar: 'Business Registrations and Licensing Agency (BRELA)', badge: 'Tier 2 Registered' },
];

export const TrustHubView: React.FC<TrustHubViewProps> = ({
  currentLang,
  onOpenTradeAdvisor,
  onOpenSMEStorefront,
  onOpenResourceHub,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="space-y-6">
      {/* Real-Time Trade Activity Feed (Required Component) */}
      <TradeActivityFeed />

      {/* Trust Framework Architecture */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
          <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span>{t.verificationArchitecture}</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          {t.trustHubDesc}
        </p>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={onOpenTradeAdvisor}
            className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>{t.corridorAdvisorBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onOpenResourceHub && (
            <button
              onClick={onOpenResourceHub}
              className="bg-neutral-900 text-neutral-200 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.downloadTemplatesBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Verification Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-950 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-neutral-900 text-white font-bold">
                Tier 3 · Audited
              </span>
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">Audited & Export Certified</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Official commercial registrar match, physical site inspection, independent ISO/standards bureau certification, and verified banking reference.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-neutral-300 font-mono">
            AfCFTA preferential trade clearance eligible
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-neutral-950 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-300 font-bold">
                Tier 2 · Registered
              </span>
              <FileCheck2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">Registry Verified</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Direct verification with the national business registry (e.g., GUE, CAC, BRS, CIPC). Active commercial tax ID and registered address verified.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-neutral-300 font-mono">
            Wholesale and procurement verified
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-neutral-950 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-400 font-bold">
                Tier 1 · Basic
              </span>
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">Contact Confirmed</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              OTP-verified WhatsApp phone line and business domain email. Location claimed by operator with basic catalog review.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-neutral-300 font-mono">
            Basic local merchant discovery
          </div>
        </motion.div>
      </div>

      {/* Sovereign Registrars Table */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Sovereign Registry Integrations
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">10 African Nations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {NATIONAL_REGISTRIES.map((reg) => (
            <div
              key={reg.country}
              className="p-3.5 rounded-2xl bg-neutral-900 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded shrink-0">
                  {reg.code}
                </span>
                <div className="truncate">
                  <span className="font-semibold text-white block truncate">{reg.country}</span>
                  <span className="text-[11px] text-neutral-400 font-mono truncate block">
                    {reg.registrar}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-black text-white shrink-0 font-bold">
                {reg.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
