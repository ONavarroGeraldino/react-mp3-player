import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import FileUploader from './FileUploader';
import TrackList from './TrackList';
import Equalizer from './Equalizer';
import useAudio from '../hook/useAudio'; // Importa tu nuevo hook

import './Style/Player.css'; 

const Player = () => {
  const [tracks, setTracks] = useState([]); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Extraemos toda la lógica del Hook
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlayPause, 
    loadTrack, 
    seek 
  } = useAudio();

  // EFECTO: Cuando cambie la lista de canciones o el índice actual, cargamos el audio
  useEffect(() => {
    if (tracks.length > 0) {
      loadTrack(tracks[currentTrackIndex].url);
    }
  }, [currentTrackIndex, tracks]);

  const handleNewFiles = (newTracks) => {
    setTracks(prevTracks => [...prevTracks, ...newTracks]);
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
  };

  // Funciones para saltar canciones
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Obtenemos el nombre de la canción actual de forma segura
  const currentTrackName = tracks[currentTrackIndex]?.name || "Selecciona una canción";

  return (
    <main className="player-wrapper">
      <section className="player-container">
        
        {/* Zona de subida (ahora arriba para mejor flujo) */}
        <FileUploader onFilesUpload={handleNewFiles} />
        {/* ÁREA DEL DISCO/ARTE MODIFICADA */}
        <div className={`track-art ${isPlaying ? 'playing' : ''}`}>
          <div className="art-placeholder">🎵</div>
          {/* Añadimos el ecualizador aquí dentro */}
          <Equalizer isPlaying={isPlaying} />
        </div>

        <div className="track-info">
          <h2 className="track-name">{currentTrackName}</h2>
          <p className="track-status">
            {tracks.length > 0 ? (isPlaying ? 'Reproduciendo' : 'En Pausa') : 'Esperando archivos...'}
          </p>
        </div>

        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={seek} 
        />

        <Controls 
          isPlaying={isPlaying} 
          onPlayPause={togglePlayPause} 
          onSkipForward={skipForward}
          onSkipBack={skipBack}
        />
      
        <TrackList 
          tracks={tracks} 
          currentTrackIndex={currentTrackIndex} 
          onTrackSelect={handleTrackSelect} 
        />
      </section>
    </main>
  );
};

export default Player;