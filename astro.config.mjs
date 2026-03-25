// @ts-check
// ============================================================
// astro.config.mjs - Configuracion principal de Astro
// Integra Tailwind CSS v4 via plugin de Vite.
// Docs: https://docs.astro.build/en/reference/configuration/
// ============================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portafolioz.com',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin/') && !page.includes('/api/'),
  })],
  security: {
    checkOrigin: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});