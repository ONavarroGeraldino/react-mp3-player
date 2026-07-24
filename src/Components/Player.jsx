import React, { useState, useEffect, useRef, useCallback } from 'react';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import FileUploader from './FileUploader';
import TrackList from './TrackList';
import Equalizer from './Equalizer';
import useAudio from '../hook/useAudio';

import './Style/Player.css';

const Player = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTracklist, setShowTracklist] = useState(false);
  const dragCounter = useRef(0);
  const toastTimer = useRef(null);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    loadTrack,
    seek,
    setVolume,
  } = useAudio();

  useEffect(() => {
    if (tracks.length > 0) {
      loadTrack(tracks[currentTrackIndex].url);
    }
  }, [currentTrackIndex, tracks]);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleNewFiles = (newTracks) => {
    setTracks(prevTracks => [...prevTracks, ...newTracks]);
    setShowTracklist(true);
    showToast(`${newTracks.length} cancion${newTracks.length > 1 ? 'es' : ''} agregada${newTracks.length > 1 ? 's' : ''}`);
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleRemoveTrack = (index, e) => {
    e.stopPropagation();
    const removed = tracks[index];
    setTracks(prev => prev.filter((_, i) => i !== index));
    if (index < currentTrackIndex || (index === currentTrackIndex && tracks.length === 1)) {
      setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % Math.max(tracks.length - 1, 1));
    }
    showToast(`"${removed.name}" eliminada`);
  };

  const handleClearAll = () => {
    setTracks([]);
    setCurrentTrackIndex(0);
    setShowTracklist(false);
    showToast('Lista vaciada');
  };

  const skipForward = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const skipBack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));

      if (audioFiles.length > 0) {
        const newTracks = audioFiles.map(file => ({
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: URL.createObjectURL(file),
          file: file,
        }));
        handleNewFiles(newTracks);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  const currentTrackName = tracks[currentTrackIndex]?.name || 'Sin cancion';

  return (
    <main className={`player-wrapper ${isDragOver ? 'drag-over' : ''}`} data-drop-label="Suelta para agregar">
      <div className="ambient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {toast && <div className="toast-notification">{toast}</div>}

      <section className={`player-container ${isPlaying ? 'playing' : ''}`}>
        <div className="player-header">
          <span className="brand">music-mp3</span>
          {tracks.length > 0 && (
            <button className="clear-btn" onClick={handleClearAll} title="Limpiar lista">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>

        <FileUploader onFilesUpload={handleNewFiles} isDragOver={isDragOver} />

        <div className={`track-art ${isPlaying ? 'playing' : ''}`}>
          <div className="vinyl-grooves"></div>
          <div className="vinyl-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <div className="vinyl-shine"></div>
          <Equalizer isPlaying={isPlaying} />
        </div>

        <div className="track-info">
          <h2 className="track-name">{currentTrackName}</h2>
          <div className="track-meta">
            <p className={`track-status ${tracks.length > 0 ? 'active' : ''}`}>
              {tracks.length > 0 ? (
                <>
                  <span className="status-dot"></span>
                  {isPlaying ? 'Reproduciendo' : 'En Pausa'}
                </>
              ) : (
                'Esperando archivos...'
              )}
            </p>
          </div>
        </div>

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />

        <Controls
          isPlaying={isPlaying}
          volume={volume}
          onPlayPause={togglePlayPause}
          onSkipForward={skipForward}
          onSkipBack={skipBack}
          onVolumeChange={setVolume}
        />

        <div className="section-divider"></div>

        <TrackList
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
          onRemoveTrack={handleRemoveTrack}
          visible={showTracklist || tracks.length > 0}
          onToggle={() => setShowTracklist(prev => !prev)}
        />
      </section>
    </main>
  );
};

export default Player;
