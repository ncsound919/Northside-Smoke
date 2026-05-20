import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2022',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['lucide-react', 'motion'],
            'vendor-radix': [
              '@radix-ui/react-tabs',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-switch',
              '@radix-ui/react-avatar',
              '@radix-ui/react-progress',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});
