<template>
    <div v-if="isTyping" class="flex justify-start">
        <div :class="indicatorClasses">
            <div class="flex gap-1">
                <div
                    class="w-2 h-2 bg-txt-muted rounded-full animate-bounce"
                    style="animation-delay: 0ms"
                ></div>
                <div
                    class="w-2 h-2 bg-txt-muted rounded-full animate-bounce"
                    style="animation-delay: 150ms"
                ></div>
                <div
                    class="w-2 h-2 bg-txt-muted rounded-full animate-bounce"
                    style="animation-delay: 300ms"
                ></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { ChatVariant, DEFAULT_CHAT_VARIANT, isChatVariant } from './chatVariants.js'

const props = defineProps({
    isTyping: {
        type: Boolean,
        default: true
    },
    variant: {
        type: String,
        default: DEFAULT_CHAT_VARIANT,
        validator: isChatVariant
    }
})

const indicatorClasses = computed(() => {
    return props.variant === ChatVariant.EMBEDDED
        ? 'py-2 text-default'
        : 'bg-surface text-default rounded px-4 py-2 border border-solid border-border'
})
</script>
