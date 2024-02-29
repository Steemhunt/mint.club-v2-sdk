import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const config = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      module: 'ESNext',
      tsconfig: 'tsconfig.json',
      exclude: ['**/test', '**/*.test.ts', '/examples'],
    }),
    terser(),
  ],
};

export default config;
