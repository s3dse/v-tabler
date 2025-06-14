import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import { createApp } from 'vue'
import App from './App.vue'
import { busy } from '@/directives'

const app = createApp(App)
app.directive('busy', busy)
app.mount('#app')
window.$vm = app
