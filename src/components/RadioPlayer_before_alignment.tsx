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
      {/* Mobile Layout - Professional horizontal arrangement */}
      {isMobile ? (
        <div className="flex items-start gap-4 p-4">
          {/* Cover Image Section - Left aligned */}
          <section className="flex-shrink-0" aria-label="Album Cover">
            <div
              className="bg-white border border-white/30 shadow-sm overflow-hidden flex items-center justify-center"
              style={{
                width: '80px',
                height: '80px'
              }}
            >
              {audioContext.coverImageUrl ? (
                <img
                  src={audioContext.coverImageUrl}
                  alt={`Cover artwork for ${audioContext.currentTrack}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/radio_nudista_metatag.png";
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <img
                  src="/images/radio_nudista_metatag.png"
                  alt="Radio Nudista default cover"
                  className="w-full h-full object-cover"
                  onError={(e) => {
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

          {/* Controls Section - Right of cover, precisely top-aligned */}
          <section className="flex-1 flex flex-col min-w-0" aria-label="Playback Controls" style={{ marginTop: '0px' }}>
            {/* Scrolling Text - Perfectly aligned with cover top edge */}
            <div className="mb-5">
              <div
                ref={mobileTicker.containerRef}
                className="relative w-full"
                style={{ 
                  height: '1.25rem', 
                  overflow: 'hidden', 
                  backgroundColor: 'transparent' 
                }}
                role="marquee"
                aria-live="polite"
              >
                <div
                  ref={mobileTicker.textRef}
                  className="absolute inset-y-0 left-0 flex items-center text-white font-medium whitespace-nowrap text-sm leading-none"
                  style={{ paddingLeft: '0rem', paddingRight: '0.5rem' }}
                >
                  {audioContext.currentTrack}
                </div>
              </div>
            </div>

            {/* Play/Pause Button - Left aligned below scrolling text */}
            <div className="flex justify-start">
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
      ) : (
        /* Desktop Layout - Original layout with volume control */
        <div className="flex items-center gap-4 p-6">
          {/* Cover Image Section - Desktop */}
          <section className="flex-shrink-0" aria-label="Album Cover">
            <div
              className="bg-white border border-white/30 shadow-sm overflow-hidden flex items-center justify-center"
              style={{
                width: '120px',
                height: '120px'
              }}
            >
              {audioContext.coverImageUrl ? (
                <img
                  src={audioContext.coverImageUrl}
                  alt={`Cover artwork for ${audioContext.currentTrack}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/radio_nudista_metatag.png";
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <img
                  src="/images/radio_nudista_metatag.png"
                  alt="Radio Nudista default cover"
                  className="w-full h-full object-cover"
                  onError={(e) => {
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

          {/* Volume Control Section - Desktop only */}
          <section className="flex-shrink-0" aria-label="Volume Control">
            <VolumeControl
              volume={audioContext.volume}
              isMuted={audioContext.isMuted}
              onVolumeChange={audioContext.setVolume}
              onToggleMute={audioContext.toggleMute}
              height={120}
            />
          </section>

          {/* Player Controls Section - Desktop */}
          <section 
            className="flex-1 flex flex-col justify-center min-w-0" 
            style={{ height: '120px' }}
            aria-label="Playback Controls"
          >
            {/* Desktop Track Info */}
            <header className="mb-3">
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

            {/* Play/Pause Button - Desktop */}
            <div className="flex justify-start">
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
      )}
    </article>
  );
};

export default RadioPlayer;
