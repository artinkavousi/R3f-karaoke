import React, { createContext, useRef, useContext } from 'react';

interface AudioContextValue {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const Ctx = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  return <Ctx.Provider value={{ audioRef }}>{children}<audio ref={audioRef} className="hidden" /></Ctx.Provider>;
};

export const useAudio = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
