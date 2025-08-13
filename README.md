
# Nudista Radio Aura Glass

![Nudista Radio](https://raw.githubusercontent.com/kamansoft/nudista-radio-aura-glass/main/public/images/radio_nudista_metatag.png)

**Nudista Radio Aura Glass** is a modern, multilingual web radio platform with dynamic content, live streaming, and a glassmorphism UI. Built with Vite, React, TypeScript, Tailwind CSS, and Shadcn UI, it is designed for extensibility, internationalization, and a seamless user experience across devices.

## Key Features

- **Multilingual & Dynamic Content**: 
    - Automatic language detection and subdirectory-based routing (`/es`, `/pt`, ...).
    - Content is managed as Markdown files per language, auto-indexed at build time into a dynamic navigation and content system.
    - Easily add new languages or content without code changes.

- **Live Radio & Streaming**:
    - Custom radio player with cover art, ticker, play/pause, and volume control.
    - Embedded Twitch player with privacy/ad-blocker detection and user-friendly fallback.
    - 24/7 stream, with a configurable countdown teaser for launches/events.

- **Modern UI & UX**:
    - Glassmorphism design, background video, and custom font.
    - Responsive layouts for mobile and desktop.
    - Dynamic navigation menu (static + content-driven), language-aware.

- **Developer Experience**:
    - All configuration via `.env` files (URLs, launch dates, languages, etc).
    - Debug bar for live inspection of app state and language detection (visible in non-production).
    - Extensible: add new languages, content, or pages with minimal effort.
    - Custom Vite plugins for multi-language builds and content indexing.

## Quick Start

1. **Clone the repository:**
     ```bash
     git clone https://github.com/kamansoft/nudista-radio-aura-glass.git
     cd nudista-radio-aura-glass
     ```
2. **Install dependencies:**
     ```bash
     bun install
     # or npm install
     ```
3. **Run the development server:**
     ```bash
     bun run dev
     # or npm run dev
     ```
     The app will be available at `http://localhost:5173` (or as configured).

## Architecture Overview

- **src/components/**: UI, player, navigation, and layout components.
- **src/pages/**: Top-level pages (Home, About, Contact, etc).
- **src/content/{lang}/**: Markdown content per language, auto-indexed.
- **src/lang/**: Translation JSONs for each supported language.
- **src/plugins/**: Vite plugins for multi-language builds and content indexing.
- **src/config/env.ts**: Centralized, type-safe environment variable access.
- **Debug & Contexts**: Debug bar, language, and audio context providers.


## Content Management & Dynamic Pages

All site content is managed as Markdown files in `src/content/{lang}/`. Each file starts with a YAML frontmatter block containing required metadata. At build time, all content is auto-indexed and used for navigation and routing.

### Required Frontmatter Fields
- `title`: Page/program title
- `slug`: URL slug (unique per language)
- `id`: Unique identifier
- `component`: React page component to use (e.g., `SimplePage`, `ProgramPage`)
- `public`: `true` or `false` (only `true` is indexed and shown)
- `date`: ISO date string
- `language`: Language code (e.g., `es`, `pt`)

#### Optional Fields
- `menu`: Label for navigation (if present, `menu_position` is required)
- `menu_position`: Number for ordering in navigation
- Any other custom fields are allowed and will be indexed

### Example: Adding a New Page

```markdown
---
title: "Mi Nueva Página"
slug: mi-nueva-pagina
id: mi-nueva-pagina
component: SimplePage
public: true
date: 2025-08-13
language: es
menu: "nueva"
menu_position: 3
---

# Mi Nueva Página

¡Este es el contenido de mi nueva página en español!
```

Place this file in `src/content/es/mi-nueva-pagina.md` and rebuild. The page will appear in navigation and be routable at `/es/mi-nueva-pagina`.

### Menu & Component Logic
- Only content with `public: true` and both `menu` and `menu_position` appears in navigation.
- If `menu` is set, `menu_position` must also be set (otherwise, build fails).
- Content without `menu`/`menu_position` can still be public and routable, but will not appear in navigation.
- The `component` field determines which React page component renders the content.

---

## Documentation

See the [`docs/`](./docs/README.md) folder for:
- [Getting Started](./docs/getting-started.md)
- [Usage & Build](./docs/usage.md)
- [Environment Variables](./docs/environment-variables.md)
- [Component Guide](./docs/components-guide.md)
- [Project Structure](./docs/project-structure.md)
- [Deployment](./docs/deployment.md)
- [Content Management (EN)](./docs/en/content-management.md)
- [Gestión de Contenido (ES)](./docs/es/content-management.md)

---

This project was bootstrapped with `vite-react-shadcn-ts-template` and extended for multilingual, dynamic content, and live radio features.

