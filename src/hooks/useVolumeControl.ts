import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVolumeControlReturn {
  isDragging: boolean;
  handleTrackInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  handleDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
}

/**
 * Custom hook for volume control interactions
 * Optimized for smooth touch experience on iPhone and Android devices
 */
export const useVolumeControl = (onVolumeChange: (volume: number) => void): UseVolumeControlReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(false);
  const trackElementRef = useRef<HTMLElement | null>(null);
  const lastVolumeRef = useRef<number>(0);
  const rafRef = useRef<number>();

  // Enhanced volume calculation with smoother precision
  const calculateVolumeFromEvent = useCallback((e: MouseEvent | TouchEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const relativeY = clientY - rect.top;

    // Add padding zones for easier interaction at edges
    const paddingTop = 8;
    const paddingBottom = 8;
    const effectiveHeight = rect.height - paddingTop - paddingBottom;
    const adjustedY = Math.max(paddingTop, Math.min(rect.height - paddingBottom, relativeY));

    const percentage = Math.max(0, Math.min(100,
      ((effectiveHeight - (adjustedY - paddingTop)) / effectiveHeight) * 100
    ));

    // Smooth out small movements to prevent jitter
    const roundedPercentage = Math.round(percentage * 2) / 2; // Round to 0.5 increments
    return roundedPercentage;
  }, []);

  // Enhanced volume update with iPhone-specific handling
  const updateVolumeSmooth = useCallback((newVolume: number) => {
    // Detect if this is a mobile device (iPhone/Android)
    const isMobile = 'ontouchstart' in window;

    // Use different thresholds for mobile vs desktop
    const threshold = isMobile ? 0.1 : 0.5; // Much smaller threshold for mobile

    if (Math.abs(newVolume - lastVolumeRef.current) < threshold) return;

    // For iPhone, update immediately without requestAnimationFrame throttling
    if (isMobile) {
      onVolumeChange(newVolume);
      lastVolumeRef.current = newVolume;
    } else {
      // Desktop: use requestAnimationFrame for smoothness
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        onVolumeChange(newVolume);
        lastVolumeRef.current = newVolume;
      });
    }
  }, [onVolumeChange]);

  // Handle track click/tap with haptic-like feedback timing
  const handleTrackInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    trackElementRef.current = target;

    const volume = calculateVolumeFromEvent(e.nativeEvent, target);
    updateVolumeSmooth(volume);

    // Brief visual feedback for mobile users
    if ('ontouchstart' in window) {
      setIsDragging(true);
      setTimeout(() => setIsDragging(false), 150);
    }
  }, [calculateVolumeFromEvent, updateVolumeSmooth]);

  // Enhanced drag start with better mobile detection
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragRef.current = true;

    // Store reference to track element for smoother dragging
    const handleElement = e.currentTarget as HTMLElement;
    const trackElement = handleElement.parentElement as HTMLElement;
    trackElementRef.current = trackElement;

    const volume = calculateVolumeFromEvent(e.nativeEvent, trackElement);
    updateVolumeSmooth(volume);

    // Prevent context menu on long press (mobile)
    if ('ontouchstart' in window) {
      document.addEventListener('contextmenu', preventContextMenu, { once: true });
    }
  }, [calculateVolumeFromEvent, updateVolumeSmooth]);

  // Prevent context menu during drag
  const preventContextMenu = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  // Optimized mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current || !trackElementRef.current) return;

    e.preventDefault();
    const volume = calculateVolumeFromEvent(e, trackElementRef.current);
    updateVolumeSmooth(volume);
  }, [calculateVolumeFromEvent, updateVolumeSmooth]);

  // Enhanced touch move handler with better Android/iPhone compatibility
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragRef.current || !trackElementRef.current) return;

    // Prevent scrolling and zooming during drag
    e.preventDefault();
    e.stopPropagation();

    // Handle multi-touch scenarios (ignore additional fingers)
    if (e.touches.length !== 1) return;

    const volume = calculateVolumeFromEvent(e, trackElementRef.current);
    updateVolumeSmooth(volume);
  }, [calculateVolumeFromEvent, updateVolumeSmooth]);

  // Clean drag end with proper cleanup
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragRef.current = false;
    trackElementRef.current = null;

    // Cancel any pending animation frames
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }

    // Remove context menu prevention
    document.removeEventListener('contextmenu', preventContextMenu);
  }, [preventContextMenu]);

  // Enhanced event listener setup with better mobile support
  useEffect(() => {
    if (isDragging) {
      // Mouse events for desktop
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);

      // Touch events optimized for mobile with proper passive handling
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
        capture: true
      });
      document.addEventListener('touchend', handleDragEnd, { passive: true });
      document.addEventListener('touchcancel', handleDragEnd, { passive: true });

      // Handle page visibility changes (mobile app switching)
      document.addEventListener('visibilitychange', handleDragEnd);

      // Handle orientation changes on mobile
      window.addEventListener('orientationchange', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
      document.removeEventListener('visibilitychange', handleDragEnd);
      window.removeEventListener('orientationchange', handleDragEnd);

      // Cleanup animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  return {
    isDragging,
    handleTrackInteraction,
    handleDragStart
  };
};
