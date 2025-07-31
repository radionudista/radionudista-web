/**
 * Twitch Player URL Generator
 * 
 * This utility dynamically constructs the Twitch player URL,
 * incorporating the current domain to satisfy Twitch's parent requirement.
 */
import { env } from '../config/env';
import { logger } from './logger';

/**
 * Constructs the Twitch player URL with dynamic parent domains.
 * 
 * @returns {string} The full Twitch player URL.
 */
export const getTwitchPlayerUrl = (): string => {
  const baseUrl = 'https://player.twitch.tv/';
  const channel = env.TWITCH_CHANNEL;
  
  // Start with static parents from the .env file
  const staticParents = env.TWITCH_STATIC_PARENTS.split(',').map(p => p.trim());
  
  // Dynamically add the current hostname
  const dynamicParents = [window.location.hostname];
  
  // Combine and deduplicate parents
  const allParents = [...new Set([...staticParents, ...dynamicParents])];
  
  // Construct the parent query string
  const parentQuery = allParents.map(p => `parent=${p}`).join('&');
  
  const url = `${baseUrl}?channel=${channel}&${parentQuery}&autoplay=true&muted=false`;
  
  logger.info('Generated Twitch Player URL', {
    url,
    channel,
    staticParents,
    dynamicParents,
    allParents
  });
  
  return url;
};
