
import contentIndex from '../contentIndex.json';

// Vite import all markdown files in src/content/*/*.md
const markdownFiles = import.meta.glob('../content/*/*.md', { query: '?raw', import: 'default', eager: true });

// Build a map: { [lang]: { [slug]: { ...meta, markdown } } }
const contentMap: Record<string, Record<string, any>> = {};

for (const [id, langs] of Object.entries(contentIndex)) {
  for (const [lang, meta] of Object.entries(langs as Record<string, any>)) {
    if (!contentMap[lang]) contentMap[lang] = {};
    // Find the markdown file for this entry
    const mdPath = `../content/${lang}/${meta.slug}.md`;
    const markdown = markdownFiles[mdPath] || '';
    contentMap[lang][meta.slug] = { ...meta, markdown };
  }
}

export function getContent(lang: string, slug: string) {
  return contentMap[lang]?.[slug] || null;
}

export function getAllSlugs(lang: string): string[] {
  return Object.keys(contentMap[lang] || {});
}
