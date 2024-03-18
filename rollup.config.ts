import typescript from '@rollup/plugin-typescript';

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
    ],
  },
];

export default config;
