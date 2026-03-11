// @ts-check
// ============================================================
// astro.config.mjs - Configuracion principal de Astro
// Integra Tailwind CSS v4 via plugin de Vite.
// Docs: https://docs.astro.build/en/reference/configuration/
// ============================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },
});