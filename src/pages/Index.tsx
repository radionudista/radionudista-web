
import React, { useState } from 'react';
import CountdownTeaser from '../components/CountdownTeaser';
import TwitchPlayer from '../components/TwitchPlayer';

const Index = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  
  const launchDate = new Date('2025-07-06T22:30:00.000-05:00');

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

export default Index;
