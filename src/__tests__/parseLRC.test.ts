import { parseLRC } from '../utils/parseLRC';

test('parses lrc lines', () => {
  const input = '[00:10.00]hello\n[00:20.00]world';
  const result = parseLRC(input);
  expect(result).toEqual([
    { time: 10, text: 'hello' },
    { time: 20, text: 'world' },
  ]);
});
