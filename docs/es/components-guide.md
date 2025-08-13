# Guía de Componentes

Esta guía ofrece una visión general de los componentes clave y su rol en el sistema multilingüe, de contenido dinámico y radio en vivo.

## Componentes Principales

### `LanguageRouter`
- Maneja la detección de idioma, rutas con subdirectorios (`/es`, `/pt`, ...), y fallback al idioma por defecto.
- Integra React Router e i18n.

### `Navigation`
- Combina ítems de menú estáticos y dinámicos.
- Los ítems dinámicos se generan desde `public/content.json` (auto-indexado desde Markdown en `src/content/{lang}/`).
- Sensible al idioma: la navegación se adapta al idioma y contenido disponible.

### `RadioPlayerSection` & `RadioPlayer`
- `RadioPlayerSection`: Wrapper para el reproductor de radio, con título/descripción opcional.
- `RadioPlayer`: Reproductor de audio personalizado con carátula, ticker, play/pause y control de volumen. Usa contextos para el estado de audio.

### `TwitchPlayer`
- Embebe el stream de Twitch en vivo.
- Detecta ad-blockers/Brave y ofrece fallback amigable si es bloqueado.
- Configurado por variables de entorno para canal, dominios y tamaño.

### `CountdownTeaser`
- Muestra cuenta regresiva a un lanzamiento/evento (desde env vars).
- Usa el hook `useCountdown` y el componente `CountdownUnit`.

### `PagesLayout` & `Layout`
- `PagesLayout`: Envuelve todas las páginas con video de fondo y contexto de audio.
- `Layout`: Maneja navegación, contenido principal y footer (con redes sociales y botón de Patreon).

### `DebugBar`
- Muestra info de debug en vivo (idioma, contextos, etc) en entornos no productivos.
- Usa `DebugContext` y `useLanguageDebugInfo`.

## Sistema de Contenido Dinámico

- Los archivos Markdown en `src/content/{lang}/` se indexan automáticamente en `public/content.json` en tiempo de build.
- Cada entrada puede definir etiquetas de menú, slugs y visibilidad por idioma.
- La navegación y rutas se generan en base a este contenido.

## Extender el Sistema

- **Agregar un nuevo idioma:**
	- Añade a `VITE_SUPPORTED_LANGUAGES` en env.
	- Crea archivo de traducción en `src/lang/` y carpeta de contenido en `src/content/{lang}/`.
- **Agregar nuevo contenido/página:**
	- Agrega un archivo Markdown en la carpeta de idioma correspondiente.
	- Aparecerá en navegación y rutas tras rebuild.

---
Para más, ver [Estructura del Proyecto](./project-structure.md) y [Variables de Entorno](./environment-variables.md).
