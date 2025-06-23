import React, { ChangeEvent } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useLyrics } from '../contexts/LyricsContext';
import { useLRCParser } from '../hooks/useLRCParser';

export const ControlsPanel: React.FC = () => {
  const { audioRef } = useAudio();
  const { setLyrics } = useLyrics();
  const [rawLrc, setRawLrc] = React.useState<string | null>(null);
  const parsed = useLRCParser(rawLrc);

  React.useEffect(() => {
    if (parsed.length) setLyrics(parsed);
  }, [parsed, setLyrics]);

  const onAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(file);
    }
  };

  const onLrcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then(setRawLrc);
    }
  };

  const onPlay = () => audioRef.current?.play();
  const onPause = () => audioRef.current?.pause();

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-4 rounded text-sm space-x-2">
      <input type="file" accept="audio/*" onChange={onAudioChange} />
      <input type="file" accept=".lrc" onChange={onLrcChange} />
      <button onClick={onPlay} className="px-2 py-1 bg-green-600 rounded">Play</button>
      <button onClick={onPause} className="px-2 py-1 bg-red-600 rounded">Pause</button>
    </div>
  );
};
