/**
 * Debug Logger Utility
 * 
 * This module provides a logging mechanism that only displays logs
 * when debug mode is enabled via environment configuration.
 * 
 * Usage:
 * - logger.debug('Debug message')
 * - logger.info('Info message')
 * - logger.warn('Warning message')
 * - logger.error('Error message')
 */

import { isDebugMode } from '../config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogData = string | number | boolean | object | null | undefined;

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: LogData;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: LogData): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    if (!isDebugMode()) {
      return;
    }

    const logMessage = this.formatMessage(level, message, data);
    const prefix = `[${logMessage.timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
      default:
        console.log(prefix, message, data || '');
    }
  }

  /**
   * Log debug messages
   */
  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }

  /**
   * Log info messages
   */
  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  /**
   * Log error messages
   */
  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }

  /**
   * Log environment configuration (useful for debugging)
   */
  logEnvConfig(): void {
    if (!isDebugMode()) {
      return;
    }

    this.info('Environment Configuration Loaded', {
      environment: import.meta.env.VITE_APP_ENVIRONMENT,
      debug: import.meta.env.VITE_APP_DEBUG,
      launchingDate: import.meta.env.VITE_LAUNCHING_DATE,
      twitchPlayerSize: import.meta.env.VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    });
  }

  /**
   * Log build information
   */
  logBuildInfo(): void {
    if (!isDebugMode()) {
      return;
    }

    this.info('Build Information', {
      baseUrl: import.meta.env.BASE_URL,
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      isSSR: import.meta.env.SSR,
    });
  }
}

// Export singleton logger instance
export const logger = new Logger();

// Auto-log environment configuration on module load
logger.logEnvConfig();
logger.logBuildInfo();
