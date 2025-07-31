/**
 * Environment Configuration
 * 
 * This module provides type-safe access to environment variables
 * and centralized configuration management for the application.
 */

export type AppEnvironment = 'production' | 'local' | 'feature';

export interface EnvConfig {
  APP_ENVIRONMENT: AppEnvironment;
  APP_DEBUG: boolean;
  LAUNCHING_DATE: string;
  TWITCH_CHANNEL: string;
  TWITCH_STATIC_PARENTS: string;
  STREAM_URL: string;
  TWITCH_PLAYER_WINDOW_SIZE_PERCENT: number;
  DEV_LAUNCHING_SECONDS: number;
}

/**
 * Get environment variable with type checking
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[`VITE_${key}`];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable VITE_${key} is not defined`);
  }
  return value || defaultValue || '';
};

/**
 * Get boolean environment variable
 */
const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
};

/**
 * Get number environment variable
 */
const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = getEnvVar(key, defaultValue?.toString());
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable VITE_${key} must be a number, got: ${value}`);
  }
  return parsed;
};

/**
 * Application environment configuration
 */
export const env: EnvConfig = {
  APP_ENVIRONMENT: getEnvVar('APP_ENVIRONMENT', 'local') as AppEnvironment,
  APP_DEBUG: getEnvBoolean('APP_DEBUG', false),
  LAUNCHING_DATE: getEnvVar('LAUNCHING_DATE', '2025-08-09T12:00:00-03:00'),
  TWITCH_CHANNEL: getEnvVar('TWITCH_CHANNEL', 'radionudista'),
  TWITCH_STATIC_PARENTS: getEnvVar('TWITCH_STATIC_PARENTS', 'localhost'),
  STREAM_URL: getEnvVar('STREAM_URL', 'https://twitch.tv/radionudista'),
  TWITCH_PLAYER_WINDOW_SIZE_PERCENT: getEnvNumber('TWITCH_PLAYER_WINDOW_SIZE_PERCENT', 70),
  DEV_LAUNCHING_SECONDS: getEnvNumber('DEV_LAUNCHING_SECONDS', -1),
};

/**
 * Utility functions for environment checking
 */
export const isProduction = () => env.APP_ENVIRONMENT === 'production';
export const isDevelopment = () => env.APP_ENVIRONMENT === 'local';
export const isFeature = () => env.APP_ENVIRONMENT === 'feature';
export const isDebugMode = () => env.APP_ENVIRONMENT !== 'production' && env.APP_DEBUG;
