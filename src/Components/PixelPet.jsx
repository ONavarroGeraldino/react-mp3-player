import { useState, useEffect, memo } from 'react';

const petTypes = [
  { type: 'cat', emoji: '🐱', speed: 2.5, size: 28, bounce: true },
  { type: 'dog', emoji: '🐕', speed: 3.0, size: 30, bounce: true },
  { type: 'robot', emoji: '🤖', speed: 1.8, size: 26, bounce: false },
  { type: 'ninja', emoji: '🥷', speed: 4.0, size: 24, bounce: false },
  { type: 'ghost', emoji: '👻', speed: 2.0, size: 28, bounce: false },
  { type: 'alien', emoji: '👾', speed: 2.2, size: 26, bounce: true },
  { type: 'frog', emoji: '🐸', speed: 2.8, size: 24, bounce: true },
];

const PixelPet = ({ id, onRemove }) => {
  const [pos, setPos] = useState(() => {
    const fromLeft = Math.random() > 0.5;
    return {
      x: fromLeft ? -40 : window.innerWidth + 40,
      y: 60 + Math.random() * (window.innerHeight - 180),
      dir: fromLeft ? 1 : -1,
    };
  });

  const pet = petTypes[Math.floor(Math.random() * petTypes.length)];

  useEffect(() => {
    let frame;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 16, 3);
      lastTime = now;

      setPos(prev => {
        const nx = prev.x + pet.speed * prev.dir * dt;
        const ny = pet.bounce
          ? prev.y + Math.sin((now / 400) * prev.dir) * 1.5 * dt
          : prev.y;

        if ((prev.dir > 0 && nx > window.innerWidth + 60) ||
            (prev.dir < 0 && nx < -60)) {
          onRemove(id);
          return prev;
        }

        return { x: nx, y: ny, dir: prev.dir };
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [id, onRemove, pet.speed, pet.bounce]);

  return (
    <button
      onClick={() => onRemove(id, true)}
      className="fixed z-40 pointer-events-auto select-none cursor-pointer hover:scale-125 transition-transform"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scaleX(${pos.dir > 0 ? 1 : -1})`,
        fontSize: `${pet.size}px`,
        lineHeight: 1,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      }}
      title="Click para eliminar"
    >
      <span
        style={{
          animation: `petWalk 0.3s steps(2, end) infinite`,
          display: 'inline-block',
        }}
      >
        {pet.emoji}
      </span>
      <style>{`
        @keyframes petWalk {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </button>
  );
};

export default memo(PixelPet);
