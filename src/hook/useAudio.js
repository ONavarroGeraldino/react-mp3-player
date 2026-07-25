import { useState, useRef, useEffect, useCallback } from 'react';

const useAudio = () => {
  const audio = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [freqData, setFreqData] = useState(new Uint8Array(64));
  const isPlayingRef = useRef(false);
  const audioCtx = useRef(null);
  const analyser = useRef(null);
  const animFrame = useRef(null);

  const initAudioContext = useCallback(() => {
    if (audioCtx.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const anal = ctx.createAnalyser();
    anal.fftSize = 128;
    anal.smoothingTimeConstant = 0.7;
    const source = ctx.createMediaElementSource(audio.current);
    source.connect(anal);
    anal.connect(ctx.destination);
    audioCtx.current = ctx;
    analyser.current = anal;
  }, []);

  const updateFreq = useCallback(() => {
    if (!analyser.current) return;
    const data = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(data);
    setFreqData(data);
    animFrame.current = requestAnimationFrame(updateFreq);
  }, []);

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
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    } else {
      initAudioContext();
      if (audioCtx.current?.state === 'suspended') {
        audioCtx.current.resume();
      }
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            updateFreq();
          })
          .catch(() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
      }
    }
  }, [initAudioContext, updateFreq]);

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
    const handleEnd = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };

    audioRef.addEventListener('timeupdate', updateTime);
    audioRef.addEventListener('loadedmetadata', updateDuration);
    audioRef.addEventListener('ended', handleEnd);

    return () => {
      audioRef.removeEventListener('timeupdate', updateTime);
      audioRef.removeEventListener('loadedmetadata', updateDuration);
      audioRef.removeEventListener('ended', handleEnd);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    freqData,
    togglePlayPause,
    loadTrack,
    seek,
    setVolume,
  };
};

export default useAudio;
