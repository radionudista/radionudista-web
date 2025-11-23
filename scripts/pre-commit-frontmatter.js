#!/usr/bin/env node

/**
 * Pre-commit hook for frontmatter validation
 * 
 * This script validates only the staged markdown files
 * to ensure proper frontmatter formatting before commit.
 * 
 * Usage: node scripts/pre-commit-frontmatter.js
 * 
 * Exit codes:
 * 0 - All staged files valid
 * 1 - Validation errors found
 */

import { execSync } from 'child_process';
import { validateFile } from './validate-frontmatter.js';
import path from 'path';

/**
 * Get list of staged markdown files
 */
function getStagedMarkdownFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    const files = output.trim().split('\n').filter(Boolean);
    
    return files
      .filter(file => file.endsWith('.md') && file.startsWith('src/content/'))
      .map(file => path.resolve(file));
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

/**
 * Main validation function for pre-commit
 */
function validateStagedFiles() {
  console.log('🔍 Validating frontmatter in staged markdown files...\n');
  
  const stagedFiles = getStagedMarkdownFiles();
  
  if (stagedFiles.length === 0) {
    console.log('✅ No staged markdown files to validate');
    return;
  }

  console.log(`Found ${stagedFiles.length} staged markdown files\n`);

  let hasErrors = false;
  const errors = [];

  // Validate each staged file
  stagedFiles.forEach(filePath => {
    const isValid = validateFile(filePath);
    if (!isValid) {
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.log('\n❌ Pre-commit validation failed!');
    console.log('Please fix the frontmatter errors before committing.');
    console.log('Run "npm run validate:frontmatter" for detailed error information.\n');
    process.exit(1);
  } else {
    console.log('✅ All staged markdown files have valid frontmatter!');
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateStagedFiles();
}