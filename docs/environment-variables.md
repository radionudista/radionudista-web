# Environment Variables

The application uses environment variables to manage configuration for different environments. Vite exposes environment variables on the special `import.meta.env` object.

These variables are loaded from the following files in your project root:

-   `.env`: Loaded in all cases.
-   `.env.local`: Loaded in all cases, ignored by git.
-   `.env.[mode]`: Only loaded in the specified mode.
-   `.env.[mode].local`: Only loaded in the specified mode, ignored by git.

The build scripts in `package.json` use the `--mode` flag to specify the context (e.g., `development`, `production`).

## Available Variables

Here are the key environment variables used in the application:

| Variable | Description | Default Value | Example |
| --- | --- | --- | --- |
| `VITE_APP_TITLE` | The title of the application, used in the browser tab. | `Nudista Radio` | `Nudista Radio Live` |
| `VITE_TARGET_DATE` | The target date and time for the countdown timer, in ISO 8601 format. | `2025-12-31T23:59:59` | `2025-08-15T20:00:00` |
| `VITE_TWITCH_CHANNEL` | The name of the Twitch channel to be embedded. | `nudistaradio` | `monstercat` |
| `VITE_TWITCH_PARENT` | The parent domain for the embedded Twitch player. This is a required security feature by Twitch. | `localhost` | `nudistaradio.com` |
| `VITE_PASSWORD_PROTECT` | Set to `'true'` to enable password protection for the site. | `'false'` | `'true'` |
| `VITE_SITE_PASSWORD` | The password to access the site if password protection is enabled. | `""` | `your-secret-password` |
| `VITE_MAINTENANCE_MODE` | Set to `'true'` to enable maintenance mode, which can show a specific page or message. | `'false'` | `'true'` |
| `VITE_SHOW_COUNTDOWN` | Set to `'true'` to display the countdown timer component. | `'true'` | `'false'` |
| `VITE_SHOW_TWITCH_PLAYER` | Set to `'true'` to display the Twitch player component. | `'true'` | `'false'` |
| `VITE_DEBUG_MODE` | Set to `'true'` to enable the debug bar and other debugging features. | `'false'` | `'true'` |

## How to Add a New Environment Variable

1.  **Add the variable** to the relevant `.env` files (e.g., `.env.development`, `.env.production`). Remember to prefix it with `VITE_` to expose it to the client-side code.
2.  **Add TypeScript definition**: For TypeScript autocompletion, add the variable to `src/vite-env.d.ts`:
    ```typescript
    // /src/vite-env.d.ts
    /// <reference types="vite/client" />

    interface ImportMetaEnv {
      readonly VITE_APP_TITLE: string;
      readonly VITE_NEW_VARIABLE: string; // Add your new variable here
      // other env variables...
    }

    interface ImportMeta {
      readonly env: ImportMetaEnv;
    }
    ```
3.  **Use it in your code**: You can now access the variable in your application code using `import.meta.env.VITE_NEW_VARIABLE`.

