import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import MediaButton from './ui/MediaButton';
import { Square, Volume2, VolumeX } from 'lucide-react';
import { useNewsTicker } from '../hooks/useTextScrolling';

interface RadioPlayerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * RadioPlayer Component
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for audio playback control and display
 *
 * Follows Open/Closed Principle:
 * - Open for extension through props and future cover image logic
 * - Closed for modification of core playbook functionality
 *
 * Features:
 * - Two-state player: playing or stopped (no buffering)
 * - Stop button replaces FFT visualization when playing
 * - Volume control with hover slider
 * - Cover image placeholder ready for future implementation
 * - Intelligent text scrolling with accurate width estimation
 * - Responsive grid layout with proper click handling
 */
const RadioPlayer: React.FC<RadioPlayerProps> = ({
  className = '',
  size = 'large'
}) => {
  const { isPlaying, currentTrack, togglePlay } = useAudio();
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  // Use simple news ticker effect - only when playing
  const { containerRef, textRef } = useNewsTicker({
    text: currentTrack,
    isActive: isPlaying,
    speed: 80 // 80 pixels per second - adjust as needed
  });

  // Get button size based on player size
  const getButtonSize = () => {
    switch (size) {
      case 'small': return 48;
      case 'medium': return 64;
      case 'large': return 80;
      default: return 80;
    }
  };

  const buttonSize = getButtonSize();

  // Toggle mute/unmute functionality
  const toggleMute = () => {
    const audioElements = document.querySelectorAll('audio');

    if (isMuted) {
      // Unmute: restore previous volume
      setVolume(previousVolume);
      setIsMuted(false);
      audioElements.forEach(audio => {
        audio.volume = previousVolume / 100;
      });
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      audioElements.forEach(audio => {
        audio.volume = 0;
      });
    }
  };

  // Update volume control to unmute when slider is moved
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    // Apply volume to audio element
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = newVolume / 100;
    });
  };

  return (
    <div className={`glass-card transition-colors hover:bg-white/5 ${className}`}>
      {/* Layout aligned to cover image height */}
      <div className="flex items-stretch p-6 gap-4">

        {/* Cover Image - Sets the height reference */}
        <div className="flex-shrink-0">
          <div
            className="bg-white rounded-lg border border-white/30 shadow-sm"
            style={{ width: '120px', height: '120px' }}
          >
            {/* Placeholder for future cover image logic */}
          </div>
        </div>

        {/* Volume Control - Aligned to cover image height */}
        <div className="flex items-center justify-start">
          <div className="relative flex flex-col items-center" style={{ height: '120px' }}>
            {/* White vertical track - matches cover image height */}
            <div
              className="w-1 h-full bg-white/30 rounded-full relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const percentage = Math.max(0, Math.min(100, 100 - (clickY / rect.height) * 100));
                const newVolume = Math.round(percentage);
                handleVolumeChange(newVolume);
              }}
            >
              {/* Volume fill */}
              <div
                className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all duration-150"
                style={{ height: `${volume}%` }}
              />

              {/* Draggable handle */}
              <div
                className="absolute w-3 h-3 bg-white rounded-full border border-white/50 cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110"
                style={{
                  bottom: `${volume}%`,
                  left: '50%',
                  transform: 'translate(-50%, 50%)'
                }}
                onMouseDown={(e) => {
                  const track = e.currentTarget.parentElement;
                  if (!track) return;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const rect = track.getBoundingClientRect();
                    const y = moveEvent.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                    const newVolume = Math.round(percentage);
                    handleVolumeChange(newVolume);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>

            {/* Minimalistic speaker icon - replaces volume percentage */}
            <button
              onClick={toggleMute}
              className="mt-1 p-1 hover:bg-white/10 rounded transition-all duration-150"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={14} className="text-white/70 hover:text-white" />
              ) : (
                <Volume2 size={14} className="text-white/70 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Player Controls - Left aligned, height matches cover image */}
        <div className="flex-1 flex flex-col justify-center" style={{ height: '120px' }}>

          {/* Current Track Info with News Ticker Effect */}
          <div
            ref={containerRef}
            className="mb-4 relative  "
            style={{
              width: '100%',
              height: '1.75rem',
              overflow: 'hidden'
            }}
          >
            <div
              ref={textRef}
              className="absolute top-0 left-0 h-full flex items-center text-lg text-white font-medium whitespace-nowrap"
              style={{
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem'
              }}
            >
              {currentTrack}
            </div>
          </div>

          {/* Play/Stop Button - Left aligned with consistent sizing */}
          <div className="flex justify-start">
            {!isPlaying ? (
              <div
                style={{
                  width: buttonSize * 0.6,
                  height: buttonSize * 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MediaButton
                  isPlaying={false}
                  isLoading={false}
                  onClick={togglePlay}
                  size={size}
                />
              </div>
            ) : (
              /* Stop button when playing - same dimensions as play button container */
              <button
                onClick={togglePlay}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 transition-all duration-200 border border-white/30"
                style={{
                  width: buttonSize * 0.6,
                  height: buttonSize * 0.6,
                  borderRadius: '50%'
                }}
                aria-label="Stop"
              >
                <Square
                  size={buttonSize * 0.3}
                  className="text-white fill-white"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
