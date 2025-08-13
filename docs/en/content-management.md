# Content Management & Dynamic Pages

This project uses a powerful, flexible content system based on Markdown files and frontmatter metadata. All site content (except for a few static pages) is managed in Markdown, auto-indexed, and rendered dynamically.

## How Content Works

- **Location:** All content lives in `src/content/{lang}/` (e.g., `src/content/es/`, `src/content/pt/`).
- **Frontmatter:** Each Markdown file must start with a YAML frontmatter block containing required metadata.
- **Indexing:** At build time, a Vite plugin scans all Markdown files, validates required fields, and generates a `contentIndex.json` file used for navigation and routing.
- **Rendering:** The `component` field in frontmatter determines which React page component renders the content (e.g., `SimplePage`, `ProgramPage`).
- **Navigation:** If a file has both `menu` and `menu_position` fields and is `public: true`, it appears in the navigation for its language.
- **Visibility:** Only files with `public: true` are indexed and routable. Files with `public: false` are ignored, even if they have menu fields.

## Required Frontmatter Fields

Every Markdown file must include the following fields in its frontmatter:

- `title`: The page or program title.
- `slug`: The URL slug (unique per language).
- `id`: Unique identifier for the content.
- `component`: The React page component to use (e.g., `SimplePage`, `ProgramPage`).
- `public`: `true` or `false` (only `true` content is indexed and shown).
- `date`: ISO date string (for sorting, display, or program schedule).
- `language`: The language code (e.g., `es`, `pt`).

### Optional Fields
- `menu`: The label to show in navigation (if present, `menu_position` is required).
- `menu_position`: Number for ordering in navigation (required if `menu` is set).
- Any other custom fields (e.g., `program_order`, `schedule`, `talent`, etc.) are allowed and will be indexed.

## Example: Adding a New Page

To add a new page in Spanish:

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

- Place this file in `src/content/es/mi-nueva-pagina.md`.
- Rebuild the project. The page will appear in navigation and be routable at `/es/mi-nueva-pagina`.

## Menu & Navigation Logic

- Only content with `public: true` and both `menu` and `menu_position` appears in navigation.
- If `menu` is set, `menu_position` must also be set (otherwise, build fails).
- Content without `menu`/`menu_position` can still be public and routable, but will not appear in navigation.
- No two items in the same language can have the same `menu` and `menu_position`.

## Component Logic

- The `component` field in frontmatter determines which React page component renders the content.
- Example: `component: ProgramPage` will use the `ProgramPage.tsx` React component.
- You can create new components and reference them in frontmatter for custom layouts.

---

For more, see the [Component Guide](../components-guide.md) and [Project Structure](../project-structure.md).
