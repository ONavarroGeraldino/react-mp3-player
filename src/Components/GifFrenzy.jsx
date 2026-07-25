import { useState, useEffect, useCallback } from 'react';
import PixelPet from './PixelPet';

const MAX_PETS = 8;

const GifFrenzy = ({ active }) => {
  const [pets, setPets] = useState([]);

  const removePet = useCallback((id, clicked) => {
    setPets(prev => prev.filter(p => p.id !== id));
  }, []);

  const spawnPet = useCallback(() => {
    setPets(prev => {
      if (prev.length >= MAX_PETS) return prev;
      return [...prev, { id: Date.now() + Math.random() }];
    });
  }, []);

  useEffect(() => {
    if (!active) return;

    spawnPet();
    const interval = setInterval(() => {
      spawnPet();
    }, 1500 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, [active, spawnPet]);

  if (!active && pets.length === 0) return null;

  return (
    <>
      {pets.map(pet => (
        <PixelPet key={pet.id} id={pet.id} onRemove={removePet} />
      ))}
    </>
  );
};

export default GifFrenzy;
