<template>
    <div
        class="flex items-center justify-between p-4 border-b border-solid border-border rounded-t-sm bg-primary text-onprimary"
    >
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 class="font-semibold">AI Assistant</h3>
        </div>
        <button @click="clearChat" title="Clear chat" class="bg-primary">
            <div class="block i-tabler-trash text-onprimary hover:text-primary-lt w-5 h-5" />
        </button>
    </div>
</template>
<script setup>
const emit = defineEmits(['clear-chat'])

function clearChat() {
    emit('clear-chat')
}
</script>
