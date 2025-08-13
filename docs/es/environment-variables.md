# Variables de Entorno

La aplicación usa variables de entorno (todas con prefijo `VITE_`) para configuración. Se cargan desde `.env`, `.env.[mode]` y `.env.[mode].local` en la raíz del proyecto. Vite las expone vía `import.meta.env`.

## Variables Clave

| Variable | Descripción | Ejemplo/Default |
| --- | --- | --- |
| `VITE_APP_ENVIRONMENT` | Entorno: `production`, `local`, o `feature` | `local` |
| `VITE_APP_DEBUG` | Habilita barra de debug y logs extra | `true` |
| `VITE_LAUNCHING_DATE` | Fecha ISO para teaser de cuenta regresiva | `2025-08-09T12:00:00-03:00` |
| `VITE_DEV_LAUNCHING_SECONDS` | Para dev: segundos hasta lanzamiento (override) | `2` |
| `VITE_TWITCH_CHANNEL` | Canal de Twitch | `radionudista` |
| `VITE_TWITCH_STATIC_PARENTS` | Dominios parent para embed de Twitch | `radionudista.com,localhost` |
| `VITE_STREAM_URL` | URL directa de Twitch | `https://twitch.tv/radionudista` |
| `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` | Tamaño del player Twitch (%) | `100` |
| `VITE_RADIO_STREAM_URL` | URL del stream de radio (audio) | `https://servidor30.brlogic.com:7024/live` |
| `VITE_RADIO_STATUS_URL` | API de estado de radio | *(ver .env)* |
| `VITE_RADIO_INFO_URL` | API de info de radio | *(ver .env)* |
| `VITE_RADIO_INFO_API_URL` | API de info de radio (alt) | *(ver .env)* |
| `VITE_RADIO_STATUS_POLL_INTERVAL` | Intervalo de polling (ms) | `500` o `10000` |
| `VITE_SUPPORTED_LANGUAGES` | Lista de idiomas soportados | `es,pt` |
| `VITE_DEFAULT_LANGUAGE` | Idioma por defecto | `es` |

## Cómo Agregar o Cambiar Variables

1. Agrega la variable al archivo `.env` correspondiente. Usa prefijo `VITE_` para exponerla al cliente.
2. (Opcional) Agrega a `src/vite-env.d.ts` para autocompletado TypeScript.
3. Usa en código como `import.meta.env.VITE_TU_VARIABLE` o vía el objeto `env` en `src/config/env.ts`.

## Notas

- Todas las URLs, listas de idiomas y toggles de features se controlan por env vars.
- ¿Agregas un idioma? Añádelo a `VITE_SUPPORTED_LANGUAGES` y provee archivo de traducción en `src/lang/` y contenido en `src/content/{lang}/`.
- Para dev local, usa `.env.development`. Para producción, `.env.production`.

---
Ver también: [Primeros Pasos](./getting-started.md) y [Guía de Componentes](./components-guide.md).
