# Project Structure

This project is organized for modularity, multilingual support, and dynamic content. Key directories and files:

```
/                  # Project root
├── dist/          # Build output
├── docs/          # Documentation (Markdown)
├── public/        # Static assets (images, fonts, content.json, etc)
├── src/           # Source code
│   ├── components/    # UI, player, navigation, layout, etc
│   │   ├── ui/        # Shadcn UI and custom UI components
│   │   └── ...        # App-specific components
│   ├── config/        # Environment and i18n config
│   ├── constants/     # App-wide constants
│   ├── contexts/      # React context providers (audio, debug, etc)
│   ├── hooks/         # Custom React hooks
│   ├── lang/          # Translation JSONs per language
│   ├── lib/           # Utility functions
│   ├── pages/         # Top-level page components (for routing)
│   ├── plugins/       # Vite plugins (multi-language build, content indexer)
│   ├── content/       # Markdown content per language (e.g. content/es/, content/pt/)
│   ├── utils/         # Miscellaneous utilities
│   ├── App.tsx        # Main App component (providers, routing)
│   ├── main.tsx       # App entry point
│   └── index.css      # Global styles (Tailwind)
├── .env.*             # Environment variable files
├── package.json       # Project metadata and scripts
├── vite.config.ts     # Vite config (plugins, aliases, etc)
└── ...                # Other config (tsconfig, tailwind, postcss, etc)
```

## Highlights

- **Multilingual & Dynamic Content**: Markdown in `src/content/{lang}/` is auto-indexed at build time into `public/content.json` for dynamic navigation and routing.
- **Custom Plugins**: Vite plugins in `src/plugins/` handle multi-language builds and content indexing.
- **Extensible**: Add new languages or content by adding files—no code changes required.
- **Context Providers**: Audio, debug, and language context for state management.
- **UI/UX**: Glassmorphism, responsive layouts, and custom font.

---
For more, see [Component Guide](./components-guide.md) and [Environment Variables](./environment-variables.md).
