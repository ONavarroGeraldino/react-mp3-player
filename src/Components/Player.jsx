import { useState, useEffect, useRef, useCallback } from 'react';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import FileUploader from './FileUploader';
import TrackList from './TrackList';
import Equalizer from './Equalizer';
import useAudio from '../hook/useAudio';

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
    showToast(`${newTracks.length} TRACK${newTracks.length > 1 ? 'S' : ''} ADDED`);
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
    showToast(`"${removed.name}" REMOVED`);
  };

  const handleClearAll = () => {
    setTracks([]);
    setCurrentTrackIndex(0);
    setShowTracklist(false);
    showToast('PLAYLIST CLEARED');
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

  const currentTrackName = tracks[currentTrackIndex]?.name || 'NO_TRACK';

  return (
    <main
      className={`min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#08080f] relative overflow-hidden ${
        isDragOver ? 'after:fixed after:inset-0 after:z-50 after:border-[3px] after:border-dashed after:border-[#00ff41] after:m-4 after:flex after:items-center after:justify-center after:content-["DROP_MP3_HERE"] after:text-[#00ff41] after:font-["Press_Start_2P"] after:text-sm after:bg-black/80' : ''
      }`}
    >
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 btn-bevel bg-[#1a1a2e] px-6 py-3 border border-[#3d3d52] text-[#00ff41] text-[10px] font-bold uppercase tracking-widest lcd-text animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      <div className="metal-frame w-full max-w-[400px] bg-[#12121d] relative z-10">
        {/* Title bar */}
        <div className="bg-gradient-to-b from-[#3d3d52] to-[#2a2a3a] px-3 py-1.5 flex items-center justify-between border-b border-[#1a1a2e]">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff41] text-[10px] font-bold uppercase tracking-[3px] lcd-text">MP3_PLAYER v1.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            {tracks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="btn-bevel w-6 h-5 flex items-center justify-center bg-[#2a2a3a] hover:bg-[#3a1010] text-[#64748b] hover:text-[#ff4444]"
                title="CLEAR ALL"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 space-y-4">
          {/* File upload */}
          <FileUploader onFilesUpload={handleNewFiles} isDragOver={isDragOver} />

          {/* LCD Display area */}
          <div className="bg-[#0d1b0d] border-2 border-[#2a3d2a] p-4 space-y-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
            {/* Spectrum analyzer / Equalizer */}
            <Equalizer isPlaying={isPlaying} />

            {/* Track name LCD */}
            <div className="text-center space-y-1">
              <h2 className="lcd-text text-[11px] leading-relaxed truncate px-2">
                {currentTrackName.replace(/ /g, '_').toUpperCase()}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-none ${isPlaying ? 'bg-[#00ff41] neon-glow' : 'bg-[#2a3d2a]'}`} />
                <span className="text-[#00ff41] text-[8px] font-bold uppercase tracking-[2px] font-[Press_Start_2P]">
                  {tracks.length === 0 ? 'STAND_BY' : isPlaying ? 'PLAYING >>' : 'PAUSED ||'}
                </span>
              </div>
            </div>

            {/* Progress LCD */}
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
          </div>

          {/* Controls */}
          <Controls
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={togglePlayPause}
            onSkipForward={skipForward}
            onSkipBack={skipBack}
            onVolumeChange={setVolume}
          />

          {/* Tracklist */}
          <TrackList
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackSelect={handleTrackSelect}
            onRemoveTrack={handleRemoveTrack}
            visible={showTracklist || tracks.length > 0}
            onToggle={() => setShowTracklist(prev => !prev)}
          />

          {/* Status bar */}
          <div className="border-t border-[#2a2a3e] pt-2 flex justify-between px-1">
            <span className="text-[#64748b] text-[8px] font-bold uppercase tracking-widest">
              {tracks.length > 0 ? `TRK ${String(currentTrackIndex + 1).padStart(2, '0')}/${String(tracks.length).padStart(2, '0')}` : 'NO TRACKS'}
            </span>
            <span className="text-[#64748b] text-[8px] font-bold uppercase tracking-widest">
              KHZ 44.1
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Player;
