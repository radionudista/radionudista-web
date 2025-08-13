# Estructura del Proyecto

Este proyecto está organizado para modularidad, soporte multilingüe y contenido dinámico. Directorios y archivos clave:

```
/                  # Raíz del proyecto
├── dist/          # Build output
├── docs/          # Documentación (Markdown)
├── public/        # Assets estáticos (imágenes, fuentes, content.json, etc)
├── src/           # Código fuente
│   ├── components/    # UI, reproductor, navegación, layout, etc
│   │   ├── ui/        # Shadcn UI y componentes UI personalizados
│   │   └── ...        # Componentes específicos de la app
│   ├── config/        # Configuración de entorno e i18n
│   ├── constants/     # Constantes globales
│   ├── contexts/      # Providers de React context (audio, debug, etc)
│   ├── hooks/         # Custom React hooks
│   ├── lang/          # JSONs de traducción por idioma
│   ├── lib/           # Funciones utilitarias
│   ├── pages/         # Componentes de página top-level (para routing)
│   ├── plugins/       # Plugins Vite (multi-language build, content indexer)
│   ├── content/       # Contenido Markdown por idioma (ej: content/es/, content/pt/)
│   ├── utils/         # Utilidades misceláneas
│   ├── App.tsx        # Componente principal (providers, routing)
│   ├── main.tsx       # Entry point
│   └── index.css      # Estilos globales (Tailwind)
├── .env.*             # Archivos de variables de entorno
├── package.json       # Metadata y scripts
├── vite.config.ts     # Config Vite (plugins, aliases, etc)
└── ...                # Otros config (tsconfig, tailwind, postcss, etc)
```

## Destacados

- **Contenido Multilingüe y Dinámico**: Markdown en `src/content/{lang}/` se indexa en build a `public/content.json` para navegación y rutas dinámicas.
- **Plugins Personalizados**: Plugins Vite en `src/plugins/` manejan build multilenguaje e indexado de contenido.
- **Extensible**: Agrega idiomas/contenido solo agregando archivos—no se requieren cambios de código.
- **Providers de Contexto**: Audio, debug y lenguaje para manejo de estado global.
- **UI/UX**: Glassmorphism, layouts responsivos y fuente personalizada.

---
Para más, ver [Guía de Componentes](./components-guide.md) y [Variables de Entorno](./environment-variables.md).
