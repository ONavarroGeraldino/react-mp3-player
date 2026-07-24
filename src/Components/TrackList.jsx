import React from 'react';
import './Style/TrackList.css';

const TrackList = ({ tracks, currentTrackIndex, onTrackSelect, onRemoveTrack, visible, onToggle }) => {
  return (
    <div className={`tracklist-section ${visible ? 'visible' : ''}`}>
      <div className="tracklist-container">
        <div className="tracklist-header">
          <span className="tracklist-title">Tu Biblioteca</span>
          <span className="tracklist-count">{tracks.length}</span>
        </div>

        {tracks.length === 0 ? (
          <div className="tracklist-empty">
            <span className="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </span>
            <p>No hay canciones cargadas</p>
          </div>
        ) : (
          <ul className="tracklist-ul">
            {tracks.map((track, index) => (
              <li
                key={index}
                className={`track-item ${currentTrackIndex === index ? 'active' : ''}`}
                onClick={() => onTrackSelect(index)}
              >
                <span className="track-number">{currentTrackIndex === index ? (
                  <span className="playing-indicator">
                    <span className="indicator-bar bar-a"></span>
                    <span className="indicator-bar bar-b"></span>
                    <span className="indicator-bar bar-c"></span>
                  </span>
                ) : (
                  index + 1
                )}</span>
                <div className="track-details">
                  <span className="track-name-list">{track.name}</span>
                  <span className="track-author-list">Archivo Local</span>
                </div>
                <button
                  className="track-remove"
                  onClick={(e) => onRemoveTrack(index, e)}
                  title="Eliminar cancion"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrackList;
