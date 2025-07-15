
import React, { useState } from 'react';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import AboutPage from '../components/AboutPage';
import ContactPage from '../components/ContactPage';
import BackgroundVideo from '../components/BackgroundVideo';
import { AudioProvider } from '../contexts/AudioContext';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AudioProvider>
      <div className="min-h-screen w-full overflow-hidden relative">
        <BackgroundVideo />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderPage()}
          </Layout>
        </div>
      </div>
    </AudioProvider>
  );
};

export default Index;
