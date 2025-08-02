import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        UnoCSS()
    ],
    resolve: {
        alias: {
            // Library package alias - must come first to take precedence
            '@s3_dse/v-tabler': fileURLToPath(new URL('../../packages/v-tabler/src', import.meta.url)),
            // Library's @ alias (for imports within the library)
            '@/': fileURLToPath(new URL('../../packages/v-tabler/src/', import.meta.url)),
            // Demo app's @ alias - use a different pattern to avoid conflicts
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
