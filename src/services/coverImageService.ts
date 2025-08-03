import { env } from '../config/env';

/**
 * Song Cover Response Interface
 * Represents the response from the song cover API
 */
export interface SongCoverResponse {
  success: boolean;
  cover: string;
}

/**
 * Cover Image Service Interface
 * Follows Interface Segregation Principle
 */
export interface ICoverImageService {
  fetchCoverImageUrl(songName: string): Promise<string | null>;
  clearCache(): void;
}

/**
 * Cover Image Service Implementation
 * Follows Single Responsibility Principle - handles only cover image operations
 * Follows Open/Closed Principle - extensible through interface
 * Follows DRY Principle - reusable cover fetching logic
 */
export class CoverImageService implements ICoverImageService {
  private coverCache = new Map<string, string>();
  private radioInfoCache: any = null;
  private readonly radioInfoUrl: string;

  constructor() {
    this.radioInfoUrl = env.RADIO_INFO_API_URL;
  }

  /**
   * Fetches radio info with caching
   * Follows DRY principle by centralizing radio info fetching
   */
  private async fetchRadioInfo(): Promise<any> {
    try {
      if (this.radioInfoCache) {
        return this.radioInfoCache;
      }

      const response = await fetch(this.radioInfoUrl);
      if (!response.ok) {
        throw new Error(`Radio info fetch failed: ${response.status}`);
      }

      this.radioInfoCache = await response.json();
      return this.radioInfoCache;
    } catch (error) {
      console.error('Error fetching radio info:', error);
      return null;
    }
  }

  /**
   * Fetches song cover metadata from the streaming provider
   * Follows Single Responsibility Principle
   */
  private async fetchSongCoverMetadata(songCoverUrl: string, songName: string): Promise<SongCoverResponse | null> {
    try {
      const coverApiUrl = songCoverUrl.replace('{songName}', encodeURIComponent(songName));

      const response = await fetch(coverApiUrl);
      if (!response.ok) {
        console.warn(`Song cover metadata fetch failed: ${response.status} for song: ${songName}`);
        return null;
      }

      const data: SongCoverResponse = await response.json();

      if (!data.success || !data.cover) {
        console.warn(`Invalid cover response for song: ${songName}`, data);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching song cover metadata:', error);
      return null;
    }
  }

  /**
   * Constructs the final cover image URL
   * Follows DRY principle by centralizing URL construction
   */
  private buildCoverImageUrl(baseUrl: string, coverFileName: string): string {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBaseUrl}${coverFileName}`;
  }

  /**
   * Validates if the cover image is accessible
   * Skips HEAD request validation to avoid CORS issues
   * Images will be validated by the browser when loaded in <img> tags
   */
  private async validateCoverImageUrl(imageUrl: string): Promise<boolean> {
    // Skip fetch validation due to CORS restrictions
    // Browser will handle CORS appropriately when loading images in <img> tags
    return true;
  }

  /**
   * Fetches the complete cover image URL for a given song
   * Implements the full flow: radio info → song cover API → final image URL
   * Follows SOLID principles with proper error handling and caching
   * CORS-safe implementation - relies on browser's image loading mechanism
   */
  async fetchCoverImageUrl(songName: string): Promise<string | null> {
    if (!songName || songName.trim() === '') {
      return null;
    }

    const cacheKey = songName.toLowerCase().trim();

    // Check cache first (DRY principle)
    if (this.coverCache.has(cacheKey)) {
      return this.coverCache.get(cacheKey) || null;
    }

    try {
      // Step 1: Fetch radio info
      const radioInfo = await this.fetchRadioInfo();
      if (!radioInfo?.songCoverUrl || !radioInfo?.assetUrls?.cover) {
        console.warn('Missing required radio info for cover fetching');
        return null;
      }

      // Step 2: Fetch song cover metadata
      const coverMetadata = await this.fetchSongCoverMetadata(radioInfo.songCoverUrl, songName);
      if (!coverMetadata) {
        return null;
      }

      // Step 3: Construct final cover image URL
      const coverImageUrl = this.buildCoverImageUrl(radioInfo.assetUrls.cover, coverMetadata.cover);

      // Step 4: Skip validation to avoid CORS issues - let browser handle it
      // The browser's <img> tag will handle CORS appropriately
      console.log(`Generated cover URL for "${songName}":`, coverImageUrl);

      // Cache the result
      this.coverCache.set(cacheKey, coverImageUrl);

      return coverImageUrl;

    } catch (error) {
      console.error('Error in cover image fetch process:', error);
      return null;
    }
  }

  /**
   * Clears all cached data
   * Useful for testing or when radio info changes
   */
  clearCache(): void {
    this.coverCache.clear();
    this.radioInfoCache = null;
  }
}
