import { useState, useCallback } from 'react';

/**
 * Volume control utilities and event handlers
 * Follows DRY principle - centralized volume calculation logic
 */
export const useVolumeControl = (onVolumeChange: (volume: number) => void) => {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Calculate volume percentage from mouse/touch event
   */
  const calculateVolumeFromEvent = useCallback((clientY: number, trackElement: HTMLElement): number => {
    const rect = trackElement.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    return Math.round(percentage);
  }, []);

  /**
   * Handle volume track click/tap interaction
   */
  const handleTrackInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const track = e.currentTarget as HTMLElement;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newVolume = calculateVolumeFromEvent(clientY, track);
    onVolumeChange(newVolume);
  }, [calculateVolumeFromEvent, onVolumeChange]);

  /**
   * Handle drag start for volume control
   */
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const track = (e.currentTarget as HTMLElement).parentElement;
    if (!track) return;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newVolume = calculateVolumeFromEvent(clientY, track);
      onVolumeChange(newVolume);
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove as EventListener);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [calculateVolumeFromEvent, onVolumeChange]);

  return {
    isDragging,
    handleTrackInteraction,
    handleDragStart
  };
};

