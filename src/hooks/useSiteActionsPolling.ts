import { useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

interface SiteActions {
  'dont-relaod'?: boolean;
  'dont-reload'?: boolean; // Also check for correct spelling
}

/**
 * Custom hook for polling site actions and performing automatic reloads
 * 
 * Follows Single Responsibility Principle:
 * - Only responsible for polling and reload logic
 * 
 * Features:
 * - Polls site-actions.json every 5 seconds
 * - Non-cachable requests using timestamp query parameter
 * - Reloads site when dont-reload is false or missing
 * - Handles both "dont-relaod" (typo) and "dont-reload" (correct spelling)
 */
export const useSiteActionsPolling = (enabled: boolean = true) => {
  const checkSiteActions = useCallback(async () => {
    try {
      // Create non-cachable request with timestamp
      const timestamp = Date.now();
      const response = await fetch(`/site-actions.json?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        logger.warn('Failed to fetch site-actions.json', { status: response.status });
        return;
      }

      const siteActions: SiteActions = await response.json();
      
      // Check both possible spellings of the attribute
      const dontReload = siteActions['dont-relaod'] ?? siteActions['dont-reload'];
      
      logger.debug('Site actions polled', { 
        siteActions, 
        dontReload,
        timestamp: new Date().toISOString()
      });

      // If dont-reload is false or undefined, reload the site
      if (dontReload === false || dontReload === undefined) {
        logger.info('Site reload triggered by site-actions.json', { 
          dontReload,
          action: 'reloading_site'
        });
        
        // Reload the entire page
        window.location.reload();
      }

    } catch (error) {
      logger.error('Error polling site-actions.json', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    logger.info('Site actions polling started', { 
      interval: '5 seconds',
      enabled: true
    });

    // Start polling immediately
    checkSiteActions();

    // Set up interval for polling every 5 seconds
    const interval = setInterval(checkSiteActions, 5000);

    // Cleanup interval on unmount
    return () => {
      logger.info('Site actions polling stopped');
      clearInterval(interval);
    };
  }, [enabled, checkSiteActions]);

  return {
    checkSiteActions
  };
};
