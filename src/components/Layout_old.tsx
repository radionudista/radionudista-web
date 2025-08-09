import React from 'react';
import { Instagram, X } from 'lucide-react';
import Navigation from './Navigation';
import FooterSocialLink from './FooterSocialLink';

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
          <FooterSocialLink />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
