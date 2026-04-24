import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

const PUBLIC = resolve(__dirname, 'public')
const DIST   = resolve(__dirname, 'dist')

/* Files/folders in public/ to skip during build (served from R2 or not needed) */
const SKIP = new Set([
  'centrale.tif', 'centrale_byte.tif', 'centrale_3857.tif',
  'thermal.tif',  'thermal_3857.tif',
  'tiles',        'tiles_thermal',
  'scale_to_byte.py', 'thermal_colors.txt',
])

function copyPublicSelective(): import('vite').Plugin {
  return {
    name: 'copy-public-selective',
    apply: 'build',
    closeBundle() {
      if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true })
      for (const entry of fs.readdirSync(PUBLIC)) {
        if (SKIP.has(entry)) continue
        const src = resolve(PUBLIC, entry)
        const dst = resolve(DIST, entry)
        fs.cpSync(src, dst, { recursive: true })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyPublicSelective()],
  build: {
    copyPublicDir: false,   // we handle it selectively above
  },
})
