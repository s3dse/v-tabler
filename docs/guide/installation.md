# Installation

## Package Manager

Install V-Tabler using your preferred package manager:

::: code-group

```bash [npm]
npm install @s3_dse/v-tabler
```

```bash [yarn]
yarn add @s3_dse/v-tabler
```

```bash [pnpm]
pnpm add @s3_dse/v-tabler
```

:::

## Vue Plugin Installation

Install the Vue plugin to register all components globally:

```javascript
import { createApp } from 'vue'
import VTabler from '@s3_dse/v-tabler'
import App from './App.vue'

// Import UnoCSS styles
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

const app = createApp(App)
app.use(VTabler)
app.mount('#app')
```

## Individual Component Import

You can also import components individually:

```javascript
import { TableComponent, CardComponent } from '@s3_dse/v-tabler'

export default {
  components: {
    TableComponent,
    CardComponent
  }
}
```

## UnoCSS Configuration

V-Tabler includes a UnoCSS preset. Add it to your `uno.config.js`:

```javascript
import { defineConfig } from 'unocss'
import { presetVTabler } from '@s3_dse/v-tabler/preset'

export default defineConfig({
  presets: [
    presetVTabler()
  ]
})
```

## TypeScript Support

V-Tabler includes TypeScript definitions. No additional setup required for TypeScript projects.

## Next Steps

- [Quick Start Guide](/guide/quick-start)
- [Configuration](/guide/configuration)
- [Table Component](/components/table-component)
