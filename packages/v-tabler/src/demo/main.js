import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import { createApp } from 'vue'
import App from './App.vue'
import VTabler from '..'
// import VTabler, { getDefaultTranslationKeys } from '../install.js'
// import { createI18n } from 'vue-i18n'

// const i18n = createI18n({
//     locale: window.navigator.language.split('-')[0],
//     fallbackLocale: 'en',
//     legacy: false,
//     globalInjection: true,
//     messages: {
//         ...getDefaultTranslationKeys()
//     }
// })

const app = createApp(App)
// app.use(i18n)
// app.provide('$i18n', i18n.global)
// app.use(VTabler, {
//     i18n: i18n.global
// })
app.use(VTabler)
app.mount('#app')
window.$vm = app
