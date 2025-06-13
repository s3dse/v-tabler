import { colors } from './colors.js'

const shortcuts = {
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
    'selected-hovered-minor': 'bg-primary dark:bg-primary/30 hover:bg-primary/80 text-onprimary',
    'scrollbar-thumb-hover': 'scrollbar-thumbHover',
    'with-scrollbar': `scrollbar scrollbar-thumb-color-scrollbar-thumb hover:scrollbar-thumb-color-scrollbar-thumbHover
            scrollbar-track-color-inherit scrollbar-rounded scrollbar-thumb-radius-2px`
}
const theme = {
    light: {
        colors: {
            background: '#f5f7fb',
            surface: colors.white,
            'surface-hover': '#e9ecef',
            muted: '#f1f3f5',
            subtle: '#e9ecef',
            dropdown: '#ffffff',
            dropdownBorder: '#dee2e6',
            border: '#dee2e6',
            borderInput: '#ced4da',
            inputfield: '#ffffff',
            'thead-background': colors.slate[100],
            'thead-text': colors.slate[500],
            disabled: colors.gray[200],
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
            gray: colors.gray,
            txt: {
                DEFAULT: '#1f2937',
                muted: '#6b7280',
                subtle: '#9ca3af',
                inverted: '#ffffff',
                disabled: '#9ca3af',
                onprimary: '#f3f4f6',
                onerror: '#1f2937'
            }
        },
        shortcuts
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
            inputfield: '#273449',
            'thead-background': colors.moon[900],
            'thead-text': colors.slate[500],
            disabled: colors.gray[700],
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
            gray: colors.gray,
            txt: {
                DEFAULT: '#f3f4f6',
                muted: '#9ca3af',
                subtle: '#6b7280',
                inverted: '#000000',
                disabled: '#4b5563',
                onprimary: '#f3f4f6',
                onerror: '#f3f4f6'
            }
        }
    },
    shortcuts
}

export { theme, shortcuts }
