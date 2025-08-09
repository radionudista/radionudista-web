import React from 'react';
import { Instagram, X } from 'lucide-react';
import Navigation from './Navigation';
import FooterSocialLink from './FooterSocialLink';
import { PatreonButton } from './ui/patreon-button';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component - Simplified following SOLID principles
 * Single Responsibility: Only handles overall page layout structure
 * Open/Closed: Extensible through children prop without modification
 * Dependency Inversion: Depends on Navigation abstraction
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Extracted to dedicated component */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-footer fixed bottom-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
          <FooterSocialLink
            url="https://www.instagram.com/radionudista"
            ariaLabel="Follow us on Instagram"
            icon={Instagram}
          />
          <FooterSocialLink
            url="https://twitter.com/radionudista"
            ariaLabel="Follow us on X"
            icon={X}
          />
          <FooterSocialLink
            url="https://linktr.ee/radionudista"
            ariaLabel="Visit our Linktree"
            svgPath="M0.2,33.1h24.2L7.1,16.7l9.5-9.6L33,23.8V0h14.2v23.8L63.6,7.1l9.5,9.6L55.8,33H80v13.5H55.7l17.3,16.7l-9.5,9.4L40,49.1L16.5,72.7L7,63.2l17.3-16.7H0V33.1H0.2z M33.1,65.8h14.2v32H33.1V65.8z"
          />
          <PatreonButton absolute={true} />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
