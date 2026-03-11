// @ts-check
// ============================================================
// astro.config.mjs - Configuracion principal de Astro
// Integra Tailwind CSS v4 via plugin de Vite.
// Docs: https://docs.astro.build/en/reference/configuration/
// ============================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Tailwind v4 se integra como plugin de Vite (no como integracion de Astro)
  vite: {
    plugins: [tailwindcss()],
  },
});