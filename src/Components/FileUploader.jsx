import { useState } from 'react';
import { saveToIndexedDB } from '../utils/storage';
import { extractCoverFromFile } from '../utils/coverExtractor';

const FileUploader = ({ onFilesUpload, isDragOver, accentColor, onToast }) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    const id = 'track_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const name = file.name.replace(/\.[^/.]+$/, '');
    await saveToIndexedDB(id, file, name);
    const cover = await extractCoverFromFile(file);
    return {
      name,
      url: URL.createObjectURL(file),
      cover,
      local: true,
      localId: id,
    };
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));

    if (audioFiles.length === 0) return;

    setUploading(true);

    const newTracks = [];
    for (const file of audioFiles) {
      try {
        const track = await uploadFile(file);
        newTracks.push(track);
      } catch (err) {
        console.error('Upload error for', file.name, err);
      }
    }

    if (newTracks.length > 0) {
      onFilesUpload(newTracks);
      onToast?.(`${newTracks.length} TRACK${newTracks.length > 1 ? 'S' : ''} ADDED`);
    }

    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`btn-bevel flex items-center justify-center gap-2 py-2.5 px-4 w-full cursor-pointer transition-all duration-150 bg-[#1a1a2e] hover:bg-[#222238] ${
          uploading ? 'opacity-60 pointer-events-none' : ''
        }`}
        style={{ color: isDragOver ? accentColor : '#94a3b8' }}
      >
        {uploading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">SAVING...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">
              ADD FILES [.mp3]
            </span>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          accept="audio/mp3,audio/mpeg"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUploader;
