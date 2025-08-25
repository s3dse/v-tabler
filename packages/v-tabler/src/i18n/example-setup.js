// Example demonstrating v-tabler i18n integration without Vue internals

// main.js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VTabler, { getDefaultTranslationKeys } from '@s3dse/v-tabler'
import App from './App.vue'

// Method 1: Plugin Options (Recommended) ✅
const vTablerDefaults = getDefaultTranslationKeys()

const messages = {
    en: {
        ...vTablerDefaults,
        app: { title: 'My App' }
    },
    de: {
        'vTabler.table.filters.textLabel': 'Enthält Text:',
        'vTabler.table.filters.numericLabel': 'Zahlenfilter:',
        'vTabler.table.filters.clearFilterLabel': 'Filter löschen',
        app: { title: 'Meine App' }
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
app.use(VTabler, { i18n }) // ← i18n integration happens here
app.mount('#app')

// Alternative Method 2: Manual Setup
/*
import { setVTablerI18n } from '@s3dse/v-tabler'

const app = createApp(App)
app.use(i18n)
app.use(VTabler)
setVTablerI18n(i18n.global) // ← Manual connection
app.mount('#app')
*/

// How it works internally (no Vue internals used):
/*
1. setVTablerI18n() stores the i18n instance in a global ref
2. useI18n() composable retrieves it via:
   - Global ref (set by setVTablerI18n)
   - Standard Vue inject() for vue-i18n
   - Falls back to English defaults
3. No getCurrentInstance() or other Vue internals needed!
*/

// Your components work unchanged:
/*
<template>
  <TableComponent 
    :data="tableData" 
    :columns="columns" 
    :enable-filtering="true" 
  />
</template>
*/
