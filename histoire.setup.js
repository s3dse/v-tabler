import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { busy } from './src/directives/busy/busy.js'
import { defineSetupVue3 } from '@histoire/plugin-vue'

const setup = defineSetupVue3(({ app }) => {
    // This is the same as the `setup` function in the main file
    // but it is called after the plugins have been applied
    // and the app has been created.
    // This is a good place to add global components, directives, etc.
    app.directive('busy', busy)
})
