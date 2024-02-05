import typescript from '@rollup/plugin-typescript';

const config = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      module: 'ESNext',
      tsconfig: 'tsconfig.json',
      exclude: ['**/test', '**/*.test.ts', '/examples'],
    }),
  ],
};

export default config;
