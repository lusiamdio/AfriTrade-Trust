import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Eye,
  X,
  Printer,
  ShieldCheck,
  Search,
  BookOpen,
} from 'lucide-react';
import { TradeDocumentTemplate, LanguageCode } from '../types';
import { TRADE_DOCUMENT_TEMPLATES } from '../data/tradeTemplates';
import { TRANSLATIONS } from '../i18n/translations';

interface ResourceHubProps {
  currentLang?: LanguageCode;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({ currentLang = 'en' }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<TradeDocumentTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'all',
    'Customs & Origin',
    'Logistics & Shipping',
    'Commercial & Financial',
    'Quality & Agriculture',
    'SME Cross-Border',
  ];

  const filteredDocs = TRADE_DOCUMENT_TEMPLATES.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleDownload = (doc: TradeDocumentTemplate) => {
    const element = document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_Template.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = (doc: TradeDocumentTemplate) => {
    navigator.clipboard.writeText(doc.content);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400">
          <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span>Pan-African Trade Documentation Standards</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          {t.resourceHubDesc}
        </p>

        {/* Search & Filter Toolbar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? t.allSectors : cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter templates..."
              className="w-full bg-neutral-900 text-white placeholder-neutral-500 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:bg-neutral-850"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-neutral-950 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col justify-between transition-all space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-300 font-bold">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">{doc.fileType}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="truncate">{doc.standard}</span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="bg-white hover:bg-neutral-200 text-black text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                title={t.downloadTemplate}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadTemplate}</span>
              </button>

              <button
                onClick={() => handleCopy(doc)}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                title={t.copyTemplate}
              >
                {copiedId === doc.id ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-950 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between bg-neutral-900">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white" />
                  <span>{previewDoc.title}</span>
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Standard: {previewDoc.standard}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-neutral-300 bg-black/70 leading-relaxed whitespace-pre-wrap selection:bg-white selection:text-black">
              {previewDoc.content}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
