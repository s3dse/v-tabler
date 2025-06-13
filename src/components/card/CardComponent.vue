<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
export default {
    props: {
        classes: {
            type: String,
            default: ''
        }
    },
    name: 'card-component'
}
</script>
