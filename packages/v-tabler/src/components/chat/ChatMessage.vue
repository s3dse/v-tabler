<template>
    <div class="flex" :class="alignmentClass">
        <div :class="messageClasses">
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <span class="text-xs mt-1 block opacity-70" :title="message.timestamp.toLocaleString()">
                {{
                    message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChatVariant, DEFAULT_CHAT_VARIANT, isChatVariant } from './chatVariants.js'

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
    },
    variant: {
        type: String,
        default: DEFAULT_CHAT_VARIANT,
        validator: isChatVariant
    }
})

const alignmentClass = computed(() => {
    return props.message.role === 'user' ? 'justify-end' : 'justify-start'
})

const messageClasses = computed(() => {
    if (props.message.role === 'user') {
        return 'max-w-[80%] rounded px-4 py-2 shadow-sm bg-primary text-onprimary'
    }

    if (props.variant === ChatVariant.EMBEDDED) {
        return 'w-full max-w-full py-2 text-default'
    }

    return 'max-w-[80%] rounded px-4 py-2 shadow-sm bg-surface text-default border border-solid border-border'
})
</script>
