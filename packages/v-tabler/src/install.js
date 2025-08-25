import * as components from './components'
import * as directives from './directives'
import { setVTablerI18n } from './composables/useI18n.js'

const VTail = {
    install(Vue, options = {}) {
        Object.keys(components).forEach(key => {
            Vue.component(key, components[key])
        })
        Object.keys(directives).forEach(key => {
            Vue.directive(key, directives[key])
        })

        // If i18n instance is provided in options, set it up
        if (options.i18n) {
            setVTablerI18n(options.i18n)
        }
    }
}

export default VTail

// Export components directly at the top level
export * from './components'
export * as components from './components'
export * as directives from './directives'
export * as composables from './composables'
