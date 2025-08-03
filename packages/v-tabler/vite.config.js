import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
    const isDemoMode = mode === 'demo'
    
    if (isDemoMode) {
        // Demo development configuration
        return {
            plugins: [vue(), UnoCSS()],
            root: 'src/demo',
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            },
            server: {
                port: 8081
            }
        }
    }
    
    // Library build configuration
    return {
        plugins: [
            vue(),
            UnoCSS(),
            dts({
                exclude: ['**/*.stories.*', '**/*.story.*', 'src/demo/**/*']
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        build: {
            lib: {
                entry: {
                    'v-tabler': fileURLToPath(new URL('./src/install.js', import.meta.url)),
                    preset: fileURLToPath(new URL('./src/preset/index.mjs', import.meta.url))
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
        }
    }
})
