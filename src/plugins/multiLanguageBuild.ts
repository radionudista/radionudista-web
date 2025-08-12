import { Plugin } from 'vite';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { logger } from '../utils/logger';
/**
 * Multi-Language Build Plugin for Vite
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for generating multi-language builds
 *
 * Follows Open/Closed Principle:
 * - Open for extension through configuration
 * - Closed for modification of core build logic
 *
 * Features:
 * - Dynamically reads language files from src/lang/
 * - Generates separate builds for each language
 * - Creates subdirectory-based routing structure
 * - No manual configuration needed when adding new languages
 */

interface MultiLangConfig {
  langDir: string;
  defaultLang: string;
  supportedLangs?: string[];
}

export function multiLanguageBuild(config: MultiLangConfig): Plugin {
  return {
    name: 'multi-language-build',

    async buildStart() {
      // Dynamically discover supported languages from lang folder
      const langPath = resolve(config.langDir);

      if (!existsSync(langPath)) {
        logger.warn(`Language directory not found: ${langPath}`);
        return;
      }

      const files = await readdir(langPath);
      const languages = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));

      logger.debug(`Discovered languages: ${languages.join(', ')}`);

      // Store languages for use in other hooks
      (this as any).discoveredLanguages = languages;
    },

    async generateBundle(options, bundle) {
      const languages: string[] = (this as any).discoveredLanguages || [];

      if (languages.length === 0) {
        console.warn('No language files found, skipping multi-language build');
        return;
      }

      // Generate language-specific index.html files
      for (const lang of languages) {
        const isDefault = lang === config.defaultLang;
        const langPrefix = isDefault ? '' : `/${lang}`;

        // Create language-specific HTML with proper lang attribute and base href
        const htmlContent = this.generateLanguageHTML(lang, langPrefix);

        // Add to bundle
        const fileName = isDefault ? 'index.html' : `${lang}/index.html`;

        this.emitFile({
          type: 'asset',
          fileName,
          source: htmlContent
        });
      }
    },

    generateLanguageHTML(language: string, basePath: string): string {
      return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${basePath}/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="${basePath}/" />
    <title>RadioNudista</title>
    <script>
      // Set language preference before app loads
      window.__INITIAL_LANGUAGE__ = '${language}';
      document.documentElement.lang = '${language}';
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${basePath}/src/main.tsx"></script>
  </body>
</html>`;
    }
  };
}
