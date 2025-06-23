import { ParsedLRCLine } from '../types';

export function parseLRC(text: string): ParsedLRCLine[] {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        return { time, text: match[3].trim() };
      }
      return null;
    })
    .filter((l): l is ParsedLRCLine => l !== null)
    .sort((a, b) => a.time - b.time);
}
