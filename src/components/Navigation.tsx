import React, { useState, useMemo } from 'react';
import contentIndex from '../contentIndex.json';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

import MiniPlayer from './MiniPlayer';
import { PatreonButton } from './ui/patreon-button';
import { env } from '../config/env';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
}

// Helper to get current language from path (e.g. /es/slug)
function getCurrentLang(pathname: string, supportedLangs: string[]): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && supportedLangs.includes(parts[0])) return parts[0];
  return supportedLangs[0]; // fallback
}

interface NavigationProps {
  navItems?: NavigationItem[];
  className?: string;
}

/**
 * Navigation Component - Following SOLID principles
 * Single Responsibility: Handles navigation UI and mobile menu state
 * Open/Closed: Extensible through navItems prop without modification
 * Liskov Substitution: Can be replaced by any component implementing NavigationProps
 * Interface Segregation: Clean interface with only necessary props
 * Dependency Inversion: Depends on abstractions (useLocation, Link)
 */
const Navigation: React.FC<NavigationProps> = ({
  navItems = [
    { id: 'home', label: 'radio' , path: '/' }
  ],
  className = ''
}) => {
    const { t } = useTranslation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  // --- Dynamic nav items from indexed content (contentIndex.json) ---
  const supportedLangs = env.SUPPORTED_LANGUAGES;
  const currentLang = getCurrentLang(location.pathname, supportedLangs);

  // Helper to prefix nav paths with current language
  const getNavPath = (item: NavigationItem) => {
    if (item.id === 'home') {
      return currentLang ? `/${currentLang}` : '/';
    }
    if (currentLang) {
      return `/${currentLang}/${item.path}`;
    }
    return `/${item.path}`;
  };

  // Helper: is current path a home route for any supported language?
  const isHomeRoute = React.useMemo(() => {
    // Accepts /, /es, /pt, etc. (with or without trailing slash)
    const path = location.pathname.replace(/\/+$/, ''); // remove trailing slash
    if (path === '') return true; // root
    return supportedLangs.some(lang => path === `/${lang}`);
  }, [location.pathname, supportedLangs]);

  // No fetch needed; contentIndex.json is imported as a module

  const dynamicNavItems: NavigationItem[] = useMemo(() => {
    // Collect all public, menu'd items for current language
    const items: NavigationItem[] = [];
    Object.entries(contentIndex).forEach(([id, langs]: [string, any]) => {
      const entry = langs[currentLang];
      if (entry && entry.menu && (entry.public === true || entry.public === 'true')) {
        items.push({
          id: `${id}-${currentLang}`,
          label: entry.menu,
          path: entry.slug // Only the slug, not a full path
        });
      }
    });
    // Sort by menu_position if present
    return items.sort((a, b) => {
      const idA = a.id?.split('-')[0];
      const idB = b.id?.split('-')[0];
      const posA = contentIndex?.[idA]?.[currentLang]?.menu_position ?? 9999;
      const posB = contentIndex?.[idB]?.[currentLang]?.menu_position ?? 9999;
      return posA - posB;
    });
  }, [currentLang]);

  // Translate static navItems labels using full key path (e.g., navigation.radio)
  const translatedNavItems = navItems.map(item => ({
    ...item,
    label: t(`navigation.${item.label}`)
  }));
  // Merge static and dynamic nav items (dynamic after static)
  const mergedNavItems = [...translatedNavItems, ...dynamicNavItems];

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`glass-navbar fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Logo size="medium" />

          {/* Mini Player - Desktop only, hidden on any home route (/{lang}) */}
          {!isHomeRoute && (
            <div className="hidden md:block">
              <MiniPlayer />
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {mergedNavItems.map((item) => {
              const navPath = getNavPath(item);
              const isActive = location.pathname === navPath;
              return (
                <Link
                  key={item.id}
                  to={navPath}
                  className={`nav-link px-4 py-2 ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ fontFamily: "'AkzidenzGrotesk', sans-serif" }}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* PatreonButton removed from desktop nav */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden nav-link p-2"
            onClick={openMobileMenu}
            aria-label="Open navigation menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden" role="dialog" aria-modal="true">
          {/* Mobile Menu Panel - Solid black background covering screen except footer area */}
          <div
            className={`absolute top-0 left-0 right-0 bottom-16 bg-black transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            {/* Close Button - Positioned at top right */}
            <header className="flex justify-end p-6">
              <button
                onClick={closeMobileMenu}
                className="nav-link p-2"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </header>

            {/* Mobile Navigation Links - Positioned at top */}
            <div className="px-8 py-8 space-y-6">
              {mergedNavItems.map((item) => {
                const navPath = getNavPath(item);
                const isActive = location.pathname === navPath;
                return (
                  <Link
                    key={item.id}
                    to={navPath}
                    onClick={handleMobileNavClick}
                    className={`nav-link-mobile text-center py-4 px-6 text-xl block w-full transition-all duration-200 ${
                      isActive ? 'active' : ''
                    }`}
                    style={{ fontFamily: "'AkzidenzGrotesk', sans-serif" }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mini Player in Mobile Menu - Hidden on any home route (/{lang}) */}
              {!isHomeRoute && (
                <div className="mt-8 flex justify-center">
                  <MiniPlayer />
                </div>
              )}
            </div>

            {/* PatreonButton positioned at bottom of mobile menu panel */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <PatreonButton absolute={false} className="relative" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
