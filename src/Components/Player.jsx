import { useState, useEffect, useRef, useCallback } from 'react';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import FileUploader from './FileUploader';
import TrackList from './TrackList';
import Equalizer from './Equalizer';
import ThreeBackground from './ThreeBackground';
import CornerViz from './CornerViz';
import SpectrumViz from './SpectrumViz';
import StyleSwitcher from './StyleSwitcher';
import ShapeSwitcher from './ShapeSwitcher';
import useAudio from '../hook/useAudio';
import { loadFromIndexedDB, saveToIndexedDB, deleteFromIndexedDB, clearIndexedDB } from '../utils/storage';
import { extractCoverFromFile } from '../utils/coverExtractor';

const themes = {
  0: {
    name: 'MP3_PHYSICAL',
    accent: '#ff2d95',
    accentDim: '#cc2477',
    accentRgb: '255,45,149',
    lcdBg: '#1a0d14',
    lcdBorder: '#2a1a3d',
    lcdText: '#ff2d95',
    caseClass: 'player-case',
    bgColor: '#08080f',
    sphereColor: '#ff2d95',
    sphereSize: 'large',
    btnPlayFrom: '#ff2d95',
    btnPlayTo: '#cc0052',
  },
  1: {
    name: 'MP3_GLASS',
    accent: '#a855f7',
    accentDim: '#7c3aed',
    accentRgb: '168,85,247',
    lcdBg: 'rgba(255,255,255,0.05)',
    lcdBorder: 'rgba(255,255,255,0.12)',
    lcdText: '#c084fc',
    caseClass: 'glass-case',
    bgColor: '#0f0a1a',
    sphereColor: '#a855f7',
    sphereSize: 'large',
    btnPlayFrom: '#a855f7',
    btnPlayTo: '#6d28d9',
  },
  2: {
    name: 'MP3_NEON',
    accent: '#00f0ff',
    accentDim: '#00b8cc',
    accentRgb: '0,240,255',
    lcdBg: '#050505',
    lcdBorder: '#1a3a3a',
    lcdText: '#00f0ff',
    caseClass: 'neon-case',
    bgColor: '#050505',
    sphereColor: '#00f0ff',
    sphereSize: 'large',
    btnPlayFrom: '#00f0ff',
    btnPlayTo: '#0099aa',
  },
  3: {
    name: 'MP3_RETRO',
    accent: '#f59e0b',
    accentDim: '#d97706',
    accentRgb: '245,158,11',
    lcdBg: '#1a1408',
    lcdBorder: '#3a2a08',
    lcdText: '#f59e0b',
    caseClass: 'retro-case',
    bgColor: '#0d0a04',
    sphereColor: '#f59e0b',
    sphereSize: 'large',
    btnPlayFrom: '#f59e0b',
    btnPlayTo: '#b45309',
  },
  4: {
    name: 'MP3_CHROME',
    accent: '#e2e8f0',
    accentDim: '#94a3b8',
    accentRgb: '226,232,240',
    lcdBg: '#0f1117',
    lcdBorder: '#334155',
    lcdText: '#e2e8f0',
    caseClass: 'chrome-case',
    bgColor: '#0a0a0f',
    sphereColor: '#e2e8f0',
    sphereSize: 'large',
    btnPlayFrom: '#e2e8f0',
    btnPlayTo: '#64748b',
  },
  5: {
    name: 'MP3_LAVA',
    accent: '#ef4444',
    accentDim: '#b91c1c',
    accentRgb: '239,68,68',
    lcdBg: '#1a0a0a',
    lcdBorder: '#3a1515',
    lcdText: '#ef4444',
    caseClass: 'lava-case',
    bgColor: '#080404',
    sphereColor: '#ef4444',
    sphereSize: 'large',
    btnPlayFrom: '#ef4444',
    btnPlayTo: '#991b1b',
  },
};

const Player = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTracklist, setShowTracklist] = useState(false);
  const [style, setStyle] = useState(0);
  const [shape, setShape] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sphereReady, setSphereReady] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const dragCounter = useRef(0);
  const toastTimer = useRef(null);
  const isLoaded = useRef(false);
  const autoPlayRef = useRef(false);

  const t = themes[style];

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    freqData,
    togglePlayPause,
    loadTrack,
    seek,
    setVolume,
  } = useAudio();

  useEffect(() => {
    if (tracks.length > 0) {
      const shouldAutoPlay = autoPlayRef.current;
      if (shouldAutoPlay) autoPlayRef.current = false;
      loadTrack(tracks[currentTrackIndex].url, shouldAutoPlay);
    }
  }, [currentTrackIndex, reloadTrigger]);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    const loadPlaylistData = async () => {
      try {
        const saved = localStorage.getItem('mp3_playlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const restored = await Promise.all(parsed.map(async (t) => {
              if (t.localId) {
                const entry = await loadFromIndexedDB(t.localId);
                if (entry && entry.file) {
                  return { ...t, url: URL.createObjectURL(entry.file) };
                }
                return null;
              }
              return t;
            }));
            const valid = restored.filter(Boolean);
            if (valid.length > 0) setTracks(valid);
          }
        }
      } catch {}

      setLoading(false);
      isLoaded.current = true;
    };
    loadPlaylistData();
  }, []);

  useEffect(() => {
    if (!isLoaded.current) return;

    localStorage.setItem('mp3_playlist', JSON.stringify(tracks));
  }, [tracks]);

  const handleNewFiles = (newTracks) => {
    const wasEmpty = tracks.length === 0;
    setTracks(prevTracks => [...prevTracks, ...newTracks]);
    setShowTracklist(true);
    if (wasEmpty) {
      setReloadTrigger(prev => prev + 1);
    }
    showToast(`${newTracks.length} TRACK${newTracks.length > 1 ? 'S' : ''} ADDED`);
  };

  const handleTrackSelect = (index) => {
    autoPlayRef.current = true;
    setCurrentTrackIndex(index);
  };

  const handleRemoveTrack = (index, e) => {
    e.stopPropagation();
    const removed = tracks[index];
    setTracks(prev => prev.filter((_, i) => i !== index));
    if (index < currentTrackIndex || (index === currentTrackIndex && tracks.length === 1)) {
      setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % Math.max(tracks.length - 1, 1));
    }
    if (removed.localId) {
      deleteFromIndexedDB(removed.localId).catch(() => {});
    }
    showToast(`"${removed.name}" REMOVED`);
  };

  const handleClearAll = () => {
    clearIndexedDB().catch(() => {});
    localStorage.removeItem('mp3_playlist');
    setTracks([]);
    setCurrentTrackIndex(0);
    setShowTracklist(false);
    showToast('PLAYLIST CLEARED');
  };

  const handleReorder = (reordered) => {
    setTracks(reordered);
  };

  const skipForward = () => {
    if (tracks.length === 0) return;
    autoPlayRef.current = true;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const skipBack = () => {
    if (tracks.length === 0) return;
    autoPlayRef.current = true;
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

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));

      if (audioFiles.length > 0) {
        const newTracks = [];
        for (const file of audioFiles) {
          const id = 'track_' + Date.now() + '_' + Math.random().toString(36).slice(2);
          const name = file.name.replace(/\.[^/.]+$/, '');
          await saveToIndexedDB(id, file, name);
          let cover = null;
          try { cover = await extractCoverFromFile(file); } catch {}
          newTracks.push({ name, url: URL.createObjectURL(file), cover, local: true, localId: id });
        }
        if (newTracks.length > 0) {
          handleNewFiles(newTracks);
        }
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
      className={`min-h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}
      style={{ backgroundColor: t.bgColor }}
    >
      <ThreeBackground style={style} accentColor={t.sphereColor} shape={shape} size={t.sphereSize} onLoad={() => setSphereReady(true)} />

      <StyleSwitcher currentStyle={style} onChange={setStyle} />
      <ShapeSwitcher currentShape={shape} onChange={setShape} />

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 btn-bevel bg-[#1a1a2e] px-6 py-3 border border-[#3d3d52] text-[10px] font-bold uppercase tracking-widest lcd-text animate-[fadeIn_0.2s_ease-out]"
          style={{ color: t.accent, textShadow: `0 0 6px rgba(${t.accentRgb},0.4)` }}>
          {toast}
        </div>
      )}

      <div className={`${t.caseClass} w-full max-w-[400px] relative z-10 transition-all duration-500 overflow-hidden`} style={{ opacity: 0.9 }}>
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative w-10 h-10">
              <svg className="animate-spin absolute inset-0" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.15" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold lcd-text" style={{ color: t.lcdText }}>
                {sphereReady ? 'OK' : '3D'}
              </span>
            </div>
            <span className="lcd-text text-[10px]" style={{ color: t.lcdText }}>
              {sphereReady ? 'INITIALIZING...' : 'LOADING SPHERE...'}
            </span>
          </div>
        )}
        {!loading && (
        <>
        {/* Title bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[3px] lcd-text"
              style={{ color: t.lcdText, textShadow: `0 0 6px rgba(${t.accentRgb},0.4)` }}>
              {t.name}
            </span>
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
          <FileUploader onFilesUpload={handleNewFiles} isDragOver={isDragOver} accentColor={t.accent} onToast={showToast} />

          {/* LCD Display area */}
          <div className="screen-bezel p-4 space-y-3 relative overflow-hidden" style={{ background: t.lcdBg, borderColor: t.lcdBorder }}>
            <CornerViz isPlaying={isPlaying} accentColor={t.accent} />
            <SpectrumViz freqData={freqData} accentColor={t.accent} accentRgb={t.accentRgb} />

            {/* Cover art + track info */}
            <div className="flex justify-center">
            <div className="flex items-center gap-3 max-w-full">
              {tracks[currentTrackIndex]?.cover ? (
                <img
                  src={tracks[currentTrackIndex].cover}
                  alt="cover"
                  className="w-10 h-10 object-cover border border-[#1a1a28] flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-[#0d0d18] border border-[#1a1a28] text-[#3d3d52]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              )}
              <div className="text-center flex-1 min-w-0 space-y-1">
              <h2 className="lcd-text text-[11px] leading-relaxed truncate"
                style={{ color: t.lcdText, textShadow: `0 0 6px rgba(${t.accentRgb},0.4)` }}>
                {currentTrackName.replace(/ /g, '_').toUpperCase()}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none"
                  style={{
                    backgroundColor: isPlaying ? t.accent : t.lcdBorder,
                    boxShadow: isPlaying ? `0 0 8px rgba(${t.accentRgb},0.5)` : 'none',
                  }}
                />
                <span className="text-[8px] font-bold uppercase tracking-[2px] font-[Press_Start_2P]"
                  style={{ color: t.lcdText }}>
                  {tracks.length === 0 ? 'STAND_BY' : isPlaying ? 'PLAYING >>' : 'PAUSED ||'}
                </span>
            </div>
            </div>
            </div>
            </div>

            {/* Progress LCD */}
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
              accentColor={t.accent}
              accentDim={t.accentDim}
              lcdBg={t.lcdBg}
              lcdBorder={t.lcdBorder}
              lcdText={t.lcdText}
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
            accentColor={t.accent}
            accentRgb={t.accentRgb}
            lcdText={t.lcdText}
            btnPlayFrom={t.btnPlayFrom}
            btnPlayTo={t.btnPlayTo}
          />

          {/* Tracklist */}
          <TrackList
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackSelect={handleTrackSelect}
            onRemoveTrack={handleRemoveTrack}
            onReorder={handleReorder}
            visible={showTracklist || tracks.length > 0}
            onToggle={() => setShowTracklist(prev => !prev)}
            accentColor={t.accent}
            accentRgb={t.accentRgb}
            lcdText={t.lcdText}
          />

          {/* Status bar */}
          <div className="mt-3 pt-2 flex justify-between px-2 border-t border-[#ffffff08]">
            <span className="text-[#64748b] text-[8px] font-bold uppercase tracking-widest">
              {tracks.length > 0 ? `TRK ${String(currentTrackIndex + 1).padStart(2, '0')}/${String(tracks.length).padStart(2, '0')}` : 'NO TRACKS'}
            </span>
            <span className="text-[#64748b] text-[8px] font-bold uppercase tracking-widest">
              KHZ 44.1
            </span>
          </div>
        </div>
        </>
        )}
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
