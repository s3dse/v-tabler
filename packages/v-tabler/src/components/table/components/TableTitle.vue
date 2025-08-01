<template>
    <div
        v-if="title || slots.title"
        class="vt-title-border border-b border-border my-3"
        :class="{ 'bg-surface': title && !slots.title }"
    >
        <div v-if="title && !slots.title" class="vt-title card-title mx-4 my-3">
            {{ title }}
        </div>
        <slot v-else name="title" />
    </div>
</template>

<script setup>
import { useSlots } from 'vue'

defineProps({
    title: {
        type: String,
        required: false
    }
})

const slots = useSlots()
</script>