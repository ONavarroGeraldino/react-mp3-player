import { useState, useRef } from 'react';

const TrackList = ({ tracks, currentTrackIndex, onTrackSelect, onRemoveTrack, onReorder, visible, onToggle, accentColor, accentRgb, lcdText }) => {
  const [search, setSearch] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const dragOverIndex = useRef(null);

  const filtered = search.trim()
    ? tracks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : tracks;

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIndex.current = index;
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newTracks = [...tracks];
    const [removed] = newTracks.splice(dragIndex, 1);
    newTracks.splice(index, 0, removed);
    onReorder(newTracks);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className={`overflow-hidden transition-all duration-300 ${visible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="btn-bevel bg-[#1a1a2e] px-3 py-2 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <span className="text-[10px] font-bold uppercase tracking-widest lcd-text" style={{ color: accentColor }}>PLAYLIST</span>
        <div className="flex items-center gap-2">
          <span className="lcd-text text-[10px] text-[#94a3b8]">{tracks.length}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
            className={`transition-transform ${visible ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="bg-[#0d0d18] border border-[#2a2a3a] border-t-0 max-h-72 overflow-y-auto">
        {tracks.length > 0 && (
          <div className="px-3 py-1.5 border-b border-[#1a1a28]">
            <div className="flex items-center gap-1.5 bg-[#0a0a14] border border-[#1a1a28] px-2 py-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH..."
                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] placeholder-[#3d3d52] w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-[#64748b] hover:text-[#94a3b8]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-[#64748b]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">{search ? 'NOT FOUND' : 'EMPTY'}</span>
          </div>
        ) : (
          <ul className="divide-y divide-[#1a1a28]">
            {filtered.map((track) => {
              const actualIndex = tracks.indexOf(track);
              return (
                <li
                  key={actualIndex}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDrop={(e) => handleDrop(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onTrackSelect(actualIndex)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer group transition-colors"
                  style={{
                    backgroundColor: currentTrackIndex === actualIndex ? `${accentColor}11` : dragIndex === actualIndex ? `${accentColor}22` : undefined,
                    borderLeft: currentTrackIndex === actualIndex ? `3px solid ${accentColor}` : '3px solid transparent',
                    opacity: dragIndex === actualIndex ? 0.5 : 1,
                  }}
                >
                  <span className="w-5 text-center flex-shrink-0">
                    {currentTrackIndex === actualIndex ? (
                      <span className="flex items-end justify-center gap-[1px] h-4">
                        <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '6px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.3s' }} />
                        <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '12px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.1s' }} />
                        <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '8px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.5s' }} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#64748b]">
                        {String(actualIndex + 1).padStart(2, '0')}
                      </span>
                    )}
                  </span>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-medium truncate group-hover:text-white"
                      style={{ color: currentTrackIndex === actualIndex ? accentColor : '#c8c8d0' }}>
                      {track.name.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-[#64748b] uppercase tracking-wider">
                      MP3 FILE
                    </span>
                  </div>

                  <button
                    onClick={(e) => onRemoveTrack(actualIndex, e)}
                    className="opacity-0 group-hover:opacity-100 btn-bevel w-6 h-5 flex items-center justify-center bg-[#1a1a2e] hover:bg-[#3a1010] text-[#64748b] hover:text-[#ff4444] transition-opacity flex-shrink-0"
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrackList;
