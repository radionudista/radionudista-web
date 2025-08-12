
import contentIndex from '../contentIndex.json';
// Helper to fetch contentIndex.json via HTTP if needed in the future
export async function fetchContentIndex(): Promise<any> {
  const res = await fetch('/contentIndex.json');
  if (!res.ok) throw new Error('Failed to fetch contentIndex.json');
  return res.json();
}

// Vite import all markdown files in src/content/*/*.md
const markdownFiles = import.meta.glob('../content/*/*.md', { query: '?raw', import: 'default', eager: true });

// Build a map: { [lang]: { [slug]: { ...meta, markdown } } }
const contentMap: Record<string, Record<string, any>> = {};

for (const [id, langs] of Object.entries(contentIndex)) {
  for (const [lang, meta] of Object.entries(langs as Record<string, any>)) {
    if (!contentMap[lang]) contentMap[lang] = {};
    // Use the markdownfile path from contentIndex.json
    let mdPath = meta.markdownfile;
    // Ensure the path is relative to src/lib/contentLoader.ts for import.meta.glob
    if (mdPath.startsWith('/content/')) {
      mdPath = '..' + mdPath;
    } else if (!mdPath.startsWith('../content/')) {
      mdPath = '../content/' + lang + '/' + id + '.md';
    }
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
