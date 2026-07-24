import React from 'react';

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
    <div className={`w-full ${isDragOver ? 'ring-2 ring-[#ff2d95]' : ''}`}>
      <label
        htmlFor="file-upload"
        className={`btn-bevel flex items-center justify-center gap-2 py-2.5 px-4 w-full cursor-pointer transition-all duration-150 ${
          isDragOver
            ? 'bg-[#1a0a14] text-[#ff2d95]'
            : 'bg-[#1a1a2e] hover:bg-[#222238] text-[#94a3b8] hover:text-[#c8c8d0]'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className={`text-xs font-bold uppercase tracking-wider ${
          isDragOver ? 'font-[Press_Start_2P] text-[10px]' : ''
        }`}>
          {isDragOver ? 'SOLTAR AQUI' : 'ADD FILES [.mp3]'}
        </span>
        <input
          id="file-upload"
          type="file"
          accept="audio/mp3,audio/mpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUploader;
