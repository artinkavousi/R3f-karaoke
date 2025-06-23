import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: 'src/index.tsx',
    output: [
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.cjs.js', format: 'cjs' },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ jsx: 'react-jsx', exclude: ['src/__tests__/**'] }),
      postcss(),
    ],
    external: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei'],
  },
  {
    input: 'src/index.tsx',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()],
  },
];
