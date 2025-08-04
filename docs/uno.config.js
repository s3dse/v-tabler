import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|html|js|ts|md)($|\?)/]
    }
  },
  presets: [
    presetWind3()
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()]
})
