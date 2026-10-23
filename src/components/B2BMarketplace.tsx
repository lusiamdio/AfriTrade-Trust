import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  PlusCircle,
  FileText,
  Clock,
  MapPin,
  TrendingUp,
  SlidersHorizontal,
  MessageCircle,
} from 'lucide-react';
import {
  SourcingRequest,
  SupplierQuotation,
  LanguageCode,
  CurrencyCode,
  BusinessListing,
} from '../types';
import { formatPrice } from '../utils/currency';
import { TRANSLATIONS } from '../i18n/translations';

interface B2BMarketplaceProps {
  sourcingRequests: SourcingRequest[];
  quotations: SupplierQuotation[];
  businesses: BusinessListing[];
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onPostNewRFQ: (rfq: Partial<SourcingRequest>) => void;
  onSubmitQuotation: (quote: Partial<SupplierQuotation>) => void;
  onDirectWhatsApp: (phone: string, text: string) => void;
  onNavigateToPostRFQ?: () => void;
  onNavigateToCompare?: (rfq: SourcingRequest) => void;
  onNavigateToSubmitQuote?: (rfq: SourcingRequest) => void;
}

export const B2BMarketplace: React.FC<B2BMarketplaceProps> = ({
  sourcingRequests,
  quotations,
  businesses,
  currentLang,
  currentCurrency,
  onPostNewRFQ,
  onSubmitQuotation,
  onDirectWhatsApp,
  onNavigateToPostRFQ,
  onNavigateToCompare,
  onNavigateToSubmitQuote,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Packaging & Containers',
    'Agriculture & Agro-Processing',
    'Renewable Energy & Electrical',
    'Textiles & Industrial Manufacturing',
    'Cosmetics & Agro-Processing',
  ];

  const filteredRequests = sourcingRequests.filter((r) =>
    selectedCategory === 'all' ? true : r.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
            <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span>{t.b2bMarketplaceTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
            {t.b2bMarketplaceDesc}
          </p>
        </div>

        <button
          onClick={() => {
            if (onNavigateToPostRFQ) onNavigateToPostRFQ();
          }}
          className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.postSourcingRequestBtn}</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs text-neutral-500 font-mono flex items-center gap-1 shrink-0 pl-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t.sectorFilter}
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-black shadow-md'
                : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {cat === 'all' ? t.allSectors : cat}
          </button>
        ))}
      </div>

      {/* RFQ Listings Grid */}
      {filteredRequests.length === 0 ? (
        <div className="p-10 sm:p-12 text-center bg-neutral-950 rounded-3xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Procurement Tenders Found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Platform is clean of mock data. Post your actual business sourcing requirement to receive verified bids from African suppliers.
            </p>
          </div>
          {onNavigateToPostRFQ && (
            <button
              onClick={onNavigateToPostRFQ}
              className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postSourcingRequestBtn}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((rfq) => {
            const quotesCount = quotations.filter((q) => q.rfqId === rfq.id).length;

            return (
              <motion.div
                key={rfq.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-3xl bg-neutral-950 hover:bg-neutral-900/90 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300 px-2.5 py-1 rounded-lg font-bold">
                      {rfq.category}
                    </span>
                    <span className="text-neutral-400 text-[11px] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {t.deadline} {rfq.deadlineDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {currentLang === 'pt' && rfq.titlePt
                      ? rfq.titlePt
                      : currentLang === 'fr' && rfq.titleFr
                      ? rfq.titleFr
                      : currentLang === 'sw' && rfq.titleSw
                      ? rfq.titleSw
                      : currentLang === 'ar' && rfq.titleAr
                      ? rfq.titleAr
                      : rfq.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="text-white font-semibold">{rfq.buyerCompany}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {rfq.targetDestination}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {rfq.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-2xl bg-neutral-900/80">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase block">{t.targetVolume}</span>
                      <span className="font-bold text-white text-sm">{rfq.quantityNeeded}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-900/80">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase block">{t.targetBudget}</span>
                      <span className="font-bold text-white text-sm">
                        {formatPrice(rfq.targetBudgetUSD, currentCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateToCompare) onNavigateToCompare(rfq);
                    }}
                    className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-neutral-900 hover:bg-neutral-800 px-3 py-2 rounded-xl"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{quotesCount > 0 ? `${t.compareQuotesBtn} (${quotesCount})` : t.compareQuotesBtn}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onNavigateToSubmitQuote) onNavigateToSubmitQuote(rfq);
                      }}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors cursor-pointer"
                    >
                      {t.submitQuotationBtn}
                    </button>

                    <button
                      onClick={() => {
                        const msg = `Hello ${rfq.buyerName}, regarding your sourcing request on AfriTrade Trust: "${rfq.title}". We would like to provide our quotation.`;
                        onDirectWhatsApp(rfq.whatsappContact, msg);
                      }}
                      className="p-2 bg-white text-black hover:bg-neutral-200 rounded-xl transition-all cursor-pointer shadow-md"
                      title={t.negotiateWhatsApp}
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
