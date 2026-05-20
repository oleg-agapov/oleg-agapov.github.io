// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

export default defineConfig({
  // site: 'https://olegagapov.com',
  site: 'https://oleg-agapov.github.io',
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@duckdb/duckdb-wasm'],
    },
  },
});
