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

---

## License

MIT License

Copyright (c) 2025 Sebastian Doerl
