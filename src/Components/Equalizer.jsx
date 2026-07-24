import React from 'react';

const Equalizer = ({ isPlaying }) => {
  const bars = [
    { delay: '0s' },
    { delay: '-0.2s' },
    { delay: '-0.4s' },
    { delay: '-0.6s' },
    { delay: '-0.3s' },
    { delay: '-0.5s' },
    { delay: '-0.1s' },
    { delay: '-0.7s' },
  ];

  const heights = [18, 28, 22, 32, 16, 24, 20, 26];

  return (
    <div className="flex items-end justify-center gap-[2px] h-10 w-20 mx-auto mt-2">
      {bars.map((bar, i) => (
        <span
          key={i}
          className="block w-[5px] rounded-none bg-[#00ff41] transition-[height] duration-100"
          style={{
            height: isPlaying ? undefined : '3px',
            animation: isPlaying
              ? `winamp-eq 0.8s ease-in-out infinite alternate`
              : 'none',
            animationDelay: bar.delay,
            '--eq-height': `${heights[i]}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes winamp-eq {
          0% { height: 3px; background: #00ff41; }
          20% { height: var(--eq-height); background: #39ff14; }
          100% { height: 3px; background: #00cc34; }
        }
      `}</style>
    </div>
  );
};

export default Equalizer;
