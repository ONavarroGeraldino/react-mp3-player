import { useState, useEffect, useCallback } from 'react';
import PixelPet from './PixelPet';
import { fetchAnimeGifs, getRandomGif } from '../utils/giphy';

const MAX_PETS = 8;

const GifFrenzy = ({ active }) => {
  const [pets, setPets] = useState([]);
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    if (!active) return;
    fetchAnimeGifs().then(setGifs);
  }, [active]);

  const removePet = useCallback((id) => {
    setPets(prev => prev.filter(p => p.id !== id));
  }, []);

  const spawnPet = useCallback(() => {
    const gif = getRandomGif(gifs);
    if (!gif) return;
    setPets(prev => {
      if (prev.length >= MAX_PETS) return prev;
      return [...prev, { id: Date.now() + Math.random(), gif }];
    });
  }, [gifs]);

  useEffect(() => {
    if (!active || gifs.length === 0) return;

    spawnPet();
    const interval = setInterval(() => {
      spawnPet();
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [active, gifs.length, spawnPet]);

  if (!active && pets.length === 0) return null;

  return (
    <>
      {pets.map(pet => (
        <PixelPet key={pet.id} id={pet.id} gif={pet.gif} onRemove={removePet} />
      ))}
    </>
  );
};

export default GifFrenzy;
