import { colors as customColors } from './colors.js'
import { presetWind3 } from 'unocss'

const allColors = { ...presetWind3().theme.colors, moon: customColors.moon }

const shortcuts = [
    {
        'text-subtle': 'text-txt-subtle',
        'text-muted': 'text-txt-muted',
        'text-default': 'text-txt-DEFAULT',
        'text-inverted': 'text-txt-inverted',
        'text-disabled': 'text-txt-disabled',
        'text-onprimary': 'text-txt-onprimary',
        'text-onerror': 'text-txt-onerror',
        'hovered-major': 'hover:bg-primary-lt hover:text-default',
        'highlighted-major': 'data-[highlighted]:(bg-primary-lt text-default)',
        'selected-major': 'bg-primary text-txt-onprimary',
        'selected-hovered-major': 'bg-primary-hover! text-txt-onprimary!',
        'hovered-minor': 'hover:bg-surface-hover hover:text-txt-DEFAULT',
        'selected-minor': 'bg-primary-lt text-txt-DEFAULT',
        'selected-hovered-minor':
            'bg-primary dark:bg-primary/30 hover:bg-primary/80 text-onprimary',
        'scrollbar-thumb-hover': 'scrollbar-thumbHover',
        'with-scrollbar': `scrollbar scrollbar-thumb-color-scrollbar-thumb hover:scrollbar-thumb-color-scrollbar-thumbHover
                scrollbar-track-color-inherit scrollbar-rounded scrollbar-thumb-radius-2px`,
        'form-help': `inline-flex ml-2 items-center justify-center w-5 h-5 bg-subtle text-muted rounded-full cursor-pointer transition duration-150 ease-in-out hover:text-onprimary hover:bg-primary hover:ease-linear`,
        'page-header': 'text-xl font-semibold my-3',
        card: 'bg-surface text-default border border-solid border-border rounded-sm',
        'card-title': 'text-base text-default font-medium',
        // 'form-inputfield':
        //     'bg-inputfield border border-border rounded focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none h-[2.375rem] transition-colors duration-150 ease-in-out',
        // 'form-inputfield-sm': `bg-inputfield border border-border rounded-sm focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none h-6.5 transition-colors duration-150 ease-in-out`,
        'form-inputfield-within':
            'bg-inputfield border border-border rounded focus-within:border-primary focus-within:ring focus-within:ring-primary/30 focus-within:outline-none h-[2.375rem] transition-colors duration-150 ease-in-out',
        'header-1': 'text-3xl font-semibold leading-tight pb-4',
        'header-2': 'text-2xl font-semibold leading-snug pb-2',
        'header-3': 'text-xl font-medium leading-relaxed pb-1',
        'header-4': 'text-lg font-medium leading-relaxed pb-1',
        'header-5': 'text-base font-medium leading-relaxed pb-1',
        'header-6': 'text-sm font-medium leading-relaxed pb-1',
        'color-transition': 'transition-colors duration-150 ease-in-out',
        'table-top-control': `flex rounded-sm text-default text-sm px-2 h-[1.625rem]`,
        'formfield': `bg-inputfield border border-border disabled:bg-disabled focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none transition-colors duration-150 ease-in-out`

    },
    [
        /^form-inputfield-(sm|md)$/,
        ([, size]) => {
            const sizes = {
                sm: 'h-[1.625rem]',
                md: 'h-[2.375rem]'
            }
            const textSize = {
                sm: 'text-sm',
                base: 'text-base'
            }
            return `bg-inputfield border border-border 
            rounded px-2
            focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none 
            ${sizes[size] || sizes.md} 
            ${textSize[size] || textSize.base}
            transition-colors duration-150 ease-in-out`
        }
    ],
    {
        'form-inputfield': 'form-inputfield-md'
    },
    [
        /^btn-(base|primary|transparent)-(sm|md|lg|formfield|default)$/,
        ([, colorOption, sizeOption]) => {
            const colors = {
                base: `bg-surface text-default hover:bg-surface-hover 
                border border-solid border-border
                active:bg-muted 
                disabled:bg-disabled disabled:text-subtle`,
                primary: `bg-primary text-onprimary hover:bg-primary-hover 
                border border-solid border-primary
                active:bg-primary/80 
                disabled:bg-disabled disabled:border-border disabled:text-subtle`,
                transparent: `bg-transparent text-default hover:bg-surface-hover
                border border-solid border-border
                active:bg-muted
                disabled:bg-disabled disabled:text-subtle`
            }
            const color = colors[colorOption]
            const sizes = {
                sm: 'px-3 py-1.5 text-xs font-semibold tracking-wide',
                md: 'px-4 py-2 text-sm font-semibold tracking-wide',
                lg: 'px-5 py-2.5 text-base font-semibold tracking-wide',
                formfield: 'h-[2.375rem] px-2 text-base font-semibold tracking-wide',
                default: 'px-4 text-sm'
            }
            const size = sizes[sizeOption] || sizes.default
            const layout = 'inline-flex items-center justify-center gap-1'
            const disabledCursor = 'disabled:hover:cursor-default disabled:pointer-events-none'
            const focus = 'focus:outline-none focus-visible:ring focus-visible:ring-primary/30'
            const hoverCursor = 'hover:cursor-pointer'
            const transition = 'transition-colors duration-150 ease-in-out'
            return `${layout} ${color} ${size} ${hoverCursor} ${disabledCursor} ${focus} ${transition}`
        }
    ],
    {
        'btn-base': 'btn-base-default'
    }
]

const rules = [
    [
        /^(\w+)-mix:([\w-]+)@(\d+):([\w-]+)$/,
        ([, prefix, base, percent, tint], { theme }) => {
            const themeColors = theme.colors || {}

            const supportedProperties = {
                text: 'color',
                bg: 'background-color',
                border: 'border-color'
            }

            const resolveColor = (name, palette) => {
                if (!name || typeof name !== 'string') return name
                if (name.startsWith('#') || /^[a-z]+$/i.test(name)) return name

                const value = name
                    .split('-')
                    .reduce(
                        (acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined),
                        palette
                    )

                return typeof value === 'string' ? value : name
            }

            const cssProperty = supportedProperties[prefix]
            if (!cssProperty) return
            const baseColor = resolveColor(base, themeColors)
            const tintColor = resolveColor(tint, themeColors)
            if (!baseColor || !tintColor) return
            return {
                [cssProperty]: `color-mix(in srgb, ${baseColor} ${percent}%, ${tintColor})`
            }
        }
    ]
]

const autocompletions = {
    templates: [
        'text-mix:$color@percent:$color',
        'bg-mix:$color@percent:$color',
        'border-mix:$color@percent:$color'
    ]
}

const theme = {
    light: {
        colors: {
            background: '#f5f7fb',
            surface: allColors.white,
            'surface-hover': '#e9ecef',
            muted: '#f1f3f5',
            subtle: '#e9ecef',
            dropdown: '#ffffff',
            dropdownBorder: '#dee2e6',
            border: '#dee2e6',
            borderInput: '#ced4da',
            inputfield: '#ffffff',
            'thead-background': allColors.slate[100],
            'thead-text': allColors.slate[500],
            disabled: allColors.gray[200],
            scrollbar: {
                thumb: '#ced4da',
                thumbHover: '#adb5bd'
            },
            primary: {
                DEFAULT: '#206bc4',
                hover: '#1a5bb0',
                active: '#154f9c',
                lt: '#e3f2fd'
            },
            error: {
                DEFAULT: '#d32f2f',
                bg: '#fdecea',
                border: '#f44336',
                hover: '#f9d7d5'
            },
            gray: allColors.gray,
            txt: {
                DEFAULT: '#2b3c53', // main readable text
                muted: '#5a6a7f', // less emphasis
                subtle: '#8c98a6', // lightest still-readable text
                inverted: '#ffffff',
                disabled: '#c1c9d1', // even softer than subtle
                onprimary: '#f3f4f6',
                onerror: '#1f2937'
            },
            ...customColors
        }
    },
    dark: {
        colors: {
            background: '#0f172a',
            surface: '#1e293b',
            'surface-hover': '#273449',
            muted: '#2d3b54',
            subtle: '#3b4c66',
            dropdown: '#273449',
            dropdownBorder: '#2a3b4f',
            border: '#2a3b4f',
            borderInput: '#4c5f7a',
            inputfield: '#0f172a',
            'thead-background': allColors.moon[800],
            'thead-text': allColors.slate[400],
            disabled: allColors.gray[700],
            scrollbar: {
                thumb: '#4c5f7a',
                thumbHover: '#5c6b8a'
            },
            primary: {
                DEFAULT: '#206bc4',
                hover: '#1a5bb0',
                active: '#154f9c',
                lt: '#264a73'
            },
            error: {
                DEFAULT: '#ef5350',
                bg: '#7f1d1d',
                border: '#ef5350',
                hover: '#b71c1c'
            },
            gray: allColors.gray,
            txt: {
                DEFAULT: '#e5e7eb', // Base readable text
                muted: '#bfc4cb', // ~70% tint — for secondary info
                subtle: '#8e949c', // ~45% tint — for less emphasis
                disabled: '#6c737b', // ~30% tint — clearly inactive
                inverted: '#000000', // For light surfaces (e.g. buttons on white)
                onprimary: '#f7f8fa', // Pure light for contrast on buttons
                onerror: '#f7f8fa'
            },
            ...customColors
        }
    }
}

export { theme, shortcuts, rules, autocompletions }
