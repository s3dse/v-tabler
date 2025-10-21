<template>
    <div class="flex" :class="alignmentClass">
        <div class="max-w-[80%] rounded px-4 py-2 shadow-sm" :class="messageClass">
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <span class="text-xs mt-1 block opacity-70">
                {{ message.timestamp }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    message: {
        type: Object,
        required: true,
        validator: value => {
            return (
                value.role &&
                ['user', 'assistant'].includes(value.role) &&
                value.content !== undefined &&
                value.timestamp !== undefined
            )
        }
    }
})

const alignmentClass = computed(() => {
    return props.message.role === 'user' ? 'justify-end' : 'justify-start'
})

const messageClass = computed(() => {
    return props.message.role === 'user'
        ? 'bg-primary text-onprimary'
        : 'bg-surface text-default border border-solid border-border'
})
</script>
