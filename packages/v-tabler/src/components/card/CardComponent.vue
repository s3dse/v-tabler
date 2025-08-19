<template>
    <div class="card-component" :class="[classes ? classes : 'card']">
        <slot name="header"></slot>
        <slot name="header-border">
            <div
                :class="[
                    headerBorder && $slots.header ? 'border-b border-border border-solid' : ''
                ]"
            ></div>
        </slot>
        <slot></slot>
        <slot name="footer-border">
            <div
                :class="[
                    footerBorder && $slots.footer ? 'border-t border-border border-solid' : ''
                ]"
            ></div>
        </slot>
        <slot name="footer"></slot>
    </div>
</template>
<script>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

export default {
    props: {
        classes: {
            type: String,
            default: ''
        },
        headerBorder: {
            type: Boolean,
            default: true
        },
        footerBorder: {
            type: Boolean,
            default: false
        }
    },
    name: 'card-component'
}
</script>
