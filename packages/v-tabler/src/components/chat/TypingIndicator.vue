<template>
    <div v-if="isTyping" class="flex justify-start">
        <div class="bg-surface text-default rounded px-4 py-2 border border-solid border-border">
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
defineProps({
    isTyping: {
        type: Boolean,
        default: true
    }
})
</script>
