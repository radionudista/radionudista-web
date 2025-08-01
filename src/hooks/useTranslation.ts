import { useTranslation as useI18nTranslation } from 'react-i18next';
import { env } from '../config/env';

/**
 * Translation Hook Abstraction
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for providing translation functionality
 *
 * Follows Open/Closed Principle:
 * - Open for extension through additional translation utilities
 * - Closed for modification of core translation logic
 *
 * Follows Dependency Inversion Principle:
 * - Components depend on this abstraction, not directly on i18next
 */

export interface TranslationHook {
  t: (key: string, options?: any) => string;
  i18n: {
    language: string;
    changeLanguage: (lng: string) => Promise<void>;
    languages: string[];
  };
  ready: boolean;
}

/**
 * Custom translation hook that provides a clean interface for components
 */
export const useTranslation = (namespace?: string): TranslationHook => {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  return {
    t,
    i18n: {
      language: i18n.language,
      changeLanguage: i18n.changeLanguage,
      languages: env.SUPPORTED_LANGUAGES
    },
    ready
  };
};

/**
 * Language utilities following SOLID principles
 */
export const LanguageUtils = {
  /**
   * Get the current language code
   */
  getCurrentLanguage: (): string => {
    return document.documentElement.lang || env.DEFAULT_LANGUAGE;
  },

  /**
   * Check if a language is supported
   */
  isLanguageSupported: (language: string): boolean => {
    return env.SUPPORTED_LANGUAGES.includes(language);
  },

  /**
   * Get browser preferred language that we support
   */
  getBrowserPreferredLanguage: (): string => {
    const browserLang = navigator.language.split('-')[0];
    return LanguageUtils.isLanguageSupported(browserLang) ? browserLang : env.DEFAULT_LANGUAGE;
  },

  /**
   * Get language display name
   */
  getLanguageDisplayName: (language: string): string => {
    const names: Record<string, string> = {
      en: 'English',
      es: 'Español',
      pt: 'Português'
    };
    return names[language] || language;
  }
};

export default useTranslation;
