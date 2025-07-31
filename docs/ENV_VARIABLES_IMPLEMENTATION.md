# Environment Variables Implementation

This document describes the environment variable configuration system implemented for the Nudista Radio Aura Glass project.

## Overview

The project now supports environment-specific configurations through Vite's environment variable system. This allows for different settings across development, production, and feature environments without modifying code.

## Environment Variables

### Available Variables

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `VITE_APP_ENVIRONMENT` | string | Application environment (`production`, `local`, `feature`) | `local` |
| `VITE_APP_DEBUG` | boolean | Enable debug logging in browser console | `false` |
| `VITE_LAUNCHING_DATE` | string | ISO date string for countdown target | `2025-08-09T12:00:00-03:00` |
| `VITE_TWITCH_SRC_URL` | string | Twitch player iframe source URL | Default Twitch URL |
| `VITE_STREAM_URL` | string | Direct Twitch stream URL for fallbacks | `https://twitch.tv/radionudista` |
| `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` | number | Player size as percentage of browser canvas (maintains 16:9 ratio) | `70` |

### Environment Files

- `.env` - Production environment (default)
- `.env.development` - Development environment  
- `.env.feature` - Feature branch environment

## Build Scripts

| Script | Environment | Description |
|--------|-------------|-------------|
| `npm run dev` | development | Start development server with debug logging |
| `npm run build` | production | Build for production (no debug logs) |
| `npm run build:dev` | development | Build development version |
| `npm run build:feature` | feature | Build feature version |
| `npm run build:production` | production | Build production version |

## Logging System

The project includes a debug logging utility that only outputs to console when `VITE_APP_DEBUG=true`.

### Usage

```typescript
import { logger } from '../utils/logger';

// Only logs when debug mode is enabled
logger.debug('Debug message', { data: 'optional' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Log Levels

- `debug` - Detailed debugging information
- `info` - General information 
- `warn` - Warning messages
- `error` - Error messages

## Configuration Access

```typescript
import { env, isDebugMode, isProduction } from '../config/env';

// Access environment variables
const twitchUrl = env.TWITCH_SRC_URL;
const launchDate = new Date(env.LAUNCHING_DATE);

// Environment checks
if (isDebugMode()) {
  console.log('Debug mode enabled');
}
```

## Dynamic Player Sizing

The Twitch player now dynamically sizes based on the `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` variable while maintaining the 16:9 aspect ratio.

```typescript
import { getDynamicPlayerSize } from '../constants/mediaConstants';

// Get dynamic sizing styles
const playerStyles = getDynamicPlayerSize('VIDEO_16_9');
```

## Implementation Details

### Files Modified

- **Environment Configuration**: `src/config/env.ts`
- **Logging Utility**: `src/utils/logger.ts`
- **Media Constants**: Updated `src/constants/mediaConstants.ts`
- **Components Updated**:
  - `src/pages/Index.tsx` - Uses env for launch date
  - `src/components/TwitchPlayer.tsx` - Uses env for URLs and sizing
  - `src/components/CountdownTeaser.tsx` - Added debug logging

### Type Safety

All environment variables are typed and validated at runtime with helpful error messages for missing required variables.

### Backward Compatibility

The implementation maintains full backward compatibility. All existing functionality remains unchanged, with hardcoded values replaced by configurable environment variables.

## Examples

### Development Environment (.env.development)
```bash
VITE_APP_ENVIRONMENT=local
VITE_APP_DEBUG=true
VITE_LAUNCHING_DATE=2025-08-09T12:00:00-03:00
VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT=80
```

### Production Environment (.env)
```bash
VITE_APP_ENVIRONMENT=production
VITE_APP_DEBUG=false
VITE_LAUNCHING_DATE=2025-08-09T12:00:00-03:00
VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT=70
```

## Browser Console Output (Debug Mode)

When `VITE_APP_DEBUG=true`, you'll see logs like:

```
[2025-07-24T12:46:00.000Z] [INFO] Environment Configuration Loaded { environment: "local", debug: "true", ... }
[2025-07-24T12:46:01.000Z] [INFO] Index page loaded { launchDate: "2025-08-09T15:00:00.000Z", ... }
[2025-07-24T12:46:02.000Z] [DEBUG] CountdownTeaser rendered { targetDate: "2025-08-09T15:00:00.000Z", ... }
```
