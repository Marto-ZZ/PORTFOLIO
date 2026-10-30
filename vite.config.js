import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pathToFileURL } from 'node:url';

function precalculo() {
  return {
    name: 'precalculo',
    apply: 'build',
    async load(id) {
      if (!id.endsWith('.precalc.js')) return null;
      const mod = await import(pathToFileURL(id).href);
      return Object.entries(mod)
        .map(([nombre, valor]) => (nombre === 'default'
          ? `export default ${JSON.stringify(valor)};`
          : `export const ${nombre} = ${JSON.stringify(valor)};`))
        .join('\n');
    },
  };
}

export default defineConfig({
  plugins: [react(), precalculo()],
  base: './'
});
