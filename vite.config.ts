import fs from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/faui-landing-page/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'github-pages-spa-fallback',
      apply: 'build',
      async closeBundle() {
        const distDir = path.resolve('./dist')
        const indexHtmlPath = path.join(distDir, 'index.html')
        const notFoundHtmlPath = path.join(distDir, '404.html')
        await fs.copyFile(indexHtmlPath, notFoundHtmlPath)
      },
    },
  ],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      // undici is a Node-only HTTP lib pulled in transitively by
      // @mariozechner/pi-ai. It is only dynamically imported under Node
      // (guarded by process.versions?.node) and never runs in the browser,
      // so we stub it out to keep ~485K out of the bundle.
      undici: path.resolve('./src/stubs/undici-empty.ts'),
    },
  },
})
