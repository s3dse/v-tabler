<template>
    <div class="card-component" :class="[classes ? classes : 'card']">
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
