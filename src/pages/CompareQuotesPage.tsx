import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, MessageCircle, ShieldCheck } from 'lucide-react';
import { SourcingRequest, SupplierQuotation, BusinessListing, CurrencyCode, LanguageCode } from '../types';
import { formatPrice } from '../utils/currency';
import { TRANSLATIONS } from '../i18n/translations';

interface CompareQuotesPageProps {
  rfq: SourcingRequest;
  quotations: SupplierQuotation[];
  businesses: BusinessListing[];
  currentCurrency: CurrencyCode;
  onBack: () => void;
  onSubmitQuoteRedirect: (rfq: SourcingRequest) => void;
  onDirectWhatsApp: (phone: string, text: string) => void;
  currentLang?: LanguageCode;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({
  rfq,
  quotations,
  businesses,
  currentCurrency,
  onBack,
  onSubmitQuoteRedirect,
  onDirectWhatsApp,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentQuotes = quotations.filter((q) => q.rfqId === rfq.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t.backToMarketplace}</span>
      </button>

      {/* Tender Header Summary */}
      <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
          <TrendingUp className="w-4 h-4 text-white" />
          <span>{t.compareTenderSummary}</span>
        </div>
        <div className="text-sm font-normal text-white">
          {currentLang === 'pt' && rfq.titlePt
            ? rfq.titlePt
            : currentLang === 'fr' && rfq.titleFr
            ? rfq.titleFr
            : currentLang === 'sw' && rfq.titleSw
            ? rfq.titleSw
            : currentLang === 'ar' && rfq.titleAr
            ? rfq.titleAr
            : rfq.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
          <span>{t.buyerLabel} <strong className="text-white">{rfq.buyerCompany}</strong></span>
          <span>·</span>
          <span>{t.targetVolume} <strong className="text-white">{rfq.quantityNeeded}</strong></span>
          <span>·</span>
          <span>{t.targetBudget} <strong className="text-white">{formatPrice(rfq.targetBudgetUSD, currentCurrency)}</strong></span>
          <span>·</span>
          <span>{t.destination} <strong className="text-white">{rfq.targetDestination}</strong></span>
        </div>
      </div>

      {/* Quotes Cards */}
      {currentQuotes.length === 0 ? (
        <div className="bg-neutral-950 rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-300">{t.noBidsYet}</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {t.firstBidPrompt}
          </p>
          <button
            onClick={() => onSubmitQuoteRedirect(rfq)}
            className="mt-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {t.submitQuotationBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuotes.map((quote) => {
            const supp = businesses.find((b) => b.id === quote.supplierId);
            const phone = supp ? supp.whatsappNumber : rfq.whatsappContact;

            return (
              <div
                key={quote.id}
                className="bg-neutral-950 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{quote.supplierName}</h3>
                      <span className="text-[11px] font-mono text-neutral-400">{quote.supplierCountry}</span>
                    </div>
                    {quote.afcftaTariffEligible && (
                      <span className="text-[10px] font-mono uppercase text-white font-bold bg-black px-2 py-0.5 rounded">
                        {t.afcftaEligible}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 bg-black rounded-xl space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-neutral-400">Unit Price:</span>
                      <span className="text-lg font-bold text-white">
                        {formatPrice(quote.unitPriceUSD, currentCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-neutral-400 font-mono">
                      <span>Order Total:</span>
                      <span className="text-white font-semibold">
                        {formatPrice(quote.totalPriceUSD, currentCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-neutral-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.moqLabel}:</span>
                      <span className="text-white font-medium">{quote.moq}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.leadTimeDays}:</span>
                      <span className="text-white font-medium">{quote.leadTimeDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.preferredIncoterm}:</span>
                      <span className="text-white font-medium">{quote.incoterm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{t.paymentSecurityTerms}:</span>
                      <span className="text-white font-medium truncate max-w-[200px]">{quote.paymentTerms}</span>
                    </div>
                  </div>

                  {quote.notes && (
                    <p className="text-xs text-neutral-400 italic bg-black p-3 rounded-xl leading-relaxed">
                      "{quote.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const msg = `Hello ${quote.supplierName}, regarding your quotation for ${rfq.title} at ${quote.unitPriceUSD} USD. We would like to initiate procurement negotiation.`;
                      onDirectWhatsApp(phone, msg);
                    }}
                    className="w-full bg-white text-black hover:bg-neutral-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>{t.negotiateWhatsApp}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
