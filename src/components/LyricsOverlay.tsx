import React from 'react';
import { useLyrics } from '../contexts/LyricsContext';
import { useSync } from '../hooks/useSync';

export const LyricsOverlay: React.FC = () => {
  const { lyrics, activeIndex } = useLyrics();
  useSync();

  return (
    <div className="absolute bottom-20 w-full text-center pointer-events-none font-bold text-2xl">
      {lyrics.map((line, idx) => (
        <div
          key={idx}
          className={idx === activeIndex ? 'text-yellow-300' : 'text-white'}
          style={{ lineHeight: '2rem' }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
