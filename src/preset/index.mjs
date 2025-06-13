import { definePreset, presetIcons, presetWind3 } from 'unocss'
import { colors } from './colors.js'
import { icons } from './icons.js'
import { theme as t, shortcuts } from './theme.js'
import presetTheme from 'unocss-preset-theme'

const Theme = presetWind3().theme

const MATCHERS = Object.freeze({
    SELECTED_AND_HIGHLIGHTED: 'selected-and-highlighted:'
})

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

const generateVariantsAutocomplete = variants =>
    Object.keys(variants).map(name => `${name}:`)

const presetVTail = definePreset(options => {
    const givenColors = options?.colors || {}
    const mergedColors = { ...colors, ...givenColors }
    if (!mergedColors.primary) {
        mergedColors.primary = colors.navy
    }

    const theme = {
        dark: {
            colors: {
                primary: mergedColors.primary,
                background: colors.moon[900],
                border: colors.moon[700],
                inputfield: colors.moon[900],
                thead: colors.moon[900]
            }
        },
        light: {
            colors: {
                primary: mergedColors.primary,
                background: Theme.colors.gray[50],
                border: Theme.colors.gray[200],
                inputfield: Theme.colors.white,
                thead: Theme.colors.slate[100]
            }
        },
        ...t
    }

    return {
        name: 'v-tabler-preset',
        theme: {
            colors: {...theme.light.colors, ...colors },
            fontFamily: { sans: '"Inter", system-ui, sans-serif' }
        },
        shortcuts,
        presets: [
            presetIcons({
                collections: {
                    custom: icons
                }
            }),
            presetTheme({ theme })
        ],
        variants: [...generateAttributeVariants(CUSTOM_VARIANTS)],
        autocomplete: {
            templates: generateVariantsAutocomplete(CUSTOM_VARIANTS)
        }
    }
})

export default presetVTail
