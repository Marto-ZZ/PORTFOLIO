import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base relativa: assets como './...' en vez de '/NOMBRE-REPO/...'.
  // Funciona en cualquier subdirectorio de GitHub Pages sin depender del nombre del repo.
  base: './'
});
