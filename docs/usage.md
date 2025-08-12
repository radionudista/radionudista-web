
# Usage & Build

This document explains how to run, build, and lint the application, including multilingual and dynamic content features.

## Development Server

Start the development server:
```bash
bun run dev
# or npm run dev
```
The app will be available at `http://localhost:5173` (or as configured). Hot Module Replacement (HMR) is enabled.

## Building the Application

The project supports multiple build modes. All builds output to the `dist/` directory.

- **Development Build:**
	```bash
	bun run build:dev
	# or npm run build:dev
	```
	Uses `.env.development` and is suitable for local/staging testing.

- **Feature Build:**
	```bash
	bun run build:feature
	# or npm run build:feature
	```
	Uses `.env.feature` for feature branch builds.

- **Production Build:**
	```bash
	bun run build
	# or npm run build
	# or bun run build:production
	```
	Uses `.env.production` for optimized, minified output.

### Multilingual & Content Indexing

- At build time, all Markdown content in `src/content/{lang}/` is auto-indexed into `public/content.json`.
- The build produces language-specific routes and navigation based on available content and translations.
- Adding new languages or content is automatic—just add files and rebuild.

## Previewing the Production Build

After building, preview the production output locally:
```bash
bun run preview
# or npm run preview
```
This serves the `dist` folder for final checks before deployment.

## Linting

Check code for linting errors and style issues:
```bash
bun run lint
# or npm run lint
```
This uses ESLint with the rules in `eslint.config.js`. Run before committing code.

---
For more, see [Getting Started](./getting-started.md) and [Deployment](./deployment.md).


