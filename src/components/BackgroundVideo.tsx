import React, { useState, useEffect, useRef } from 'react';
import { selectRandomVideo, VIDEO_CONFIG } from '../utils/videoConfig';
import { LAYOUT, getGlassOverlay } from '../constants/layoutConstants';
import { useBackgroundTransition } from '../hooks/useBackgroundTransition';
import { useDebug } from '../contexts/DebugContext';
import { isDebugMode } from '../config/env';

interface BackgroundVideoProps {
  /**
   * Additional CSS classes for the video element
   */
  className?: string;
  
  /**
   * Whether to show the overlay for better contrast
   */
  showOverlay?: boolean;
  
  /**
   * Custom overlay opacity (0-1)
   */
  overlayOpacity?: number;
}

/**
 * BackgroundVideo Component
 * 
 * Follows Single Responsibility Principle:
 * - Only responsible for rendering background video with black background while loading
 * 
 * Follows Open/Closed Principle:
 * - Open for extension through props
 * - Closed for modification of core functionality
 *
 * Follows DRY Principle:
 * - Uses centralized layout constants and background transition logic
 * - Reuses background transition hook
 *
 * Features:
 * - Shows black background while video loads
 * - Smooth fade-in transition when video is ready
 * - Configurable overlay for better contrast
 * - Video darkening overlay for improved UI visibility
 */
const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  className = '',
  showOverlay = true,
  overlayOpacity = 0.4
}) => {
  const [currentVideo, setCurrentVideo] = useState<string>(VIDEO_CONFIG.defaultVideo);
  const [videoKey, setVideoKey] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setDebugInfo } = useDebug();

  // Use the background transition hook
  const { 
    isVideoReady, 
    videoOpacity,
    handleVideoCanPlay,
    handleVideoLoadedData,
    transitionStyles
  } = useBackgroundTransition({ 
    videoRef,
    transitionDuration: 1000      // 1 second fade-in transition
  });

  useEffect(() => {
    const debugData = {
      isVideoReady,
      videoOpacity,
      currentVideo: currentVideo.split('/').pop(),
    };
    setDebugInfo('BackgroundVideo', debugData);
    try {
      const forced = typeof window !== 'undefined' && (localStorage.getItem('debug') === '1' || new URL(window.location.href).searchParams.get('debug') === '1' || new URL(window.location.href).searchParams.get('debug') === 'true');
      if (isDebugMode() || forced) {
        document.body.setAttribute('data-rn-bg-video', debugData.currentVideo || '');
      }
    } catch {
      // noop
    }
  }, [isVideoReady, videoOpacity, currentVideo, setDebugInfo]);

  useEffect(() => {
    // Select a random video each time the component mounts
    const randomVideo = selectRandomVideo();
    setCurrentVideo(randomVideo);
    // Force video reload by changing the key
    setVideoKey(prev => prev + 1);
    
    // Debug: Log the selected video for development
    console.log('BackgroundVideo - Random video selected:', randomVideo);
    console.log('BackgroundVideo - Component initialized');
  }, []); // Empty dependency array ensures this runs once when component mounts

  useEffect(() => {
    // Force video to load when currentVideo changes
    if (videoRef.current) {
      videoRef.current.load();
      console.log('BackgroundVideo - Video load() called for:', currentVideo);
    }
  }, [currentVideo]);

  const overlayConfig = getGlassOverlay(overlayOpacity);

  return (
    <>
      {/* Black Background (shown while video loads) */}
      <div className={`${LAYOUT.PATTERNS.FIXED_OVERLAY} bg-black z-[${LAYOUT.Z_INDEX.BACKGROUND}]`} />

      {/* Background Video - Fades in when ready */}
      <video 
        ref={videoRef}
        key={videoKey}
        className={`${LAYOUT.PATTERNS.FIXED_OVERLAY} object-cover z-[${LAYOUT.Z_INDEX.BACKGROUND}] ${className}`}
        style={transitionStyles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoadedData}
        onCanPlay={handleVideoCanPlay}
        onLoadStart={() => console.log('BackgroundVideo - Video started loading')}
        onProgress={() => console.log('BackgroundVideo - Video loading progress')}
        onCanPlayThrough={() => console.log('BackgroundVideo - Video can play through')}
      >
        <source src={`${currentVideo}?t=${videoKey}`} type="video/mp4" />
      </video>
      
      {/* Video Darkening Overlay - Improves content visibility */}
      <div className={`${LAYOUT.PATTERNS.FIXED_OVERLAY} bg-black/30 z-[${LAYOUT.Z_INDEX.BACKGROUND + 1}]`} />
      
      {/* Overlay for better contrast */}
      {showOverlay && (
        <div 
          className={`${overlayConfig.className} z-[${LAYOUT.Z_INDEX.OVERLAY}]`}
          style={overlayConfig.style}
        />
      )}
    </>
  );
};

export default BackgroundVideo;
