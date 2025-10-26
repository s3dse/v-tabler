<template>
    <div class="p-4 border-t border-solid border-border bg-surface">
        <div class="flex gap-2 items-end">
            <textarea
                ref="textareaRef"
                v-model="localMessage"
                @keydown="handleKeydown"
                @input="adjustHeight"
                :placeholder="placeholder"
                :disabled="disabled"
                :style="textareaStyle"
                rows="1"
                class="flex-1 form-inputfield resize-none overflow-y-auto with-scrollbar"
            />
            <button
                type="button"
                @click="handleSubmit"
                :disabled="!localMessage.trim() || disabled"
                class="btn-primary-md flex-shrink-0"
            >
                <div class="i-tabler-send w-5 h-5" />
            </button>
        </div>
        <div v-if="showHint" class="text-xs text-muted mt-2">
            Press <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send,
            <kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new line
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Type your message...'
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
        validator: value => {
            if (typeof value === 'number') return value > 0
            if (typeof value === 'string') return /^\d+(\.\d+)?(px|rem|em|%)?$/.test(value)
            console.warn(
                `ChatInput: invalid maxHeight value ${value} - expected Number or String with [px|rem|em|%]`
            )
            return false
        }
    }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const localMessage = ref(props.modelValue)
const textareaRef = ref(null)

// Computed style for max-height
const textareaStyle = computed(() => {
    const maxHeightValue =
        typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    return {
        'min-height': '2.375rem',
        'max-height': maxHeightValue
    }
})

// Sync with parent
watch(
    () => props.modelValue,
    newVal => {
        localMessage.value = newVal
        nextTick(() => adjustHeight())
    }
)

watch(localMessage, newVal => {
    emit('update:modelValue', newVal)
})

const handleKeydown = event => {
    // Allow Shift+Enter for new line (default behavior)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        event.stopPropagation()
        handleSubmit()
    }
}

const preventFormSubmission = event => {
    if (event) {
        event.stopPropagation()
        event.preventDefault()
    }
}

const handleSubmit = event => {
    if (!localMessage.value.trim() || props.disabled) return

    preventFormSubmission(event)
    emit('submit', localMessage.value)

    nextTick(() => {
        textareaRef.value?.focus()
    })
}

const adjustHeight = () => {
    const textarea = textareaRef.value
    if (!textarea) return

    // Reset height to calculate scrollHeight correctly
    textarea.style.height = 'auto'

    // Convert maxHeight to pixels if it's a number
    const maxHeightPx =
        typeof props.maxHeight === 'number' ? props.maxHeight : parseFloat(props.maxHeight)
    const newHeight = Math.min(textarea.scrollHeight, maxHeightPx)
    textarea.style.height = `${newHeight}px`
}

const focus = () => {
    nextTick(() => {
        textareaRef.value?.focus()
    })
}

const clear = () => {
    localMessage.value = ''
    nextTick(() => adjustHeight())
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
