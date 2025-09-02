import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default defineConfig([
  // ES Module build
  {
    input: 'src/js/index.ts',
    output: {
      file: 'dist/frost-glass.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      })
    ],
    external: []
  },
  
  // UMD build
  {
    input: 'src/js/index.ts',
    output: {
      file: 'dist/frost-glass.umd.js',
      format: 'umd',
      name: 'FrostGlass',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      })
    ],
    external: []
  },
  
  // Minified IIFE build (for CDN)
  {
    input: 'src/js/index.ts',
    output: {
      file: 'dist/frost-glass.min.js',
      format: 'iife',
      name: 'FrostGlass',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: {
          reserved: ['FrostGlass']
        }
      })
    ],
    external: []
  }
]);