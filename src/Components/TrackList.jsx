import React from 'react';

const TrackList = ({ tracks, currentTrackIndex, onTrackSelect, onRemoveTrack, visible, onToggle, accentColor, accentRgb, lcdText }) => {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${visible ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
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

      <div className="bg-[#0d0d18] border border-[#2a2a3a] border-t-0 max-h-60 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-[#64748b]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">EMPTY</span>
          </div>
        ) : (
          <ul className="divide-y divide-[#1a1a28]">
            {tracks.map((track, index) => (
              <li
                key={index}
                onClick={() => onTrackSelect(index)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer group transition-colors"
                style={{
                  backgroundColor: currentTrackIndex === index ? `${accentColor}11` : undefined,
                  borderLeft: currentTrackIndex === index ? `3px solid ${accentColor}` : '3px solid transparent',
                }}
              >
                <span className="w-5 text-center flex-shrink-0">
                  {currentTrackIndex === index ? (
                    <span className="flex items-end justify-center gap-[1px] h-4">
                      <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '6px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.3s' }} />
                      <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '12px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.1s' }} />
                      <span className="w-[2px] rounded-none" style={{ background: accentColor, height: '8px', animation: 'winamp-eq 0.6s ease-in-out infinite alternate', animationDelay: '-0.5s' }} />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#64748b]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </span>

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium truncate group-hover:text-white"
                    style={{ color: currentTrackIndex === index ? accentColor : '#c8c8d0' }}>
                    {track.name.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-[#64748b] uppercase tracking-wider">
                    MP3 FILE
                  </span>
                </div>

                <button
                  onClick={(e) => onRemoveTrack(index, e)}
                  className="opacity-0 group-hover:opacity-100 btn-bevel w-6 h-5 flex items-center justify-center bg-[#1a1a2e] hover:bg-[#3a1010] text-[#64748b] hover:text-[#ff4444] transition-opacity flex-shrink-0"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
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
