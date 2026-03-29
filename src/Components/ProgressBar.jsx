import React from 'react';
import './Style/ProgressBar.css';

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  
  // Función auxiliar para formatear segundos a MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculamos el porcentaje para el background de la barra (opcional para estilo)
  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="progress-container">
      <input 
        type="range" 
        className="progress-bar"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => onSeek(e.target.value)}
        style={{ '--progress': `${progressPercent}%` }}
      />
      <div className="time-info">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;