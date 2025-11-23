import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { toast } from '../hooks/use-toast';
import MediaButton from './ui/MediaButton';

interface ProgramPlayerProps {
  programId: string;
  audioSource: string;
  title: string;
  isCompact?: boolean;
}

interface ProgramPlayerState {
  isValidUrl: boolean;
  directUrl?: string;
  error?: string;
  errorCode?: string;
  isProcessing: boolean;
  audioValidated?: boolean;
}

/**
 * ProgramPlayer Component
 * 
 * Individual audio player for program content that integrates with the unified AudioContext.
 * Features:
 * - Play/pause functionality for individual programs
 * - Local audio file support
 * - Loading and error states
 * - Visual feedback for active/inactive states
 * - Consistent styling with existing player components
 * 
 * Accessibility Features:
 * - ARIA labels and descriptions for all interactive elements
 * - Keyboard navigation support (Space/Enter to play/pause, Escape to stop)
 * - Screen reader announcements for state changes
 * - High contrast mode compatibility
 * - Focus management and visual focus indicators
 * - Semantic HTML structure with proper roles
 * - Live regions for dynamic content updates
 */
const ProgramPlayer: React.FC<ProgramPlayerProps> = ({
  programId,
  audioSource,
  title,
  isCompact = false
}) => {
  const audioContext = useAudio();
  const [urlState, setUrlState] = useState<ProgramPlayerState>({
    isValidUrl: false,
    isProcessing: true
  });

  // Refs for accessibility
  const containerRef = useRef<HTMLDivElement>(null);
  const statusAnnouncementRef = useRef<HTMLDivElement>(null);
  const previousPlayingState = useRef<boolean>(false);

  // Check if this program is currently active
  const isActive = audioContext.currentSource === 'program' && 
                   audioContext.currentProgramId === programId;
  
  // Determine if this program is playing
  const isPlaying = isActive && audioContext.isPlaying;
  
  // Determine if this program is loading
  const isLoading = isActive && audioContext.isLoading;

  // Process audio source - simplified for local files served from same domain
  useEffect(() => {
    if (!audioSource) {
      setUrlState({
        isValidUrl: false,
        error: 'No audio source provided for this program.',
        errorCode: 'EMPTY_URL',
        isProcessing: false
      });
      return;
    }

    setUrlState(prev => ({ ...prev, isProcessing: true }));

    // Handle local MP3 files and direct URLs
    let finalUrl = audioSource;
    
    // If it's just a filename (like "checkpoint.mp3"), prepend the audios path
    if (audioSource.endsWith('.mp3') && !audioSource.includes('/')) {
      finalUrl = `/audios/${audioSource}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`Setting up audio for ${title}:`, finalUrl);
    }
    
    setUrlState({
      isValidUrl: true,
      directUrl: finalUrl,
      isProcessing: false,
      audioValidated: false
    });
  }, [audioSource, title]);

  // Handle play/pause button click
  const handlePlayPause = async () => {
    if (!urlState.isValidUrl || !urlState.directUrl) {
      const errorMsg = urlState.error || 'Audio file not available';
      toast({
        variant: "destructive",
        title: "Cannot Play Audio",
        description: errorMsg,
      });
      return;
    }

    // Clear any previous errors when user tries to play
    audioContext.clearError();

    if (isActive) {
      if (isPlaying) {
        // If this program is playing, stop it
        audioContext.stopProgram();
      } else {
        // If this program is paused, resume it
        audioContext.playProgram(programId, urlState.directUrl, title);
      }
    } else {
      // If this program is not active, start playing it
      audioContext.playProgram(programId, urlState.directUrl, title);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Space or Enter key to play/pause
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handlePlayPause();
    }
    // Escape key to stop program and return to radio
    else if (event.key === 'Escape' && isActive) {
      event.preventDefault();
      audioContext.stopProgram();
    }
  };

  // Screen reader announcements for state changes
  useEffect(() => {
    if (previousPlayingState.current !== isPlaying && statusAnnouncementRef.current) {
      const announcement = isPlaying 
        ? `Now playing: ${title}`
        : isActive 
          ? `Paused: ${title}`
          : `Stopped: ${title}`;
      
      statusAnnouncementRef.current.textContent = announcement;
      
      // Clear announcement after a short delay to avoid cluttering screen readers
      const timer = setTimeout(() => {
        if (statusAnnouncementRef.current) {
          statusAnnouncementRef.current.textContent = '';
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
    previousPlayingState.current = isPlaying;
  }, [isPlaying, isActive, title]);

  // Determine button state
  const getButtonState = () => {
    if (urlState.isProcessing) {
      return { disabled: true, loading: true, playing: false };
    }
    
    if (!urlState.isValidUrl) {
      return { disabled: true, loading: false, playing: false };
    }

    return { 
      disabled: false, 
      loading: isLoading, 
      playing: isPlaying 
    };
  };

  const buttonState = getButtonState();

  // Generate accessible labels and descriptions
  const getAriaLabel = () => {
    if (urlState.isProcessing) {
      return `Loading audio for ${title}`;
    }
    if (!urlState.isValidUrl) {
      return `Audio unavailable for ${title}`;
    }
    if (isPlaying) {
      return `Pause ${title}`;
    }
    return `Play ${title}`;
  };

  const getAriaDescription = () => {
    if (!urlState.isValidUrl) {
      return urlState.error || 'Invalid audio source';
    }
    if (isActive) {
      return isPlaying ? 'Currently playing' : 'Currently paused';
    }
    return 'Program audio player';
  };

  // Render error state
  if (!urlState.isProcessing && !urlState.isValidUrl) {
    return (
      <div 
        className={`flex items-center gap-2 ${isCompact ? 'py-1' : 'py-2'} rounded-md`}
        role="alert"
        aria-label={getAriaLabel()}
        tabIndex={0}
      >
        <div 
          className="flex items-center justify-center w-8 h-8 opacity-50 contrast-more:opacity-70"
          aria-hidden="true"
        >
          <div className="w-4 h-4 bg-red-400 contrast-more:bg-red-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-white contrast-more:text-black font-bold">!</span>
          </div>
        </div>
        {!isCompact && (
          <div className="flex-1 min-w-0">
            <span className="text-xs text-red-400 contrast-more:text-red-300 block truncate" id={`error-${programId}`}>
              {urlState.error || 'Audio file not available'}
            </span>
            <button
              onClick={() => {
                const detailedError = urlState.error || 'Audio file not available';
                
                toast({
                  variant: "destructive",
                  title: "Audio Error Details",
                  description: detailedError,
                });
              }}
              className="text-xs text-red-300 hover:text-red-200 underline mt-1 focus:outline-none focus:ring-1 focus:ring-red-400 rounded"
            >
              Show details
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex items-center gap-2 ${isCompact ? 'py-1' : 'py-2'} ${
        isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'
      } transition-opacity duration-200 rounded-md focus-within:ring-2 focus-within:ring-white/30 contrast-more:focus-within:ring-white`}
      role="region"
      aria-label={`Program player for ${title}`}
      aria-describedby={`description-${programId}`}
      onKeyDown={handleKeyDown}
      tabIndex={buttonState.disabled ? -1 : 0}
    >
      {/* Screen reader announcements */}
      <div
        ref={statusAnnouncementRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Hidden description for screen readers */}
      <div id={`description-${programId}`} className="sr-only">
        {getAriaDescription()}
      </div>

      {/* Play/Pause Button */}
      <div className="flex-shrink-0">
        <MediaButton
          isPlaying={buttonState.playing}
          isLoading={buttonState.loading}
          onClick={handlePlayPause}
          size="small"
          disabled={buttonState.disabled}
          className={`${
            isActive 
              ? 'ring-2 ring-white/30 bg-white/10 focus:ring-4 focus:ring-white/50 contrast-more:ring-white contrast-more:bg-white/20' 
              : 'hover:bg-white/5 focus:ring-2 focus:ring-white/30 contrast-more:hover:bg-white/15 contrast-more:focus:ring-white'
          } transition-all duration-200 focus:outline-none`}
        />
      </div>

      {/* Program Title - Only show if not compact */}
      {!isCompact && (
        <div className="flex-1 min-w-0">
          <span 
            className={`text-sm ${
              isActive ? 'text-white font-medium contrast-more:font-bold' : 'text-white/80 contrast-more:text-white/90'
            } truncate block transition-colors duration-200`}
            title={title}
            id={`title-${programId}`}
          >
            {title}
          </span>
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="flex-shrink-0" aria-hidden="true">
          <div 
            className="w-2 h-2 bg-white rounded-full animate-pulse"
            title="Currently active"
          />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex-shrink-0" aria-hidden="true">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Loading audio" />
        </div>
      )}

      {/* Error indicator for active program */}
      {isActive && audioContext.error && (
        <div className="flex-shrink-0" aria-hidden="true">
          <div 
            className="w-2 h-2 bg-red-400 rounded-full animate-pulse" 
            title={`Error: ${audioContext.error}`}
          />
        </div>
      )}

      {/* Status indicator for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isActive && isPlaying && 'Playing'}
        {isActive && !isPlaying && !isLoading && 'Paused'}
        {isLoading && 'Loading'}
        {isActive && audioContext.error && `Error: ${audioContext.error}`}
      </div>
    </div>
  );
};

export default ProgramPlayer;