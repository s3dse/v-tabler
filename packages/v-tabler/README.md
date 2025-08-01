# v-tabler

A component library for Vue 3 using UnoCSS.

## Installation

Install the library via `npm install --save @s3_dse/v-tabler`.

In your `uno.config.js` import and install the preset:

```js
import { defineConfig, presetUno } from 'unocss'
import presetVTail from '@s3_dse/v-tabler/preset'

export default defineConfig({
    presets: [presetUno(), presetVTail()]
})
```

Add the following to your entry point (e.g. `main.js`):

```js
import VTail from '@s3_dse/v-tabler'

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(VTail)

app.mount('#app')
```

## Development

This package is part of a monorepo. To develop:

```bash
# Install dependencies
npm install

# Run stories for component development
npm run story:dev

# Build the library
npm run build

# Run tests
npm run test:unit
```

## Components

See the [main repository README](../../README.md) for full component documentation.
