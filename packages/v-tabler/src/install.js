import * as components from './components'
import * as directives from './directives'

const VTail = {
    install(Vue) {
        Object.keys(components).forEach(key => {
            Vue.component(key, components[key])
        })
        Object.keys(directives).forEach(key => {
            Vue.directive(key, directives[key])
        })
    }
}

export default VTail

// Export components directly at the top level
export * from './components'
export * as components from './components'
export * as directives from './directives'
export * as composables from './composables'
