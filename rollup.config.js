import ts from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import flatDts from 'rollup-plugin-flat-dts';
import unbundle from 'rollup-plugin-unbundle';
import typescript from 'typescript';

export default defineConfig({
  input: {
    'exec-z': './src/index.ts',
  },
  plugins: [
    unbundle(),
    ts({
      typescript,
      tsconfig: 'tsconfig.main.json',
      cacheDir: 'target/.rts_cache',
    }),
  ],
  output: {
    dir: '.',
    format: 'esm',
    sourcemap: true,
    entryFileNames: 'dist/[name].js',
    plugins: [
      flatDts({
        tsconfig: 'tsconfig.main.json',
        lib: true,
        file: 'dist/exec-z.d.ts',
        compilerOptions: {
          declarationMap: true,
        },
      }),
    ],
  },
});
