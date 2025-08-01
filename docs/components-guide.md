# Components Guide

This guide provides an overview of the key components in the application, with a focus on those that are configurable or have significant business logic.

## Countdown Timer (`CountdownTeaser.tsx`)

The countdown timer is implemented in `src/components/CountdownTeaser.tsx`. It displays a countdown to a specific date and time.

### Configuration

The countdown is configured via environment variables:

-   `VITE_TARGET_DATE`: The target date and time for the countdown, in ISO 8601 format (e.g., `2025-12-31T23:59:59`).
-   `VITE_SHOW_COUNTDOWN`: A boolean (`'true'` or `'false'`) that controls the visibility of the entire countdown component.

### Logic

-   The component uses the `useCountdown` custom hook (`src/hooks/useCountdown.ts`) to calculate the time remaining.
-   The hook takes the target date as an argument and returns the remaining days, hours, minutes, and seconds.
-   The `CountdownTeaser` component then renders these values using the `CountdownUnit` presentational component.
-   If the target date is reached, the countdown will display all zeros.

### Usage

The component is rendered conditionally in `src/pages/Index.tsx` based on the `VITE_SHOW_COUNTDOWN` variable:

```tsx
// src/pages/Index.tsx
import CountdownTeaser from '@/components/CountdownTeaser';

// ...
{import.meta.env.VITE_SHOW_COUNTDOWN === 'true' && <CountdownTeaser />}
// ...
```

## Twitch Player (`TwitchPlayer.tsx`)

The Twitch player, located at `src/components/TwitchPlayer.tsx`, embeds a Twitch stream and its corresponding chat into the application.

### Configuration

The player is configured using the following environment variables:

-   `VITE_TWITCH_CHANNEL`: The name of the Twitch channel to display (e.g., `nudistaradio`).
-   `VITE_TWITCH_PARENT`: The domain where the application is hosted. This is a security requirement from Twitch to allow embedding. For local development, this should be `localhost`. For production, it must be the public domain of your site (e.g., `nudistaradio.com`).
-   `VITE_SHOW_TWITCH_PLAYER`: A boolean (`'true'` or `'false'`) to control the visibility of the player.

### Implementation

-   The component uses the official `twitch-embed` library, which is loaded via a script in the component.
-   It creates two `div` elements, one for the video player and one for the chat.
-   A `useEffect` hook initializes the `Twitch.Embed` object with the channel and parent domain from the environment variables.
-   The player and chat are rendered inside a responsive container.

### Usage

The component is conditionally rendered in `src/pages/Index.tsx` based on the `VITE_SHOW_TWITCH_PLAYER` variable:

```tsx
// src/pages/Index.tsx
import TwitchPlayer from '@/components/TwitchPlayer';

// ...
{import.meta.env.VITE_SHOW_TWITCH_PLAYER === 'true' && <TwitchPlayer />}
// ...
```

