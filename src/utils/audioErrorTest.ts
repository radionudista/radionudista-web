/**
 * Test file to verify enhanced error handling functionality
 * This file can be used for manual testing of the new error handling features
 */

import { validateGoogleDriveUrlDetailed, processGoogleDriveUrl, getGoogleDriveErrorMessage } from './googleDriveUtils';
import { AudioService } from '../services/audioService';

// Test cases for Google Drive URL validation
export const testGoogleDriveValidation = () => {
  console.log('=== Testing Google Drive URL Validation ===');
  
  const testCases = [
    '',
    'not-a-url',
    'https://example.com/file.mp3',
    'https://drive.google.com/file/d/abc123/view',
    'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing',
    'javascript:alert("xss")',
    'https://drive.google.com/file/d/malformed-id-too-short/view'
  ];
  
  testCases.forEach((url, index) => {
    console.log(`\nTest ${index + 1}: "${url}"`);
    const result = validateGoogleDriveUrlDetailed(url);
    console.log('Result:', result);
    if (!result.isValid && result.errorCode) {
      console.log('User-friendly message:', getGoogleDriveErrorMessage(result.errorCode));
    }
  });
};

// Test cases for audio format validation
export const testAudioValidation = async () => {
  console.log('\n=== Testing Audio Format Validation ===');
  
  const testUrls = [
    'https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3', // Valid MP3
    'https://invalid-domain.com/nonexistent.mp3', // Network error
    'https://drive.google.com/uc?export=download&id=invalid', // Invalid file
  ];
  
  for (const url of testUrls) {
    console.log(`\nTesting: ${url}`);
    try {
      const result = await AudioService.validateAudioUrlDetailed(url);
      console.log('Validation result:', result);
      
      if (!result.isValid) {
        console.log('Testing retry logic...');
        const retryResult = await AudioService.validateAudioUrlWithRetry(url, 2, 500);
        console.log('Retry result:', retryResult);
      }
    } catch (error) {
      console.error('Test error:', error);
    }
  }
};

// Test browser audio format support
export const testAudioFormatSupport = () => {
  console.log('\n=== Testing Audio Format Support ===');
  
  const support = AudioService.checkAudioFormatSupport();
  console.log('Browser audio format support:', support);
  
  const recommended = AudioService.getRecommendedAudioFormats();
  console.log('Recommended formats:', recommended);
};

// Run all tests (uncomment to use)
// testGoogleDriveValidation();
// testAudioValidation();
// testAudioFormatSupport();