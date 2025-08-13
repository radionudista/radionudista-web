# Environment Variables

The application uses environment variables (all prefixed with `VITE_`) for configuration. These are loaded from `.env`, `.env.[mode]`, and `.env.[mode].local` files in the project root. Vite exposes them via `import.meta.env`.

## Key Variables

| Variable | Description | Example/Default |
| --- | --- | --- |
| `VITE_APP_ENVIRONMENT` | App environment: `production`, `local`, or `feature` | `local` |
| `VITE_APP_DEBUG` | Enable debug bar and extra logging | `true` |
| `VITE_LAUNCHING_DATE` | ISO date for countdown teaser | `2025-08-09T12:00:00-03:00` |
| `VITE_DEV_LAUNCHING_SECONDS` | For dev: seconds until launch (overrides date) | `2` |
| `VITE_TWITCH_CHANNEL` | Twitch channel name | `radionudista` |
| `VITE_TWITCH_STATIC_PARENTS` | Comma-separated parent domains for Twitch embed | `radionudista.com,localhost` |
| `VITE_STREAM_URL` | Direct Twitch stream URL | `https://twitch.tv/radionudista` |
| `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` | Twitch player size (percent of canvas) | `100` |
| `VITE_RADIO_STREAM_URL` | Radio stream URL (audio) | `https://servidor30.brlogic.com:7024/live` |
| `VITE_RADIO_STATUS_URL` | Radio status API URL | *(see .env)* |
| `VITE_RADIO_INFO_URL` | Radio info API URL | *(see .env)* |
| `VITE_RADIO_INFO_API_URL` | Radio info API URL (alt) | *(see .env)* |
| `VITE_RADIO_STATUS_POLL_INTERVAL` | Poll interval for radio status (ms) | `500` or `10000` |
| `VITE_SUPPORTED_LANGUAGES` | Comma-separated list of supported languages | `es,pt` |
| `VITE_DEFAULT_LANGUAGE` | Default language code | `es` |

## How to Add or Change Variables

1. Add the variable to the relevant `.env` file(s). Prefix with `VITE_` to expose to client code.
2. (Optional) Add to `src/vite-env.d.ts` for TypeScript autocompletion.
3. Use in code as `import.meta.env.VITE_YOUR_VARIABLE` or via the `env` object in `src/config/env.ts`.

## Notes

- All URLs, language lists, and feature toggles are controlled via env vars.
- Adding a new language? Add it to `VITE_SUPPORTED_LANGUAGES` and provide a translation file in `src/lang/` and content in `src/content/{lang}/`.
- For local dev, use `.env.development`. For production, use `.env.production`.

---
See also: [Getting Started](./getting-started.md) and [Component Guide](./components-guide.md).
