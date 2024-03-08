import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/esm/index.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        module: 'ESNext',
        tsconfig: 'tsconfig.json',
        exclude: ['**/test', '**/*.test.ts', '/examples'],
      }),
      terser(),
    ],
  },
  {
    input: 'src/node.ts',
    output: [
      {
        file: 'dist/cjs/node.js',
        format: 'cjs',
      },
      {
        file: 'dist/esm/node.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        module: 'ESNext',
        tsconfig: 'tsconfig.json',
        exclude: ['**/test', '**/*.test.ts', '/examples'],
      }),
      terser(),
    ],
  },
];

export default config;
