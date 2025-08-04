// import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
// import transformerVariantGroup from '@unocss/transformer-variant-group'

// export default defineConfig({
//   content: {
//     pipeline: {
//       include: [/\.(vue|html|js|ts|md)($|\?)/]
//     }
//   },
//   presets: [
//     presetWind3()
//   ],
//   transformers: [transformerVariantGroup(), transformerDirectives()]
// })


import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { presetVTabler } from '../../packages/v-tabler/src/preset/index.mjs'
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
    transformers: [transformerVariantGroup(), transformerDirectives()]
})
