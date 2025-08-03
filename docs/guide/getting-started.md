# Getting Started

Welcome to V-Tabler! This guide will help you get up and running with our Vue 3 component library.

## Installation

Install V-Tabler via npm:

```bash
npm install @s3-dse/v-tabler
```

Or with yarn:

```bash
yarn add @s3-dse/v-tabler
```

## Quick Setup

### 1. Install the Plugin

```javascript
import { createApp } from 'vue'
import VTabler from '@s3-dse/v-tabler'
import '@s3-dse/v-tabler/style.css'

const app = createApp(App)
app.use(VTabler)
app.mount('#app')
```

### 2. Use Components

```vue
<template>
  <div>
    <TableComponent 
      :items="data" 
      :fields="fields"
      title="My First Table"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const data = ref([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
])

const fields = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
])
</script>
```

## Individual Component Import

If you prefer to import components individually:

```javascript
import { TableComponent, CardComponent } from '@s3-dse/v-tabler'

export default {
  components: {
    TableComponent,
    CardComponent
  }
}
```

## UnoCSS Setup

V-Tabler uses UnoCSS for styling. Add UnoCSS to your project:

```bash
npm install -D unocss @unocss/reset
```

Create `uno.config.js`:

```javascript
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno()
  ],
  theme: {
    colors: {
      primary: '#646cff'
    }
  }
})
```

Import in your main CSS:

```css
@import '@unocss/reset/tailwind-compat.css';
@import 'virtual:uno.css';
```

## Next Steps

- Explore [Components](/components/) for detailed documentation
- Check out [Configuration](/guide/configuration) for advanced setup
- Learn about [Theming](/guide/theming) for customization
- View the [live demo](http://localhost:8081) for interactive examples

## TypeScript Support

V-Tabler includes full TypeScript support out of the box. No additional setup required!

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
