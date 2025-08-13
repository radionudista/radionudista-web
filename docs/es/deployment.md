# Despliegue

Esta guía explica cómo desplegar Nudista Radio Aura Glass en cualquier proveedor de hosting estático, con notas especiales para contenido multilingüe/estático y variables de entorno.

---

## 1. Build para Producción

Ejecuta:
```bash
bun run build
# o npm run build
```
Esto genera el directorio `dist/` con todos los archivos estáticos (HTML, JS, CSS, imágenes, content.json, etc). Todas las rutas de idiomas/contenido se pre-generan.

## 2. Elige un Proveedor de Hosting

Cualquier host de sitios estáticos funciona, por ejemplo:
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [AWS S3 + CloudFront](https://aws.amazon.com/s3/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

Puedes usar subida manual o conectar tu repo para despliegue continuo.

## 3. Configura Variables de Entorno

**Importante:** Define todas las variables `VITE_` requeridas en el panel de tu proveedor. Ver [Variables de Entorno](./environment-variables.md) para la lista completa. Claves:
- `VITE_TWITCH_CHANNEL`, `VITE_TWITCH_STATIC_PARENTS`, `VITE_STREAM_URL`
- `VITE_LAUNCHING_DATE`, `VITE_SUPPORTED_LANGUAGES`, `VITE_DEFAULT_LANGUAGE`
- Otras usadas para contenido, radio o debug

Si usas dominio propio, incluye tu dominio en `VITE_TWITCH_STATIC_PARENTS`.

## 4. Despliega

### Manual
Sube el contenido de `dist/` a tu host estático.

### Despliegue Continuo (Recomendado)
1. Sube tu repo a GitHub/GitLab/Bitbucket.
2. Conéctalo a tu proveedor de hosting.
3. Comando de build: `bun run build` o `npm run build`
4. Directorio de publicación: `dist`
5. Comando de instalación: `bun install` o `npm install`
6. Agrega todas las variables de entorno requeridas.
7. ¡Despliega!

## Notas Multilingües y de Contenido Estático

- Todas las rutas de idiomas y contenido se pre-generan en build. No se necesita lógica server-side.
- ¿Agregas un idioma o archivo? Solo agrégalo y rebuild/despliega.
- `public/content.json` se auto-genera y se usa para navegación/contenido dinámico.

## Ejemplo: Cloudflare Pages

1. Conecta tu repo y define el comando de build como `bun run build` (o `npm run build` si Bun no está soportado).
2. Directorio de publicación: `dist`.
