import { BusinessListing, BusinessReview, VerificationTier } from '../types';

export interface TrustScoreDetails {
  score: number; // 10 - 100
  tierScore: number;
  certScore: number;
  certCount: number;
  siteBonus: number;
  positiveReviewsCount: number;
  neutralReviewsCount: number;
  negativeReviewsCount: number;
  reviewDelta: number;
  totalReviewsCount: number;
  ratingAverage: number;
  ratingLabel: string;
}

/**
 * Calculates a verified Trust Score synchronized in real time with:
 * 1. Verification Tier (Tier 3 Audited / Tier 2 Registered / Tier 1 Basic)
 * 2. Independent Certification count
 * 3. Physical site audit status
 * 4. User reviews (Good reviews increase the score rate; Bad reviews reduce it in real time)
 */
export function calculateRealtimeTrustScore(
  business: BusinessListing,
  reviews?: BusinessReview[]
): TrustScoreDetails {
  // 1. Tier Base Score
  let tierScore = 25;
  switch (business.verification?.tier as VerificationTier) {
    case 'tier_3_audited':
      tierScore = 70;
      break;
    case 'tier_2_registered':
      tierScore = 52;
      break;
    case 'tier_1_basic':
      tierScore = 38;
      break;
    default:
      tierScore = 22;
      break;
  }

  // 2. Certification Count
  const certCount = business.verification?.independentCertifications?.length || 0;
  const certScore = Math.min(certCount * 4, 16); // up to 16 points

  // 3. Physical Site & Verified Contacts Bonus
  let siteBonus = 0;
  if (business.verification?.physicalSiteAudited) siteBonus += 4;
  if (business.verification?.phoneVerified) siteBonus += 2;
  if (business.verification?.emailVerified) siteBonus += 2;
  if (business.tradeReadiness?.afcftaRegistered) siteBonus += 2;

  // 4. Synchronize with Reviews in Real-Time
  const activeReviews = reviews ?? business.reviews ?? [];
  let positiveReviewsCount = 0;
  let neutralReviewsCount = 0;
  let negativeReviewsCount = 0;
  let reviewDelta = 0;

  activeReviews.forEach((rev) => {
    if (rev.rating >= 4) {
      positiveReviewsCount++;
      // Good review increases score rate
      reviewDelta += rev.rating === 5 ? 5 : 3;
    } else if (rev.rating <= 2) {
      negativeReviewsCount++;
      // Bad review drastically pulls down trust score rate
      reviewDelta -= rev.rating === 1 ? 14 : 9;
    } else {
      neutralReviewsCount++;
      // Neutral review
      reviewDelta += 0;
    }
  });

  // Calculate rating average
  const totalReviewsCount = activeReviews.length;
  const ratingSum = activeReviews.reduce((sum, r) => sum + r.rating, 0);
  const ratingAverage = totalReviewsCount > 0 ? Number((ratingSum / totalReviewsCount).toFixed(1)) : (business.rating || 0);

  // Suspicious penalty
  const suspiciousReports = business.verification?.suspiciousReportsCount || 0;
  const penalty = suspiciousReports * 15;

  // Raw combined score
  const rawScore = tierScore + certScore + siteBonus + reviewDelta - penalty;
  const score = Math.min(100, Math.max(10, Math.round(rawScore)));

  let ratingLabel = 'Moderate Trust';
  if (score >= 90) ratingLabel = 'Top Tier Audited';
  else if (score >= 75) ratingLabel = 'High Trust Verified';
  else if (score >= 55) ratingLabel = 'Commercial Registered';
  else ratingLabel = 'Caution / Low Trust';

  return {
    score,
    tierScore,
    certScore,
    certCount,
    siteBonus,
    positiveReviewsCount,
    neutralReviewsCount,
    negativeReviewsCount,
    reviewDelta,
    totalReviewsCount,
    ratingAverage,
    ratingLabel,
  };
}

/**
 * Returns genuine reviews associated with this business (no mock data)
 */
export function getDefaultReviewsForBusiness(business: BusinessListing): BusinessReview[] {
  return business.reviews || [];
}
