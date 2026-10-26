<template>
    <div
        :class="
            isEmbedded
                ? 'w-full py-4 bg-transparent'
                : 'p-4 border-t border-solid border-border bg-surface'
        "
    >
        <div
            class="chat-input-wrapper flex items-end gap-2"
            :class="
                isEmbedded
                    ? 'w-full rounded border border-solid border-border bg-surface p-3 focus-within:ring-2 focus-within:ring-primary-lt'
                    : ''
            "
        >
            <ChatMentionComposer
                v-if="mentionsEnabled"
                ref="mentionComposerRef"
                v-model="localMessage"
                :option-provider="mentionOptionProvider"
                :trigger-provider="mentionTriggerProvider"
                :placeholder="resolvedPlaceholder"
                :disabled="disabled"
                :max-height="maxHeight"
                :recall-last-message="recallLastMessage"
                :variant="variant"
                @submit="handleSubmit"
            />
            <textarea
                v-else
                ref="textareaRef"
                v-model="localMessage"
                @keydown="handleKeydown"
                @input="adjustHeight"
                :placeholder="resolvedPlaceholder"
                :disabled="disabled"
                :style="autoHeightStyle"
                :rows="isEmbedded ? 2 : 1"
                class="flex-1 min-w-0 text-default resize-none overflow-y-auto with-scrollbar"
                :class="
                    isEmbedded
                        ? 'border-0 bg-transparent px-2 py-1 outline-none shadow-none focus:ring-0'
                        : 'form-inputfield'
                "
            />

            <button
                type="button"
                @click="handleButtonClick"
                :disabled="
                    !props.isTyping && (isMessageEmpty || containsUnresolvedMentions || disabled)
                "
                class="btn-primary-md flex-shrink-0"
                :class="{ 'btn-secondary-md': props.isTyping }"
            >
                <div v-if="props.isTyping" class="i-tabler-x w-5 h-5" />
                <div v-else class="i-tabler-send w-5 h-5" />
            </button>
        </div>
        <div v-if="showHint" class="text-xs text-muted mt-2">
            <div v-if="language.startsWith('de-')" class="flex flex-col gap-2">
                <p>
                    Drücken Sie <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>, um
                    zu senden,
                    <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> für eine
                    neue Zeile, <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd>, um die
                    letzte Nachricht abzurufen
                </p>
                <slot name="additional-hints" />
                <p>AI kann Fehler machen. Bitte überprüfe die Antworten.</p>
            </div>
            <div v-else class="flex flex-col gap-2">
                <p>
                    Press <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send,
                    <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new
                    line, <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd> to recall last
                    message
                </p>
                <slot name="additional-hints" />
                <p>AI can make mistakes. Please verify the responses.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useAutoHeight } from './useAutoHeight.js'
import { useNavigatorLanguage } from '@vueuse/core'
import { useI18n } from '@/composables/useI18n.js'
import { ChatVariant, DEFAULT_CHAT_VARIANT, isChatVariant } from './chatVariants.js'
import ChatMentionComposer from './mentions/ChatMentionComposer.vue'
import { hasUnresolvedMentions, isMentionDraft } from './mentions/mentionDraft.js'

const FOCUS_RESTORE_DELAY_MS = 50

const { t } = useI18n()

const props = defineProps({
    placeholder: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    showHint: {
        type: Boolean,
        default: true
    },
    maxHeight: {
        type: [Number, String],
        default: 150,
        validator: (value) => {
            if (typeof value === 'number') return value > 0
            if (typeof value === 'string') return /^\d+(\.\d+)?(px|rem|em|%)?$/.test(value)
            console.warn(
                `ChatInput: invalid maxHeight value ${value} - expected Number or String with [px|rem|em|%]`
            )
            return false
        }
    },
    isTyping: {
        type: Boolean,
        default: false
    },
    recallLastMessage: {
        type: Function,
        default: null
    },
    mentionOptionProvider: {
        type: Function,
        default: null
    },
    mentionTriggerProvider: {
        type: Function,
        default: null
    },
    variant: {
        type: String,
        default: DEFAULT_CHAT_VARIANT,
        validator: isChatVariant
    }
})

const localMessage = defineModel({
    type: [String, Object],
    default: ''
})
const emit = defineEmits(['submit', 'cancel'])

const isEmbedded = computed(() => props.variant === ChatVariant.EMBEDDED)

const textareaRef = ref(null)
const mentionComposerRef = ref(null)
const pendingFocus = ref(false)
const mentionsEnabled = computed(() => typeof props.mentionOptionProvider === 'function')

watch(
    mentionsEnabled,
    (enabled) => {
        if (!enabled && isMentionDraft(localMessage.value)) {
            localMessage.value = localMessage.value.serializedContent
        }
    },
    { flush: 'sync' }
)

const messageContent = computed(() =>
    isMentionDraft(localMessage.value) ? localMessage.value.content : localMessage.value
)
const isMessageEmpty = computed(() => !messageContent.value?.trim())
const containsUnresolvedMentions = computed(
    () => isMentionDraft(localMessage.value) && hasUnresolvedMentions(localMessage.value)
)

const { language } = useNavigatorLanguage()

const { autoHeightStyle, adjustHeight, adjustHeightNextTick } = useAutoHeight({
    elementRef: textareaRef,
    maxHeight: props.maxHeight
})

watch(
    () => props.disabled,
    (isDisabled) => {
        if (!isDisabled && pendingFocus.value) {
            pendingFocus.value = false
            setTimeout(() => {
                if (document.activeElement === document.body) {
                    focus()
                }
            }, FOCUS_RESTORE_DELAY_MS)
        }
    }
)

watch(localMessage, () => {
    if (!mentionsEnabled.value) adjustHeightNextTick()
})

const canRecallPlainMessage = computed(() => {
    const textarea = textareaRef.value
    const inputEmpty = isMessageEmpty.value
    const cursorAtStart = textarea && textarea.selectionStart === 0
    return textarea && (inputEmpty || cursorAtStart)
})

const recallPlainMessage = () => {
    if (!props.recallLastMessage || !canRecallPlainMessage.value) return false

    const lastMessage = props.recallLastMessage()
    if (!lastMessage) return false

    const recalledContent = isMentionDraft(lastMessage)
        ? lastMessage.serializedContent
        : lastMessage
    localMessage.value = recalledContent
    nextTick(() => {
        textareaRef.value.setSelectionRange(recalledContent.length, recalledContent.length)
        adjustHeight()
    })
    return true
}

const handleKeydown = (event) => {
    if (event.key === 'ArrowUp') {
        if (recallPlainMessage()) event.preventDefault()
        return
    }
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        event.stopPropagation()
        handleSubmit()
    }
}

const handleButtonClick = () => {
    if (props.isTyping) {
        emit('cancel')
    } else {
        handleSubmit()
    }
}

const handleSubmit = (submittedValue) => {
    if (isMentionDraft(submittedValue)) localMessage.value = submittedValue
    if (
        isMessageEmpty.value ||
        containsUnresolvedMentions.value ||
        props.disabled ||
        props.isTyping
    ) {
        return
    }

    emit('submit', localMessage.value)
    nextTick(focus)
}

const focus = () => {
    if (mentionsEnabled.value) {
        if (props.disabled) pendingFocus.value = true
        else mentionComposerRef.value?.focus()
        return
    }
    const textarea = textareaRef.value
    if (!textarea) return

    if (textarea.disabled) {
        pendingFocus.value = true
    } else {
        textarea.focus()
    }
}

const resolvedPlaceholder = computed(() => {
    if (props.placeholder !== null && props.placeholder !== undefined) return props.placeholder
    return t('vTabler.chat.input.placeholder')
})

const clear = () => {
    if (mentionsEnabled.value) {
        mentionComposerRef.value?.clear()
        return
    }
    localMessage.value = ''
    adjustHeightNextTick()
}

defineExpose({ focus, clear })
</script>

<style scoped>
textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-track {
    background: transparent;
}

textarea::-webkit-scrollbar-thumb {
    background: var(--un-preset-scrollbar-thumb);
    border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: var(--un-preset-scrollbar-thumbHover);
}

kbd {
    font-family: ui-monospace, monospace;
}
</style>
