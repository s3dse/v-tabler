<template>
    <component :is="tag" :class="[classes, $attrs.class]">
        <slot />
    </component>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
    tag: {
        type: String,
        default: '',
        validator: value => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
    }
})

const headingClasses = {
    h1: 'header-1',
    h2: 'header-2',
    h3: 'header-3',
    h4: 'header-4',
    h5: 'header-5',
    h6: 'header-6',
    default: ''
}

const classes = computed(() => {
    return headingClasses[props.tag] || headingClasses.default
})
</script>
