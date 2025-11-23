#!/usr/bin/env node

/**
 * Frontmatter Auto-Fix Script
 * 
 * This script automatically fixes common frontmatter formatting issues
 * in markdown files.
 * 
 * Usage: node scripts/fix-frontmatter.js [--dry-run] [file-pattern]
 * 
 * Options:
 * --dry-run: Show what would be fixed without making changes
 * file-pattern: Specific file or pattern to fix (default: all content files)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const isDryRun = process.argv.includes('--dry-run');
const filePattern = process.argv.find(arg => !arg.startsWith('--') && !arg.endsWith('.js'));

let totalFiles = 0;
let fixedFiles = 0;
let fixes = [];

/**
 * Fix common frontmatter issues
 */
function fixFrontmatter(content, filePath) {
  const originalContent = content;
  let fixedContent = content;
  const fileFixes = [];

  // Normalize line endings
  fixedContent = fixedContent.replace(/\r\n/g, '\n');

  // Check if file has frontmatter
  if (!fixedContent.startsWith('---\n')) {
    return { content: originalContent, fixes: [], hasChanges: false };
  }

  const frontmatterEndIndex = fixedContent.indexOf('\n---\n', 4);
  if (frontmatterEndIndex === -1) {
    return { content: originalContent, fixes: [], hasChanges: false };
  }

  const beforeFrontmatter = fixedContent.substring(0, 4); // '---\n'
  const frontmatterText = fixedContent.substring(4, frontmatterEndIndex);
  const afterFrontmatter = fixedContent.substring(frontmatterEndIndex);

  let fixedFrontmatter = frontmatterText;
  const lines = frontmatterText.split('\n');
  const fixedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const originalLine = line;

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      fixedLines.push(line);
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      fixedLines.push(line);
      continue;
    }

    const key = line.substring(0, colonIndex);
    const afterColon = line.substring(colonIndex + 1);

    // Fix 1: Remove extra spaces after colon
    if (afterColon.match(/^  +/) && afterColon.trim() !== '') {
      const fixedAfterColon = ' ' + afterColon.trim();
      line = key + ':' + fixedAfterColon;
      fileFixes.push(`Line ${i + 2}: Fixed extra spaces after colon: "${originalLine}" → "${line}"`);
    }

    // Fix 2: Add space after colon if missing
    else if (afterColon.length > 0 && !afterColon.startsWith(' ') && afterColon.trim() !== '') {
      line = key + ': ' + afterColon.trim();
      fileFixes.push(`Line ${i + 2}: Added missing space after colon: "${originalLine}" → "${line}"`);
    }

    // Fix 3: Remove trailing spaces
    if (line !== line.trimEnd()) {
      const trimmedLine = line.trimEnd();
      fileFixes.push(`Line ${i + 2}: Removed trailing spaces: "${line}" → "${trimmedLine}"`);
      line = trimmedLine;
    }

    // Fix 4: Normalize boolean values
    const value = afterColon.trim();
    if (value === 'True' || value === 'TRUE') {
      line = key + ': true';
      fileFixes.push(`Line ${i + 2}: Normalized boolean: "${originalLine}" → "${line}"`);
    } else if (value === 'False' || value === 'FALSE') {
      line = key + ': false';
      fileFixes.push(`Line ${i + 2}: Normalized boolean: "${originalLine}" → "${line}"`);
    }

    // Fix 5: Fix Google Drive URLs (convert sharing URLs to proper format)
    if (key.trim() === 'audio_source' && value.includes('drive.google.com/file/d/')) {
      const fileIdMatch = value.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
      if (fileIdMatch && value.includes('/view')) {
        const fileId = fileIdMatch[1];
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        line = key + ': ' + directUrl;
        fileFixes.push(`Line ${i + 2}: Converted Google Drive sharing URL to direct URL: "${value}" → "${directUrl}"`);
      }
    }

    fixedLines.push(line);
  }

  fixedFrontmatter = fixedLines.join('\n');
  fixedContent = beforeFrontmatter + fixedFrontmatter + afterFrontmatter;

  const hasChanges = fixedContent !== originalContent;

  return {
    content: fixedContent,
    fixes: fileFixes,
    hasChanges
  };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixFrontmatter(content, filePath);
    
    if (result.hasChanges) {
      fixedFiles++;
      
      const relativePath = path.relative(process.cwd(), filePath);
      fixes.push({
        file: relativePath,
        fixes: result.fixes
      });

      if (!isDryRun) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        console.log(`✅ Fixed: ${relativePath}`);
      } else {
        console.log(`🔍 Would fix: ${relativePath}`);
      }
      
      result.fixes.forEach(fix => {
        console.log(`   • ${fix}`);
      });
      console.log();
    }
    
    return result.hasChanges;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Find markdown files to process
 */
function findFilesToProcess() {
  if (filePattern) {
    // Process specific file or pattern
    if (fs.existsSync(filePattern)) {
      return [path.resolve(filePattern)];
    } else {
      console.error(`File not found: ${filePattern}`);
      process.exit(1);
    }
  }

  // Process all markdown files in content directory
  const files = [];
  
  function scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }
  
  scanDirectory(CONTENT_DIR);
  return files;
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Frontmatter Auto-Fix Tool\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const files = findFilesToProcess();
  
  if (files.length === 0) {
    console.log('⚠️  No markdown files found to process');
    return;
  }

  console.log(`Found ${files.length} markdown files to process\n`);

  // Process each file
  files.forEach(processFile);

  // Report results
  console.log('📊 Fix Results:');
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files with fixes: ${fixedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - fixedFiles}\n`);

  if (fixedFiles > 0) {
    if (isDryRun) {
      console.log('🔍 Run without --dry-run to apply these fixes');
    } else {
      console.log('✅ All fixes applied successfully!');
      console.log('💡 Consider running "npm run validate:frontmatter" to verify the fixes');
    }
  } else {
    console.log('✅ No frontmatter issues found!');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}