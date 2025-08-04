import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useVolumeControl } from '../../hooks/useVolumeControl';
import { useResponsive } from '../../hooks/useResponsive';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  height?: number;
}

/**
 * Specialized Volume Control Component
 * Follows Single Responsibility Principle - only handles volume UI
 */
export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  height = 120
}) => {
  const { isDragging, handleTrackInteraction, handleDragStart } = useVolumeControl(onVolumeChange);
  const { isMobile } = useResponsive();

  return (
    <div className="flex items-center justify-start">
      <div className="relative flex flex-col items-center" style={{ height }}>
        {/* Volume Track */}
        <div
          className={`w-1 h-full bg-white/30 relative cursor-pointer touch-none select-none ${
            isDragging ? 'bg-white/40' : ''
          }`}
          onClick={handleTrackInteraction}
          onTouchStart={handleTrackInteraction}
        >
          {/* Volume Fill */}
          <div
            className={`absolute bottom-0 left-0 w-full bg-white transition-all ${
              isDragging ? 'duration-0' : 'duration-150'
            }`}
            style={{ height: `${volume}%` }}
          />

          {/* Draggable Handle - Responsive size */}
          <div
            className={`absolute bg-white border-2 border-white/50 cursor-grab active:cursor-grabbing transition-all touch-none select-none ${
              isDragging ? 'scale-125 shadow-lg duration-0' : 'duration-150 hover:scale-110'
            }`}
            style={{
              width: isMobile ? '12px' : '16px',
              height: isMobile ? '12px' : '16px',
              bottom: `${volume}%`,
              left: '50%',
              transform: 'translate(-50%, 50%)',
              boxShadow: isDragging ? '0 4px 12px rgba(255, 255, 255, 0.3)' : undefined
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
        </div>

        {/* Mute/Unmute Button - Responsive size */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 hover:bg-white/10 transition-all duration-150 touch-manipulation ${
            isMobile ? 'mt-1' : 'mt-2'
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
          style={{
            minHeight: isMobile ? '28px' : '32px',
            minWidth: isMobile ? '28px' : '32px'
          }}
        >
          {isMuted ? (
            <VolumeX size={isMobile ? 12 : 14} className="text-white/70 hover:text-white" />
          ) : (
            <Volume2 size={isMobile ? 12 : 14} className="text-white/70 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
