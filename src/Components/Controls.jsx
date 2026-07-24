import React, { useState } from 'react';

const Controls = ({ isPlaying, volume, onPlayPause, onSkipBack, onSkipForward, onVolumeChange }) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);

  const cycleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

  const handleVolumeChange = (e) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-4">
      {/* Volume */}
      <div className="flex items-center gap-2 px-2">
        <button
          onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
          className="btn-bevel w-8 h-6 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3d3d52] active:scale-95 flex-shrink-0"
        >
          <svg width="12" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
          </svg>
        </button>
        <input
          type="range"
          className="winamp-slider flex-1"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span className="lcd-text text-[8px] w-7 text-right">{Math.round(volume * 100)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Shuffle */}
        <button
          onClick={() => setIsShuffled(!isShuffled)}
          className={`btn-bevel w-8 h-7 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3d3d52] ${
            isShuffled ? 'text-[#ff2d95] neon-glow' : 'text-[#64748b]'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        </button>

        {/* Prev */}
        <button onClick={onSkipBack} className="btn-bevel w-10 h-10 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3d3d52] text-[#c8c8d0]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          className="btn-bevel w-14 h-14 flex items-center justify-center bg-gradient-to-b from-[#ff2d95] to-[#cc0052] hover:from-[#ff4da6] hover:to-[#e6005c] text-white neon-glow"
        >
          {isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="ml-[2px]">
              <polygon points="7 3 21 12 7 21 7 3" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button onClick={onSkipForward} className="btn-bevel w-10 h-10 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3d3d52] text-[#c8c8d0]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={cycleRepeat}
          className={`btn-bevel w-8 h-7 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3d3d52] relative ${
            repeatMode > 0 ? 'text-[#ff2d95] neon-glow' : 'text-[#64748b]'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          {repeatMode === 1 && (
            <span className="absolute -top-0.5 -right-0.5 lcd-text text-[6px]">1</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
