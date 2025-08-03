import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { MEDIA_CONSTANTS } from '../constants/mediaConstants';
import { STREAM_CONFIG } from '../constants/streamConstants';
import { RadioStreamService } from '../services/streamService';
import { env } from '../config/env';

interface StreamStatus {
  isMobile: boolean;
  streamingStatus: number;
  streamingType: string;
  currentTrack: string;
}

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

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>(MEDIA_CONSTANTS.STREAM.DEFAULT_TRACK);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize stream service with radio info API URL from environment
  const streamService = useRef(
    new RadioStreamService(
      STREAM_CONFIG.statusUrl,
      STREAM_CONFIG.streamUrl,
      MEDIA_CONSTANTS.STREAM.DEFAULT_TRACK
    )
  );

  // Fetch current track info and cover image
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const trackName = await streamService.current.fetchCurrentTrack();
      if (trackName !== currentTrack) {
        setCurrentTrack(trackName);

        // Fetch cover image for the new track using the radio info API
        const coverUrl = await streamService.current.fetchSongCover(trackName);
        setCoverImageUrl(coverUrl);
      }
    } catch (error) {
      console.error('Error fetching track info:', error);
    }
  }, [currentTrack]);

  // Set volume function
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, [isMuted]);

  // Toggle mute function
  const toggleMute = useCallback(() => {
    if (isMuted) {
      // Unmute: restore previous volume
      setVolumeState(previousVolume);
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100;
      }
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
      setVolumeState(0);
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  }, [isMuted, volume, previousVolume]);

  // Apply volume to new audio instances
  const createAudioWithVolume = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audio.volume = volume / 100;

    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('error', () => {
      setIsLoading(false);
      setIsPlaying(false);
    });

    return audio;
  }, [volume]);

  // Rename current togglePlay to togglePlayWithPause (keeps current functionality)
  const togglePlayWithPause = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = createAudioWithVolume(STREAM_CONFIG.streamUrl);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, createAudioWithVolume]);

  // New togglePlay that drops audio ref on pause and creates new one on play
  const togglePlay = useCallback(() => {
    if (isPlaying && audioRef.current) {
      // Pause and drop current audio ref
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      // Create new audio instance and play from current stream
      audioRef.current = createAudioWithVolume(STREAM_CONFIG.streamUrl);
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, createAudioWithVolume]);

  // Update track info periodically
  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, MEDIA_CONSTANTS.STREAM.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio playback error');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const contextValue = {
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
      <audio
        ref={audioRef}
        src={STREAM_CONFIG.streamUrl}
        preload={MEDIA_CONSTANTS.STREAM.PRELOAD}
      />
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
