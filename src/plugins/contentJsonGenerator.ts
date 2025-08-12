import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { env } from '../config/env';

interface ContentEntry {
  [lang: string]: {
    title: string;
    slug: string;
    id: string;
    component: string;
    public: string;
    date: string;
  };
}

type ContentJson = Record<string, ContentEntry>;

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) return getMarkdownFiles(res);
    if (entry.isFile() && res.endsWith('.md')) return [res];
    return [];
  }));
  return files.flat();
}

function getIdFromFilename(filename: string): string {
  return path.basename(filename, '.md');
}

export function contentJsonGeneratorPlugin({
  contentDir,
  outputFile,
  supportedLanguages,
}: {
  contentDir: string;
  outputFile: string;
  supportedLanguages: string[];
}): Plugin {
  return {
    name: 'content-json-generator',
    async buildStart() {
      const content: ContentJson = {};

      for (const lang of supportedLanguages) {
        const langDir = path.join(contentDir, lang);
        try {
          const files = await getMarkdownFiles(langDir);
          for (const file of files) {
            const fileContent = await fs.readFile(file, 'utf-8');
            const { data } = matter(fileContent);

            if (!(data.public === true || data.public === 'true')) continue;

            const id = data.id || getIdFromFilename(file);
            if (!content[id]) content[id] = {};

            content[id][lang] = {
              title: data.title || '',
              slug: data.slug || getIdFromFilename(file),
              id,
              component: data.component || '',
              public: data.public,
              date: data.date || '',
            };
          }
        } catch (err) {
          // Ignore missing language folders
        }
      }

      await fs.writeFile(outputFile, JSON.stringify(content, null, 2), 'utf-8');
      this.info(`Generated content.json with ${Object.keys(content).length} entries.`);
    },
  };
}