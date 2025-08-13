# Uso y Build

Este documento explica cómo ejecutar, build y lint la aplicación, incluyendo las características multilingües y de contenido dinámico.

## Servidor de Desarrollo

Inicia el servidor de desarrollo:
```bash
bun run dev
# o npm run dev
```
La app estará disponible en `http://localhost:5173` (o como esté configurado). HMR está habilitado.

## Build de la Aplicación

El proyecto soporta varios modos de build. Todos los builds salen en el directorio `dist/`.

- **Build de Desarrollo:**
	```bash
	bun run build:dev
	# o npm run build:dev
	```
	Usa `.env.development` y es ideal para pruebas locales/staging.

- **Build de Feature:**
	```bash
	bun run build:feature
	# o npm run build:feature
	```
	Usa `.env.feature` para builds de ramas feature.

- **Build de Producción:**
	```bash
	bun run build
	# o npm run build
	# o bun run build:production
	```
	Usa `.env.production` para output optimizado y minificado.

### Multilingüe & Indexado de Contenido

- En build, todo el contenido Markdown en `src/content/{lang}/` se indexa automáticamente en `public/content.json`.
- El build produce rutas y navegación específicas por idioma según el contenido y traducciones disponibles.
- Agregar nuevos idiomas o contenido es automático—solo agrega archivos y rebuild.

## Previsualizar el Build de Producción

Tras build, previsualiza el output localmente:
```bash
bun run preview
# o npm run preview
```
Esto sirve la carpeta `dist` para chequeos finales antes de deploy.

## Linting

Chequea errores de lint y estilo:
```bash
bun run lint
```
