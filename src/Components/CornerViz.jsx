import { useEffect, useState } from 'react';

const notes = ['♪', '♫', '♬', '♪', '♫', '♩', '♪', '♬'];

const CornerViz = ({ isPlaying }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isPlaying) {
      setItems([]);
      return;
    }

    const interval = setInterval(() => {
      setItems(prev => {
        const now = Date.now();
        const filtered = prev.filter(n => now - n.id < 1800);
        if (filtered.length < 6) {
          const newItem = {
            id: now + Math.random(),
            x: 10 + Math.random() * 80,
            symbol: notes[Math.floor(Math.random() * notes.length)],
            size: 8 + Math.random() * 10,
            opacity: 0.4 + Math.random() * 0.6,
            delay: Math.random() * 0.3,
          };
          return [...filtered, newItem];
        }
        return filtered;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isPlaying) return null;

  return (
    <div className="absolute top-0 right-0 w-20 h-full pointer-events-none z-10 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${40 + Math.random() * 55}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            color: '#ff2d95',
            textShadow: '0 0 4px rgba(255,45,149,0.4)',
            animation: `noteFloat 1.8s ease-out ${item.delay}s forwards`,
          }}
        >
          {item.symbol}
        </span>
      ))}
      <style>{`
        @keyframes noteFloat {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translateY(-50px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CornerViz;
