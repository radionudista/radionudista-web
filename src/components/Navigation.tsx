import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import MiniPlayer from './MiniPlayer';
import { PatreonButton } from './ui/patreon-button';
import { useLocation } from 'react-router-dom';
import contentIndex from '../../public/content.json';
import { useTranslation } from '../hooks/useTranslation';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
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
    { id: 'home', label: 'radio', path: '/' },
    { id: 'about', label: 'nosotrxs', path: '/about' },
    { id: 'contact', label: 'Contact', path: '/contact' }
  ],
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { i18n } = useTranslation ? useTranslation() : { i18n: { language: 'es' } };

  // Memoize dynamic nav items for current language
  const dynamicNavItems = useMemo(() => {
    const lang = i18n.language || 'es';
    if (!contentIndex || typeof contentIndex !== 'object') return [];
    // Collect all indexed content for this language with menu and public
    const items = Object.entries(contentIndex)
      .map(([id, langs]) => {
        const entry = langs[lang];
        if (!entry || !entry.menu || !entry.public) return null;
        return {
          id: `${id}-${lang}`,
          label: entry.menu,
          path: `/${lang}/${entry.slug}`,
          menu_position: typeof entry.menu_position === 'number' ? entry.menu_position : (entry.menu_position ? Number(entry.menu_position) : 0),
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a.menu_position ?? 0) - (b.menu_position ?? 0));
    return items;
  }, [i18n.language]);

  // Merge static and dynamic nav items (dynamic after static)
  const mergedNavItems = useMemo(() => {
    return [...navItems, ...dynamicNavItems];
  }, [navItems, dynamicNavItems]);

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

          {/* Mini Player - Desktop only, hidden on home page */}
          {location.pathname !== '/' && (
            <div className="hidden md:block">
              <MiniPlayer />
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {mergedNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={{ fontFamily: "'AkzidenzGrotesk', sans-serif" }}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mini Player Mobile - Scaled down, hidden on home page */}
            {location.pathname !== '/' && (
              <div className="scale-75 origin-center">
                <MiniPlayer />
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={openMobileMenu}
              className="nav-link p-2"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
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
              {mergedNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleMobileNavClick}
                  className={`nav-link-mobile text-center py-4 px-6 text-xl block w-full transition-all duration-200 ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  style={{ fontFamily: "'AkzidenzGrotesk', sans-serif" }}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mini Player in Mobile Menu - Hidden on home page */}
              {location.pathname !== '/' && (
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
