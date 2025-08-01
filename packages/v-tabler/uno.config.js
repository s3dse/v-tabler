import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { presetVTabler } from './src/preset/index.mjs'

export default defineConfig({
    content: {
        pipeline: {
            include: [/\.(vue|html|js|ts)($|\?)/]
        }
    },
    presets: [
        presetWind3(), 
        presetVTabler({ enableSemanticSpacing: false })
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()]
})
