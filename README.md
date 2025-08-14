# V-Tabler

A modern Vue 3 component library for building beautiful, data-rich web applications. Includes advanced table, form, and UI components, built with UnoCSS and designed for flexibility and developer experience.

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

## Theme Customization

You can override the default theme by passing a custom theme to the preset:

```js
const myCustomColors = { ... }
export default defineConfig({
  presets: [presetUno(), presetVTail({ colors: myCustomColors })]
})
```

---

## Documentation

See the `/docs` folder for full API documentation and usage guides for all components.

---

## License

MIT License

Copyright (c) 2025 Sebastian Doerl
