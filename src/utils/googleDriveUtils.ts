/**
 * Google Drive URL utilities for converting share URLs to direct download URLs
 * and validating Google Drive URL formats with comprehensive error handling
 */

/**
 * Detailed validation result for Google Drive URLs
 */
export interface GoogleDriveValidationResult {
  isValid: boolean;
  fileId?: string;
  error?: string;
  errorCode?: 'EMPTY_URL' | 'INVALID_TYPE' | 'INVALID_DOMAIN' | 'MALFORMED_URL' | 'INVALID_FILE_ID' | 'SUSPICIOUS_URL';
}

/**
 * Comprehensive Google Drive URL validation with detailed error reporting
 * @param url - The URL to validate
 * @returns Detailed validation result with error information
 */
export function validateGoogleDriveUrlDetailed(url: string): GoogleDriveValidationResult {
  // Check for empty or null URL
  if (!url) {
    return {
      isValid: false,
      error: 'URL is required and cannot be empty',
      errorCode: 'EMPTY_URL'
    };
  }

  // Check if URL is a string
  if (typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL must be a string',
      errorCode: 'INVALID_TYPE'
    };
  }

  // Trim whitespace and normalize URL
  const normalizedUrl = url.trim();
  
  if (normalizedUrl.length === 0) {
    return {
      isValid: false,
      error: 'URL cannot be empty or contain only whitespace',
      errorCode: 'EMPTY_URL'
    };
  }

  // Check for basic URL structure
  try {
    new URL(normalizedUrl);
  } catch {
    return {
      isValid: false,
      error: 'URL format is invalid - must be a valid HTTP/HTTPS URL',
      errorCode: 'MALFORMED_URL'
    };
  }

  // Check if it's a Google Drive domain (support multiple formats)
  const validDomains = [
    'drive.google.com',
    'docs.google.com',
    'googledrive.com'
  ];
  
  const hasValidDomain = validDomains.some(domain => normalizedUrl.includes(domain));
  
  if (!hasValidDomain) {
    return {
      isValid: false,
      error: 'URL must be from Google Drive (drive.google.com, docs.google.com, or googledrive.com)',
      errorCode: 'INVALID_DOMAIN'
    };
  }

  // Extract file ID from various Google Drive URL formats
  const fileIdPatterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{25,})/,  // Standard share URL
    /\/document\/d\/([a-zA-Z0-9_-]{25,})/,  // Google Docs
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]{25,})/,  // Google Sheets
    /\/presentation\/d\/([a-zA-Z0-9_-]{25,})/,  // Google Slides
    /[?&]id=([a-zA-Z0-9_-]{25,})/,  // Direct ID parameter
    /\/open\?id=([a-zA-Z0-9_-]{25,})/  // Open URL format
  ];

  let fileId: string | null = null;
  
  for (const pattern of fileIdPatterns) {
    const match = normalizedUrl.match(pattern);
    if (match && match[1]) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId) {
    return {
      isValid: false,
      error: 'Could not extract file ID from Google Drive URL. Please ensure the URL is a valid Google Drive share link.',
      errorCode: 'INVALID_FILE_ID'
    };
  }

  // Validate file ID format (Google Drive file IDs are typically 25+ characters)
  if (fileId.length < 25) {
    return {
      isValid: false,
      error: 'File ID appears to be too short. Please check the Google Drive URL format.',
      errorCode: 'INVALID_FILE_ID'
    };
  }

  // Check for suspicious patterns that might indicate a malformed URL
  const suspiciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /onload=/i,
    /onerror=/i
  ];

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(normalizedUrl));
  
  if (hasSuspiciousContent) {
    return {
      isValid: false,
      error: 'URL contains suspicious content and cannot be processed',
      errorCode: 'SUSPICIOUS_URL'
    };
  }

  return {
    isValid: true,
    fileId
  };
}

/**
 * Converts a Google Drive share URL to a streaming URL for media playback
 * Uses streaming URLs that are CORS-friendly and designed for media playback
 * @param shareUrl - The Google Drive share URL (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * @returns The streaming URL (e.g., https://drive.google.com/file/d/FILE_ID/preview)
 * @throws Error with detailed message if URL is invalid
 */
export function convertGoogleDriveUrl(shareUrl: string): string {
  const validation = validateGoogleDriveUrlDetailed(shareUrl);
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Google Drive URL');
  }

  const fileId = validation.fileId!;
  // Use streaming URL instead of download URL to avoid CORS issues
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Alternative: Convert to direct streaming URL for audio files
 * This format is more reliable for audio playbook in web browsers
 * @param shareUrl - The Google Drive share URL
 * @returns The direct streaming URL
 */
export function convertGoogleDriveToStreamingUrl(shareUrl: string): string {
  const validation = validateGoogleDriveUrlDetailed(shareUrl);
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Google Drive URL');
  }

  const fileId = validation.fileId!;
  // Use the direct file access URL which is more CORS-friendly
  return `https://drive.google.com/uc?id=${fileId}`;
}

/**
 * Convert to Google Docs download URL (alternative approach)
 * This uses docs.google.com which might have better CORS support
 * @param shareUrl - The Google Drive share URL
 * @returns The docs.google.com download URL
 */
export function convertGoogleDriveToDocsUrl(shareUrl: string): string {
  const validation = validateGoogleDriveUrlDetailed(shareUrl);
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Google Drive URL');
  }

  const fileId = validation.fileId!;
  // Use docs.google.com format which might have better CORS support
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Validates if a URL is a properly formatted Google Drive URL (legacy function for backward compatibility)
 * @param url - The URL to validate
 * @returns True if the URL is a valid Google Drive URL, false otherwise
 */
export function validateGoogleDriveUrl(url: string): boolean {
  return validateGoogleDriveUrlDetailed(url).isValid;
}

/**
 * Enhanced result interface for Google Drive URL processing
 */
export interface GoogleDriveProcessResult {
  isValid: boolean;
  directUrl?: string;
  error?: string;
  errorCode?: string;
  fileId?: string;
  alternativeUrls?: string[];
}

/**
 * Checks if a Google Drive URL is accessible and properly formatted with enhanced error handling
 * @param url - The Google Drive URL to check
 * @returns Object with detailed validation result and converted URL if valid
 */
export function processGoogleDriveUrl(url: string): GoogleDriveProcessResult {
  try {
    const validation = validateGoogleDriveUrlDetailed(url);
    
    if (!validation.isValid) {
      return {
        isValid: false,
        error: validation.error || 'Invalid Google Drive URL format',
        errorCode: validation.errorCode
      };
    }

    // Try the docs.google.com format first (potentially better CORS support)
    const docsUrl = convertGoogleDriveToDocsUrl(url);
    return {
      isValid: true,
      directUrl: docsUrl,
      fileId: validation.fileId,
      alternativeUrls: [
        convertGoogleDriveToStreamingUrl(url), // Fallback option
        convertGoogleDriveUrl(url) // Another fallback
      ]
    };
  } catch (error) {
    let errorMessage = 'Unknown error processing URL';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Try to extract error code from message if available
      if (error.message.includes('extract file ID')) {
        errorCode = 'INVALID_FILE_ID';
      } else if (error.message.includes('domain')) {
        errorCode = 'INVALID_DOMAIN';
      } else if (error.message.includes('format')) {
        errorCode = 'MALFORMED_URL';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return {
      isValid: false,
      error: errorMessage,
      errorCode
    };
  }
}

/**
 * Get user-friendly error message based on error code
 * @param errorCode - The error code from validation
 * @returns User-friendly error message
 */
export function getGoogleDriveErrorMessage(errorCode?: string): string {
  switch (errorCode) {
    case 'EMPTY_URL':
      return 'No audio source provided. Please add an audio link to this program.';
    case 'INVALID_TYPE':
      return 'Invalid audio source format. Please provide a valid audio URL.';
    case 'INVALID_DOMAIN':
      return 'Audio source must be from a supported hosting service.';
    case 'MALFORMED_URL':
      return 'Invalid URL format. Please check the audio link and try again.';
    case 'INVALID_FILE_ID':
      return 'Cannot access this audio file. Please check sharing permissions and URL format.';
    case 'SUSPICIOUS_URL':
      return 'This URL cannot be processed for security reasons.';
    case 'CORS_ERROR':
      return 'Audio file cannot be played due to browser security restrictions. Consider using a different hosting service.';
    default:
      return 'Unable to process the audio source. Please check the audio link.';
  }
}

/**
 * Recommended audio hosting services that work well with web browsers
 */
export const RECOMMENDED_AUDIO_HOSTS = [
  {
    name: 'SoundCloud',
    description: 'Free audio hosting with embed support',
    example: 'https://soundcloud.com/user/track',
    corsSupport: true
  },
  {
    name: 'Archive.org',
    description: 'Free, reliable hosting with CORS support',
    example: 'https://archive.org/download/item/file.mp3',
    corsSupport: true
  },
  {
    name: 'Dropbox',
    description: 'Change dl=0 to dl=1 in share URLs',
    example: 'https://dropbox.com/s/abc123/file.mp3?dl=1',
    corsSupport: true
  },
  {
    name: 'Direct Server URLs',
    description: 'Host files on your own server or CDN',
    example: 'https://yourserver.com/audio/file.mp3',
    corsSupport: true
  }
];

/**
 * Check if a URL is from a CORS-friendly audio hosting service
 * @param url - The URL to check
 * @returns Whether the URL is likely to work with CORS
 */
export function isCorsFreindlyAudioUrl(url: string): boolean {
  const corsFriendlyDomains = [
    'archive.org',
    'soundcloud.com',
    'dropbox.com',
    // Add more as needed
  ];
  
  return corsFriendlyDomains.some(domain => url.includes(domain)) ||
         url.includes('dl=1') || // Dropbox direct download
         !url.includes('drive.google.com'); // Assume non-Google Drive URLs might work
}