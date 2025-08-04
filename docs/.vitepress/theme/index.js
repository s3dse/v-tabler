// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import VTabler from '@s3_dse/v-tabler'
import DynamicLayout from '../../components/DynamicLayout.vue'

export default {
  // extends: DefaultTheme,
  ...DefaultTheme,
  Layout: DynamicLayout,
  enhanceApp({ app }) {
    app.use(VTabler)
  }
}
