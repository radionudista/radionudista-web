import React, { useState } from 'react';
import CountdownTeaser from '../components/CountdownTeaser';
import TwitchPlayer from '../components/TwitchPlayer';

/**
 * CountdownPage - Standalone page for countdown teaser functionality
 * This component contains the original index page logic with countdown and Twitch player
 */
const CountdownPage = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  
  const launchDate = new Date('2025-08-09T12:00:00-03:00');

  const handleCountdownEnd = () => {
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

export default CountdownPage;
