import { defineConfig, presetUno, transformerDirectives } from 'unocss'

import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetVTail from './src/preset/index.mjs'
import { colors } from './src/preset/colors.js'
import { presetScrollbar } from 'unocss-preset-scrollbar'

const cutOffBrackets = v =>
    v.indexOf('[') === 0 && v.indexOf(']') === v.length - 1 ? v.slice(1, -1) : v
const allowedUnits =
    'cm,mm,Q,in,pc,pt,px,em,rem,ex,ch,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh'
const defaultUnit = 'rem'
const hasUnit = v => allowedUnits.split(',').some(u => v.endsWith(u))
const valWithUnit = v => {
    const withoutBrackets = cutOffBrackets(v)
    if (hasUnit(withoutBrackets)) {
        return withoutBrackets
    } else {
        return `${withoutBrackets}${defaultUnit}`
    }
}

export default defineConfig({
    rules: [
        [
            /^grid-auto-fill-([[.\d\w\]]+)$/,
            ([, d]) => ({
                'grid-template-columns': `repeat(auto-fill, minmax(${valWithUnit(d)}, 1fr))`
            })
        ],
        [
            /^grid-auto-fit-([[.\d\w\]]+)$/,
            ([, d]) => ({
                'grid-template-columns': `repeat(auto-fit, minmax(${valWithUnit(d)}, 1fr))`
            })
        ]
    ],
    theme: {
        colors
    },
    shortcuts: [
        [
            /^busy-text-(.*)$/,
            ([, c]) => `relative 
        select-none overflow-hidden border-rounded 
        before:animate-spin 
        before:border-opacity-90 
        before:border-t-transparent  
        before:border-r-${c} 
        before:border-b-${c} 
        before:border-l-${c} 
        before:border-rounded-full 
        before:border-solid 
        before:border-3 
        before:content-empty 
        before:h-1.5rem 
        before:w-1.5rem 
        before:left-50% 
        before:absolute 
        before:top-50% 
        before:m-t-[-0.75rem] 
        before:m-r-0 
        before:m-b-0 
        before:m-l-[-0.75rem]
        before:z-500 
        after:border-rounded-[3px] 
        after:content-empty 
        after:h-full 
        after:left-0 
        after:absolute 
        after:top-0 
        after:w-full 
        after:z-499`
        ],
        [/^busy-bg-(.*)$/, ([, c]) => `after:bg-${c}/70`],
        {
            // 'form-help': `inline-flex ml-2 items-center justify-center w-5 h-5 bg-subtle text-muted rounded-full cursor-pointer transition duration-100 hover:text-onprimary hover:bg-primary hover:ease-linear`,
            // 'page-header': 'text-xl font-semibold my-3',
            // 'card':
            //     'bg-surface border border-solid border-border rounded-sm',
            // 'card-title': 'text-base text-default font-medium'
        }
    ],
    presets: [
        presetUno(),
        presetScrollbar(),

        presetVTail()
    ],
    transformers: [transformerVariantGroup(), transformerDirectives() ],
    autocomplete: ['text-subtle', 'text-muted', 'text-default', 'text-inverted', 'text-disabled', 'card-title'],
})
