import { useState, useEffect, memo } from 'react';

const PixelPet = ({ id, gif, onRemove }) => {
  const [pos, setPos] = useState(() => {
    const fromLeft = Math.random() > 0.5;
    return {
      x: fromLeft ? -gif.width : window.innerWidth + gif.width,
      y: 80 + Math.random() * (window.innerHeight - 200),
      dir: fromLeft ? 1 : -1,
    };
  });

  const speed = 2 + Math.random() * 3;

  useEffect(() => {
    let frame;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 16, 3);
      lastTime = now;

      setPos(prev => {
        const nx = prev.x + speed * prev.dir * dt;
        const ny = prev.y + Math.sin(now / 500 + id) * 0.8 * dt;

        if ((prev.dir > 0 && nx > window.innerWidth + gif.width) ||
            (prev.dir < 0 && nx < -gif.width)) {
          onRemove(id);
          return prev;
        }

        return { x: nx, y: ny, dir: prev.dir };
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [id, onRemove, speed, gif.width]);

  return (
    <button
      onClick={() => onRemove(id)}
      className="fixed z-40 pointer-events-auto cursor-pointer hover:scale-125 transition-transform"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scaleX(${pos.dir > 0 ? 1 : -1})`,
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
      }}
      title={gif.title || `Click para eliminar`}
    >
      <img
        src={gif.url}
        alt={gif.title || 'pet'}
        width={gif.width}
        height={gif.height}
        className="pointer-events-none"
        draggable={false}
      />
    </button>
  );
};

export default memo(PixelPet);
