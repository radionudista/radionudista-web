import { useEffect, useState } from "react";
import i18n from "@/config/i18n";
import { env } from "@/config/env";
import { useDebug } from "@/contexts/DebugContext";

/**
 * Hook to provide detected and selected language for debugging purposes.
 * Automatically registers language info in the DebugContext.
 */
export function useLanguageDebugInfo() {
  const [detected, setDetected] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(i18n.language);
  const { setDebugInfo } = useDebug();

  useEffect(() => {
    // Attempt to detect the language using i18next's languageDetector or fallback to navigator.language
    const detectedLang =
      (i18n.services?.languageDetector as any)?.detect?.() ||
      (i18n as any).services?.languageDetector?.cacheUserLanguage?.() ||
      navigator.language ||
      null;
    setDetected(detectedLang);
    setSelected(i18n.language);

    // Register language info in DebugContext
    setDebugInfo("Language", {
      detectedLanguage: detectedLang,
      selectedLanguage: i18n.language,
      supportedLanguages: env.SUPPORTED_LANGUAGES,
      defaultLanguage: env.DEFAULT_LANGUAGE,
    });

    // Listen for language changes and update DebugContext accordingly
    const handler = (lng: string) => {
      setSelected(lng);
      setDebugInfo("Language", {
        detectedLanguage: detectedLang,
        selectedLanguage: lng,
        supportedLanguages: env.SUPPORTED_LANGUAGES,
        defaultLanguage: env.DEFAULT_LANGUAGE,
      });
    };
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDebugInfo]);

  return {
    detectedLanguage: detected,
    selectedLanguage: selected,
    supportedLanguages: env.SUPPORTED_LANGUAGES,
    defaultLanguage: env.DEFAULT_LANGUAGE,
  };
}