# Configuration

## UnoCSS Preset

V-Tabler provides a comprehensive UnoCSS preset with custom shortcuts and theme configuration.

### Basic Setup

```javascript
// uno.config.js
import { defineConfig } from 'unocss'
import { presetVTabler } from '@s3_dse/v-tabler/preset'

export default defineConfig({
    presets: [presetVTabler()]
})
```

### Custom Theme

You can customize the theme by extending the preset:

```javascript
import { defineConfig } from 'unocss'
import { presetVTabler } from '@s3_dse/v-tabler/preset'

export default defineConfig({
    presets: [
        presetVTabler({
            // Custom theme overrides
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    900: '#1e3a8a'
                }
            }
        })
    ],
    theme: {
        // Additional theme customizations
        fontFamily: {
            sans: ['Inter', 'sans-serif']
        }
    }
})
```

## Available Shortcuts

### Button Shortcuts

```css
/* Primary buttons */
btn-primary-sm     /* Small primary button */
btn-primary-md     /* Medium primary button */
btn-primary-lg     /* Large primary button */

/* Ghost buttons */
btn-ghost-sm       /* Small ghost button */
btn-ghost-md       /* Medium ghost button */
btn-ghost-lg       /* Large ghost button */

/* Transparent buttons */
btn-transparent-sm /* Small transparent button */
btn-transparent-md /* Medium transparent button */
btn-transparent-lg /* Large transparent button */
```

### Table Shortcuts

```css
/* Column alignment */
table-col-left     /* Left-aligned column */
table-col-center   /* Center-aligned column */
table-col-right    /* Right-aligned column */

/* Form controls */
form-inputfield-sm /* Small form input */
form-inputfield-md /* Medium form input */
form-inputfield-lg /* Large form input */
```

### Utility Shortcuts

```css
/* Scrollbar styling */
with-scrollbar     /* Custom scrollbar styling */
```

## Theme Variables

V-Tabler uses CSS custom properties for theming:

```css
:root {
    /* Primary colors */
    --color-primary: #3b82f6;
    --color-primary-hover: #2563eb;

    /* Background colors */
    --color-background: #ffffff;
    --color-surface: #f8fafc;

    /* Text colors */
    --color-text: #1f2937;
    --color-text-muted: #6b7280;

    /* Border colors */
    --color-border: #e5e7eb;

    /* Table specific */
    --color-thead-background: #f9fafb;
    --color-thead-text: #374151;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --color-background: #111827;
        --color-surface: #1f2937;
        --color-text: #f9fafb;
        --color-text-muted: #9ca3af;
        --color-border: #374151;
        --color-thead-background: #1f2937;
        --color-thead-text: #e5e7eb;
    }
}
```

## Component Configuration

### Global Component Props

You can set default props for components globally:

```javascript
import { createApp } from 'vue'
import VTabler from '@s3_dse/v-tabler'

const app = createApp(App)

// Configure default props
app.use(VTabler, {
    TableComponent: {
        perPage: 25,
        enableSearch: true,
        enableColumnFilters: true
    },
    CardComponent: {
        elevated: true
    }
})
```

### Individual Component Configuration

Configure components individually in your templates:

```vue
<template>
    <TableComponent
        :items="data"
        :fields="fields"
        :per-page="50"
        :search-placeholder="'Search users...'"
        :clear-all-filters-button-text="'Reset Filters'"
        :pagination-previous-label="'Previous Page'"
        :pagination-next-label="'Next Page'"
    />
</template>
```

## Environment-Specific Configuration

### Development

```javascript
// vite.config.js
export default defineConfig({
    plugins: [vue(), UnoCSS()],
    define: {
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: true
    }
})
```

### Production

```javascript
// vite.config.js
export default defineConfig({
    plugins: [vue(), UnoCSS()],
    build: {
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
```
