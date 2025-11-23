## ADDED Requirements

### Requirement: Twitch Stream Integration

The system SHALL provide embedded Twitch live video streaming with privacy and ad-blocker detection.

#### Scenario: Successful Twitch embed

- **WHEN** user accesses Twitch player
- **THEN** Twitch stream loads in embedded player
- **AND** player respects configured size percentage
- **AND** privacy controls are handled appropriately

#### Scenario: Ad-blocker detection

- **WHEN** ad-blocker prevents Twitch embed
- **THEN** user-friendly fallback message is displayed
- **AND** direct Twitch.tv link is provided

### Requirement: Dedicated Twitch Player Page

The system SHALL provide a dedicated route `/twitch-player` that displays only the Twitch stream without website navigation.

#### Scenario: Full-screen Twitch experience

- **WHEN** user navigates to `/twitch-player`
- **THEN** only Twitch player is visible on screen
- **AND** Radio Nudista logo is centered over the player
- **AND** background video continues playing
- **AND** no navigation or other content is shown

#### Scenario: Configurable player sizing

- **WHEN** `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT` is set
- **THEN** player size respects the percentage configuration
- **AND** player remains centered on screen

#### Scenario: Responsive player layout

- **WHEN** viewed on different screen sizes
- **THEN** player adapts appropriately
- **AND** logo positioning remains centered
- **AND** background video scales correctly
