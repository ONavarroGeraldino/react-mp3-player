import React from 'react';

const ProgressBar = ({ currentTime, duration, onSeek, accentColor, accentDim, lcdBg, lcdBorder, lcdText }) => {

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="w-full px-1">
      <div className="flex justify-between items-center mb-1 px-1">
        <span className="lcd-text text-[10px]" style={{ color: lcdText }}>{formatTime(currentTime)}</span>
        <span className="lcd-text text-[10px]" style={{ color: lcdText }}>{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        className="winamp-progress"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => onSeek(e.target.value)}
        style={{
          '--progress': `${progressPercent}%`,
          background: lcdBg,
          borderColor: lcdBorder,
          backgroundImage: `linear-gradient(90deg, ${accentColor}, ${accentDim})`,
          backgroundSize: `${progressPercent}% 100%`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
};

export default ProgressBar;
