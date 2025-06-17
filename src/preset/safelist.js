// safelist.js
// import { shortcuts } from './theme.js'
import { colors } from './colors.js'

// Helper: flatten shortcut values into classnames
function extractClassesFromShortcuts(shortcuts) {
    const all = []
    for (const [key, value] of Object.entries(shortcuts)) {
        all.push(key)
        if (typeof value === 'function') continue
        const split = value.split(/\s+/)
        for (const cls of split) {
            if (!all.includes(cls)) all.push(cls)
        }
    }
    return all
}

// Helper: collect all color-based utilities
function generateColorUtilities(colors, prefix = 'bg') {
    const out = []
    for (const [key, val] of Object.entries(colors)) {
        if (typeof val === 'string') {
            out.push(`${prefix}-${key}`)
        } else if (typeof val === 'object') {
            for (const sub of Object.keys(val)) {
                out.push(`${prefix}-${key}-${sub}`)
            }
        }
    }
    return out
}

const mergeObjectShortcuts = shortcuts => {
    return Array.isArray(shortcuts)
        ? shortcuts.reduce((acc, curr) => Object.assign(acc, Array.isArray(curr) ? {} : curr), {})
        : shortcuts
}

export function getSafelist(givenShortcuts) {
    const shortcuts = mergeObjectShortcuts(givenShortcuts)
    const shortcutClasses = extractClassesFromShortcuts(shortcuts)
    const colorBgClasses = generateColorUtilities(colors, 'bg')
    const colorTextClasses = generateColorUtilities(colors, 'text')

    // Add hover/variant safelist entries if needed
    const variants = ['hovered', 'selected', 'checked']
    const variantClasses = []

    for (const cls of shortcutClasses) {
        for (const variant of variants) {
            variantClasses.push(`${variant}:${cls}`)
        }
    }

    return [
        ...new Set([...shortcutClasses, ...colorBgClasses, ...colorTextClasses, ...variantClasses])
    ]
}
