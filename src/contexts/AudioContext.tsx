import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { MEDIA_CONSTANTS } from '../constants/mediaConstants';
import { STREAM_CONFIG } from '../constants/streamConstants';
import { RadioStreamService } from '../services/streamService';
import { AudioService } from '../services/audioService';

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: string;
  coverImageUrl: string | null;
  volume: number;
  isMuted: boolean;
  togglePlayWithPause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Audio Provider - Simplified and follows SOLID principles
 * Single Responsibility: Manages audio state and playback
 * Open/Closed: Extensible through services
 * Dependency Inversion: Depends on abstractions (services)
 */
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>(MEDIA_CONSTANTS.STREAM.DEFAULT_TRACK);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  // Volume State
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamService = useRef(
    new RadioStreamService(
      STREAM_CONFIG.statusUrl,
      STREAM_CONFIG.streamUrl,
      MEDIA_CONSTANTS.STREAM.DEFAULT_TRACK
    )
  );

  /**
   * Audio Event Handlers - DRY principle
   */
  const audioEventHandlers = {
    onLoadStart: () => setIsLoading(true),
    onCanPlay: () => setIsLoading(false),
    onWaiting: () => setIsLoading(true),
    onError: () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio playback error');
    }
  };

  /**
   * Create audio instance with proper configuration
   */
  const createConfiguredAudio = useCallback(() => {
    const audio = AudioService.createAudioInstance(STREAM_CONFIG.streamUrl, volume / 100);

    // Apply event listeners
    audio.addEventListener('loadstart', audioEventHandlers.onLoadStart);
    audio.addEventListener('canplay', audioEventHandlers.onCanPlay);
    audio.addEventListener('waiting', audioEventHandlers.onWaiting);
    audio.addEventListener('error', audioEventHandlers.onError);

    return audio;
  }, [volume]);

  /**
   * Volume Control - Following SRP
   */
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    AudioService.setAudioVolume(audioRef.current, newVolume / 100);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolumeState(previousVolume);
      setIsMuted(false);
      AudioService.setAudioVolume(audioRef.current, previousVolume / 100);
    } else {
      setPreviousVolume(volume);
      setVolumeState(0);
      setIsMuted(true);
      AudioService.setAudioVolume(audioRef.current, 0);
    }
  }, [isMuted, volume, previousVolume]);

  /**
   * Playback Control - Following SRP
   */
  const togglePlayWithPause = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = createConfiguredAudio();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, createConfiguredAudio]);

  const togglePlay = useCallback(() => {
    if (isPlaying && audioRef.current) {
      AudioService.cleanupAudio(audioRef.current);
      audioRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      audioRef.current = createConfiguredAudio();
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, createConfiguredAudio]);

  /**
   * Track Information - Following SRP
   */
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const trackName = await streamService.current.fetchCurrentTrack();
      if (trackName !== currentTrack) {
        setCurrentTrack(trackName);
        const coverUrl = await streamService.current.fetchSongCover(trackName);
        setCoverImageUrl(coverUrl);
      }
    } catch (error) {
      console.error('Error fetching track info:', error);
    }
  }, [currentTrack]);

  // Effects
  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, MEDIA_CONSTANTS.STREAM.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);

  const contextValue: AudioContextType = {
    isPlaying,
    isLoading,
    currentTrack,
    coverImageUrl,
    volume,
    isMuted,
    togglePlayWithPause,
    togglePlay,
    setVolume,
    toggleMute,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
