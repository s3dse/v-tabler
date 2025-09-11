export const theme = {
    light: {
        colors: {
            // Sunburn-inspired light theme - warm, cream-based palette
            background: '#fdf6e3', // Warm cream background
            surface: '#fffbf0', // Slightly warmer white
            'surface-hover': '#f7f0e0', // Gentle warm hover
            muted: '#f4ead5', // Warm muted tone
            subtle: '#eee8d5', // Sunburn subtle beige
            dropdown: '#fffbf0',
            dropdownBorder: '#e6dcc3',
            border: '#e6dcc3', // Warm border
            borderInput: '#d6cc9a', // Slightly darker warm border
            inputfield: '#fffbf0',
            'thead-background': '#f7f0e0',
            'thead-text': '#93a1a1', // Sunburn's muted blue-gray
            disabled: '#eee8d5',
            scrollbar: {
                thumb: '#d6cc9a',
                thumbHover: '#b8a082'
            },
            primary: {
                DEFAULT: '#268bd2', // Sunburn blue
                hover: '#2075c7',
                active: '#1e6bb8',
                lt: '#e1f5fe'
            },
            error: {
                DEFAULT: '#dc322f', // Sunburn red
                bg: '#fdf2f2',
                border: '#dc322f',
                hover: '#f5e6e6'
            },
            gray: {
                50: '#fdf6e3',
                100: '#f7f0e0',
                200: '#eee8d5',
                300: '#d6cc9a',
                400: '#b8a082',
                500: '#93a1a1',
                600: '#7c8b8b',
                700: '#657b83',
                800: '#586e75',
                900: '#073642'
            },
            txt: {
                DEFAULT: '#657b83', // Sunburn's main text color
                muted: '#93a1a1', // Sunburn's muted text
                subtle: '#b8a082', // Warm subtle text
                inverted: '#fdf6e3',
                disabled: '#d6cc9a',
                onprimary: '#fdf6e3',
                onerror: '#fdf6e3'
            }
        }
    },
    dark: {
        colors: {
            // Zenburn-inspired dark theme - warm, earthy, low-contrast
            background: '#3f3f3f', // Classic zenburn background
            surface: '#4f4f4f', // Slightly lighter surface
            'surface-hover': '#5f5f5f', // Subtle hover state
            muted: '#2b2b2b', // Darker muted
            subtle: '#404040', // Subtle variation
            dropdown: '#4f4f4f',
            dropdownBorder: '#6f6f6f',
            border: '#6f6f6f', // Zenburn's typical border
            borderInput: '#8f8f8f', // Lighter input border
            inputfield: '#3f3f3f',
            'thead-background': '#2b2b2b',
            'thead-text': '#9fafa9', // Zenburn's green-gray
            disabled: '#606060',
            scrollbar: {
                thumb: '#7f7f7f',
                thumbHover: '#9f9f9f'
            },
            primary: {
                DEFAULT: '#8cd0d3', // Zenburn cyan
                hover: '#93dfdc',
                active: '#7ac7ca',
                lt: '#4f7f7f'
            },
            error: {
                DEFAULT: '#dca3a3', // Zenburn's soft red
                bg: '#5d4e4e',
                border: '#cc9393',
                hover: '#6d5e5e'
            },
            gray: {
                50: '#f0f0f0',
                100: '#e0e0e0',
                200: '#c0c0c0',
                300: '#9f9f9f',
                400: '#7f7f7f',
                500: '#6f6f6f',
                600: '#5f5f5f',
                700: '#4f4f4f',
                800: '#3f3f3f',
                900: '#2f2f2f'
            },
            txt: {
                DEFAULT: '#dcdccc', // Classic zenburn foreground
                muted: '#c0c0c0', // Muted but readable
                subtle: '#9fafa9', // Zenburn's characteristic green-gray
                disabled: '#7f7f7f', // Clearly disabled
                inverted: '#3f3f3f', // Dark text for light surfaces
                onprimary: '#2b2b2b', // Dark text on cyan primary
                onerror: '#2b2b2b' // Dark text on error background
            }
        }
    }
}
