import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { env } from '../config/env';

/**
 * I18n Configuration with Dynamic Language Loading
 * 
 * Follows Single Responsibility Principle:
 * - Only responsible for i18n initialization and configuration
 * 
 * Follows Open/Closed Principle:
 * - Open for extension by adding new language files
 * - Closed for modification of core loading logic
 * 
 * Follows Dependency Inversion Principle:
 * - Depends on environment abstractions, not concrete values
 */

// Dynamic import of translation files based on supported languages
const loadTranslations = async () => {
  const resources: Record<string, { translation: any }> = {};
  
  for (const language of env.SUPPORTED_LANGUAGES) {
    try {
      // Dynamic import based on language code
      const translation = await import(`../lang/${language}.json`);
      resources[language] = { translation: translation.default };
    } catch (error) {
      console.warn(`Failed to load translation for language: ${language}`, error);
    }
  }
  
  return resources;
};

// Language detection configuration
const detection = {
  order: ['path', 'localStorage', 'navigator', 'htmlTag'],
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true
};

// Initialize i18n with dynamic translations
const initializeI18n = async () => {
  const resources = await loadTranslations();
  
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: env.DEFAULT_LANGUAGE,
      supportedLngs: env.SUPPORTED_LANGUAGES,
      debug: env.APP_DEBUG,
      
      detection,
      
      interpolation: {
        escapeValue: false // React already does escaping
      },
      
      react: {
        useSuspense: false // Disable suspense for better compatibility
      }
    });
};

// Initialize on import
initializeI18n();

export default i18n;
