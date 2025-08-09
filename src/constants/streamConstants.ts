import { env } from '../config/env';

/**
 * Stream configuration URLs - Now using environment variables
 */
export const STREAM_CONFIG = {
  streamUrl: env.RADIO_STREAM_URL,
  statusUrl: env.RADIO_STATUS_URL,
  twitchChannel: env.TWITCH_CHANNEL
} as const;

