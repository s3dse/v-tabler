import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import { createApp } from 'vue'
import App from './App.vue'
import VTabler from '@s3_dse/v-tabler'

const app = createApp(App)
app.use(VTabler)
app.mount('#app')
window.$vm = app
