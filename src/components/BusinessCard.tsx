import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  MessageCircle,
  ArrowUpRight,
  Info,
  Calendar,
  Check,
  Award,
  Bookmark,
  Star,
  UserCheck,
  Send,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BusinessListing, LanguageCode, CurrencyCode, VerificationTier, BusinessReview } from '../types';
import { formatPrice } from '../utils/currency';
import { calculateRealtimeTrustScore, getDefaultReviewsForBusiness } from '../utils/trustScore';
import { TRANSLATIONS } from '../i18n/translations';

interface BusinessCardProps {
  business: BusinessListing;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  lowDataMode: boolean;
  onOpenDetails: (business: BusinessListing) => void;
  onQuickWhatsApp: (business: BusinessListing) => void;
  onQuickQuote: (business: BusinessListing) => void;
  onReportSuspicious?: (business: BusinessListing) => void;
  aiMatchReason?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (businessId: string) => void;
  onAddReview?: (businessId: string, review: BusinessReview) => void;
  currentUser?: { role: 'merchant' | 'buyer'; business?: BusinessListing; name?: string } | null;
  onRequireAuth?: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  currentLang,
  currentCurrency,
  lowDataMode,
  onOpenDetails,
  onQuickWhatsApp,
  onQuickQuote,
  aiMatchReason,
  isBookmarked = false,
  onToggleBookmark,
  onAddReview,
  currentUser,
  onRequireAuth,
}) => {
  const [showInsights, setShowInsights] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);
  const [showWriteReviewForm, setShowWriteReviewForm] = useState(false);

  // Review Form State
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
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Active reviews list
  const activeReviews = business.reviews && business.reviews.length > 0
    ? business.reviews
    : getDefaultReviewsForBusiness(business);

  // Real-time synchronized Trust Score
  const trustScore = calculateRealtimeTrustScore(business, activeReviews);

  const getTierShortLabel = (tier: VerificationTier) => {
    switch (tier) {
      case 'tier_3_audited':
        return t.tier3Badge;
      case 'tier_2_registered':
        return t.tier2Badge;
      case 'tier_1_basic':
        return t.tier1Badge;
      default:
        return t.unverifiedBadge;
    }
  };

  const primaryProduct = business.products[0];

  const displayTagline =
    currentLang === 'pt' && business.taglinePt
      ? business.taglinePt
      : currentLang === 'fr' && business.taglineFr
      ? business.taglineFr
      : currentLang === 'sw' && business.taglineSw
      ? business.taglineSw
      : currentLang === 'ar' && business.taglineAr
      ? business.taglineAr
      : business.tagline;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

    const newReview: BusinessReview = {
      id: `rev-${Date.now()}`,
      authorName: reviewerName.trim() || (reviewRole === 'buyer' ? 'Verified Buyer' : 'Verified Merchant'),
      authorCompany: reviewerCompany.trim() || undefined,
      authorRole: reviewRole,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      verifiedTransaction: true,
    };

    if (onAddReview) {
      onAddReview(business.id, newReview);
    }

    setReviewComment('');
    setShowWriteReviewForm(false);
    setShowReviewsList(true);
    setReviewSubmittedNotice(true);
    setTimeout(() => setReviewSubmittedNotice(false), 3500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-neutral-950 rounded-3xl overflow-visible flex flex-col justify-between shadow-2xl hover:bg-neutral-900/95 transition-all group relative"
    >
      <div>
        {/* Cover / Header with Bookmarking & Trust Score Radial Pill */}
        {!lowDataMode ? (
          <div className="h-36 w-full overflow-hidden bg-neutral-900 relative rounded-t-3xl">
            <img
              src={business.coverImage}
              alt={business.name}
              loading="lazy"
              className="w-full h-full object-cover brightness-70 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

            {/* Top Badge Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-white font-bold flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-semibold">{business.countryCode}</span>
                <span>{business.country}</span>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Bookmarking Action Button */}
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold ${
                    isBookmarked
                      ? 'bg-white text-black shadow-lg ring-1 ring-white'
                      : 'bg-black/80 text-neutral-300 hover:text-white hover:bg-black'
                  }`}
                  title={
                    currentUser
                      ? isBookmarked
                        ? t.removeFromFavorites
                        : t.saveToFavorites
                      : t.signInToSave
                  }
                  aria-label={t.saveSupplier}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isBookmarked ? 'fill-black text-black' : 'text-current'
                    }`}
                  />
                  {isBookmarked && <span className="hidden sm:inline">{t.saved}</span>}
                </button>

                {/* Visual Trust Score Radial Pill */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInsights((prev) => !prev);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-md text-white font-mono text-[10px] font-bold cursor-pointer hover:bg-black transition-colors shrink-0"
                  title="Trust Score synchronized in real time with verification tier, certs & reviews"
                >
                  {/* Mini Radial Meter */}
                  <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-800"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-white"
                        strokeDasharray={`${trustScore.score}, 100`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                  <span>{t.trustScore} {trustScore.score}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-10 bg-neutral-900 px-4 flex items-center justify-between rounded-t-3xl">
            <span className="text-[11px] font-mono text-neutral-400">
              Low-Data · {business.countryCode} {business.country}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isBookmarked ? 'bg-white text-black font-bold' : 'text-neutral-300'
                }`}
              >
                {isBookmarked ? t.saved : t.save}
              </button>
              <span className="text-[10px] font-mono text-white font-bold">
                {t.trustScore}: {trustScore.score}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 space-y-3.5 relative">
          {/* Metadata Header with Hoverable 'Verification Insights' Trigger & Industry */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            {/* Hover Trigger for Verification Insights */}
            <div
              className="relative"
              onMouseEnter={() => setShowInsights(true)}
              onMouseLeave={() => setShowInsights(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInsights((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer transition-colors"
                aria-label="Verification Insights"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="font-bold text-white">{getTierShortLabel(business.verification.tier)}</span>
                <Info className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Hoverable 'Verification Insights' Popup */}
              <AnimatePresence>
                {showInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-neutral-900/98 backdrop-blur-2xl p-4 rounded-2xl shadow-2xl z-50 space-y-3 pointer-events-auto"
                    onMouseEnter={() => setShowInsights(true)}
                    onMouseLeave={() => setShowInsights(false)}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <span className="text-xs font-black uppercase text-white tracking-wider">
                          Verification Insights
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-white text-black px-1.5 py-0.5 rounded font-extrabold">
                        {business.verification.tier === 'tier_3_audited' ? 'Audited' : 'Verified'}
                      </span>
                    </div>

                    {/* Trust Score Breakdown in Popup */}
                    <div className="bg-black/70 p-3 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-white" />
                          Trust Score Calculation
                        </span>
                        <span className="text-white font-black">{trustScore.score}/100</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 space-y-0.5 font-mono">
                        <div className="flex justify-between">
                          <span>Verification Tier ({getTierShortLabel(business.verification.tier)})</span>
                          <span className="text-neutral-300">+{trustScore.tierScore} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Independent Certifications ({business.verification.independentCertifications.length})</span>
                          <span className="text-neutral-300">+{trustScore.certScore} pts</span>
                        </div>
                        {business.verification.physicalSiteAudited && (
                          <div className="flex justify-between">
                            <span>Physical Site Audited</span>
                            <span className="text-neutral-300">+{trustScore.siteBonus} pts</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Real-time Reviews Impact ({trustScore.positiveReviewsCount} Good, {trustScore.negativeReviewsCount} Bad)</span>
                          <span className={trustScore.reviewDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {trustScore.reviewDelta >= 0 ? `+${trustScore.reviewDelta}` : trustScore.reviewDelta} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] font-sans">
                      {/* Criteria 1: Government Registration Check */}
                      <div className="flex items-start gap-2 bg-black/60 p-2.5 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">Official Company Registry</span>
                          <span className="text-neutral-400 block text-[10px]">
                            Registration verified via {business.verification.registrarAuthority}
                          </span>
                          <span className="font-mono text-neutral-300 block text-[10px] mt-0.5">
                            ID: {business.verification.registrationNumber}
                          </span>
                        </div>
                      </div>

                      {/* Criteria 2: Contact Line Authentication */}
                      <div className="flex items-start gap-2 bg-black/60 p-2.5 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">Contact Authentication</span>
                          <span className="text-neutral-400 block text-[10px]">
                            Direct WhatsApp line & business domain verified
                          </span>
                        </div>
                      </div>

                      {/* Criteria 3: Facility / Location Audited */}
                      <div className="flex items-start gap-2 bg-black/60 p-2.5 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">Physical Site Verification</span>
                          <span className="text-neutral-400 block text-[10px]">
                            {business.verification.physicalSiteAudited
                              ? 'Physical plant & warehouse independently audited'
                              : `Operating facility verified in ${business.city}, ${business.country}`}
                          </span>
                        </div>
                      </div>

                      {/* Criteria 4: Certifications & Audit Date */}
                      <div className="flex items-start gap-2 bg-black/60 p-2.5 rounded-xl">
                        <Calendar className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">Audit Timestamp</span>
                          <span className="text-neutral-400 block text-[10px]">
                            Verified: {business.verification.auditDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span>AfCFTA Cross-Border Ready</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInsights(false);
                          onOpenDetails(business);
                        }}
                        className="text-white font-bold hover:underline cursor-pointer"
                      >
                        Full Dossier →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="text-neutral-500">{business.industry}</span>
          </div>

          {/* VISUAL TRUST SCORE INDICATOR BAR (Syncs with reviews in real-time) */}
          <div className="p-3 rounded-2xl bg-neutral-900/90 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">{t.trustScore}</span>
                <span className="text-neutral-400 text-[10px]">({trustScore.ratingLabel})</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white font-extrabold text-sm">{trustScore.score}</span>
                <span className="text-neutral-500 text-[10px]">/100</span>
              </div>
            </div>

            {/* Visual Meter Bar */}
            <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden relative">
              <motion.div
                initial={false}
                animate={{ width: `${trustScore.score}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full transition-colors ${
                  trustScore.score >= 80
                    ? 'bg-white'
                    : trustScore.score >= 60
                    ? 'bg-neutral-300'
                    : 'bg-neutral-500'
                }`}
              />
            </div>

            {/* Sync Indicators */}
            <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 pt-0.5">
              <span>{getTierShortLabel(business.verification.tier)} · {trustScore.certCount} {t.verifiedCerts}</span>
              <span className={trustScore.reviewDelta >= 0 ? 'text-white font-semibold' : 'text-neutral-300 font-semibold'}>
                {t.liveSync} {trustScore.positiveReviewsCount} {t.goodReviews} / {trustScore.negativeReviewsCount} {t.badReviews}
              </span>
            </div>
          </div>

          {/* REVIEWS SECTION: APPEARS DIRECTLY BELOW TRUST SCORE BAR */}
          <div className="rounded-2xl bg-neutral-900/70 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowReviewsList((v) => !v)}
                className="flex items-center gap-1.5 font-bold text-white hover:text-neutral-300 transition-colors cursor-pointer text-[11px]"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{t.reviews} ({activeReviews.length})</span>
                <span className="text-neutral-400 font-normal font-mono flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-neutral-400 text-neutral-400" />
                  {trustScore.ratingAverage}
                </span>
                {showReviewsList ? <ChevronUp className="w-3 h-3 text-neutral-400" /> : <ChevronDown className="w-3 h-3 text-neutral-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser && onRequireAuth) {
                    onRequireAuth();
                    return;
                  }
                  setShowWriteReviewForm((v) => !v);
                }}
                className="text-[10px] font-bold text-black bg-white hover:bg-neutral-200 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>{t.writeReview}</span>
              </button>
            </div>

            {/* Review Submission Notice */}
            <AnimatePresence>
              {reviewSubmittedNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-800 text-white text-[10px] p-2 rounded-xl flex items-center gap-1.5 font-mono"
                >
                  <Check className="w-3 h-3 text-white" />
                  <span>{t.reviewSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Write Review Form (Expandable) */}
            <AnimatePresence>
              {showWriteReviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleReviewSubmit}
                  className="bg-black/90 p-3 rounded-xl space-y-2.5 pt-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-300 font-semibold">
                    <span>{t.rateThisBusiness}</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {reviewRating >= 4
                        ? `4-5 (${t.goodReviews})`
                        : reviewRating <= 2
                        ? `1-2 (${t.badReviews})`
                        : '3 (Neutral)'}
                    </span>
                  </div>

                  {/* 5-Star Selection */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating
                              ? 'fill-white text-white'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-mono font-bold text-white ml-2">
                      {reviewRating}/5
                    </span>
                  </div>

                  {/* Role Switcher */}
                  <div className="flex rounded-lg bg-neutral-900 p-0.5 text-[10px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setReviewRole('buyer')}
                      className={`flex-1 py-1 rounded transition-colors cursor-pointer ${
                        reviewRole === 'buyer'
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.iAmBuyer}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewRole('seller')}
                      className={`flex-1 py-1 rounded transition-colors cursor-pointer ${
                        reviewRole === 'seller'
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.iAmSeller}
                    </button>
                  </div>

                  {/* Reviewer Inputs */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <input
                      type="text"
                      placeholder={t.yourName}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="bg-neutral-900 text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder={t.companyOptional}
                      value={reviewerCompany}
                      onChange={(e) => setReviewerCompany(e.target.value)}
                      className="bg-neutral-900 text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>

                  {/* Review Text */}
                  <textarea
                    rows={2}
                    placeholder={t.reviewPlaceholder}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-neutral-900 text-white p-2 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-white"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowWriteReviewForm(false)}
                      className="text-[10px] px-2.5 py-1 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="bg-white text-black hover:bg-neutral-200 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>{t.postReview}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Latest Review Preview (or expanded list) */}
            <div className="space-y-1.5">
              {(showReviewsList ? activeReviews : activeReviews.slice(0, 1)).map((rev) => (
                <div key={rev.id} className="bg-black/40 p-2 rounded-xl text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-white font-bold truncate">{rev.authorName}</span>
                      {rev.authorCompany && (
                        <span className="text-neutral-500 truncate hidden sm:inline">· {rev.authorCompany}</span>
                      )}
                      <span className="px-1.5 py-0.2 rounded text-[8px] uppercase font-bold bg-neutral-800 text-neutral-300">
                        {rev.authorRole === 'buyer' ? 'Buyer' : 'Seller'}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? 'fill-white text-white' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-300 line-clamp-2 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}

              {!showReviewsList && activeReviews.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowReviewsList(true)}
                  className="text-[9px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer block text-center w-full pt-0.5"
                >
                  {t.viewAllReviews} ({activeReviews.length}) →
                </button>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <div>
            <h3
              onClick={() => onOpenDetails(business)}
              className="text-base font-bold text-white group-hover:text-neutral-200 cursor-pointer line-clamp-1 transition-colors tracking-tight"
            >
              {business.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {displayTagline}
            </p>
          </div>

          {/* AI Match Context (If active) */}
          {aiMatchReason && (
            <div className="p-3 rounded-xl bg-neutral-900 text-[11px] text-neutral-300 space-y-0.5">
              <span className="text-white font-bold block uppercase text-[10px]">{t.matchInsight}</span>
              <span>{aiMatchReason}</span>
            </div>
          )}

          {/* Registry Verification Record */}
          <div
            className="p-3 rounded-xl bg-neutral-900 text-xs space-y-1 cursor-pointer hover:bg-neutral-850 transition-colors"
            onClick={() => setShowInsights((prev) => !prev)}
            title="Click to view verification insights"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 font-mono">{t.verifiedID}</span>
              <span className="font-mono text-white font-bold">
                {business.verification.registrationNumber}
              </span>
            </div>
            <div className="text-[11px] text-neutral-300 truncate">
              {business.verification.registrarAuthority}
            </div>
          </div>

          {/* Primary Product & MOQ */}
          {primaryProduct && (
            <div className="p-3 rounded-xl bg-neutral-900 flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                  {t.leadProduct}
                </span>
                <span className="text-white font-semibold truncate block">
                  {currentLang === 'pt' && primaryProduct.namePt
                    ? primaryProduct.namePt
                    : currentLang === 'fr' && primaryProduct.nameFr
                    ? primaryProduct.nameFr
                    : currentLang === 'sw' && primaryProduct.nameSw
                    ? primaryProduct.nameSw
                    : currentLang === 'ar' && primaryProduct.nameAr
                    ? primaryProduct.nameAr
                    : primaryProduct.name}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-white font-black block">
                  {formatPrice(primaryProduct.unitPriceUSD, currentCurrency)}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {t.moqLabel} {primaryProduct.moq}
                </span>
              </div>
            </div>
          )}

          {/* Export Footprint */}
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-0.5">
            <span className="text-neutral-500 font-mono">{t.exports}</span>
            <span className="text-neutral-300 truncate">
              {business.tradeReadiness.countriesServed.slice(0, 4).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions: 80% Black / 20% White */}
      <div className="p-3.5 flex items-center justify-between gap-2 bg-neutral-900/60 rounded-b-3xl">
        <button
          onClick={() => onQuickWhatsApp(business)}
          className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-black" />
          <span>{t.whatsAppBtn}</span>
        </button>

        <button
          onClick={() => onQuickQuote(business)}
          className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
        >
          {t.quoteBtn}
        </button>

        <button
          onClick={() => onOpenDetails(business)}
          className="p-2.5 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
          aria-label="View Details"
          title={t.fullDossier}
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
};
