import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    preact(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:3000', '/users': 'http://localhost:3000' }
  }
})
