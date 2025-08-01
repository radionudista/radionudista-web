import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import MediaButton from './ui/MediaButton';
import AudioVisualization from './ui/AudioVisualization';
import { useAudioVisualization } from '../hooks/useAudioVisualization';

interface RadioPlayerProps {
  className?: string;
  showTitle?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ 
  className = '', 
  showTitle = true,
  size = 'large'
}) => {
  const { isPlaying, isLoading, currentTrack, togglePlay } = useAudio();
  const { barHeights } = useAudioVisualization({ isPlaying, isLoading });

  return (
    <div 
      className={`glass-card transition-colors ${!isLoading ? 'cursor-pointer hover:bg-white/10' : 'cursor-wait'} ${className}`}
      onClick={!isLoading ? togglePlay : undefined}
    >
      <div className="text-center">
        {showTitle && (
          <h3 className="text-2xl font-bold text-white mb-8">{currentTrack}</h3>
        )}
        
        {/* Play Button and Audio Visualization */}
        <div className="flex justify-center items-center mb-8 space-x-8">
          {/* Container with fixed height to prevent layout shift */}
          <div className="h-20 flex items-center justify-center">
            {!isPlaying ? (
              <MediaButton
                isPlaying={isPlaying}
                isLoading={isLoading}
                onClick={togglePlay}
                size={size}
              />
            ) : null}
            
            {/* Dynamic FFT Audio Visualization - Clickable for pause */}
            {isPlaying && !isLoading && (
              <AudioVisualization barHeights={barHeights} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
