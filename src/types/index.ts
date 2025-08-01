/**
 * Core Application Types
 * Follows Interface Segregation Principle - small, focused interfaces
 */

// Audio Player Types
export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: string;
}

export interface AudioPlayerActions {
  togglePlay: () => Promise<void>;
}

export interface AudioPlayerContext extends AudioPlayerState, AudioPlayerActions {}

// Media Control Types
export type MediaButtonSize = 'small' | 'medium' | 'large';

export interface MediaButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
  size: MediaButtonSize;
}

// Component Props Types
export interface RadioPlayerProps {
  className?: string;
  showTitle?: boolean;
  size?: MediaButtonSize;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Configuration Types
export interface StreamConfiguration {
  streamUrl: string;
  statusUrl: string;
  twitchChannel: string;
}

export interface MediaConfiguration {
  aspectRatios: Record<string, string>;
  intervals: Record<string, number>;
  visualization: Record<string, number>;
  stream: {
    defaultTrack: string;
    preload: 'none' | 'metadata' | 'auto';
    updateInterval: number;
  };
}
