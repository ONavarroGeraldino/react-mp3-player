import React from 'react';
import './Style/Controls.css';

const Controls = ({ isPlaying, onPlayPause, onSkipBack, onSkipForward }) => {
  return (
    <div className="controls-container">
      <button className="control-btn secondary" onClick={onSkipBack}>
        ⏮️
      </button>
      
      <button className="control-btn main-action" onClick={onPlayPause}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      <button className="control-btn secondary" onClick={onSkipForward}>
        ⏭️
      </button>
    </div>
  );
};

export default Controls;