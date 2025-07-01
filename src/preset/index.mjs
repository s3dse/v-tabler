import { definePreset, presetIcons } from 'unocss'
import { icons } from './icons.js'
import {
    theme as baseTheme,
    shortcuts,
    rules,
    preflights,
    autocompletions,
    spacing,
    animation
} from './theme.js'
import presetTheme from 'unocss-preset-theme'
import merge from 'lodash.merge'
import { getSafelist } from './safelist.js'

const CUSTOM_VARIANTS = Object.freeze({
    'checked-and-highlighted': '[&[data-state=checked][data-highlighted]]',
    'checked-and-hovered': '[data-state="checked"]:hover'
})

const generateAttributeVariants = variants => {
    return Object.entries(variants).map(([name, selector]) => {
        const prefix = `${name}:`
        return matcher => {
            if (!matcher.startsWith(prefix)) return matcher
            return {
                matcher: matcher.slice(prefix.length),
                selector: s => `${s}${selector}`
            }
        }
    })
}

const generateVariantsAutocomplete = variants => Object.keys(variants).map(name => `${name}:`)

const safelist = getSafelist(shortcuts)

const presetVTabler = definePreset((options = {}) => {
    const { enableSemanticSpacing = true, theme: themeOverrides = {} } = options

    const mergedTheme = merge({}, baseTheme, themeOverrides)

    return {
        name: 'v-tabler-preset',
        theme: {
            colors: mergedTheme.light.colors,
            fontFamily: { sans: '"Inter", system-ui, sans-serif' },
            ...(enableSemanticSpacing ? { spacing } : {}),
            animation
        },
        shortcuts,
        rules,
        presets: [
            presetIcons({
                collections: {
                    custom: icons
                }
            }),
            presetTheme({ theme: mergedTheme })
        ],
        preflights,
        safelist: ['text-moon-500'],
        variants: [...generateAttributeVariants(CUSTOM_VARIANTS)],
        autocomplete: {
            templates: [
                ...generateVariantsAutocomplete(CUSTOM_VARIANTS),
                ...autocompletions.templates
            ]
        }
    }
})

export { presetVTabler, safelist }
