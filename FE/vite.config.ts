import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  server: {
    port: 4173,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@schemas': path.resolve(__dirname, '../schemas'),
    },
  },
  optimizeDeps: {
    include: [
      'ace-builds/src-noconflict/mode-sql',
      'ace-builds/src-noconflict/theme-monokai',
    ],
  },
})
