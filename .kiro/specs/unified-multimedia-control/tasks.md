# Implementation Plan

- [x] 1. Create Google Drive URL conversion utility





  - Create `src/utils/googleDriveUtils.ts` with URL conversion functions
  - Implement `convertGoogleDriveUrl` function to transform share URLs to direct download URLs
  - Add URL validation function to check if Google Drive URLs are properly formatted
  - _Requirements: 2.2, 5.1, 5.2_

- [x] 2. Extend AudioContext for multi-source support





  - [x] 2.1 Add new state properties to AudioContext interface


    - Add `currentSource`, `currentProgramId`, `currentProgramTitle` to AudioContextType interface
    - Update AudioProvider state to include program-specific properties
    - _Requirements: 1.1, 1.3, 3.2, 4.1_

  - [x] 2.2 Implement program audio playback methods


    - Add `playProgram` method to switch audio source to program file
    - Add `stopProgram` method to stop current program and reset player state
    - Add `returnToRadio` method to switch back to radio stream
    - _Requirements: 1.3, 1.5, 2.2, 2.4_

  - [x] 2.3 Update existing playback methods for source management


    - Modify `togglePlay` and `togglePlayWithPause` to handle multi-source logic
    - Ensure radio stream methods work with new source switching system
    - _Requirements: 1.1, 1.2, 4.3_

- [x] 3. Create ProgramPlayer component





  - [x] 3.1 Build basic ProgramPlayer component structure


    - Create `src/components/ProgramPlayer.tsx` with play/pause button
    - Implement loading and error states
    - Add props for programId, audioSource, and title
    - _Requirements: 2.1, 2.3, 3.4_



  - [x] 3.2 Integrate ProgramPlayer with AudioContext





    - Connect ProgramPlayer to enhanced AudioContext
    - Implement click handlers for play/pause functionality
    - Add visual feedback for active/inactive states
    - _Requirements: 2.2, 2.6, 3.4, 4.2_

  - [x] 3.3 Add accessibility features to ProgramPlayer











    - Implement ARIA labels and keyboard navigation
    - Add screen reader support for state changes
    - _Requirements: 2.7_

- [x] 4. Update existing player components





  - [x] 4.1 Modify RadioPlayer to use enhanced AudioContext


    - Update RadioPlayer to display program information when program is active
    - Ensure radio player shows synchronized state with mini player
    - _Requirements: 1.1, 1.2, 3.1, 3.2_



  - [x] 4.2 Update MiniPlayer for multi-source display





    - Modify MiniPlayer to show program title when program audio is playing
    - Ensure mini player controls work with both radio and program sources
    - _Requirements: 1.1, 1.2, 3.2_

- [x] 5. Integrate ProgramPlayer into ProgramPage





  - [x] 5.1 Add ProgramPlayer to each program item in ProgramPage


    - Import and place ProgramPlayer component after line 82 in ProgramPage.tsx
    - Pass program metadata (id, title, audio_source) as props to each ProgramPlayer
    - Handle cases where audio_source is missing or invalid
    - _Requirements: 2.1, 2.7_

  - [x] 5.2 Implement Google Drive URL processing in ProgramPage


    - Use googleDriveUtils to convert audio_source URLs before passing to ProgramPlayer
    - Add error handling for invalid or missing audio_source fields
    - _Requirements: 2.2, 5.1, 5.3_

- [x] 6. Add audio end event handling





  - [x] 6.1 Implement auto-return to radio stream


    - Add event listener for program audio 'ended' event
    - Automatically switch back to radio stream when program audio finishes
    - Reset program player states to initial state
    - _Requirements: 1.5, 2.4, 2.5_



  - [x] 6.2 Handle audio loading and error events





    - Add proper error handling for failed audio loads
    - Implement loading states during audio source switching
    - Add user feedback for network errors or unsupported formats
    - _Requirements: 5.3, 5.4_

- [x] 7. Add comprehensive error handling and validation






  - [x] 7.1 Implement robust Google Drive URL validation



    - Add comprehensive URL format checking
    - Handle edge cases and malformed URLs
    - Provide clear error messages for invalid audio sources
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 7.2 Add audio format validation and fallback handling



    - Validate audio file accessibility before attempting playback
    - Implement fallback mechanisms for unsupported formats
    - Add retry logic for network-related failures
    - _Requirements: 5.3, 5.4_

- [x] 8. Implement state persistence and cleanup





  - [x] 8.1 Add proper audio instance cleanup


    - Ensure old audio instances are properly disposed when switching sources
    - Prevent memory leaks from multiple audio elements
    - Handle browser autoplay restrictions gracefully
    - _Requirements: 4.4, 4.5_

  - [x] 8.2 Maintain playback state across navigation


    - Ensure audio continues playing when navigating between pages
    - Preserve volume and mute settings across source switches
    - _Requirements: 1.4, 4.3_