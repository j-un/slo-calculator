/// <reference types="vitest" />
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html', 'clover', 'json'],
      reportsDirectory: '../coverage', // Use 'reportsDirectory' instead of 'dir'
    },
  },
} as UserConfig);
