import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import MediaButton from './ui/MediaButton';
import { useNewsTicker } from '../hooks/useTextScrolling';

/**
 * MiniPlayer Component
 *
 * Compact version of the radio player with news ticker text scrolling.
 * Features:
 * - Simple news ticker effect when playing
 * - Text never escapes the glass container limits
 * - Seamless right-to-left scrolling animation
 */
const MiniPlayer = () => {
  const { isPlaying, isLoading, currentTrack, togglePlay } = useAudio();

  // Use simple news ticker effect - only when playing
  const { containerRef, textRef } = useNewsTicker({
    text: currentTrack,
    isActive: isPlaying,
    speed: 60 // 60 pixels per second for MiniPlayer
  });

  // Debug: Log the current track to verify data flow
  console.log('MiniPlayer - currentTrack:', currentTrack);

  return (
    <div 
      className={`flex items-center space-x-3 glass-card px-3 py-2 max-w-xs transition-colors ${!isLoading ? 'cursor-pointer hover:bg-white/10' : 'cursor-wait'}`}
      onClick={!isLoading ? togglePlay : undefined}
    >
      <MediaButton
        isPlaying={isPlaying}
        isLoading={isLoading}
        onClick={togglePlay}
        size="small"
      />
      
      {/* Text container with news ticker scrolling - improved visibility */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 relative bg-white/5 rounded border border-white/10"
        style={{
          height: '1.5rem', // Increased from 1.25rem for better visibility
          overflow: 'hidden',
          minWidth: '100px' // Ensure minimum width for text display
        }}
      >
        <div
          ref={textRef}
          className="absolute top-0 left-0 h-full flex items-center text-white text-sm font-medium whitespace-nowrap"
          style={{
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            lineHeight: '1.5rem' // Match container height
          }}
        >
          {currentTrack || 'RadioNudista - Live Stream'}
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
