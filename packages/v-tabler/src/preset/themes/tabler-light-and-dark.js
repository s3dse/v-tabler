import { colors as customColors } from '../colors.js'
import { presetWind3 } from 'unocss'

const allColors = { ...presetWind3().theme.colors, ...customColors }

export const theme = {
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
                DEFAULT: allColors['star-of-life'].DEFAULT,
                hover: allColors['star-of-life'].hover,
                active: allColors['star-of-life'].active,
                lt: allColors['star-of-life']['lt-light']
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
            }
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
                DEFAULT: allColors['star-of-life'].DEFAULT,
                hover: allColors['star-of-life'].hover,
                active: allColors['star-of-life'].active,
                lt: allColors['star-of-life']['lt-dark']
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
            }
        }
    }
}
