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
                v-if="mentionMode"
                ref="mentionComposerRef"
                :model-value="localMessage"
                :option-provider="mentionOptionProvider"
                :trigger-provider="mentionTriggerProvider"
                :placeholder="_placeholder"
                :disabled="disabled"
                :max-height="maxHeight"
                :recall-last-message="recallLastMessage"
                :variant="variant"
                @update:model-value="handleMentionUpdate"
                @submit="handleSubmit"
            />
            <textarea
                v-else
                ref="textareaRef"
                v-model="localMessage"
                @keydown="handleKeydown"
                @input="handleInput"
                :placeholder="_placeholder"
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
                :disabled="!props.isTyping && (messageIsEmpty || hasUnresolved || disabled)"
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
                <p>AI kann Fehler machen. Bitte überprüfe die Antworten.</p>
            </div>
            <div v-else class="flex flex-col gap-2">
                <p>
                    Press <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send,
                    <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new
                    line, <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd> to recall last
                    message
                </p>
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

const { t } = useI18n()

const props = defineProps({
    modelValue: {
        type: [String, Object],
        default: ''
    },
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

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const isEmbedded = computed(() => props.variant === ChatVariant.EMBEDDED)

const localMessage = ref(props.modelValue)
const textareaRef = ref(null)
const mentionComposerRef = ref(null)
const pendingFocus = ref(false)
const mentionMode = computed(() => typeof props.mentionOptionProvider === 'function')
const messageContent = computed(() =>
    isMentionDraft(localMessage.value) ? localMessage.value.content : localMessage.value
)
const messageIsEmpty = computed(() => !messageContent.value?.trim())
const hasUnresolved = computed(
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
            // Small delay to avoid stealing focus if user focused elsewhere
            setTimeout(() => {
                if (document.activeElement === document.body) {
                    focus()
                }
            }, 50)
        }
    }
)

// Sync with parent (only watch for external changes)
watch(
    () => props.modelValue,
    (newVal) => {
        localMessage.value = newVal
        if (!mentionMode.value) adjustHeightNextTick()
    }
)

const handleInput = () => {
    emit('update:modelValue', localMessage.value)
    adjustHeight()
}

const handleMentionUpdate = (value) => {
    localMessage.value = value
    emit('update:modelValue', value)
}

const recallLastMessageAllowed = computed(() => {
    const textarea = textareaRef.value
    const inputEmpty = messageIsEmpty.value
    const cursorAtStart = textarea && textarea.selectionStart === 0
    return textarea && (inputEmpty || cursorAtStart)
})

const handleKeydown = (event) => {
    // Handle up arrow to recall last message
    if (event.key === 'ArrowUp' && props.recallLastMessage) {
        // Only recall if textarea is empty or cursor is at the beginning
        if (recallLastMessageAllowed.value) {
            event.preventDefault()
            const lastMessage = props.recallLastMessage()
            if (lastMessage) {
                const recalledContent = isMentionDraft(lastMessage)
                    ? lastMessage.serializedContent
                    : lastMessage
                localMessage.value = recalledContent
                emit('update:modelValue', recalledContent)
                // Move cursor to end
                nextTick(() => {
                    textareaRef.value.setSelectionRange(
                        recalledContent.length,
                        recalledContent.length
                    )
                    adjustHeight()
                })
            }
        }
        return
    }

    // Allow Shift+Enter for new line (default behavior)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        event.stopPropagation()
        handleSubmit()
    }
}

const preventFormSubmission = (event) => {
    if (event) {
        event.stopPropagation()
        event.preventDefault()
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
    if (messageIsEmpty.value || hasUnresolved.value || props.disabled || props.isTyping) return

    preventFormSubmission(isMentionDraft(submittedValue) ? null : submittedValue)
    emit('submit', localMessage.value)

    nextTick(() => {
        focus()
    })
}

const focus = () => {
    if (mentionMode.value) {
        if (props.disabled) pendingFocus.value = true
        else mentionComposerRef.value?.focus()
        return
    }
    const textarea = textareaRef.value
    if (!textarea) {
        return
    }

    if (textarea.disabled) {
        // Mark that focus is pending, watcher will handle it
        pendingFocus.value = true
    } else {
        textarea.focus()
    }
}

const _placeholder = computed(() => {
    if (props.placeholder !== null && props.placeholder !== undefined) return props.placeholder
    return t('vTabler.chat.input.placeholder')
})

const clear = () => {
    if (mentionMode.value) {
        mentionComposerRef.value?.clear()
        return
    }
    localMessage.value = ''
    emit('update:modelValue', '')
    adjustHeightNextTick()
}

defineExpose({ focus, clear })
</script>

<style scoped>
/* Custom scrollbar for textarea */
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
