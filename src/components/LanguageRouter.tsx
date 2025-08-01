import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, LanguageUtils } from '../hooks/useTranslation';
import { env } from '../config/env';
import i18n from '../config/i18n';

// Import pages
import PagesLayout from '../components/PagesLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFound from '../pages/NotFound';

/**
 * Language Router Component
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for language-based routing
 *
 * Follows Open/Closed Principle:
 * - Open for extension through new routes
 * - Closed for modification of core routing logic
 *
 * Features:
 * - Automatic browser language detection
 * - Subdirectory-based language routing (/es, /pt)
 * - Fallback to default language
 * - SEO-friendly URL structure
 */

const LanguageDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Wait for i18n to be ready
  useEffect(() => {
    const checkI18nReady = () => {
      if (i18n.isInitialized && typeof i18n.changeLanguage === 'function') {
        setIsI18nReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkI18nReady, 100);
      }
    };

    checkI18nReady();
  }, []);

  useEffect(() => {
    if (!isI18nReady) return;

    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    // Check if the first segment is a language code
    const isLanguageInPath = env.SUPPORTED_LANGUAGES.includes(firstSegment);

    if (isLanguageInPath) {
      // Language is already in the path, set it in i18n
      if (i18n.language !== firstSegment) {
        i18n.changeLanguage(firstSegment);
      }
    } else {
      // No language in path, detect and redirect
      const browserLang = LanguageUtils.getBrowserPreferredLanguage();
      const targetLang = browserLang !== env.DEFAULT_LANGUAGE ? browserLang : env.DEFAULT_LANGUAGE;

      if (targetLang !== env.DEFAULT_LANGUAGE) {
        // Redirect to language-specific path
        navigate(`/${targetLang}${currentPath}`, { replace: true });
      } else {
        // Set default language without redirect
        i18n.changeLanguage(env.DEFAULT_LANGUAGE);
      }
    }
  }, [location.pathname, navigate, isI18nReady]);

  // Show loading state while i18n initializes
  if (!isI18nReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes for default language (no prefix) */}
      <Route path="/" element={<PagesLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Routes for non-default languages with language prefix */}
      {env.SUPPORTED_LANGUAGES
        .filter(lang => lang !== env.DEFAULT_LANGUAGE)
        .map(lang => (
          <Route key={lang} path={`/${lang}`} element={<PagesLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        ))}

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const LanguageRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageDetector>
        <AppRoutes />
      </LanguageDetector>
    </BrowserRouter>
  );
};

export default LanguageRouter;
