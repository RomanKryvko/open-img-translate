import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,

    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
  },
});
