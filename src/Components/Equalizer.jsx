import React from 'react';

const Equalizer = ({ isPlaying, accentColor }) => {
  const bars = [
    { delay: '0s', height: 18 },
    { delay: '-0.2s', height: 28 },
    { delay: '-0.4s', height: 22 },
    { delay: '-0.6s', height: 32 },
    { delay: '-0.3s', height: 16 },
    { delay: '-0.5s', height: 24 },
    { delay: '-0.1s', height: 20 },
    { delay: '-0.7s', height: 26 },
  ];

  return (
    <div className="flex items-end justify-center gap-[2px] h-10 w-20 mx-auto mt-2">
      {bars.map((bar, i) => (
        <span
          key={i}
          className="block w-[5px] rounded-none transition-[height] duration-100"
          style={{
            backgroundColor: accentColor,
            height: isPlaying ? undefined : '3px',
            animation: isPlaying
              ? `winamp-eq 0.8s ease-in-out infinite alternate`
              : 'none',
            animationDelay: bar.delay,
            '--eq-height': `${bar.height}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes winamp-eq {
          0% { height: 3px; }
          20% { height: var(--eq-height); }
          100% { height: 3px; }
        }
      `}</style>
    </div>
  );
};

export default Equalizer;
