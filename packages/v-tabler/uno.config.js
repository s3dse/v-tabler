import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { presetVTabler } from './src/preset/index.mjs'

export default defineConfig({
    content: {
        pipeline: {
            include: [/\.(vue|html|js|ts)($|\?)/]
        }
    },
    presets: [presetWind3(), presetVTabler({ enableSemanticSpacing: false }), presetScrollbar()],
    transformers: [transformerVariantGroup(), transformerDirectives()]
})
