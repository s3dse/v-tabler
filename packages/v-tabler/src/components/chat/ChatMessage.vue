<template>
    <div class="flex" :class="alignmentClass">
        <div :class="messageClasses">
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <p
                v-if="message.requestState === 'streaming' && !message.content"
                class="text-sm opacity-70"
                role="status"
            >
                {{ t('vTabler.chat.message.streamingLabel') }}
            </p>
            <p
                v-else-if="message.requestState === 'cancelled'"
                class="text-sm opacity-70"
                role="status"
            >
                {{ t('vTabler.chat.message.cancelledLabel') }}
            </p>
            <p v-else-if="message.requestState === 'error'" class="text-sm" role="alert">
                {{ message.requestError }}
            </p>
            <div class="mt-1 flex items-center justify-between gap-2">
                <span class="text-xs opacity-70" :title="message.timestamp.toLocaleString()">
                    {{
                        message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }}
                </span>
                <button
                    v-if="message.role === 'user' && isSupported"
                    type="button"
                    :title="copyLabel"
                    :aria-label="copyLabel"
                    class="rounded bg-primary p-1 text-onprimary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 hover:bg-primary-hover"
                    @click="copy(copyContent)"
                >
                    <span
                        aria-hidden="true"
                        class="block h-4 w-4"
                        :class="copied ? 'i-tabler-check' : 'i-tabler-copy'"
                    />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useI18n } from '@/composables/useI18n.js'
import { ChatVariant, DEFAULT_CHAT_VARIANT, isChatVariant } from './chatVariants.js'

const props = defineProps({
    message: {
        type: Object,
        required: true,
        validator: (value) => {
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

const { t } = useI18n()
const { copy, copied, isSupported } = useClipboard()
const copyContent = computed(() => props.message.serializedContent ?? props.message.content)
const copyLabel = computed(() =>
    copied.value ? t('vTabler.chat.message.copiedLabel') : t('vTabler.chat.message.copyLabel')
)

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
