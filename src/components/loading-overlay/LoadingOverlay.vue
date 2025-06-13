<template>
    <div v-busy="show">
        <slot />
    </div>
</template>
<script>
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
export default {
    name: 'loading-overlay',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    }
}
</script>
