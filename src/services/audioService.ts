/**
 * Audio Service - Manages audio instance creation and configuration
 * Follows Single Responsibility Principle - only handles audio management
 * Follows Open/Closed Principle - extensible for different audio types
 */
export class AudioService {
  /**
   * Create configured HTML5 Audio instance
   */
  static createAudioInstance(url: string, volume: number = 0.8): HTMLAudioElement {
    const audio = new Audio(url);
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audio.volume = volume;
    return audio;
  }

  /**
   * Apply volume to existing audio instance
   */
  static setAudioVolume(audio: HTMLAudioElement | null, volume: number): void {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Cleanup audio instance
   */
  static cleanupAudio(audio: HTMLAudioElement | null): void {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
  }
}

