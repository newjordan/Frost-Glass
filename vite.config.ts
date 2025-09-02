import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    
    lib: {
      entry: resolve(__dirname, 'src/js/index.ts'),
      name: 'FrostGlass',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        const names = {
          es: 'frost-glass.esm.js',
          umd: 'frost-glass.umd.js',
          iife: 'frost-glass.min.js'
        };
        return names[format];
      }
    },
    
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'frost-glass-enhanced.css';
          }
          return assetInfo.name;
        }
      }
    }
  },
  
  server: {
    port: 3000,
    open: '/examples/index.html',
    host: 'localhost'
  },
  
  css: {
    devSourcemap: true,
    modules: false
  },
  
  optimizeDeps: {
    include: []
  }
});