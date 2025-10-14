# Requirements Document

## Introduction

This feature will create a unified multimedia control system for the radio station website that centralizes audio playback management across all components. The system will coordinate between the main radio stream player, mini navigation player, and new individual program players, ensuring only one audio source plays at a time and providing consistent user experience throughout the site.

## Requirements

### Requirement 1

**User Story:** As a user, I want a centralized audio control system so that all radio players (main and mini) stay synchronized and program players can switch the audio source across the entire site.

#### Acceptance Criteria

1. WHEN the main radio player plays/pauses THEN the mini radio player SHALL show the same play/pause state
2. WHEN the mini radio player plays/pauses THEN the main radio player SHALL show the same play/pause state
3. WHEN a program audio is selected THEN all radio players SHALL switch to play the program audio source
4. WHEN navigating between pages THEN the currently playing audio SHALL continue without interruption
5. WHEN program audio finishes THEN the system SHALL automatically return to radio stream playback and reset program players

### Requirement 2

**User Story:** As a user, I want to play individual program audio files from the program listing page so that I can listen to specific show content from different programs.

#### Acceptance Criteria

1. WHEN viewing the ProgramPage THEN each program item SHALL display a play button
2. WHEN clicking a program play button THEN the system SHALL load and play the associated Google Drive MP3 file from that program's audio_source
3. WHEN a program audio is playing THEN the play button SHALL change to a pause/stop button
4. WHEN program audio finishes playing THEN the system SHALL automatically return to radio stream and reset the program player to initial state
5. WHEN clicking play again on the same program THEN the program audio SHALL restart from the beginning
6. WHEN clicking play on a different program THEN the current program SHALL stop and the new program audio SHALL start
7. IF the audio_source field is missing or invalid THEN the play button SHALL be disabled with appropriate feedback

### Requirement 3

**User Story:** As a user, I want visual feedback about which audio source is currently playing so that I understand whether I'm listening to the radio stream or a specific program.

#### Acceptance Criteria

1. WHEN the radio stream is playing THEN both main and mini radio players SHALL show synchronized play state
2. WHEN a program audio is playing THEN all radio players SHALL show the program is active and display program information
3. WHEN any audio is paused THEN all players SHALL show paused state consistently
4. WHEN a program audio is selected THEN the active program player SHALL show highlighted/active state
5. WHEN no audio is playing THEN all players SHALL show inactive/ready state

### Requirement 4

**User Story:** As a developer, I want a centralized multimedia context so that all audio components can communicate and coordinate their states.

#### Acceptance Criteria

1. WHEN the multimedia context is initialized THEN it SHALL provide methods for play, pause, stop, and state management
2. WHEN any component requests audio playback THEN the context SHALL handle source switching and state updates
3. WHEN audio state changes THEN the context SHALL notify all subscribed components
4. WHEN the context receives conflicting requests THEN it SHALL resolve them based on priority rules
5. IF an audio source fails to load THEN the context SHALL handle the error gracefully and notify components

### Requirement 5

**User Story:** As a user, I want program audio files to be properly formatted and accessible so that playback works reliably.

#### Acceptance Criteria

1. WHEN accessing Google Drive audio links THEN the system SHALL convert them to direct playback URLs
2. WHEN an audio file is loading THEN the player SHALL show loading state
3. WHEN an audio file fails to load THEN the system SHALL display an appropriate error message
4. WHEN audio metadata is available THEN the player SHALL display relevant information (title, duration)
5. IF the Google Drive link format changes THEN the system SHALL handle the conversion gracefully or show clear error feedback