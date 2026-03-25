import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  server: { hmr: false },
  resolve: { alias: { 
    src: "/src",
    '@': fileURLToPath(new URL('./src/game', import.meta.url)),
  } },
})