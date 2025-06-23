import { useEffect } from 'react';
import { useLyrics } from '../contexts/LyricsContext';
import { useAudio } from '../contexts/AudioContext';

export function useSync() {
  const { lyrics, setActiveIndex } = useLyrics();
  const { audioRef } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      const current = audio.currentTime;
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (current >= lyrics[i].time) {
          setActiveIndex(i);
          break;
        }
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [lyrics, audioRef, setActiveIndex]);
}
