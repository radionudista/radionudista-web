
import React, { useState } from 'react';
import CountdownTeaser from '../components/CountdownTeaser';
import TwitchPlayer from '../components/TwitchPlayer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const Index = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  
  const launchDate = new Date(env.LAUNCHING_DATE);

  logger.info('Index page loaded', {
    launchDate: launchDate.toISOString(),
    showTwitch,
    environment: env.APP_ENVIRONMENT
  });

  const handleCountdownEnd = () => {
    logger.info('Countdown ended, switching to Twitch player');
    setShowTwitch(true);
  };

  if (showTwitch) {
    return <TwitchPlayer />;
  }

  return (
    <CountdownTeaser 
      targetDate={launchDate} 
      onCountdownEnd={handleCountdownEnd} 
    />
  );
};

export default Index;
