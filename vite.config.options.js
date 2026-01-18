import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  //NOTE: if we don't specify this, resulting html will be put into dist/src/settings
  root: 'src/settings',

  plugins: [svelte()],
  build: {
    outDir: '../../dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'src/settings/options.html'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
