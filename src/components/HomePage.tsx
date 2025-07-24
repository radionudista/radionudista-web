
import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import MediaButton from './ui/MediaButton';
import AudioVisualization from './ui/AudioVisualization';
import { useAudioVisualization } from '../hooks/useAudioVisualization';
import { GlassWrapper } from '../utils/glassEffects';

const HomePage = () => {
  const { isPlaying, isLoading, currentTrack, togglePlay } = useAudio();
  const { barHeights } = useAudioVisualization({ isPlaying, isLoading });

  return (
    <div className="container mx-auto px-6 py-12 reproductor">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          
        </div>
        
        {/* Radio Player Section */}
        <div 
          className={`glass-card mb-12 transition-colors ${!isLoading ? 'cursor-pointer hover:bg-white/10' : 'cursor-wait'}`}
          onClick={!isLoading ? togglePlay : undefined}
          style={{backgroundColor:'#000000'}}
        >
          <div className="text-center">
            <h3 className="text-2xl text-white mb-[4rem]">{currentTrack}</h3>
            
            {/* Play Button and Audio Visualization */}
            <div className="flex justify-center items-center mb-8 space-x-8">
              {/* Container with fixed height to prevent layout shift */}
              <div className="h-20 flex items-center justify-center">
                {/*!isPlaying ? (
                  <MediaButton
                    isPlaying={isPlaying}
                    isLoading={isLoading}
                    onClick={togglePlay}
                    size="large"
                  />
                ) : null*/}

                <MediaButton
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  onClick={togglePlay}
                  size="large"
                />
                
                {/* Dynamic FFT Audio Visualization - Clickable for pause */}
                {/*isPlaying && !isLoading && (
                  <AudioVisualization barHeights={barHeights} />
                )*/}
              </div>
            </div>
            
            {/* Station Info */}

          </div>
        </div>
        
        {/* Features */}

      </div>
    </div>
  );
};

export default HomePage;
