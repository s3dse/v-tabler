# Internationalization (i18n)

V-tabler provides comprehensive internationalization support through vue-i18n integration. This guide shows you how to set up multi-language support for table filters and other UI elements.

## Prerequisites

First, ensure you have vue-i18n installed:

```bash
npm install vue-i18n@9
# or
yarn add vue-i18n@9
```

## Basic Setup

### Method 1: Plugin Options (Recommended)

The simplest way to set up i18n is through the plugin options:

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
            title: 'My App',
            welcome: 'Welcome to our application'
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
            title: 'Meine App',
            welcome: 'Willkommen in unserer Anwendung'
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

For more control, you can set up i18n manually:

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

// Manually connect v-tabler to vue-i18n
setVTablerI18n(i18n.global)

app.mount('#app')
```

## Using Components

Once i18n is set up, your components work unchanged:

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

Filter labels will automatically be translated based on the current locale!

## Language Switching

To switch languages, simply change the vue-i18n locale:

```vue
<template>
    <div>
        <button @click="$i18n.locale = 'en'">English</button>
        <button @click="$i18n.locale = 'de'">Deutsch</button>

        <TableComponent :data="data" :columns="columns" :enable-filtering="true" />
    </div>
</template>
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

### Alternative Namespace Format

If you prefer not to use the `vTabler.` prefix, you can define translations without it:

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

V-tabler will automatically check both `vTabler.table.filters.textLabel` and `table.filters.textLabel`.

## Fallback System

V-tabler uses a robust fallback chain to ensure text is always displayed:

1. **Field-level i18n** (highest priority): `column.i18n.textLabel`
2. **vue-i18n translations**: `$t('vTabler.table.filters.textLabel')` or `$t('table.filters.textLabel')`
3. **Built-in defaults** (lowest priority): English fallback values

This ensures your table always displays meaningful text, even if some translations are missing.

## Complete Translation Keys

Here are all available translation keys for table filters:

```javascript
const translationKeys = {
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

## Example Translations

### German (de)

```javascript
{
  'vTabler.table.filters.textLabel': 'Enthält Text:',
  'vTabler.table.filters.numericLabel': 'Zahlenfilter:',
  'vTabler.table.filters.dateLabel': 'Datumsfilter:',
  'vTabler.table.filters.selectLabel': 'Werte auswählen:',
  'vTabler.table.filters.clearFilterLabel': 'Filter löschen',
  'vTabler.table.filters.searchPlaceholder': 'Optionen durchsuchen...',
  'vTabler.table.filters.noSelectionText': 'Werte auswählen:',
  'vTabler.table.filters.textPlaceholder': 'Text eingeben...',
  'vTabler.table.filters.numericPlaceholder': 'Wert...',
  'vTabler.table.filters.datePlaceholder': 'Datum auswählen...'
}
```

### French (fr)

```javascript
{
  'vTabler.table.filters.textLabel': 'Contient le texte :',
  'vTabler.table.filters.numericLabel': 'Filtre numérique :',
  'vTabler.table.filters.dateLabel': 'Filtre de date :',
  'vTabler.table.filters.selectLabel': 'Sélectionner les valeurs :',
  'vTabler.table.filters.clearFilterLabel': 'Effacer le filtre',
  'vTabler.table.filters.searchPlaceholder': 'Rechercher des options...',
  'vTabler.table.filters.noSelectionText': 'Sélectionner les valeurs :',
  'vTabler.table.filters.textPlaceholder': 'Entrer le texte...',
  'vTabler.table.filters.numericPlaceholder': 'Valeur...',
  'vTabler.table.filters.datePlaceholder': 'Sélectionner la date...'
}
```

## Migration Guide

If you were using the previous custom i18n system, the new system is fully backward compatible:

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

The new system provides global translations while maintaining all existing functionality!

## Troubleshooting

### Translations Not Working

1. **Check plugin setup**: Ensure you're passing the i18n instance to the plugin
2. **Verify keys**: Make sure translation keys match exactly (case-sensitive)
3. **Check fallbacks**: Even if translations are missing, English defaults should display

### Mixed Languages

If some text appears in different languages:

1. **Check fallback chain**: Some text might be coming from field-level i18n
2. **Verify translation completeness**: Ensure all keys are translated for each language
3. **Test with default keys**: Use `getDefaultTranslationKeys()` as a starting point

For more help, check the [GitHub repository](https://github.com/s3dse/v-tabler) or open an issue.
