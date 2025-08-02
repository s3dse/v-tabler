import { defineConfig } from 'unocss'
import { presetVTabler } from '../packages/v-tabler/src/preset/index.mjs'

export default defineConfig({
  presets: [
    presetVTabler()
  ],
  // Include docs files in scanning
  content: {
    filesystem: [
      'docs/**/*.{vue,js,ts,jsx,tsx,md}',
      'packages/v-tabler/src/**/*.{vue,js,ts}'
    ]
  }
})
