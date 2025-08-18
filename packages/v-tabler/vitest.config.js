import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(configEnv =>
    mergeConfig(
        viteConfig(configEnv),
        defineConfig({
            test: {
                environment: 'jsdom',
                exclude: [...configDefaults.exclude, 'e2e/*'],
                root: fileURLToPath(new URL('./', import.meta.url)),
                coverage: {
                    exclude: [
                        ...configDefaults.exclude,
                        ...configDefaults.coverage.exclude,
                        'histoire.config.js',
                        'histoire.setup.js',
                        'uno.config.js',
                        '**/demo/**',
                        'src/install.js',
                        'src/index.js',
                        'src/components/index.js',
                        '**/*.story.vue'
                    ]
                }
            }
        })
    )
)
