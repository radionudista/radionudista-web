## MODIFIED Requirements

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
