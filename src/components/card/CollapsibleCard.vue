<template>
    <div class="card">
        <div
            class="flex group/header justify-between items-center cursor-pointer focus-visible:(ring ring-primary/30 rounded-sm outline-none)"
            tabindex="0"
            @click="toggle"
            @keydown.enter.prevent="toggle"
            @keydown.space.prevent="toggle"
            :class="[isOpen && horizontalRule ? 'border-b border-border' : '']"
        >
            <div class="group-hover/header:text-primary-hover! color-transition py-1 px-2">
                <slot name="header">
                    <Heading tag="h2">{{ heading }}</Heading>
                </slot>
            </div>
            <slot v-if="showToggleIcon" name="toggle-icon">
                <span
                    class="pt-2 px-8 header-2 flex"
                    :class="[isOpen ? 'i-custom-chevron-up' : 'i-custom-chevron-down']"
                ></span>
            </slot>
        </div>

        <Collapse :show="isOpen">
            <div>
                <slot />
            </div>
        </Collapse>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Collapse from '../transition/Collapse.vue'
import { Heading } from '../typography'

const props = defineProps({
    heading: {
        type: String,
        default: ''
    },
    horizontalRule: {
        type: Boolean,
        default: true
    },
    showToggleIcon: {
        type: Boolean,
        default: false
    }
})

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
</script>
