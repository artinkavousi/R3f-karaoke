import React from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { LyricsProvider } from './contexts/LyricsContext';
import { ControlsPanel } from './components/ControlsPanel';
import { LyricsOverlay } from './components/LyricsOverlay';
import { R3FScene } from './components/R3FScene';
import { defaultTheme } from './themes/defaultTheme';

export const App: React.FC = () => {
  const [theme] = React.useState(defaultTheme);

  return (
    <AudioProvider>
      <LyricsProvider>
        <div className="w-full h-screen relative bg-gray-900 text-white">
          <R3FScene theme={theme} />
          <ControlsPanel />
          <LyricsOverlay />
        </div>
      </LyricsProvider>
    </AudioProvider>
  );
};
