# Components Guide

This guide provides an overview of the key components and their roles in the multilingual, dynamic content, and live radio system.

## Core Components

### `LanguageRouter`
- Handles language detection, subdirectory-based routing (`/es`, `/pt`, ...), and fallback to default language.
- Integrates with React Router and i18n.

### `Navigation`
- Combines static and dynamic menu items.
- Dynamic items are generated from `public/content.json` (auto-indexed from Markdown in `src/content/{lang}/`).
- Language-aware: navigation adapts to current language and available content.

### `RadioPlayerSection` & `RadioPlayer`
- `RadioPlayerSection`: Section wrapper for the radio player, with optional title/description.
- `RadioPlayer`: Custom audio player with cover art, ticker, play/pause, and volume control. Uses context for audio state.

### `TwitchPlayer`
- Embeds the Twitch live stream.
- Detects ad-blockers/Brave and provides a user-friendly fallback if blocked.
- Configured via environment variables for channel, parent domains, and size.

### `CountdownTeaser`
- Displays a countdown to a launch/event date (from env vars).
- Uses the `useCountdown` hook for logic and `CountdownUnit` for display.

### `PagesLayout` & `Layout`
- `PagesLayout`: Wraps all pages with background video and audio context.
- `Layout`: Handles navigation, main content, and footer (with social links and Patreon button).

### `DebugBar`
- Shows live debug info (language, context, etc) in non-production environments.
- Uses `DebugContext` and `useLanguageDebugInfo` for state.

## Dynamic Content System

- Markdown files in `src/content/{lang}/` are auto-indexed at build time into `public/content.json`.
- Each content entry can define menu labels, slugs, and visibility per language.
- Navigation and routes are generated based on this content.

## Extending the System

- **Add a new language:**
	- Add to `VITE_SUPPORTED_LANGUAGES` in env.
	- Create a translation file in `src/lang/` and content folder in `src/content/{lang}/`.
- **Add new content/page:**
	- Add a Markdown file in the appropriate language folder.
	- It will appear in navigation and routes after rebuild.

---
For more, see [Project Structure](./project-structure.md) and [Environment Variables](./environment-variables.md).
