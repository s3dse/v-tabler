<template>
    <div :class="headerClasses">
        <div class="flex items-center gap-2">
            <div
                v-if="variant === ChatVariant.CARD"
                class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
            ></div>
            <slot name="title">
                <h3 class="font-semibold">{{ chatTitle }}</h3>
            </slot>
        </div>
        <button
            type="button"
            @click="clearChat"
            :title="t('vTabler.chat.header.clearChatLabel')"
            :class="clearButtonClasses"
        >
            <div :class="clearIconClasses" />
        </button>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { ChatVariant, DEFAULT_CHAT_VARIANT, isChatVariant } from './chatVariants.js'

const { t } = useI18n()
const emit = defineEmits(['clear-chat'])
const props = defineProps({
    chatTitle: String,
    variant: {
        type: String,
        default: DEFAULT_CHAT_VARIANT,
        validator: isChatVariant
    }
})

const headerClasses = computed(() => {
    const baseClasses = 'flex items-center justify-between p-4 border-b border-solid border-border'
    return props.variant === ChatVariant.EMBEDDED
        ? `${baseClasses} bg-transparent text-default`
        : `${baseClasses} rounded-t-sm bg-primary text-onprimary`
})

const clearButtonClasses = computed(() => {
    return props.variant === ChatVariant.EMBEDDED ? 'bg-transparent' : 'bg-primary'
})

const clearIconClasses = computed(() => {
    const baseClasses = 'block i-tabler-trash w-5 h-5'
    return props.variant === ChatVariant.EMBEDDED
        ? `${baseClasses} text-muted hover:text-default`
        : `${baseClasses} text-onprimary hover:text-primary-lt`
})

function clearChat() {
    emit('clear-chat')
}
</script>
