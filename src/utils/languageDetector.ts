import { LanguageCode } from '../types';

export interface LanguageDetectionResult {
  detectedLang: LanguageCode;
  matchedLocale: string;
  isAutoDetected: boolean;
}

/**
 * Auto-detects the user's browser language and switches interface
 * to French ('fr'), Portuguese ('pt'), or Swahili ('sw') if detected,
 * while keeping English ('en') as the default fallback.
 */
export function detectBrowserLanguage(): LanguageDetectionResult {
  // 1. Check if user already has an explicit preference stored
  try {
    const saved = localStorage.getItem('afritrade_lang_preference');
    if (saved && ['en', 'pt', 'fr', 'sw', 'ar'].includes(saved)) {
      return {
        detectedLang: saved as LanguageCode,
        matchedLocale: saved,
        isAutoDetected: false,
      };
    }
  } catch {
    // Ignore iframe / localStorage access error
  }

  // 2. Gather browser language candidates from navigator
  const candidates: string[] = [];
  if (typeof navigator !== 'undefined') {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      candidates.push(...navigator.languages);
    }
    if (navigator.language) {
      candidates.push(navigator.language);
    }
    if ((navigator as any).userLanguage) {
      candidates.push((navigator as any).userLanguage);
    }
    if ((navigator as any).browserLanguage) {
      candidates.push((navigator as any).browserLanguage);
    }
  }

  // 3. Scan in order of user's browser preference for French, Portuguese, or Swahili
  for (const rawLocale of candidates) {
    if (!rawLocale) continue;
    const normalized = rawLocale.toLowerCase().trim();

    // French (e.g., fr, fr-FR, fr-CI, fr-SN, fr-CD, fr-CM)
    if (normalized.startsWith('fr')) {
      return {
        detectedLang: 'fr',
        matchedLocale: rawLocale,
        isAutoDetected: true,
      };
    }

    // Portuguese (e.g., pt, pt-PT, pt-BR, pt-AO, pt-MZ)
    if (normalized.startsWith('pt')) {
      return {
        detectedLang: 'pt',
        matchedLocale: rawLocale,
        isAutoDetected: true,
      };
    }

    // Swahili (e.g., sw, sw-KE, sw-TZ, sw-UG)
    if (normalized.startsWith('sw')) {
      return {
        detectedLang: 'sw',
        matchedLocale: rawLocale,
        isAutoDetected: true,
      };
    }
  }

  // 4. Fallback to English
  return {
    detectedLang: 'en',
    matchedLocale: candidates[0] || 'en-US',
    isAutoDetected: false,
  };
}

export function saveLanguagePreference(lang: LanguageCode): void {
  try {
    localStorage.setItem('afritrade_lang_preference', lang);
  } catch (e) {
    console.warn('Could not save language preference:', e);
  }
}
