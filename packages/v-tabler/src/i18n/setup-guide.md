# v-tabler Vue-i18n Integration Guide

v-tabler now supports vue-i18n for comprehensive internationalization. This guide shows you how to set up i18n for your TableComponent filters.

## Installation

First, ensure you have vue-i18n installed:

```bash
npm install vue-i18n@9
# or
yarn add vue-i18n@9
```

## Basic Setup

### Method 1: Via Plugin Options (Recommended)

```javascript
// main.js or main.ts
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VTabler, { getDefaultTranslationKeys } from '@s3dse/v-tabler'
import App from './App.vue'

// Get default v-tabler translations
const vTablerDefaults = getDefaultTranslationKeys()

const messages = {
    en: {
        ...vTablerDefaults,
        // Your own app translations
        app: {
            title: 'My App'
            // ... other translations
        }
    },
    de: {
        // German translations for v-tabler
        'vTabler.table.filters.textLabel': 'Enthält Text:',
        'vTabler.table.filters.numericLabel': 'Zahlenfilter:',
        'vTabler.table.filters.dateLabel': 'Datumsfilter:',
        'vTabler.table.filters.selectLabel': 'Werte auswählen:',
        'vTabler.table.filters.clearFilterLabel': 'Filter löschen',
        'vTabler.table.filters.searchPlaceholder': 'Optionen durchsuchen...',
        'vTabler.table.filters.noSelectionText': 'Werte auswählen:',
        'vTabler.table.filters.textPlaceholder': 'Text eingeben...',
        'vTabler.table.filters.numericPlaceholder': 'Wert...',
        'vTabler.table.filters.datePlaceholder': 'Datum auswählen...',

        // Your own app translations
        app: {
            title: 'Meine App'
            // ... other translations
        }
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
})

const app = createApp(App)

// Install vue-i18n first
app.use(i18n)

// Install v-tabler with i18n integration
app.use(VTabler, { i18n })

app.mount('#app')
```

### Method 2: Manual Setup

If you prefer more control, you can set up i18n manually:

```javascript
// main.js or main.ts
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VTabler, { setVTablerI18n, getDefaultTranslationKeys } from '@s3dse/v-tabler'
import App from './App.vue'

const vTablerDefaults = getDefaultTranslationKeys()
const messages = {
    en: { ...vTablerDefaults },
    de: {
        /* German translations */
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
})

const app = createApp(App)
app.use(i18n)

app.use(VTabler)
// or app.use(VTabler, { i18n: i18n.global })
// or provide via injection key `$i18n`: app.provide('$i18n', i18n.global)
// or manually connect v-tabler to vue-i18n
setVTablerI18n(i18n.global)

app.mount('#app')
```

### 2. Use TableComponent (no changes required!)

```vue
<template>
    <TableComponent :data="tableData" :columns="columns" :enable-filtering="true" />
</template>

<script setup>
import { TableComponent } from '@s3dse/v-tabler'

const tableData = [
    { id: 1, name: 'John', age: 30, created: '2024-01-15' },
    { id: 2, name: 'Jane', age: 25, created: '2024-02-20' }
]

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'created', label: 'Created Date' }
]
</script>
```

## Advanced Configuration

### Override Specific Filter Labels

You can still override individual filter labels at the field level:

```vue
<script setup>
const columns = [
    {
        key: 'name',
        label: 'Name',
        i18n: {
            textLabel: 'Search Name:', // Override just this filter's label
            textPlaceholder: 'Type to search names...'
        }
    },
    { key: 'age', label: 'Age' }, // Will use global i18n settings
    { key: 'created', label: 'Created Date' }
]
</script>
```

### Without Namespace Prefix (Alternative)

If you prefer not to use the `vTabler.` prefix in your translations, you can define them without it:

```javascript
const messages = {
    en: {
        table: {
            filters: {
                textLabel: 'Contains text:',
                numericLabel: 'Number filter:',
                dateLabel: 'Date filter:'
                // ... other translations
            }
        }
    }
}
```

### Custom Selection Text Functions

For select filters, you can provide custom functions for selection text:

```javascript
// In your i18n setup
const messages = {
    en: {
        // ... other translations
    },
    de: {
        // For German, you might need different pluralization
        // Handle this in your component or use vue-i18n's pluralization features
    }
}
```

## Fallback Behavior

v-tabler's i18n system has a robust fallback chain:

1. **Field-level i18n** (highest priority): `column.i18n.textLabel`
2. **vue-i18n translations**: `$t('vTabler.table.filters.textLabel')` or `$t('table.filters.textLabel')`
3. **Built-in defaults** (lowest priority): English fallback values

This ensures your table always displays meaningful text, even if some translations are missing.

## Complete Translation Keys Reference

Here are all the available translation keys:

```javascript
const allKeys = {
    'vTabler.table.filters.textLabel': 'Contains text:',
    'vTabler.table.filters.numericLabel': 'Number filter:',
    'vTabler.table.filters.dateLabel': 'Date filter:',
    'vTabler.table.filters.selectLabel': 'Select values:',
    'vTabler.table.filters.clearFilterLabel': 'Clear Filter',
    'vTabler.table.filters.searchPlaceholder': 'Search options...',
    'vTabler.table.filters.noSelectionText': 'Select values:',
    'vTabler.table.filters.textPlaceholder': 'Enter text...',
    'vTabler.table.filters.numericPlaceholder': 'Value...',
    'vTabler.table.filters.datePlaceholder': 'Select date...'
}
```

## Migration from Previous Version

If you were using the previous custom i18n system:

### Before

```vue
<script setup>
const columns = [
    {
        key: 'name',
        label: 'Name',
        i18n: {
            clearFilterLabel: 'Clear Filter',
            placeholder: 'Search options...'
        }
    }
]
</script>
```

### After

```vue
<!-- No changes needed! Field-level i18n still works as fallback -->
<script setup>
const columns = [
    {
        key: 'name',
        label: 'Name',
        i18n: {
            clearFilterLabel: 'Clear Filter',
            placeholder: 'Search options...'
        }
    }
]
</script>
```

The new system is fully backward compatible!
