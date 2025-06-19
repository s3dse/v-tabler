<template>
    <div class="card">
        <div class="flex justify-between items-center cursor-pointer" @click="toggle">
            <slot name="header">
                <h1 class="text-lg font-bold">{{ heading }}</h1>
            </slot>
            <slot name="trigger">
                <button
                    class="pt-2 px-4"
                    :class="[isOpen ? 'i-custom-chevron-up' : 'i-custom-chevron-down']"
                />
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

const props = defineProps({
    heading: {
        type: String,
        default: ''
    }
})

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
</script>
