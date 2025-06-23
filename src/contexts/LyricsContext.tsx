import React, { createContext, useContext, useState } from 'react';
import { ParsedLRCLine } from '../types';

interface LyricsContextValue {
  lyrics: ParsedLRCLine[];
  setLyrics: React.Dispatch<React.SetStateAction<ParsedLRCLine[]>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Ctx = createContext<LyricsContextValue | undefined>(undefined);

export const LyricsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [lyrics, setLyrics] = useState<ParsedLRCLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Ctx.Provider value={{ lyrics, setLyrics, activeIndex, setActiveIndex }}>
      {children}
    </Ctx.Provider>
  );
};

export const useLyrics = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLyrics must be used within LyricsProvider');
  return ctx;
};
