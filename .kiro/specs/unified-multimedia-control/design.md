# Design Document

## Overview

This design extends the existing AudioContext system to support multiple audio sources while maintaining synchronized playback across all player components. The system will manage both the radio stream and individual program audio files, ensuring only one audio source plays at a time and providing consistent UI feedback across all players.

## Architecture

### Current System Analysis
The existing system uses:
- `AudioContext` - Centralized audio state management
- `RadioPlayer` - Main player component with full controls
- `MiniPlayer` - Compact navigation player
- `AudioService` - Low-level audio operations
- `RadioStreamService` - Stream metadata fetching

### Enhanced Architecture
The enhanced system will extend the current architecture with:
- **Multi-source audio management** - Support for radio stream + program audio files
- **Source switching logic** - Seamless transitions between audio sources
- **Google Drive URL conversion** - Transform share links to direct audio URLs
- **Program player components** - Individual players for each program item

## Components and Interfaces

### 1. Enhanced AudioContext

```typescript
interface AudioContextType {
  // Existing properties
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: string;
  coverImageUrl: string | null;
  volume: number;
  isMuted: boolean;
  
  // New properties for multi-source support
  currentSource: 'radio' | 'program';
  currentProgramId: string | null;
  currentProgramTitle: string | null;
  
  // Enhanced methods
  togglePlayWithPause: () => void;
  togglePlay: () => void;
  playProgram: (programId: string, audioUrl: string, title: string) => void;
  stopProgram: () => void;
  returnToRadio: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}
```

### 2. Program Player Component

```typescript
interface ProgramPlayerProps {
  programId: string;
  audioSource: string;
  title: string;
  isCompact?: boolean;
}
```

The ProgramPlayer will be a small, inline player that shows:
- Play/Pause button
- Loading state indicator
- Active state when playing
- Disabled state when audio_source is invalid

### 3. Google Drive URL Service

```typescript
interface GoogleDriveService {
  convertToDirectUrl: (shareUrl: string) => string;
  validateUrl: (url: string) => boolean;
}
```

Converts Google Drive share URLs from format:
`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
To direct download format:
`https://drive.google.com/uc?export=download&id=FILE_ID`

### 4. Enhanced Audio Service

```typescript
interface AudioService {
  // Existing methods
  createAudioInstance: (url: string, volume: number) => HTMLAudioElement;
  setAudioVolume: (audio: HTMLAudioElement | null, volume: number) => void;
  cleanupAudio: (audio: HTMLAudioElement) => void;
  
  // New methods for program audio
  createProgramAudioInstance: (url: string, volume: number) => HTMLAudioElement;
  validateAudioUrl: (url: string) => Promise<boolean>;
}
```

## Data Models

### Audio Source State
```typescript
type AudioSource = 'radio' | 'program';

interface AudioState {
  source: AudioSource;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  
  // Radio-specific state
  radioTrack: string;
  radioCoverUrl: string | null;
  
  // Program-specific state
  programId: string | null;
  programTitle: string | null;
  programAudioUrl: string | null;
}
```

### Program Audio Metadata
```typescript
interface ProgramAudio {
  id: string;
  title: string;
  audioSource: string;
  isValid: boolean;
  directUrl?: string;
}
```

## Error Handling

### Google Drive URL Processing
1. **Invalid URL Format**: Show disabled play button with tooltip
2. **Network Errors**: Display retry option
3. **Audio Load Failures**: Fallback to error message
4. **Missing audio_source**: Hide play button or show disabled state

### Audio Playback Errors
1. **Stream Interruption**: Auto-retry with exponential backoff
2. **Format Not Supported**: Clear error message to user
3. **Network Issues**: Graceful degradation with user notification

### State Synchronization Errors
1. **Context Provider Missing**: Throw descriptive error
2. **Multiple Audio Instances**: Cleanup and reset to single source
3. **State Inconsistency**: Reset to known good state (radio stream)

## Testing Strategy

### Unit Tests
1. **GoogleDriveService**
   - URL conversion accuracy
   - Invalid URL handling
   - Edge cases (malformed URLs, missing IDs)

2. **Enhanced AudioContext**
   - Source switching logic
   - State synchronization
   - Error recovery

3. **ProgramPlayer Component**
   - Play/pause functionality
   - Loading states
   - Error states

### Integration Tests
1. **Multi-Player Synchronization**
   - Radio players stay synchronized
   - Program selection updates all players
   - Volume/mute changes propagate

2. **Audio Source Switching**
   - Radio to program transitions
   - Program to program transitions
   - Auto-return to radio after program ends

3. **Google Drive Integration**
   - URL conversion and playback
   - Error handling for invalid files
   - Network failure recovery

### End-to-End Tests
1. **User Workflows**
   - Play radio → select program → return to radio
   - Navigate between pages while audio plays
   - Multiple program selections
   - Volume control across all players

2. **Error Scenarios**
   - Invalid Google Drive links
   - Network connectivity issues
   - Audio format compatibility

## Implementation Phases

### Phase 1: Core Infrastructure
1. Extend AudioContext with multi-source support
2. Implement GoogleDriveService
3. Create basic ProgramPlayer component
4. Update existing players to use enhanced context

### Phase 2: Program Integration
1. Integrate ProgramPlayer into ProgramPage
2. Implement source switching logic
3. Add program metadata display
4. Handle audio end events

### Phase 3: Polish & Error Handling
1. Comprehensive error handling
2. Loading states and user feedback
3. Accessibility improvements
4. Performance optimizations

### Phase 4: Testing & Validation
1. Unit test coverage
2. Integration testing
3. User acceptance testing
4. Performance validation

## Technical Considerations

### Performance
- Lazy load program audio (only when play is clicked)
- Cleanup unused audio instances
- Debounce rapid source switching
- Optimize Google Drive URL conversion

### Accessibility
- ARIA labels for all player controls
- Keyboard navigation support
- Screen reader announcements for state changes
- High contrast mode compatibility

### Browser Compatibility
- Test audio format support across browsers
- Handle autoplay restrictions
- Graceful degradation for older browsers
- Mobile-specific considerations

### Security
- Validate Google Drive URLs before processing
- Sanitize audio metadata
- Handle CORS issues with external audio sources
- Rate limiting for API calls