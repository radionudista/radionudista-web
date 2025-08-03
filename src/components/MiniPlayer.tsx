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
 * - Pause button instead of stop button
 * - Fully transparent text canvas
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
    >
      {/* Play/Pause Button */}
      {!isPlaying ? (
        <MediaButton
          isPlaying={false}
          isLoading={isLoading}
          onClick={togglePlay}
          size="small"
        />
      ) : (
        /* Pause button when playing - minimalistic double bars, 20% bigger */
        <button
          onClick={togglePlay}
          className="flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{
            width: 32, // 20% bigger than standard small size
            height: 32,
          }}
          aria-label="Pause"
        >
          <div className="flex space-x-0.5">
            <div className="w-1.5 bg-white rounded-sm" style={{ height: 12 }} />
            <div className="w-1.5 bg-white rounded-sm" style={{ height: 12 }} />
          </div>
        </button>
      )}

      {/* Text container with news ticker scrolling - fully transparent canvas */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 relative"
        style={{
          height: '1.5rem',
          overflow: 'hidden',
          minWidth: '100px',
          backgroundColor: 'transparent' // Make canvas fully transparent
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
