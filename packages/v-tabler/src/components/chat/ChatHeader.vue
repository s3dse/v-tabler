<template>
    <div
        class="flex items-center justify-between p-4 border-b border-solid border-border rounded-t-sm bg-primary text-onprimary"
    >
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 class="font-semibold">{{ chatTitle }}</h3>
        </div>
        <button
            type="button"
            @click="clearChat"
            :title="t('vTabler.chat.header.clearChatLabel')"
            class="bg-primary"
        >
            <div class="block i-tabler-trash text-onprimary hover:text-primary-lt w-5 h-5" />
        </button>
    </div>
</template>
<script setup>
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
const emit = defineEmits(['clear-chat'])
defineProps({
    chatTitle: String
})

function clearChat() {
    emit('clear-chat')
}
</script>
