import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';
import BackgroundVideo from './BackgroundVideo';
import { AudioProvider } from '../contexts/AudioContext';

const PagesLayout = () => {
  return (
    <AudioProvider>
      <div className="min-h-screen w-full overflow-hidden relative">
        <BackgroundVideo />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Layout>
            <Outlet />
          </Layout>
        </div>
      </div>
    </AudioProvider>
  );
};

export default PagesLayout;
