
import React, { useState } from 'react';
import CountdownTeaser from '../components/CountdownTeaser';
import TwitchPlayer from '../components/TwitchPlayer';
import { env, isProduction } from '../config/env';
import { logger } from '../utils/logger';

const Index = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  
  const getLaunchDate = () => {
    if (!isProduction() && env.DEV_LAUNCHING_SECOUNDS > -1) {
      const now = new Date();
      now.setSeconds(now.getSeconds() + env.DEV_LAUNCHING_SECOUNDS);
      return now;
    }
    return new Date(env.LAUNCHING_DATE);
  };

  const launchDate = getLaunchDate();

  logger.info('Index page loaded', {
    launchDate: launchDate.toISOString(),
    showTwitch,
    environment: env.APP_ENVIRONMENT,
    devSeconds: env.DEV_LAUNCHING_SECOUNDS,
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
