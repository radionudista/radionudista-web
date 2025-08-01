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

export interface IStreamService {
  fetchCurrentTrack(): Promise<string>;
  getStreamUrl(): string;
}

/**
 * Radio Stream Service Implementation
 * Follows Single Responsibility Principle - handles only stream-related operations
 */
export class RadioStreamService implements IStreamService {
  constructor(
    private readonly statusUrl: string,
    private readonly streamUrl: string,
    private readonly defaultTrack: string = 'RadioNudista - Live Stream'
  ) {}

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

  getStreamUrl(): string {
    return this.streamUrl;
  }
}
