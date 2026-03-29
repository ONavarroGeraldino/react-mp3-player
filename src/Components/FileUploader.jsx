import React from 'react';
import './Style/FileUploader.css';

const FileUploader = ({ onFilesUpload }) => {
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filtramos solo archivos de audio para seguridad
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));

    // Creamos la estructura de datos para nuestra TrackList
    const newTracks = audioFiles.map(file => ({
      name: file.name.replace(/\.[^/.]+$/, ""), // Quitamos la extensión .mp3
      url: URL.createObjectURL(file), // Generamos la URL local temporal
      file: file // Guardamos el original por si acaso
    }));

    if (newTracks.length > 0) {
      onFilesUpload(newTracks);
    }
  };

  return (
    <div className="uploader-container">
      <label htmlFor="file-upload" className="custom-file-upload">
        <span className="upload-icon">📁</span>
        <span className="upload-text">Añadir canciones MP3</span>
        <input 
          id="file-upload" 
          type="file" 
          accept="audio/mp3,audio/mpeg" 
          multiple 
          onChange={handleFileChange} 
        />
      </label>
    </div>
  );
};

export default FileUploader;