import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { presetVTabler } from '@s3_dse/v-tabler/preset'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
    content: {
        pipeline: {
            include: [/\.(vue|html|js|ts)($|\?)/]
        }
    },
    presets: [
        presetWind3(), 
        presetScrollbar(), 
        presetVTabler({ enableSemanticSpacing: false })
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
    autocomplete: [
        'text-subtle',
        'text-muted',
        'text-default',
        'text-inverted',
        'text-disabled',
        'card-title'
    ]
})
