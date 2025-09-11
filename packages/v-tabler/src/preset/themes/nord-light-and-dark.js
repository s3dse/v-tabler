export const theme = {
    light: {
        colors: {
            // Nord-inspired light theme - clean, cool, minimal
            background: '#eceff4', // Nord Snow Storm lightest
            surface: '#e5e9f0', // Nord Snow Storm middle
            'surface-hover': '#d8dee9', // Nord Snow Storm darkest
            muted: '#f8f9fa', // Very light gray
            subtle: '#e5e9f0',
            dropdown: '#eceff4',
            dropdownBorder: '#d8dee9',
            border: '#d8dee9',
            borderInput: '#c2c9d2',
            inputfield: '#eceff4',
            'thead-background': '#e5e9f0',
            'thead-text': '#5e81ac', // Nord blue
            disabled: '#d8dee9',
            scrollbar: {
                thumb: '#c2c9d2',
                thumbHover: '#a3aab5'
            },
            primary: {
                DEFAULT: '#5e81ac', // Nord blue
                hover: '#4c566a',
                active: '#434c5e',
                lt: '#ebf1f5'
            },
            error: {
                DEFAULT: '#bf616a', // Nord red
                bg: '#faf0f1',
                border: '#bf616a',
                hover: '#f2e5e7'
            },
            gray: {
                50: '#f8f9fa',
                100: '#eceff4',
                200: '#e5e9f0',
                300: '#d8dee9',
                400: '#c2c9d2',
                500: '#a3aab5',
                600: '#81889b',
                700: '#5e81ac',
                800: '#4c566a',
                900: '#2e3440'
            },
            txt: {
                DEFAULT: '#2e3440', // Nord Polar Night darkest
                muted: '#3b4252', // Nord Polar Night second darkest
                subtle: '#434c5e', // Nord Polar Night third
                inverted: '#eceff4',
                disabled: '#81889b',
                onprimary: '#eceff4',
                onerror: '#eceff4'
            }
        }
    },
    dark: {
        colors: {
            // Nord-inspired dark theme - arctic, cool, sophisticated
            background: '#2e3440', // Nord Polar Night darkest
            surface: '#3b4252', // Nord Polar Night lighter
            'surface-hover': '#434c5e', // Nord Polar Night middle
            muted: '#242933', // Even darker than background
            subtle: '#4c566a', // Nord Polar Night lightest
            dropdown: '#3b4252',
            dropdownBorder: '#4c566a',
            border: '#4c566a',
            borderInput: '#5e81ac',
            inputfield: '#2e3440',
            'thead-background': '#242933',
            'thead-text': '#81a1c1', // Nord frost light blue
            disabled: '#4c566a',
            scrollbar: {
                thumb: '#5e81ac',
                thumbHover: '#81a1c1'
            },
            primary: {
                DEFAULT: '#88c0d0', // Nord frost cyan
                hover: '#8fbcbb',
                active: '#81a1c1',
                lt: '#5e81ac'
            },
            error: {
                DEFAULT: '#bf616a', // Nord red
                bg: '#512b30',
                border: '#bf616a',
                hover: '#5c3438'
            },
            gray: {
                50: '#f8f9fa',
                100: '#eceff4',
                200: '#e5e9f0',
                300: '#d8dee9',
                400: '#c2c9d2',
                500: '#a3aab5',
                600: '#81889b',
                700: '#5e81ac',
                800: '#4c566a',
                900: '#2e3440'
            },
            txt: {
                DEFAULT: '#eceff4', // Nord Snow Storm lightest
                muted: '#d8dee9', // Nord Snow Storm middle
                subtle: '#81a1c1', // Nord frost blue
                disabled: '#5e81ac',
                inverted: '#2e3440',
                onprimary: '#2e3440', // Dark text on light frost colors
                onerror: '#eceff4'
            }
        }
    }
}
