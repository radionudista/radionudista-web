import React, { useState, useMemo } from 'react';
import CountdownTeaser from '../components/CountdownTeaser';
import TwitchPlayer from '../components/TwitchPlayer';
import BackgroundVideo from '../components/BackgroundVideo';
import { useSiteActionsPolling } from '../hooks/useSiteActionsPolling';
import { env, isProduction } from '../config/env';
import { logger } from '../utils/logger';

const Index = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Enable site actions polling
  useSiteActionsPolling(true);

  // Memoize the launch date so it doesn't change on every render
  const launchDate = useMemo(() => {
    if (!isProduction() && env.DEV_LAUNCHING_SECONDS > -1) {
      const now = new Date();
      now.setSeconds(now.getSeconds() + env.DEV_LAUNCHING_SECONDS);
      return now;
    }
    return new Date(env.LAUNCHING_DATE);
  }, []); // Empty dependency array means this only runs once

  logger.info('Index page loaded', {
    launchDate: launchDate.toISOString(),
    showTwitch,
    environment: env.APP_ENVIRONMENT,
    devSeconds: env.DEV_LAUNCHING_SECONDS,
  });

  const handleCountdownEnd = () => {
    logger.info('Countdown ended, starting transition to Twitch player');
    setIsTransitioning(true);
    
    // Start showing Twitch player immediately to begin crossfade
    setShowTwitch(true);
    
    // Complete the transition after the fade duration
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000); // Extended to 2 seconds for smoother transition
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Persistent Background Video - never reloads */}
      <BackgroundVideo overlayOpacity={0.5} showOverlay={false} showFallbackGradient={false} />

      {/* Countdown Teaser */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
          showTwitch ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <CountdownTeaser
          targetDate={launchDate}
          onCountdownEnd={handleCountdownEnd}
        />
      </div>

      {/* Twitch Player */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
          showTwitch ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
        }`}
      >
        {(showTwitch || isTransitioning) && <TwitchPlayer />}
      </div>
    </div>
  );
};

export default Index;
