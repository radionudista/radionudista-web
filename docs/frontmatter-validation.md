# Frontmatter Validation System

This project includes a comprehensive frontmatter validation system to ensure all markdown files in the `src/content/` directory have properly formatted frontmatter.

## Features

- **Build-time validation**: Prevents builds with invalid frontmatter
- **Pre-commit hooks**: Validates staged files before commits
- **CI/CD integration**: Validates frontmatter in GitHub Actions
- **Auto-fix tools**: Automatically fixes common formatting issues
- **Detailed error reporting**: Shows exactly what's wrong and how to fix it

## Scripts

### Validation Scripts

```bash
# Validate all markdown files
npm run validate:frontmatter

# Validate only staged files (for pre-commit)
node scripts/pre-commit-frontmatter.js
```

### Auto-Fix Scripts

```bash
# Preview what would be fixed (dry run)
npm run fix:frontmatter:dry

# Apply fixes to all files
npm run fix:frontmatter

# Fix a specific file
node scripts/fix-frontmatter.js src/content/es/misterios.md
```

## Validation Rules

### Required Fields (for ProgramPage component)

- `language`: Language code (e.g., "es", "en")
- `title`: Program title
- `slug`: URL slug
- `id`: Unique identifier
- `component`: Must be "ProgramPage"
- `public`: Boolean (true/false)
- `program_order`: Number for ordering
- `schedule`: Schedule information
- `talent`: Array of talent names
- `social`: Array of social media handles
- `logo`: Logo filename

### Optional Fields

- `date`: Publication date
- `audio_source`: Google Drive URL for audio
- `description`: Program description

### Format Rules

1. **Frontmatter delimiters**: Must start and end with `---`
2. **Key-value format**: `key: value` (single space after colon)
3. **No extra spaces**: No multiple spaces after colons
4. **Boolean values**: Use `true`/`false` (lowercase)
5. **Arrays**: Use JSON format `['item1', 'item2']`
6. **Google Drive URLs**: Must be valid drive.google.com URLs

## Common Issues and Fixes

### Extra Spaces After Colon

❌ **Wrong:**
```yaml
audio_source:  https://drive.google.com/file/d/...
```

✅ **Correct:**
```yaml
audio_source: https://drive.google.com/file/d/...
```

### Invalid Boolean Values

❌ **Wrong:**
```yaml
public: True
```

✅ **Correct:**
```yaml
public: true
```

### Invalid Google Drive URLs

❌ **Wrong:**
```yaml
audio_source: https://example.com/audio.mp3
```

✅ **Correct:**
```yaml
audio_source: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

### Missing Required Fields

❌ **Wrong:**
```yaml
title: My Program
# Missing other required fields
```

✅ **Correct:**
```yaml
language: es
title: My Program
slug: my-program
id: my-program
component: ProgramPage
public: true
program_order: 1
schedule: "Monday 8:00 PM"
talent: ['Host Name']
social: ['@hostname']
logo: logo.png
```

## Integration with Build Process

The validation runs automatically during:

1. **Build process**: `npm run build` will fail if validation errors exist
2. **Development**: Use `npm run validate:frontmatter` to check files
3. **Pre-commit**: Validates staged files before commits (if hook is set up)
4. **CI/CD**: GitHub Actions validates on push/PR

## Setting Up Pre-commit Hook

To automatically validate frontmatter before commits:

```bash
# Create git hook directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
node scripts/pre-commit-frontmatter.js
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

## Error Messages

The validation system provides detailed error messages:

- **File location**: Shows which file has the error
- **Line number**: Shows exactly where the error occurs
- **Error type**: Explains what's wrong
- **Fix suggestion**: Shows how to fix the issue

Example error output:
```
❌ Frontmatter validation errors:

📄 src/content/es/misterios.md:
   • Extra space after colon at line 15: "audio_source:  https://..." (should be "audio_source: https://...")
   • Missing required field: program_order
   • Invalid Google Drive URL format: "https://example.com/audio.mp3" (cannot extract file ID)
```

## Troubleshooting

### Build Fails with Frontmatter Errors

1. Run `npm run validate:frontmatter` to see detailed errors
2. Try auto-fixing: `npm run fix:frontmatter:dry` (preview) then `npm run fix:frontmatter` (apply)
3. Manually fix remaining issues based on error messages
4. Re-run validation to confirm fixes

### Auto-fix Doesn't Work

Some issues require manual fixing:
- Missing required fields
- Invalid file structure
- Complex YAML syntax errors

### CI/CD Failures

If GitHub Actions fails:
1. Check the Actions log for specific errors
2. Fix issues locally
3. Test with `npm run validate:frontmatter`
4. Commit and push fixes

## Development Workflow

1. **Create/edit markdown files** in `src/content/`
2. **Run validation** with `npm run validate:frontmatter`
3. **Fix issues** automatically with `npm run fix:frontmatter` or manually
4. **Verify fixes** by running validation again
5. **Commit changes** (pre-commit hook will validate staged files)
6. **Push to repository** (CI will validate all files)

This system ensures consistent, valid frontmatter across all content files and prevents build failures due to formatting issues.