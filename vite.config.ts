import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const sdkRoot = path.resolve('../faui-sdk')
const sdkEntry = path.join(sdkRoot, 'src/index.tsx')
const sdkFullEntry = path.join(sdkRoot, 'src/full.tsx')

// https://vite.dev/config/
export default defineConfig({
  base: '/faui-sdk-landing-page/',
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
    {
      name: 'verify-local-faui-sdk',
      configResolved() {
        const missingEntries = [sdkEntry, sdkFullEntry].filter((entry) => !existsSync(entry))
        if (missingEntries.length > 0) {
          throw new Error(
            `Local FAUI SDK source is unavailable. Expected: ${missingEntries.join(', ')}`,
          )
        }
      },
    },
  ],
  resolve: {
    alias: [
      { find: '@lawlietfeng/faui-sdk/full', replacement: sdkFullEntry },
      { find: '@lawlietfeng/faui-sdk', replacement: sdkEntry },
      { find: 'react', replacement: path.resolve('./node_modules/react') },
      { find: 'react-dom', replacement: path.resolve('./node_modules/react-dom') },
      // undici is a Node-only HTTP lib pulled in transitively by
      // @mariozechner/pi-ai. It is only dynamically imported under Node
      // (guarded by process.versions?.node) and never runs in the browser,
      // so we stub it out to keep ~485K out of the bundle.
      { find: 'undici', replacement: path.resolve('./src/stubs/undici-empty.ts') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [path.resolve('.'), sdkRoot],
    },
  },
})
