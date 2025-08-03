import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import MediaButton from './ui/MediaButton';
import { Volume2, VolumeX } from 'lucide-react';
import { useNewsTicker } from '../hooks/useTextScrolling';

interface RadioPlayerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Custom hook to track screen width for responsive behavior
 */
const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenWidth;
};

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
 * - Pause button replaces FFT visualization when playing
 * - Volume control with hover slider
 * - Dynamic cover image display from song cover API
 * - Intelligent text scrolling with accurate width estimation
 * - Responsive grid layout with proper click handling
 * - Mobile overlay scrolling text that covers all player elements
 * - Fixed centering for screens narrower than 393px
 */
const RadioPlayer: React.FC<RadioPlayerProps> = ({
  className = '',
  size = 'large'
}) => {
  const { isPlaying, currentTrack, coverImageUrl, togglePlay, volume, isMuted, setVolume, toggleMute } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const screenWidth = useScreenWidth();

  // Separate news ticker effects for mobile and desktop
  const { containerRef: mobileContainerRef, textRef: mobileTextRef } = useNewsTicker({
    text: currentTrack,
    isActive: isPlaying,
    speed: 80
  });

  const { containerRef: desktopContainerRef, textRef: desktopTextRef } = useNewsTicker({
    text: currentTrack,
    isActive: isPlaying,
    speed: 80
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
  const isMobile = screenWidth < 768;

  // Update volume control to use AudioContext
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Unified volume calculation for mouse and touch events
  const calculateVolumeFromEvent = (clientY: number, trackElement: HTMLElement): number => {
    const rect = trackElement.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    return Math.round(percentage);
  };

  // Handle volume track click/tap
  const handleVolumeTrackInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const track = e.currentTarget as HTMLElement;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newVolume = calculateVolumeFromEvent(clientY, track);
    handleVolumeChange(newVolume);
  };

  // Enhanced drag handling with unified mouse/touch support
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const track = (e.currentTarget as HTMLElement).parentElement;
    if (!track) return;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newVolume = calculateVolumeFromEvent(clientY, track);
      handleVolumeChange(newVolume);
    };

    const handleEnd = () => {
      setIsDragging(false);
      // Remove both mouse and touch listeners
      document.removeEventListener('mousemove', handleMove as EventListener);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd);
    };

    // Add both mouse and touch listeners
    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  return (
    <div className={`glass-card transition-colors hover:bg-white/5 ${className} relative`}>
      {/* Mobile/Vertical Overlay Text - Positioned absolutely on top */}
      <div className="block md:hidden absolute top-0 left-0 right-0 z-10 p-4 pb-2">
        <div
          ref={mobileContainerRef}
          className="relative w-full"
          style={{
            height: '1.75rem',
            overflow: 'hidden',
            backgroundColor: 'transparent'
          }}
        >
          <div
            ref={mobileTextRef}
            className="absolute top-0 left-0 h-full flex items-center text-lg text-white font-medium whitespace-nowrap"
            style={{
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem'
            }}
          >
            {currentTrack}
          </div>
        </div>
      </div>

      {/* Layout aligned to cover image height */}
      <div className="flex items-stretch p-6 gap-4 md:pt-6 pt-12">

        {/* Cover Image - Sets the height reference */}
        <div className="flex-shrink-0">
          <div
            className="bg-white rounded-lg border border-white/30 shadow-sm overflow-hidden flex items-center justify-center"
            style={{ width: '120px', height: '120px' }}
          >
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt={`Cover for ${currentTrack}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image on error and show placeholder
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <div className="text-white/40 text-xs text-center px-2">
                  Radio<br />Nudista
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Volume Control - Aligned to cover image height */}
        <div className="flex items-center justify-start">
          <div className="relative flex flex-col items-center" style={{ height: '120px' }}>
            {/* White vertical track - matches cover image height */}
            <div
              className={`w-1 h-full bg-white/30 rounded-full relative cursor-pointer touch-none select-none ${
                isDragging ? 'bg-white/40' : ''
              }`}
              onClick={handleVolumeTrackInteraction}
              onTouchStart={handleVolumeTrackInteraction}
            >
              {/* Volume fill */}
              <div
                className={`absolute bottom-0 left-0 w-full bg-white rounded-full transition-all ${
                  isDragging ? 'duration-0' : 'duration-150'
                }`}
                style={{ height: `${volume}%` }}
              />

              {/* Draggable handle */}
              <div
                className={`absolute w-4 h-4 bg-white rounded-full border-2 border-white/50 cursor-grab active:cursor-grabbing transition-all touch-none select-none ${
                  isDragging ? 'scale-125 shadow-lg duration-0' : 'duration-150 hover:scale-110'
                }`}
                style={{
                  bottom: `${volume}%`,
                  left: '50%',
                  transform: 'translate(-50%, 50%)',
                  boxShadow: isDragging ? '0 4px 12px rgba(255, 255, 255, 0.3)' : undefined
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              />
            </div>

            {/* Minimalistic speaker icon - replaces volume percentage */}
            <button
              onClick={toggleMute}
              className="mt-2 p-2 hover:bg-white/10 rounded-full transition-all duration-150 touch-manipulation"
              aria-label={isMuted ? "Unmute" : "Mute"}
              style={{ minHeight: '32px', minWidth: '32px' }}
            >
              {isMuted ? (
                <VolumeX size={14} className="text-white/70 hover:text-white" />
              ) : (
                <Volume2 size={14} className="text-white/70 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Player Controls - Responsive alignment, height matches cover image */}
        <div className="flex-1 flex flex-col justify-center" style={{ height: '120px' }}>

          {/* Desktop Track Info with News Ticker Effect - Hidden on mobile */}
          <div className="hidden md:block mb-4">
            <div
              ref={desktopContainerRef}
              className="relative"
              style={{
                width: '100%',
                height: '1.75rem',
                overflow: 'hidden',
                backgroundColor: 'transparent'
              }}
            >
              <div
                ref={desktopTextRef}
                className="absolute top-0 left-0 h-full flex items-center text-lg text-white font-medium whitespace-nowrap"
                style={{
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem'
                }}
              >
                {currentTrack}
              </div>
            </div>
          </div>

          {/* Play/Pause Button - Fixed responsive alignment and sizing */}
          <div className="flex justify-center md:justify-start">
            {!isPlaying ? (
              <div
                className="flex items-center justify-center md:justify-start"
                style={{
                  width: isMobile ? buttonSize : buttonSize * 0.6,
                  height: isMobile ? buttonSize : buttonSize * 0.6
                }}
              >
                <MediaButton
                  isPlaying={false}
                  isLoading={false}
                  onClick={togglePlay}
                  size={isMobile ? 'large' : size}
                />
              </div>
            ) : (
              /* Pause button when playing - properly centered on mobile */
              <div
                className="flex items-center justify-center md:justify-start"
                style={{
                  width: isMobile ? buttonSize : buttonSize * 0.6,
                  height: isMobile ? buttonSize : buttonSize * 0.6
                }}
              >
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center transition-all duration-200 hover:scale-105 touch-manipulation"
                  style={{
                    minHeight: '44px',
                    minWidth: '44px'
                  }}
                  aria-label="Pause"
                >
                  <div className="flex space-x-1">
                    <div
                      className="bg-white rounded-sm"
                      style={{
                        width: isMobile ? '3px' : '2px',
                        height: isMobile ? buttonSize * 0.4 : buttonSize * 0.3
                      }}
                    />
                    <div
                      className="bg-white rounded-sm"
                      style={{
                        width: isMobile ? '3px' : '2px',
                        height: isMobile ? buttonSize * 0.4 : buttonSize * 0.3
                      }}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
