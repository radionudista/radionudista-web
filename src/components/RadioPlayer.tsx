import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useNewsTicker } from '../hooks/useTextScrolling';
import { useResponsive } from '../hooks/useResponsive';
import { VolumeControl } from './ui/VolumeControl';
import { PlayPauseButton } from './ui/PlayPauseButton';

interface RadioPlayerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * RadioPlayer Component - Simplified following SOLID principles
 * Single Responsibility: Orchestrates audio player UI components
 * Open/Closed: Extensible through props and composition
 * Dependency Inversion: Depends on abstractions (hooks, context)
 */
const RadioPlayer: React.FC<RadioPlayerProps> = ({
  className = '',
  size = 'large'
}) => {
  const audioContext = useAudio();
  const { isMobile } = useResponsive();

  // Separate ticker instances for mobile and desktop
  const mobileTicker = useNewsTicker({
    text: audioContext.currentTrack,
    isActive: audioContext.isPlaying,
    speed: 80
  });

  const desktopTicker = useNewsTicker({
    text: audioContext.currentTrack,
    isActive: audioContext.isPlaying,
    speed: 80
  });

  return (
    <div className={`glass-card transition-colors hover:bg-white/5 ${className} relative`}>
      {/* Mobile Overlay Text - Reduced size */}
      <div className="block md:hidden absolute top-0 left-0 right-0 z-10 px-3 py-2 pb-1">
        <div
          ref={mobileTicker.containerRef}
          className="relative w-full"
          style={{ height: isMobile ? '1.25rem' : '1.75rem', overflow: 'hidden', backgroundColor: 'transparent' }}
        >
          <div
            ref={mobileTicker.textRef}
            className={`absolute top-0 left-0 h-full flex items-center text-white font-medium whitespace-nowrap ${
              isMobile ? 'text-sm' : 'text-lg'
            }`}
            style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
          >
            {audioContext.currentTrack}
          </div>
        </div>
      </div>

      {/* Main Player Layout - Responsive sizing */}
      <div className={`flex items-stretch gap-3 ${isMobile ? 'p-4 pt-8' : 'p-6 pt-12 md:pt-6'}`}>
        {/* Cover Image - Responsive size */}
        <div className="flex-shrink-0">
          <div
            className="bg-white rounded-lg border border-white/30 shadow-sm overflow-hidden flex items-center justify-center"
            style={{
              width: isMobile ? '80px' : '120px',
              height: isMobile ? '80px' : '120px'
            }}
          >
            {audioContext.coverImageUrl ? (
              <img
                src={audioContext.coverImageUrl}
                alt={`Cover for ${audioContext.currentTrack}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <div className={`text-white/40 text-center px-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  Radio<br />Nudista
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Volume Control - Responsive height */}
        <VolumeControl
          volume={audioContext.volume}
          isMuted={audioContext.isMuted}
          onVolumeChange={audioContext.setVolume}
          onToggleMute={audioContext.toggleMute}
          height={isMobile ? 80 : 120}
        />

        {/* Player Controls - Responsive height */}
        <div className="flex-1 flex flex-col justify-center" style={{ height: isMobile ? '80px' : '120px' }}>
          {/* Desktop Track Info */}
          <div className="hidden md:block mb-4">
            <div
              ref={desktopTicker.containerRef}
              className="relative"
              style={{ width: '100%', height: '1.75rem', overflow: 'hidden', backgroundColor: 'transparent' }}
            >
              <div
                ref={desktopTicker.textRef}
                className="absolute top-0 left-0 h-full flex items-center text-lg text-white font-medium whitespace-nowrap"
                style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
              >
                {audioContext.currentTrack}
              </div>
            </div>
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center md:justify-start">
            <PlayPauseButton
              isPlaying={audioContext.isPlaying}
              isLoading={audioContext.isLoading}
              onTogglePlay={audioContext.togglePlay}
              size={size}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
