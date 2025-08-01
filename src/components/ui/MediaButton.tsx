/**
 * MediaButton Component
 * 
 * Follows SOLID Principles:
 * - SRP: Single responsibility for media control UI
 * - OCP: Open for extension via props interface
 * - DRY: Eliminates duplicate play/pause/loading UI patterns
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Square } from 'lucide-react';

export interface MediaButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

const MediaButton: React.FC<MediaButtonProps> = ({
  isPlaying,
  isLoading,
  onClick,
  size = 'medium',
  className,
  disabled = false
}) => {
  const sizeConfig = {
    small: {
      container: 'w-6 h-6',
      spinner: 'w-3 h-3 border',
      playButton: 'border-l-[12px] border-t-[8px] border-b-[8px] ml-1',
      stopIcon: 12 // Increased from 10 to 12 to match play button visual area (12px triangle base width)
    },
    medium: {
      container: 'w-12 h-12',
      spinner: 'w-4 h-4 border-2',
      playButton: 'border-l-[20px] border-t-[12px] border-b-[12px] ml-1',
      stopIcon: 12
    },
    large: {
      container: 'w-20 h-20',
      spinner: 'w-6 h-6 border-2',
      playButton: 'border-l-[30px] border-t-[20px] border-b-[20px] ml-2',
      stopIcon: 16
    }
  };

  const config = sizeConfig[size];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div 
          className={cn(
            config.spinner,
            'border-white border-t-transparent rounded-full animate-spin'
          )}
        />
      );
    }

    if (isPlaying) {
      return (
        <Square
          size={config.stopIcon}
          className="text-white fill-white"
        />
      );
    }

    return (
      <div 
        className={cn(
          config.playButton,
          'border-l-white border-t-transparent border-b-transparent'
        )}
      />
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        config.container,
        'flex items-center justify-center transition-all duration-200',
        disabled || isLoading ? 'cursor-wait opacity-50' : 'cursor-pointer hover:scale-105',
        className
      )}
      aria-label={isLoading ? 'Loading' : isPlaying ? 'Stop' : 'Play'}
    >
      {renderContent()}
    </button>
  );
};

export default MediaButton;
