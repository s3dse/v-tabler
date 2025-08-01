import * as path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: {
                'v-tabler': path.resolve(__dirname, 'src/install.js'),
                preset: path.resolve(__dirname, 'src/preset/index.mjs')
            },
            name: 'v-tabler',
            fileName: (format, name) => {
                if (format === 'es') {
                    return `${name}.js`
                }
                return `${name}.${format}`
            }
        },
        rollupOptions: {
            external: ['vue', 'unocss'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    plugins: [
        vue(),
        UnoCSS(),
        dts({
            exclude: ['**/*.stories.*', '**/*.story.*']
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
