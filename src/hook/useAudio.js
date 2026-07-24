import { useState, useRef, useEffect, useCallback } from 'react';

const useAudio = () => {
  const audio = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const isPlayingRef = useRef(false);

  const loadTrack = useCallback((url) => {
    audio.current.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
    audio.current.src = url;
    audio.current.load();
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    const audioEl = audio.current;
    if (isPlayingRef.current) {
      audioEl.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch(() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
      }
    }
  }, []);

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
