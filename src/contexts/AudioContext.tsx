import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MEDIA_CONSTANTS } from '../constants/mediaConstants';
import { STREAM_CONFIG } from '../constants/streamConstants';
import { RadioStreamService } from '../services/streamService';
import { AudioService } from '../services/audioService';
import { useDebug } from './DebugContext';
import { isDebugMode } from '@/config/env';

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
  // Health metrics
  const [lastTrackFetchAt, setLastTrackFetchAt] = useState<number | null>(null);
  const [lastTrackChangeAt, setLastTrackChangeAt] = useState<number | null>(null);
  const [audioReadyState, setAudioReadyState] = useState<number>(0);
  const [audioNetworkState, setAudioNetworkState] = useState<number>(0);
  const [audioErrorCount, setAudioErrorCount] = useState<number>(0);
  const [lastAudioErrorAt, setLastAudioErrorAt] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamService = useRef(
    new RadioStreamService(
      STREAM_CONFIG.statusUrl,
      STREAM_CONFIG.streamUrl,
      MEDIA_CONSTANTS.STREAM.DEFAULT_TRACK
    )
  );

  // Debug: publicar estado de audio para vibecoding
  const { setDebugInfo } = useDebug();
  useEffect(() => {
    try {
      const forced = typeof window !== 'undefined' && (localStorage.getItem('debug') === '1' || new URL(window.location.href).searchParams.get('debug') === '1' || new URL(window.location.href).searchParams.get('debug') === 'true');
      if (!isDebugMode() && !forced) return;
      setDebugInfo('Audio', {
        isPlaying,
        isLoading,
        currentTrack,
        volume,
        isMuted,
        hasAudioElement: !!audioRef.current,
        health: {
          readyState: audioRef.current?.readyState ?? audioReadyState,
          networkState: audioRef.current?.networkState ?? audioNetworkState,
          errorCount: audioErrorCount,
          lastAudioErrorAt,
          lastTrackFetchAt,
          lastTrackChangeAt,
          currentSrc: audioRef.current?.currentSrc ?? null,
        },
      });
      // Actualizar dataset en <body> para scrapers simples
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-rn-playing', String(isPlaying));
        document.body.setAttribute('data-rn-track', currentTrack || '');
        document.body.setAttribute('data-rn-volume', String(volume));
      }
    } catch {
      // noop
    }
  }, [isPlaying, isLoading, currentTrack, volume, isMuted, audioReadyState, audioNetworkState, audioErrorCount, lastAudioErrorAt, lastTrackFetchAt, lastTrackChangeAt, setDebugInfo]);

  /**
   * Audio Event Handlers - DRY principle
   */
  const audioEventHandlers = {
    onLoadStart: () => {
      setIsLoading(true);
      const el = audioRef.current;
      if (el) {
        setAudioReadyState(el.readyState);
        setAudioNetworkState(el.networkState);
      }
    },
    onCanPlay: () => {
      setIsLoading(false);
      const el = audioRef.current;
      if (el) {
        setAudioReadyState(el.readyState);
        setAudioNetworkState(el.networkState);
      }
    },
    onWaiting: () => {
      setIsLoading(true);
      const el = audioRef.current;
      if (el) {
        setAudioReadyState(el.readyState);
        setAudioNetworkState(el.networkState);
      }
    },
    onError: (event: Event) => {
      setIsLoading(false);
      setIsPlaying(false);
      setAudioErrorCount(prev => prev + 1);
      setLastAudioErrorAt(Date.now());
      const audioElement = event.target as HTMLAudioElement;
      const error = audioElement.error;

      if (error) {
        console.error('Audio playback error details:', {
          code: error.code,
          message: error.message,
          networkState: audioElement.networkState,
          readyState: audioElement.readyState,
          src: audioElement.src
        });

        // Handle specific error types
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            console.error('Audio playback aborted by user');
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            console.error('Network error while loading audio');
            break;
          case MediaError.MEDIA_ERR_DECODE:
            console.error('Audio decoding error');
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            console.error('Audio format not supported');
            break;
          default:
            console.error('Unknown audio error');
        }
      } else {
        console.error('Audio playback error: No error details available');
      }
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
      setLastTrackFetchAt(Date.now());
      const trackName = await streamService.current.fetchCurrentTrack();
      if (trackName !== currentTrack) {
        setCurrentTrack(trackName);
        setLastTrackChangeAt(Date.now());
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

  const contextValue: AudioContextType = useMemo(() => ({
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
  }), [isPlaying, isLoading, currentTrack, coverImageUrl, volume, isMuted, togglePlayWithPause, togglePlay, setVolume, toggleMute]);

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
