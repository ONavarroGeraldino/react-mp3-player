import { useState, useRef, useEffect, useCallback } from 'react';

const useAudio = () => {
  const audio = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const loadTrack = useCallback((url) => {
    audio.current.pause();
    audio.current.src = url;
    audio.current.load();
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    const audioEl = audio.current;
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isPlaying]);

  const seek = useCallback((time) => {
    audio.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol) => {
    audio.current.volume = vol;
    setVolumeState(vol);
  }, []);

  useEffect(() => {
    const audioRef = audio.current;

    const updateTime = () => setCurrentTime(audioRef.currentTime);
    const updateDuration = () => setDuration(audioRef.duration);
    const handleEnd = () => setIsPlaying(false);

    audioRef.addEventListener('timeupdate', updateTime);
    audioRef.addEventListener('loadedmetadata', updateDuration);
    audioRef.addEventListener('ended', handleEnd);

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
    volume,
    togglePlayPause,
    loadTrack,
    seek,
    setVolume,
  };
};

export default useAudio;
