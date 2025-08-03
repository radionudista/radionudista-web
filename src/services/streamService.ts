import { env } from '../config/env';

/**
 * Stream Service Interface
 * Follows Interface Segregation Principle - specific interfaces for stream operations
 */
export interface StreamStatus {
  isMobile: boolean;
  streamingStatus: number;
  streamingType: string;
  currentTrack: string;
}

export interface RadioInfo {
  radioName: string;
  customerUrl: string;
  retailerUrl: string;
  retailerAlt: string;
  customerLogo: string;
  locale: string;
  nextSchedules: Record<string, {
    id: string | number;
    start: number;
    end: number;
    program_info: {
      program_id: string | number;
      program_name: string;
      program_image: string;
      broadcaster_id: string | number;
      broadcaster_name: string;
      broadcaster_image: string;
      start_time: string | number;
      end_time: string | number;
    };
  }>;
  streamingUrl: string;
  updateStatusUrl: string;
  songCoverUrl: string;
  cast: {
    receiverAppId: string;
    receiverInfoUrl: string;
  };
  assetUrls: {
    upload: string;
    cover: string;
  };
}

export interface IStreamService {
  fetchCurrentTrack(): Promise<string>;
  getStreamUrl(): string;
  fetchRadioInfo(): Promise<RadioInfo | null>;
  fetchSongCover(songName: string): Promise<string | null>;
}

/**
 * Radio Stream Service Implementation
 * Follows Single Responsibility Principle - handles only stream-related operations
 */
export class RadioStreamService implements IStreamService {
  private radioInfoCache: RadioInfo | null = null;
  private readonly radioInfoUrl: string;

  constructor(
    private readonly statusUrl: string,
    private readonly streamUrl: string,
    private readonly defaultTrack: string = 'RadioNudista - Live Stream'
  ) {
    // Use the radio info API URL from environment configuration
    this.radioInfoUrl = env.RADIO_INFO_API_URL;
  }

  async fetchCurrentTrack(): Promise<string> {
    try {
      const response = await fetch(this.statusUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StreamStatus = await response.json();
      return data.currentTrack || this.defaultTrack;
    } catch (error) {
      console.error('Error fetching track info:', error);
      return this.defaultTrack;
    }
  }

  async fetchRadioInfo(): Promise<RadioInfo | null> {
    try {
      // Use cached data if available
      if (this.radioInfoCache) {
        return this.radioInfoCache;
      }

      const response = await fetch(this.radioInfoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RadioInfo = await response.json();
      this.radioInfoCache = data;
      return data;
    } catch (error) {
      console.error('Error fetching radio info:', error);
      return null;
    }
  }

  async fetchSongCover(songName: string): Promise<string | null> {
    try {
      const radioInfo = await this.fetchRadioInfo();
      if (!radioInfo?.songCoverUrl || !songName) {
        return null;
      }

      // Replace {songName} placeholder with actual song name
      const coverUrl = radioInfo.songCoverUrl.replace('{songName}', encodeURIComponent(songName));

      // Test if the cover image URL is accessible
      const response = await fetch(coverUrl, { method: 'HEAD' });
      if (response.ok) {
        return coverUrl;
      }

      return null;
    } catch (error) {
      console.error('Error fetching song cover:', error);
      return null;
    }
  }

  getStreamUrl(): string {
    return this.streamUrl;
  }
}
