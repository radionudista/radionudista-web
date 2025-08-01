import { useEffect, useRef } from 'react';

interface UseNewsTickerOptions {
  text: string;
  isActive: boolean;
  speed?: number; // pixels per second
}

/**
 * Simple news ticker hook - mimics traditional news crawl effect
 *
 * First scroll: starts from normal left position and scrolls to right
 * Subsequent scrolls: enter from right edge and scroll across
 *
 * @param options - Configuration for ticker behavior
 * @returns Container and text refs for the ticker elements
 */
export const useNewsTicker = ({
  text,
  isActive,
  speed = 50 // Default 50 pixels per second
}: UseNewsTickerOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const isFirstScrollRef = useRef<boolean>(true); // Track if this is the first scroll

  useEffect(() => {
    const startAnimation = () => {
      if (!containerRef.current || !textRef.current || !isActive || !text.trim()) {
        return;
      }

      if (isAnimatingRef.current) {
        return; // Already animating
      }

      const container = containerRef.current;
      const textElement = textRef.current;

      const containerWidth = container.clientWidth;
      const textWidth = textElement.scrollWidth;

      isAnimatingRef.current = true;

      // Remove any existing transition
      textElement.style.transition = 'none';

      let startPosition: number;
      let endPosition: number;
      let duration: number;

      if (isFirstScrollRef.current) {
        // First scroll: start from normal left position (0) and scroll to completely off-screen left
        startPosition = 0;
        endPosition = -textWidth;
        duration = (textWidth / speed) * 1000;
        isFirstScrollRef.current = false;
      } else {
        // Subsequent scrolls: enter from right edge and exit left
        startPosition = containerWidth;
        endPosition = -textWidth;
        const totalDistance = containerWidth + textWidth;
        duration = (totalDistance / speed) * 1000;
      }

      // Set start position
      textElement.style.transform = `translateX(${startPosition}px)`;

      // Force a reflow to ensure the start position is applied
      textElement.offsetHeight;

      // Apply transition and start animation
      textElement.style.transition = `transform ${duration}ms linear`;
      textElement.style.transform = `translateX(${endPosition}px)`;

      // Schedule restart when animation completes
      timeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        if (isActive && text.trim()) {
          startAnimation(); // Restart for subsequent loops
        }
      }, duration);
    };

    const stopAnimation = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      isAnimatingRef.current = false;
      isFirstScrollRef.current = true; // Reset for next time

      if (textRef.current) {
        textRef.current.style.transition = 'none';
        textRef.current.style.transform = 'translateX(0)';
      }
    };

    if (isActive && text.trim()) {
      // Small delay to ensure DOM is ready
      const initTimeout = setTimeout(startAnimation, 100);
      return () => {
        clearTimeout(initTimeout);
        stopAnimation();
      };
    } else {
      stopAnimation();
    }

    // Cleanup on unmount or dependency change
    return () => {
      stopAnimation();
    };
  }, [text, isActive, speed]);

  return {
    containerRef,
    textRef
  };
};
