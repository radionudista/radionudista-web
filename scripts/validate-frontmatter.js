#!/usr/bin/env node

/**
 * Frontmatter Validation Script
 * 
 * This script validates all markdown files in the content directory
 * to ensure proper frontmatter formatting and required fields.
 * 
 * Usage: node scripts/validate-frontmatter.js
 * 
 * Exit codes:
 * 0 - All files valid
 * 1 - Validation errors found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const REQUIRED_FIELDS = {
  ProgramPage: ['language', 'title', 'slug', 'id', 'component', 'public', 'program_order', 'schedule', 'talent', 'social', 'logo'],
  // Add other component types as needed
};

const OPTIONAL_FIELDS = ['date', 'audio_source', 'description'];

// Validation results
let totalFiles = 0;
let validFiles = 0;
let errors = [];

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content, filePath) {
  const normalizedContent = content.replace(/\r\n/g, '\n');
  
  if (!normalizedContent.startsWith('---\n')) {
    return {
      isValid: false,
      error: 'Missing frontmatter opening delimiter (---)',
      frontmatter: null,
      body: content
    };
  }

  const frontmatterEndIndex = normalizedContent.indexOf('\n---\n', 4);
  if (frontmatterEndIndex === -1) {
    return {
      isValid: false,
      error: 'Missing frontmatter closing delimiter (---)',
      frontmatter: null,
      body: content
    };
  }

  const frontmatterText = normalizedContent.substring(4, frontmatterEndIndex);
  const body = normalizedContent.substring(frontmatterEndIndex + 5).trim();

  // Parse YAML-like frontmatter
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    // Handle key-value pairs
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      return {
        isValid: false,
        error: `Invalid frontmatter syntax at line ${i + 2}: "${line}" (missing colon)`,
        frontmatter: null,
        body
      };
    }

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Validate key format
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      return {
        isValid: false,
        error: `Invalid frontmatter key format at line ${i + 2}: "${key}"`,
        frontmatter: null,
        body
      };
    }

    // Check for extra spaces after colon (common issue)
    const afterColon = line.substring(colonIndex + 1);
    if (afterColon.startsWith('  ') && afterColon.trim() !== '') {
      return {
        isValid: false,
        error: `Extra space after colon at line ${i + 2}: "${key}:${afterColon}" (should be "${key}: ${afterColon.trim()}")`,
        frontmatter: null,
        body
      };
    }

    // Parse different value types
    if (value === '') {
      frontmatter[key] = '';
    } else if (value === 'true' || value === 'false') {
      frontmatter[key] = value === 'true';
    } else if (/^\d+$/.test(value)) {
      frontmatter[key] = parseInt(value, 10);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Parse array
      try {
        frontmatter[key] = JSON.parse(value);
      } catch (e) {
        return {
          isValid: false,
          error: `Invalid array syntax at line ${i + 2}: "${value}"`,
          frontmatter: null,
          body
        };
      }
    } else {
      // String value - remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        frontmatter[key] = value.slice(1, -1);
      } else {
        frontmatter[key] = value;
      }
    }
  }

  return {
    isValid: true,
    error: null,
    frontmatter,
    body
  };
}

/**
 * Validate frontmatter fields based on component type
 */
function validateFields(frontmatter, filePath) {
  const errors = [];
  const component = frontmatter.component;

  if (!component) {
    errors.push('Missing required field: component');
    return errors;
  }

  const requiredFields = REQUIRED_FIELDS[component];
  if (!requiredFields) {
    errors.push(`Unknown component type: ${component}`);
    return errors;
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in frontmatter)) {
      errors.push(`Missing required field: ${field}`);
    } else if (frontmatter[field] === '' || frontmatter[field] === null || frontmatter[field] === undefined) {
      errors.push(`Required field "${field}" cannot be empty`);
    }
  }

  // Validate specific field formats
  if (frontmatter.audio_source) {
    const audioSource = frontmatter.audio_source.toString().trim();
    
    // Check for Google Drive URL format
    if (audioSource && !audioSource.startsWith('http')) {
      errors.push(`Invalid audio_source format: "${audioSource}" (must be a valid URL)`);
    }
    
    // Check for Google Drive domain
    if (audioSource && !audioSource.includes('drive.google.com')) {
      errors.push(`Invalid audio_source: "${audioSource}" (must be a Google Drive URL)`);
    }

    // Check for proper Google Drive file ID
    const fileIdPattern = /\/file\/d\/([a-zA-Z0-9_-]{25,})/;
    if (audioSource && !fileIdPattern.test(audioSource)) {
      errors.push(`Invalid Google Drive URL format: "${audioSource}" (cannot extract file ID)`);
    }
  }

  // Validate array fields
  if (frontmatter.talent && !Array.isArray(frontmatter.talent)) {
    errors.push(`Field "talent" must be an array, got: ${typeof frontmatter.talent}`);
  }

  if (frontmatter.social && !Array.isArray(frontmatter.social)) {
    errors.push(`Field "social" must be an array, got: ${typeof frontmatter.social}`);
  }

  // Validate boolean fields
  if (frontmatter.public !== undefined && typeof frontmatter.public !== 'boolean') {
    errors.push(`Field "public" must be a boolean, got: ${typeof frontmatter.public}`);
  }

  // Validate numeric fields
  if (frontmatter.program_order !== undefined && typeof frontmatter.program_order !== 'number') {
    errors.push(`Field "program_order" must be a number, got: ${typeof frontmatter.program_order}`);
  }

  return errors;
}

/**
 * Validate a single markdown file
 */
function validateFile(filePath) {
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parseResult = parseFrontmatter(content, filePath);
    
    if (!parseResult.isValid) {
      errors.push({
        file: path.relative(process.cwd(), filePath),
        error: parseResult.error
      });
      return false;
    }

    const fieldErrors = validateFields(parseResult.frontmatter, filePath);
    if (fieldErrors.length > 0) {
      fieldErrors.forEach(error => {
        errors.push({
          file: path.relative(process.cwd(), filePath),
          error
        });
      });
      return false;
    }

    validFiles++;
    return true;
  } catch (error) {
    errors.push({
      file: path.relative(process.cwd(), filePath),
      error: `Failed to read file: ${error.message}`
    });
    return false;
  }
}

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Main validation function
 */
function validateAllFiles() {
  console.log('🔍 Validating frontmatter in markdown files...\n');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const markdownFiles = findMarkdownFiles(CONTENT_DIR);
  
  if (markdownFiles.length === 0) {
    console.log('⚠️  No markdown files found in content directory');
    return;
  }

  console.log(`Found ${markdownFiles.length} markdown files\n`);

  // Validate each file
  markdownFiles.forEach(validateFile);

  // Report results
  console.log('📊 Validation Results:');
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Valid files: ${validFiles}`);
  console.log(`   Files with errors: ${totalFiles - validFiles}\n`);

  if (errors.length > 0) {
    console.log('❌ Frontmatter validation errors:\n');
    
    // Group errors by file
    const errorsByFile = {};
    errors.forEach(({ file, error }) => {
      if (!errorsByFile[file]) {
        errorsByFile[file] = [];
      }
      errorsByFile[file].push(error);
    });

    Object.entries(errorsByFile).forEach(([file, fileErrors]) => {
      console.log(`📄 ${file}:`);
      fileErrors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log();
    });

    console.log(`❌ Build failed: ${errors.length} frontmatter validation error(s) found`);
    process.exit(1);
  } else {
    console.log('✅ All frontmatter validation passed!');
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAllFiles();
}

export { validateAllFiles, validateFile, parseFrontmatter, validateFields };