# Change: Update Frontmatter Validation for Modern Audio Hosting

## Why

The current frontmatter validation script only accepts Google Drive URLs for audio sources, but the documentation and implementation have moved to support multiple CORS-friendly hosting services (Archive.org, SoundCloud, Dropbox, etc.). This mismatch prevents builds from completing and blocks deployment.

## What Changes

- Update `scripts/validate-frontmatter.js` to accept multiple audio hosting services
- Remove Google Drive-only restrictions that conflict with documented recommendations
- Allow Archive.org, SoundCloud, Dropbox, and custom server URLs
- Maintain backward compatibility with existing Google Drive URLs
- Update validation logic to match current audio hosting guide

## Impact

- Affected specs: validation capability
- Affected code: `scripts/validate-frontmatter.js`, build process
- Fixes build failures caused by outdated validation rules
- Enables use of recommended CORS-friendly audio hosting services
