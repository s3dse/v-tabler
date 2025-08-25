# V-Tabler

A Vue 3 component library for building data-rich web applications. Includes advanced table, form, and UI components, built with UnoCSS and designed for flexibility.

## Installation

```bash
npm install @s3-dse/v-tabler
```

Add the preset to your UnoCSS config:

```js
import { defineConfig, presetUno } from 'unocss'
import presetVTail from '@s3-dse/v-tabler/preset'

export default defineConfig({
    presets: [presetUno(), presetVTail()]
})
```

Add V-Tabler to your Vue app:

```js
import { createApp } from 'vue'
import VTabler from '@s3-dse/v-tabler'
import '@s3-dse/v-tabler/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VTabler)
app.mount('#app')
```

---

## Theme & Color Customization

V-Tabler uses a flexible theme system powered by UnoCSS. You can customize colors and other theme variables by passing a theme object to the preset in your UnoCSS config.

### Customizing Colors

You can override or extend the default color palette by providing a `colors` object to the preset:

```js
// uno.config.js
import { defineConfig, presetUno } from 'unocss'
import presetVTail from '@s3-dse/v-tabler/preset'

const myCustomColors = {
    primary: {
        DEFAULT: '#1e88e5',
        hover: '#1565c0',
        onprimary: '#fff'
    },
    secondary: {
        DEFAULT: '#ffb300',
        hover: '#ffa000',
        onsecondary: '#222'
    },
    surface: '#f5f5f5',
    background: '#fff',
    border: '#e0e0e0'
    // Add more custom colors as needed
}

export default defineConfig({
    presets: [presetUno(), presetVTail({ colors: myCustomColors })]
})
```

#### Color Keys

- `primary`, `secondary`, `surface`, `background`, `border`, `onprimary`, `onsecondary`, etc.
- Each color can have variants (e.g. `hover`, `active`, etc.)
- You can add your own custom color keys and use them in your components and styles.

#### Usage in Components

All V-Tabler components use theme colors via CSS variables and UnoCSS utility classes. Your custom colors will be available throughout the library.

---

## Components

### TableComponent

Feature-rich data table with sorting, filtering, pagination, custom cell/column rendering, sticky rows, and remote pagination support.

### DialogComponent

Accessible modal dialog with custom slots, pre-confirm logic, and flexible styling.

### Select Components

- `SingleSelect`, `MultiSelect`, `ListSelect`: Flexible select/dropdown components for single/multiple selection, custom labels, and advanced filtering.

### ToggleComponent

Switch/toggle for boolean values, supports custom labels and disabled state.

### DropdownComponent

Customizable dropdown menu for options or actions, with slot-based rendering.

### Card, Typography, Tabs, Skeleton, LoadingOverlay, Checkbox, Pagination

Additional UI components for layout, text, navigation, loading states, and forms.

---

## Usage Example

```vue
<script setup>
import { ref } from 'vue'
const items = ref([...])
const fields = ref([...])
</script>
<template>
    <table-component
        title="A Table"
        :items="items"
        :fields="fields"
        :paginate="true"
        :configurablePageSize="true"
        :per-page="5"
    >
        <template #cell(ip_address)="{ value }">
            <span class="text-primary">{{ value }}</span>
        </template>
    </table-component>
</template>
```

---

## Documentation

See the `/docs` folder for full API documentation and usage guides for all components.

## Internationalization

v-tabler includes built-in support for vue-i18n. Filter labels and UI text are automatically translated when vue-i18n is available in your application.

### Quick Setup

1. Install vue-i18n: `npm install vue-i18n@9`
2. Get default translation keys and set up your i18n:

```js
import { createI18n } from 'vue-i18n'
import VTabler, { getDefaultTranslationKeys } from '@s3-dse/v-tabler'

const vTablerDefaults = getDefaultTranslationKeys()

const messages = {
    en: { ...vTablerDefaults },
    de: {
        'vTabler.table.filters.textLabel': 'Enthält Text:',
        'vTabler.table.filters.numericLabel': 'Zahlenfilter:'
        // ... other German translations
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
})

// Install with i18n integration
app.use(i18n)
app.use(VTabler, { i18n })
```

3. Use TableComponent as usual - translations are applied automatically!

For detailed setup instructions, see the [i18n setup guide](src/i18n/setup-guide.md).

---

## License

MIT License

Copyright (c) 2025 Sebastian Doerl
