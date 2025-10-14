# Audio Hosting Guide for Radio Nudista

## The Google Drive Problem

Google Drive files cannot be played directly in web browsers due to **CORS (Cross-Origin Resource Sharing)** security restrictions. When you try to play a Google Drive audio file, you'll see errors like:

- `Access to audio at 'https://drive.google.com/uc?...' has been blocked by CORS policy`
- `Audio format not supported` (even though the format is correct)

## Recommended Audio Hosting Solutions

### 1. Archive.org (Recommended)
- **Free and reliable**
- **CORS-friendly**
- **Permanent hosting**
- **Example**: `https://archive.org/download/your-item/audio-file.mp3`

**How to use:**
1. Create account at archive.org
2. Upload your audio file
3. Use the direct download URL in your program frontmatter

### 2. SoundCloud
- **Free tier available**
- **Professional audio platform**
- **Embed support**
- **Example**: Use SoundCloud's embed URLs or direct track URLs

### 3. Dropbox
- **Easy to use**
- **Works with existing Dropbox files**
- **Simple URL modification**

**How to use:**
1. Get Dropbox share link: `https://dropbox.com/s/abc123/file.mp3?dl=0`
2. Change `dl=0` to `dl=1`: `https://dropbox.com/s/abc123/file.mp3?dl=1`

### 4. Your Own Server/CDN
- **Full control**
- **Best performance**
- **Professional solution**
- **Example**: `https://yourserver.com/audio/program.mp3`

## How to Update Your Program Files

1. **Upload your audio** to one of the recommended services
2. **Get the direct URL** (not a share/preview URL)
3. **Update your program's frontmatter**:

```markdown
---
title: Your Program
audio_source: https://archive.org/download/your-item/audio.mp3
---
```

## Testing Your Audio URLs

The system will automatically:
- ✅ Detect CORS-friendly URLs
- ⚠️ Warn about Google Drive limitations
- 🔄 Provide helpful error messages
- 💡 Suggest alternatives when needed

## Technical Details

### Why CORS Matters
CORS is a browser security feature that prevents websites from accessing resources from other domains without permission. Google Drive doesn't allow direct audio streaming to external websites.

### What We've Implemented
- **Smart URL detection**: Identifies problematic hosting services
- **Helpful error messages**: Explains issues and provides solutions
- **Fallback handling**: Graceful degradation when URLs don't work
- **User guidance**: Clear instructions for fixing audio issues

## Migration from Google Drive

If you're currently using Google Drive:

1. **Download your audio files** from Google Drive
2. **Choose a new hosting service** from the recommendations above
3. **Upload your files** to the new service
4. **Update your program frontmatter** with the new URLs
5. **Test the audio playback** in your browser

## Need Help?

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your audio URL works in a new browser tab
3. Ensure the hosting service supports CORS
4. Consider using one of our recommended services

---

*This guide ensures your radio programs have reliable, accessible audio that works across all browsers and devices.*