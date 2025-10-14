
import contentIndex from '../contentIndex.json';

// Helper to fetch contentIndex.json via HTTP if needed in the future
export async function fetchContentIndex(): Promise<any> {
  const res = await fetch('/contentIndex.json?t=' + Date.now()); // Add cache busting
  if (!res.ok) throw new Error('Failed to fetch contentIndex.json');
  return res.json();
}

// Vite import all markdown files in src/content/*/*.md
const markdownFiles = import.meta.glob('../content/*/*.md', { query: '?raw', import: 'default', eager: true });

// Build a map: { [lang]: { [slug]: { ...meta, markdown } } }
let contentMap: Record<string, Record<string, any>> = {};

// Function to build content map from index
function buildContentMap(index: any) {
  const map: Record<string, Record<string, any>> = {};
  
  for (const [id, langs] of Object.entries(index)) {
    for (const [lang, meta] of Object.entries(langs as Record<string, unknown>)) {
      if (!map[lang]) map[lang] = {};
      // Use the markdownfile path from contentIndex.json
      let mdPath = meta.markdownfile;
      // Ensure the path is relative to src/lib/contentLoader.ts for import.meta.glob
      if (mdPath.startsWith('/content/')) {
        mdPath = '..' + mdPath;
      } else if (!mdPath.startsWith('../content/')) {
        mdPath = '../content/' + lang + '/' + id + '.md';
      }
      const markdown = markdownFiles[mdPath] || '';
      map[lang][meta.slug] = { ...meta, markdown };
    }
  }
  
  return map;
}

// Initialize content map
contentMap = buildContentMap(contentIndex);

// Function to reload content dynamically in development
export async function reloadContent() {
  if (!import.meta.env.DEV) {
    console.warn('reloadContent() is only available in development mode');
    return;
  }
  
  try {
    const freshIndex = await fetchContentIndex();
    contentMap = buildContentMap(freshIndex);
    console.log('Content reloaded successfully');
  } catch (error) {
    console.error('Failed to reload content:', error);
  }
}

export function getContent(lang: string, slug: string) {
  return contentMap[lang]?.[slug] || null;
}

export function getAllSlugs(lang: string): string[] {
  return Object.keys(contentMap[lang] || {});
}
