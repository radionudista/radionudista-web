# Change: Add Twitch-Only Player Page

## Why

Users need a dedicated, distraction-free view of the Twitch stream without the full radio website UI. This provides a focused streaming experience for events, live shows, or when users want to watch the stream without navigation elements.

## What Changes

- Add new route `/twitch-player` that displays only the Twitch player
- Center the player on screen with Radio Nudista logo overlay
- Hide all website navigation and content except background video
- Use existing `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` config for player sizing
- Maintain privacy/ad-blocker detection and fallback functionality

## Impact

- Affected specs: twitch-player capability
- Affected code: App routing, new page component, existing TwitchPlayer component
- No breaking changes to existing functionality
- New route accessible alongside existing `/twitch` route
