import React from 'react';
import './Style/FileUploader.css';

const FileUploader = ({ onFilesUpload, isDragOver }) => {

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));

    const newTracks = audioFiles.map(file => ({
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
      file: file,
    }));

    if (newTracks.length > 0) {
      onFilesUpload(newTracks);
    }
    e.target.value = '';
  };

  return (
    <div className={`uploader-container ${isDragOver ? 'drag-over' : ''}`}>
      <label htmlFor="file-upload" className="custom-file-upload">
        <span className="upload-icon-row">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span className="upload-icon-plus">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        </span>
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
