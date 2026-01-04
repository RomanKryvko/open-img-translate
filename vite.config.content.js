import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,

    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
      },
    },
  },
});
