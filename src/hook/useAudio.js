import { useState, useRef, useEffect } from 'react';

const useAudio = () => {
  const audio = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 1. Función para cargar una nueva canción
  const loadTrack = (url) => {
    audio.current.src = url;
    audio.current.load();
    if (isPlaying) audio.current.play();
  };

  // 2. Play / Pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 3. Saltar a un punto específico (Seek)
  const seek = (time) => {
    audio.current.currentTime = time;
    setCurrentTime(time);
  };

  // 4. Efecto para manejar eventos del Audio
  useEffect(() => {
    const audioRef = audio.current;

    const updateTime = () => setCurrentTime(audioRef.currentTime);
    const updateDuration = () => setDuration(audioRef.duration);
    const handleEnd = () => setIsPlaying(false);

    // Escuchadores de eventos nativos
    audioRef.addEventListener('timeupdate', updateTime);
    audioRef.addEventListener('loadedmetadata', updateDuration);
    audioRef.addEventListener('ended', handleEnd);

    // Limpieza al desmontar el componente
    return () => {
      audioRef.removeEventListener('timeupdate', updateTime);
      audioRef.removeEventListener('loadedmetadata', updateDuration);
      audioRef.removeEventListener('ended', handleEnd);
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    loadTrack,
    seek,
  };
};

export default useAudio;