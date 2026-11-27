
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { nodePolyfills } from '@blocksquaredev/vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCommonjs(),
    nodePolyfills({
      include: ['events'],
      protocolImports: true,
    }),
  ],

  optimizeDeps: {
    exclude: [
      '@cornerstonejs/dicom-image-loader',
    ],
    include: [
      'dicom-parser',
    ],
  },

  worker: {
    format: 'es',
  },
});
