import React from 'react';
import './Style/TrackList.css';

const TrackList = ({ tracks, currentTrackIndex, onTrackSelect }) => {
  if (tracks.length === 0) {
    return (
      <div className="tracklist-empty">
        <p>No hay canciones cargadas</p>
      </div>
    );
  }

  return (
    <div className="tracklist-container">
      <h3 className="tracklist-title">Tu Biblioteca</h3>
      <ul className="tracklist-ul">
        {tracks.map((track, index) => (
          <li 
            key={index} 
            className={`track-item ${currentTrackIndex === index ? 'active' : ''}`}
            onClick={() => onTrackSelect(index)}
          >
            <span className="track-number">{index + 1}</span>
            <div className="track-details">
              <span className="track-name-list">{track.name}</span>
              <span className="track-author-list">Archivo Local</span>
            </div>
            {currentTrackIndex === index && <span className="playing-icon">🔊</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;