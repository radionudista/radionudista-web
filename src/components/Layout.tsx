
import React, { useState } from 'react';
import { Instagram, X, MessageCircle, Menu, PenOff } from 'lucide-react';
import MiniPlayer from './MiniPlayer';
import Logo from './Logo';
import Switch from './Switch/Switch';
import { useIdioma } from '@/contexts/IdiomaContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout = ({ children, currentPage, setCurrentPage }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {lang, setLang} = useIdioma()

  const navItems = [
    { id: 'home', label: 'radio', ptlabel: 'rádio' },
    { id: 'about', label: 'nosotrxs', ptlabel: 'sobre' },
    { id: 'contact', label: 'programación', ptlabel:'programação'}
  ];

  const handleMobileNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass-navbar fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Logo size="medium" />
          
          {/* Mini Player - Only show when not on home page */}
          {currentPage !== 'home' && (
            <div className="hidden md:block">
              <MiniPlayer />
            </div>
          )}
          
          
          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                {lang == 'es' ? item.label : item.ptlabel}
              </button>
            ))}
            <Switch value={lang} setValue={setLang} />

          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mini Player Mobile - Only show when not on home page */}
            {currentPage !== 'home' && (
              <div className="scale-75 origin-center">
                <MiniPlayer />
              </div>
            )}
            
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="nav-link p-2"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sliding Panel */}
          <div className={`absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-black/40 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Close Button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <div className="px-8 py-4 space-y-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavClick(item.id)}
                  className={`block w-full text-left py-4 px-6 rounded-md text-lg font-medium transition-all duration-200 ${
                    currentPage === item.id 
                      ? 'text-blue-400 bg-blue-400/10' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mini Player in Mobile Menu - Only show when not on home page */}
            {currentPage !== 'home' && (
              <div className="px-8 py-4 mt-12">
                <MiniPlayer />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <main className="flex-1 pt-20 pb-20">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="glass-footer fixed bottom-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
          <a target="_blank" href="https://www.instagram.com/radionudista" className="social-icon">
            <Instagram className="w-6 h-6" />
          </a>
          <a target="_blank" href="https://twitter.com/radionudista"  className="social-icon">
            <PenOff className="w-6 h-6" />
          </a>
          <a href="https://linktr.ee/radionudista" target="_blank" className="social-icon">
            <div className="w-6 h-6">
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 80 97.7"
                width="100%"
                height="100%"
                xmlSpace="preserve"
              >
                <path d="M0.2,33.1h24.2L7.1,16.7l9.5-9.6L33,23.8V0h14.2v23.8L63.6,7.1l9.5,9.6L55.8,33H80v13.5H55.7l17.3,16.7l-9.5,9.4L40,49.1
                  L16.5,72.7L7,63.2l17.3-16.7H0V33.1H0.2z M33.1,65.8h14.2v32H33.1V65.8z"
                  fill="rgba(255, 255, 255, 0.7)"
                />
              </svg>
            </div>
          </a>
          <a href="https://www.patreon.com/profile/creators?u=170209343" target="_blank" className="social-icon glass-card flex justify-center items-center"
            style={{
              position:'absolute',
              right:0,
              margin:'0 3rem'
            }}
          >
            <div className="w-6 h-6 mr-3">
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1080 1080"
                width="100%"
                height="100%"
                xmlSpace="preserve"
              >
                <path
                  fill="rgba(255, 255, 255, 0.7)"
                  d="M1033.05,324.45c-0.19-137.9-107.59-250.92-233.6-291.7
                    c-156.48-50.64-362.86-43.3-512.28,27.2C106.07,145.41,49.18,332.61,47.06,519.31
                    c-1.74,153.5,13.58,557.79,241.62,560.67c169.44,2.15,194.67-216.18,273.07-321.33
                    c55.78-74.81,127.6-95.94,216.01-117.82C929.71,603.22,1033.27,483.3,1033.05,324.45z"
                />
              </svg>
            </div>
            {lang == 'es' ? <p>apóyanos</p> : <p>ajude a gente</p>}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
