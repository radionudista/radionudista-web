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
 * RadioPlayer Component - Enhanced layout following design standards
 * Single Responsibility: Orchestrates audio player UI components
 * Open/Closed: Extensible through props and composition
 * Dependency Inversion: Depends on abstractions (hooks, context)
 * Design Standards: Consistent spacing, proper alignment, semantic structure
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
    <article className={`glass-card ${className} relative`} role="region" aria-label="Radio Player">
      {/* Mobile Overlay Text - Semantic and accessible */}
      <header className="block md:hidden absolute inset-x-0 top-0 z-10 px-4 py-3">
        <div
          ref={mobileTicker.containerRef}
          className="relative w-full"
          style={{ 
            height: isMobile ? '1.25rem' : '1.75rem', 
            overflow: 'hidden', 
            backgroundColor: 'transparent' 
          }}
          role="marquee"
          aria-live="polite"
        >
          <div
            ref={mobileTicker.textRef}
            className={`absolute inset-y-0 left-0 flex items-center text-white font-medium whitespace-nowrap ${
              isMobile ? 'text-sm' : 'text-lg'
            }`}
            style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
          >
            {audioContext.currentTrack}
          </div>
        </div>
      </header>

      {/* Main Player Layout - Enhanced structure and spacing */}
      <div className={`flex items-center gap-4 ${isMobile ? 'p-4 pt-10' : 'p-6 pt-14 md:pt-6'}`}>
        
        {/* Cover Image Section - Consistent sizing and alignment */}
        <section className="flex-shrink-0" aria-label="Album Cover">
          <div
            className="bg-white border border-white/30 shadow-sm overflow-hidden flex items-center justify-center"
            style={{
              width: isMobile ? '80px' : '120px',
              height: isMobile ? '80px' : '120px'
            }}
          >
            {audioContext.coverImageUrl ? (
              <img
                src={audioContext.coverImageUrl}
                alt={`Cover artwork for ${audioContext.currentTrack}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // On error, fallback to default radio image
                  e.currentTarget.src = "/images/radio_nudista_metatag.png";
                  e.currentTarget.onerror = null; // Prevent infinite loop
                }}
              />
            ) : (
              <img
                src="/images/radio_nudista_metatag.png"
                alt="Radio Nudista default cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If default image fails, show minimal placeholder
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                        <div class="text-white/40 text-xs text-center px-2 leading-tight">
                          Radio<br />Nudista
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            )}
          </div>
        </section>

        {/* Volume Control Section - Proper spacing */}
        <section className="flex-shrink-0" aria-label="Volume Control">
          <VolumeControl
            volume={audioContext.volume}
            isMuted={audioContext.isMuted}
            onVolumeChange={audioContext.setVolume}
            onToggleMute={audioContext.toggleMute}
            height={isMobile ? 80 : 120}
          />
        </section>

        {/* Player Controls Section - Enhanced layout and spacing */}
        <section 
          className="flex-1 flex flex-col justify-center min-w-0" 
          style={{ height: isMobile ? '80px' : '120px' }}
          aria-label="Playback Controls"
        >
          {/* Desktop Track Info - Improved typography */}
          <header className="hidden md:block mb-3">
            <div
              ref={desktopTicker.containerRef}
              className="relative w-full"
              style={{ 
                height: '1.75rem', 
                overflow: 'hidden', 
                backgroundColor: 'transparent' 
              }}
              role="marquee"
              aria-live="polite"
            >
              <div
                ref={desktopTicker.textRef}
                className="absolute inset-y-0 left-0 flex items-center text-lg text-white font-medium whitespace-nowrap leading-relaxed"
                style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
              >
                {audioContext.currentTrack}
              </div>
            </div>
          </header>

          {/* Play/Pause Button - Consistent alignment */}
          <div className="flex justify-center md:justify-start">
            <PlayPauseButton
              isPlaying={audioContext.isPlaying}
              isLoading={audioContext.isLoading}
              onTogglePlay={audioContext.togglePlay}
              size={size}
              isMobile={isMobile}
            />
          </div>
        </section>
      </div>
    </article>
  );
};
export default RadioPlayer;
