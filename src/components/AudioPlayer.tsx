import React from 'react';
import { useAudio } from '../contexts/AudioContext';

export const AudioPlayer: React.FC = () => {
  const { audioRef } = useAudio();
  return <audio ref={audioRef} />;
};
