import { useState, useRef, useEffect } from 'react';

const useAudio = () => {
  const audio = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const loadTrack = (url) => {
    audio.current.src = url;
    audio.current.load();
    if (isPlaying) audio.current.play();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    audio.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol) => {
    audio.current.volume = vol;
    setVolumeState(vol);
  };

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
