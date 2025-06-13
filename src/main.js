import { createApp } from 'vue'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { busy } from '@/directives'

const app = createApp(App)
app.directive('busy', busy)
app.mount('#app')
window.$vm = app
