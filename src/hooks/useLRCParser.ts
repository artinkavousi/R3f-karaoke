import { useState, useEffect } from 'react';
import { parseLRC } from '../utils/parseLRC';
import { ParsedLRCLine } from '../types';

export function useLRCParser(raw: string | null): ParsedLRCLine[] {
  const [lines, setLines] = useState<ParsedLRCLine[]>([]);
  useEffect(() => {
    if (raw) {
      setLines(parseLRC(raw));
    }
  }, [raw]);
  return lines;
}
