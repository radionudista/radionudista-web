/**
 * Environment Variables Test
 * 
 * This utility helps verify that all environment variables are properly configured
 * and accessible in the application.
 */

import { env, isDebugMode, isProduction, isDevelopment, isFeature } from '../config/env';
import { logger } from '../utils/logger';

export const testEnvironmentVariables = () => {
  logger.info('=== Environment Variables Test ===');
  
  logger.info('Environment Configuration:', {
    APP_ENVIRONMENT: env.APP_ENVIRONMENT,
    APP_DEBUG: env.APP_DEBUG,
    LAUNCHING_DATE: env.LAUNCHING_DATE,
    TWITCH_SRC_URL: env.TWITCH_SRC_URL,
    STREAM_URL: env.STREAM_URL,
    TWITCH_PLAYER_WINDOW_SIZE_PERCENT: env.TWITCH_PLAYER_WINDOW_SIZE_PERCENT,
  });

  logger.info('Environment Checks:', {
    isDebugMode: isDebugMode(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isFeature: isFeature(),
  });

  // Validate launch date
  try {
    const launchDate = new Date(env.LAUNCHING_DATE);
    logger.info('Launch Date Validation:', {
      originalString: env.LAUNCHING_DATE,
      parsedDate: launchDate.toISOString(),
      isValid: !isNaN(launchDate.getTime()),
    });
  } catch (error) {
    logger.error('Launch Date Error:', error);
  }

  // Validate player size percentage
  if (env.TWITCH_PLAYER_WINDOW_SIZE_PERCENT < 1 || env.TWITCH_PLAYER_WINDOW_SIZE_PERCENT > 100) {
    logger.warn('Player size percentage should be between 1 and 100', {
      current: env.TWITCH_PLAYER_WINDOW_SIZE_PERCENT
    });
  }

  logger.info('=== Environment Test Complete ===');
};

// Auto-run test in development
if (isDevelopment() && isDebugMode()) {
  testEnvironmentVariables();
}
