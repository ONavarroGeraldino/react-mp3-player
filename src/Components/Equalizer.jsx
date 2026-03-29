import React from 'react';
import './Style/Equalizer.css';

const Equalizer = ({ isPlaying }) => {
  return (
    <div className={`equalizer ${isPlaying ? 'playing' : ''}`}>
      <span className="bar bar-1"></span>
      <span className="bar bar-2"></span>
      <span className="bar bar-3"></span>
      <span className="bar bar-4"></span>
      <span className="bar bar-5"></span>
    </div>
  );
};

export default Equalizer;