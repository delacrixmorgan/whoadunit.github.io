import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // BASE_URL env var is set in the CI workflow for GitHub Pages subpath.
  // For a custom domain at root, remove the env var (defaults to '/').
  base: process.env.BASE_URL || '/',
})
