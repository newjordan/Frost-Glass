import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', '.storybook'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        'dist/',
        '.storybook/',
        'examples/'
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90
      }
    },
    reporters: ['default'],
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@js': resolve(__dirname, './src/js'),
      '@css': resolve(__dirname, './src')
    }
  }
});