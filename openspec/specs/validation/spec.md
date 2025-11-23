# Validation

## Purpose

The validation system ensures content quality and consistency across the application by validating frontmatter in markdown files, enforcing proper formatting, and ensuring audio sources use CORS-friendly hosting services.
## Requirements
### Requirement: Frontmatter Validation

Content files SHALL have valid frontmatter that meets component-specific requirements.

#### Scenario: ProgramPage validation

- **WHEN** component is "ProgramPage"
- **THEN** required fields include language, title, slug, id, component, public, program_order, schedule, talent, social, logo
- **AND** optional fields include date, audio_source, description

#### Scenario: SimplePage validation

- **WHEN** component is "SimplePage"
- **THEN** required fields include language, title, slug, id, component, public
- **AND** optional fields include date, menu, menu_position

### Requirement: Audio Source Validation

The system SHALL validate audio_source URLs in content frontmatter to ensure they use CORS-friendly hosting services.

#### Scenario: Archive.org URLs accepted

- **WHEN** audio_source contains archive.org URL
- **THEN** validation passes
- **AND** URL format is accepted

#### Scenario: Dropbox URLs accepted

- **WHEN** audio_source contains dropbox.com URL with dl=1 parameter
- **THEN** validation passes
- **AND** URL format is accepted

#### Scenario: SoundCloud URLs accepted

- **WHEN** audio_source contains soundcloud.com URL
- **THEN** validation passes
- **AND** URL format is accepted

#### Scenario: Google Drive URLs still supported

- **WHEN** audio_source contains drive.google.com URL
- **THEN** validation passes for backward compatibility
- **AND** proper file ID format is maintained

#### Scenario: Invalid hosts rejected

- **WHEN** audio_source contains unsupported hosting service
- **THEN** validation fails
- **AND** helpful error message suggests allowed services

### Requirement: Array Field Validation

Array fields SHALL be properly formatted and contain valid data types.

#### Scenario: Talent array validation

- **WHEN** talent field is present
- **THEN** it must be an array of strings
- **AND** validation fails if not an array

#### Scenario: Social array validation

- **WHEN** social field is present
- **THEN** it must be an array of strings
- **AND** validation fails if not an array

### Requirement: Boolean Field Validation

Boolean fields SHALL contain valid boolean values.

#### Scenario: Public field validation

- **WHEN** public field is present
- **THEN** it must be true or false
- **AND** validation fails for invalid boolean values

### Requirement: Build Integration

Validation SHALL run automatically during build process.

#### Scenario: Pre-build validation

- **WHEN** npm run build is executed
- **THEN** frontmatter validation runs first
- **AND** build fails if validation errors exist
- **AND** build succeeds if all files are valid

