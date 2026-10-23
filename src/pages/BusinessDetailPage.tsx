import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building2,
  Package,
  Truck,
  CreditCard,
  FileCheck2,
  Share2,
  Send,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Star,
  Bookmark,
  Award,
} from 'lucide-react';
import { BusinessListing, LanguageCode, CurrencyCode, VerificationTier, ProductItem, BusinessReview } from '../types';
import { formatPrice } from '../utils/currency';
import { calculateRealtimeTrustScore, getDefaultReviewsForBusiness } from '../utils/trustScore';
import { TRANSLATIONS } from '../i18n/translations';

interface BusinessDetailPageProps {
  business: BusinessListing;
  currentCurrency: CurrencyCode;
  onBack: () => void;
  onOpenReport: (business: BusinessListing) => void;
  onOpenClaim: (business: BusinessListing) => void;
  onTrackInquiry: (businessId: string) => void;
  onUpdateBusiness?: (business: BusinessListing) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (businessId: string) => void;
  onAddReview?: (businessId: string, review: BusinessReview) => void;
  currentUser?: { role: 'merchant' | 'buyer'; business?: BusinessListing; name?: string } | null;
  onRequireAuth?: () => void;
  currentLang?: LanguageCode;
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({
  business,
  currentCurrency,
  onBack,
  onOpenReport,
  onOpenClaim,
  onTrackInquiry,
  onUpdateBusiness,
  isBookmarked = false,
  onToggleBookmark,
  onAddReview,
  currentUser,
  onRequireAuth,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'verification' | 'reviews' | 'products' | 'trade' | 'inquiry'>('verification');
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Real-time Product Editing State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('Real-time sync ready');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Packaging & Industrial');
  const [newProdMOQ, setNewProdMOQ] = useState('500 units');
  const [newProdLeadTime, setNewProdLeadTime] = useState('7');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Real-time Reviews State
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewRole, setReviewRole] = useState<'buyer' | 'seller'>(
    currentUser?.role === 'merchant' ? 'seller' : 'buyer'
  );
  const [reviewerName, setReviewerName] = useState(
    currentUser?.name || (currentUser?.business ? currentUser.business.name : '')
  );
  const [reviewerCompany, setReviewerCompany] = useState(
    currentUser?.business ? currentUser.business.name : ''
  );
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessNotice, setReviewSuccessNotice] = useState(false);

  // Inquiry form draft state
  const [inquiryProduct, setInquiryProduct] = useState(business.products[0]?.name || business.industry);
  const [inquiryVolume, setInquiryVolume] = useState('5,000 units');
  const [destinationCity, setDestinationCity] = useState(business.city);
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hello sales team at ${business.name},\n\nI reviewed your verified supplier profile on AfriTrade Trust. We are interested in sourcing ${business.products[0]?.name || business.industry} for delivery to ${business.city}.\n\nPlease share your wholesale quotation, MOQ, and AfCFTA export lead time.\n\nBest regards,\nProcurement Team`
  );

  const activeReviews = business.reviews && business.reviews.length > 0
    ? business.reviews
    : getDefaultReviewsForBusiness(business);

  // Synchronized real-time trust score
  const trustScore = calculateRealtimeTrustScore(business, activeReviews);

  const getTierLabel = (tier: VerificationTier) => {
    switch (tier) {
      case 'tier_3_audited':
        return 'Tier 3 · Physical Site Audited';
      case 'tier_2_registered':
        return 'Tier 2 · Sovereign Registry Verified';
      case 'tier_1_basic':
        return 'Tier 1 · Basic Document Verified';
      default:
        return 'Unverified Listing';
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cleanPhone = business.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSendWhatsApp = () => {
    onTrackInquiry(business.id);
    const encoded = encodeURIComponent(inquiryMessage);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBookmarkClick = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (onToggleBookmark) {
      onToggleBookmark(business.id);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: BusinessReview = {
      id: `rev-${Date.now()}`,
      authorName: reviewerName.trim() || (reviewRole === 'buyer' ? 'Commercial Buyer' : 'Verified Merchant'),
      authorCompany: reviewerCompany.trim() || undefined,
      authorRole: reviewRole,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      verifiedTransaction: true,
    };

    if (onAddReview) {
      onAddReview(business.id, newRev);
    }

    setReviewComment('');
    setShowWriteReview(false);
    setReviewSuccessNotice(true);
    setTimeout(() => setReviewSuccessNotice(false), 4000);
  };

  // Real-Time Product Management Handlers
  const handleSaveProductEdit = (productId: string, updatedFields: Partial<ProductItem>) => {
    const updatedProducts = business.products.map((p) =>
      p.id === productId ? { ...p, ...updatedFields } : p
    );
    const updatedBusiness: BusinessListing = {
      ...business,
      products: updatedProducts,
    };
    if (onUpdateBusiness) {
      onUpdateBusiness(updatedBusiness);
    }
    setEditingProductId(null);
    setSyncStatus('Changes synced in real time');
    setTimeout(() => setSyncStatus('Real-time sync ready'), 3000);
  };

  const handleDeleteProduct = (productId: string) => {
    if (business.products.length <= 1) {
      setActionError('Every business must maintain at least one lead wholesale product.');
      setTimeout(() => setActionError(null), 4000);
      return;
    }
    const updatedProducts = business.products.filter((p) => p.id !== productId);
    const updatedBusiness: BusinessListing = {
      ...business,
      products: updatedProducts,
    };
    if (onUpdateBusiness) {
      onUpdateBusiness(updatedBusiness);
    }
    setSyncStatus('Product removed & synced');
    setTimeout(() => setSyncStatus('Real-time sync ready'), 3000);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      description: newProdDesc.trim() || 'Verified export-grade wholesale product.',
      unitPriceUSD: parseFloat(newProdPrice) || 1.0,
      moq: newProdMOQ.trim() || '500 units',
      leadTimeDays: parseInt(newProdLeadTime, 10) || 7,
      specifications: ['AfCFTA Standard Conformance', 'Commercial export packaging'],
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    };

    const updatedBusiness: BusinessListing = {
      ...business,
      products: [newProduct, ...business.products],
    };

    if (onUpdateBusiness) {
      onUpdateBusiness(updatedBusiness);
    }

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setShowAddProductForm(false);
    setSyncStatus('New product published & live');
    setTimeout(() => setSyncStatus('Real-time sync ready'), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto space-y-6 pt-2"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Verified Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReport(business)}
            className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Report Discrepancy
          </button>
          <span className="text-neutral-700">·</span>
          <button
            onClick={() => onOpenClaim(business)}
            className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {t.claimOwnership}
          </button>
          <span className="text-neutral-700">·</span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? t.copied : t.shareProfile}</span>
          </button>
        </div>
      </div>

      {/* Action Error Notification */}
      <AnimatePresence>
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl text-xs text-white font-mono flex items-center justify-between"
          >
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="text-neutral-400 hover:text-white ml-2 text-[11px]"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Hero Header */}
      <div className="bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-44 sm:h-56 w-full relative bg-neutral-900">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 -mt-12 relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-black overflow-hidden shadow-xl shrink-0">
                <img
                  src={business.logoImage}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {getTierLabel(business.verification.tier)} · {business.countryCode} {business.country}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded-md shadow-sm">
                    {t.trustScore} {trustScore.score}/100
                  </span>
                </div>
                {/* Clean, Non-Bold Headline */}
                <div className="text-base sm:text-lg font-medium text-white tracking-normal">
                  {business.name}
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{business.city} · {business.industry}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* Bookmark Button */}
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isBookmarked
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
                title={t.saveSupplier}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
                <span>{isBookmarked ? t.saved : t.saveSupplier}</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiry')}
                className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>{t.contactWhatsApp}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            {currentLang === 'pt' && business.aboutPt
              ? business.aboutPt
              : currentLang === 'fr' && business.aboutFr
              ? business.aboutFr
              : currentLang === 'sw' && business.aboutSw
              ? business.aboutSw
              : currentLang === 'ar' && business.aboutAr
              ? business.aboutAr
              : business.about}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'verification', label: t.tabVerification, icon: ShieldCheck },
          { id: 'reviews', label: `${t.tabReviews} (${activeReviews.length})`, icon: Star },
          { id: 'products', label: t.tabProducts, icon: Package },
          { id: 'trade', label: t.tabTrade, icon: Truck },
          { id: 'inquiry', label: t.tabInquiry, icon: MessageCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {/* 1. Verification Dossier */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-neutral-400">
              Government Incorporation Check
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Registered Entity Name</span>
                <span className="text-white font-medium">{business.verification.registeredEntityName}</span>
              </div>
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Official Registration Number</span>
                <span className="font-mono text-white font-bold">{business.verification.registrationNumber}</span>
              </div>
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Sovereign Registrar</span>
                <span className="text-neutral-300">{business.verification.registrarAuthority}</span>
              </div>
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Registration Year</span>
                <span className="font-mono text-white">{business.verification.registrationYear}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-neutral-400">
              Audit & Site Inspection Record
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-black flex items-center justify-between">
                <div>
                  <span className="text-white font-medium block">Physical Factory / Facility Audit</span>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    Inspected by {business.verification.auditorName || 'AfriTrade Verification Field Bureau'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-black font-mono font-bold text-[10px]">
                  {business.verification.physicalSiteAudited ? 'AUDITED' : 'PENDING AUDIT'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black space-y-2">
                <span className="text-neutral-500 font-mono block">Independent Certifications</span>
                <div className="flex flex-wrap gap-2">
                  {business.verification.independentCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REVIEWS & REAL-TIME SYNCHRONIZED TRUST SCORE */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">
          {/* Visual Trust Score Breakdown Bar */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-400 block">
                  Synchronized Trust Rating
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">{trustScore.score}</span>
                  <span className="text-neutral-500 font-mono text-sm">/ 100</span>
                  <span className="text-xs font-mono text-neutral-300 ml-2">
                    ({trustScore.ratingLabel})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser && onRequireAuth) {
                    onRequireAuth();
                    return;
                  }
                  setShowWriteReview((v) => !v);
                }}
                className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Visual Meter Bar */}
            <div className="w-full bg-black rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${trustScore.score}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white h-full rounded-full"
              />
            </div>

            {/* Live Factor Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
              <div className="bg-black p-2.5 rounded-xl">
                <span className="text-neutral-500 block">Verification Tier</span>
                <span className="text-white font-bold">+{trustScore.tierScore} pts</span>
              </div>
              <div className="bg-black p-2.5 rounded-xl">
                <span className="text-neutral-500 block">Verified Certs ({trustScore.certCount})</span>
                <span className="text-white font-bold">+{trustScore.certScore} pts</span>
              </div>
              <div className="bg-black p-2.5 rounded-xl">
                <span className="text-neutral-500 block">Site Inspection</span>
                <span className="text-white font-bold">+{trustScore.siteBonus} pts</span>
              </div>
              <div className="bg-black p-2.5 rounded-xl">
                <span className="text-neutral-500 block">Live Review Impact</span>
                <span className={trustScore.reviewDelta >= 0 ? 'text-white font-bold' : 'text-neutral-400 font-bold'}>
                  {trustScore.reviewDelta >= 0 ? `+${trustScore.reviewDelta}` : trustScore.reviewDelta} pts
                </span>
              </div>
            </div>
          </div>

          {/* Review Success Notice */}
          <AnimatePresence>
            {reviewSuccessNotice && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-neutral-900 border border-neutral-700 text-white text-xs p-3.5 rounded-xl flex items-center gap-2 font-mono"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Review posted successfully! The Trust Score bar has been recalculated in real time.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inline Write Review Form */}
          <AnimatePresence>
            {showWriteReview && (
              <motion.form
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onSubmit={handleReviewSubmit}
                className="bg-neutral-950 rounded-2xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between pb-1 border-b border-neutral-900">
                  <h4 className="text-xs font-mono uppercase text-white font-bold">
                    Submit Peer Trade Review
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {reviewRating >= 4
                      ? 'Positive (+Score)'
                      : reviewRating <= 2
                      ? 'Critical (-Score)'
                      : 'Neutral'}
                  </span>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="text-neutral-400 text-xs block mb-1">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-white text-white'
                              : 'text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-white ml-2">
                      {reviewRating}/5 Stars
                    </span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div>
                  <label className="text-neutral-400 text-xs block mb-1">Your Role in this Transaction</label>
                  <div className="flex rounded-xl bg-black p-1 text-xs font-semibold max-w-xs">
                    <button
                      type="button"
                      onClick={() => setReviewRole('buyer')}
                      className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        reviewRole === 'buyer'
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Buyer / Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewRole('seller')}
                      className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        reviewRole === 'seller'
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Seller / Supplier
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tendai Mokoena"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Company / Enterprise</label>
                    <input
                      type="text"
                      placeholder="e.g. Southern Logistics Corp"
                      value={reviewerCompany}
                      onChange={(e) => setReviewerCompany(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-neutral-400 block mb-1 font-mono">Detailed Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Document product quality, packaging condition, AfCFTA tariff certificate accuracy, and settlement experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowWriteReview(false)}
                    className="text-xs px-4 py-2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">
              Verified Trader Feedback ({activeReviews.length})
            </h4>

            <div className="space-y-3">
              {activeReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-black space-y-2 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rev.authorName}</span>
                      {rev.authorCompany && (
                        <span className="text-neutral-400 font-mono text-[11px]">
                          · {rev.authorCompany}
                        </span>
                      )}
                      <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-neutral-300">
                        {rev.authorRole === 'buyer' ? 'Verified Buyer' : 'Verified Seller'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-white text-white' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-neutral-500">{rev.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Wholesale Products (With Real-Time Inline Editing) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-neutral-400 font-bold">
                Catalog ({business.products.length} Products)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300">
                {syncStatus}
              </span>
            </div>

            <button
              onClick={() => setShowAddProductForm((v) => !v)}
              className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddProductForm ? 'Close Form' : 'Add Wholesale Product'}</span>
            </button>
          </div>

          {/* Add Product Form */}
          <AnimatePresence>
            {showAddProductForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddNewProduct}
                className="bg-neutral-950 rounded-2xl p-6 space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <h4 className="text-xs font-mono uppercase text-white font-bold">
                    Add Product (Live Real-Time Sync)
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Instantly updates your directory listing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cold-Pressed Sesame Oil (Grade A)"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:ring-1 focus:ring-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Unit Price (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 2.45"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:ring-1 focus:ring-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Minimum Order Qty (MOQ)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,000 liters / 500 units"
                      value={newProdMOQ}
                      onChange={(e) => setNewProdMOQ(e.target.value)}
                      className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:ring-1 focus:ring-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1 font-mono">Lead Time (Days)</label>
                    <input
                      type="number"
                      placeholder="e.g. 7"
                      value={newProdLeadTime}
                      onChange={(e) => setNewProdLeadTime(e.target.value)}
                      className="w-full bg-black text-white px-3.5 py-2.5 rounded-xl focus:ring-1 focus:ring-white outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-neutral-400 block mb-1 font-mono">Product Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide technical specs, certifications, and packing details..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl focus:ring-1 focus:ring-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductForm(false)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Product Live</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Products List with Real-Time Editing */}
          <div className="space-y-4">
            {business.products.map((product) => {
              const isEditing = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-neutral-950 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl relative"
                >
                  {isEditing ? (
                    <InlineProductEditor
                      product={product}
                      currentCurrency={currentCurrency}
                      onSave={(fields) => handleSaveProductEdit(product.id, fields)}
                      onCancel={() => setEditingProductId(null)}
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 px-2.5 py-0.5 rounded-md">
                            {product.category}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            MOQ: {product.moq} · Lead Time: {product.leadTimeDays} days
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white tracking-tight">
                          {product.name}
                        </h4>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.specifications.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-mono bg-black text-neutral-400 px-2 py-0.5 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className="text-xl font-black text-white block">
                            {formatPrice(product.unitPriceUSD, currentCurrency)}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            per wholesale unit
                          </span>
                        </div>

                        {/* Real-Time Action Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingProductId(product.id)}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                            title="Edit Product in Real Time"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Cross-Border & AfCFTA Readiness */}
      {activeTab === 'trade' && (
        <div className="space-y-4">
          <div className="bg-neutral-950 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-neutral-400">
              AfCFTA Export Corridor Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Export Experience</span>
                <span className="font-mono text-white font-bold">{business.tradeReadiness.exportExperienceYears} Years</span>
              </div>
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Accepted Incoterms</span>
                <span className="font-mono text-white font-bold">
                  {business.tradeReadiness.incoterms.join(', ')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-black space-y-1">
                <span className="text-neutral-500 font-mono block">Active Corridors</span>
                <span className="text-neutral-300">
                  {business.tradeReadiness.mainCorridors?.join(' · ') || 'Regional SADC / EAC corridors'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 rounded-2xl p-6 space-y-3">
            <span className="text-xs font-mono uppercase text-white font-bold block">
              Pre-cleared Customs Documentation
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {business.tradeReadiness.tradeDocumentsReady.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-white shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 5. WhatsApp Inquiry Composer */}
      {activeTab === 'inquiry' && (
        <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Direct Verified Inquiry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1 font-mono">Product of Interest</label>
              <input
                type="text"
                value={inquiryProduct}
                onChange={(e) => setInquiryProduct(e.target.value)}
                className="w-full bg-neutral-900 text-white px-3 py-2 rounded-xl focus:bg-neutral-850 outline-none"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1 font-mono">Order Quantity / Batch</label>
              <input
                type="text"
                value={inquiryVolume}
                onChange={(e) => setInquiryVolume(e.target.value)}
                className="w-full bg-neutral-900 text-white px-3 py-2 rounded-xl focus:bg-neutral-850 outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-neutral-400 block mb-1 font-mono">Destination Port / City</label>
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full bg-neutral-900 text-white px-3 py-2 rounded-xl focus:bg-neutral-850 outline-none"
            />
          </div>

          <div className="text-xs">
            <label className="text-neutral-400 block mb-1 font-mono">Prepared Message</label>
            <textarea
              rows={4}
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              className="w-full bg-neutral-900 text-white p-3 rounded-xl focus:bg-neutral-850 outline-none resize-none font-mono text-[11px] leading-relaxed"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-mono text-[11px]">
              Direct to verified WhatsApp: {cleanPhone}
            </span>
            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
            >
              <Send className="w-4 h-4 fill-black" />
              <span>Launch WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface InlineProductEditorProps {
  product: ProductItem;
  currentCurrency: CurrencyCode;
  onSave: (fields: Partial<ProductItem>) => void;
  onCancel: () => void;
}

const InlineProductEditor: React.FC<InlineProductEditorProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(product.name);
  const [unitPrice, setUnitPrice] = useState(product.unitPriceUSD.toString());
  const [moq, setMoq] = useState(product.moq);
  const [leadTime, setLeadTime] = useState(product.leadTimeDays.toString());
  const [description, setDescription] = useState(product.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      unitPriceUSD: parseFloat(unitPrice) || product.unitPriceUSD,
      moq: moq.trim(),
      leadTimeDays: parseInt(leadTime, 10) || product.leadTimeDays,
      description: description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5" />
          Edit Wholesale Product
        </span>
        <span className="text-[10px] font-mono text-neutral-400">Live Real-Time Sync</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-neutral-400 block mb-1 font-mono">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-white outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-mono">Unit Price (USD)</label>
          <input
            type="number"
            step="0.01"
            required
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full bg-black text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-white outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-mono">Minimum Order Quantity (MOQ)</label>
          <input
            type="text"
            required
            value={moq}
            onChange={(e) => setMoq(e.target.value)}
            className="w-full bg-black text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-white outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-mono">Lead Time (Days)</label>
          <input
            type="number"
            required
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            className="w-full bg-black text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-white outline-none"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="text-neutral-400 block mb-1 font-mono">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black text-white p-3 rounded-xl focus:ring-1 focus:ring-white outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Apply Real-Time Changes</span>
        </button>
      </div>
    </form>
  );
};
