# Environment Configuration

This document explains how to configure environment variables for different deployment environments.

## Environment Files

The application supports multiple environment configurations:

- `.env` - Production environment (default)
- `.env.development` - Development environment  
- `.env.feature` - Feature environment
- `.env.local` - Local development (overrides all others, not committed)

## Available Environment Variables

### VITE_APP_ENVIRONMENT
- **Type**: String
- **Values**: `production`, `local`, `feature`
- **Description**: Specifies the current application environment

### VITE_APP_DEBUG
- **Type**: Boolean
- **Values**: `true`, `false`
- **Description**: Enables/disables debug logging in the browser console

### VITE_LAUNCHING_DATE
- **Type**: String (ISO 8601 format)
- **Default**: `2025-08-09T12:00:00-03:00`
- **Description**: The target launch date for the countdown timer

### VITE_TWITCH_SRC_URL
- **Type**: String (URL)
- **Description**: The Twitch player embed URL with all necessary parameters

### VITE_STREAM_URL
- **Type**: String (URL)
- **Description**: The direct Twitch channel URL for fallback links

### VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT
- **Type**: Integer
- **Range**: 1-100
- **Description**: Percentage of browser viewport that the Twitch player should occupy while maintaining 16:9 aspect ratio

## Build Commands

Build for different environments using:

```bash
# Production build
npm run build
# or
npm run build:production

# Development build
npm run build:dev

# Feature build
npm run build:feature
```

## Debug Logging

When `VITE_APP_DEBUG=true`, the application will output detailed logs to the browser console including:

- Environment configuration on startup
- Component lifecycle events
- Countdown timer updates
- Twitch player status
- Navigation events

## Environment Priority

Vite loads environment files in this priority order (highest to lowest):

1. `.env.local` (always ignored by git)
2. `.env.[mode]` (e.g., `.env.development`)
3. `.env`

## Security Notes

- Never commit sensitive data to environment files that are tracked by git
- Use `.env.local` for sensitive local development variables
- All environment variables are exposed to the client-side code (prefixed with `VITE_`)
- Do not store secrets or API keys in these files
