import { useEffect, useState } from "react";
import i18n from "@/config/i18n";
import { env } from "@/config/env";
import { useDebug } from "@/contexts/DebugContext";

/**
 * Hook to provide detected and selected language for debugging purposes.
 * Automatically registers language info in the DebugContext.
 */
import { LanguageUtils } from './useTranslation';

export function useLanguageDebugInfo() {
  const [detected, setDetected] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(i18n.language);
  const { setDebugInfo } = useDebug();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || navigator.languages?.[0] || '';
    setDetected(browserLang);
    // Map detected language to supported
    const mapped = LanguageUtils.mapToSupportedLanguage(
      browserLang,
      env.SUPPORTED_LANGUAGES,
      env.DEFAULT_LANGUAGE
    );
    setSelected(mapped);
    setDebugInfo('LanguageDebugInfo', {
      detected: browserLang,
      mapped,
      supportedLanguages: env.SUPPORTED_LANGUAGES,
      defaultLanguage: env.DEFAULT_LANGUAGE
    });
  }, [setDebugInfo]);

  return {
    detectedLanguage: detected,
    selectedLanguage: selected,
    supportedLanguages: env.SUPPORTED_LANGUAGES,
    defaultLanguage: env.DEFAULT_LANGUAGE,
  };
}