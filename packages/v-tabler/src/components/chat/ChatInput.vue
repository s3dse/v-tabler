<template>
    <div class="p-4 border-t border-solid border-border bg-surface">
        <div class="flex gap-2 items-end">
            <textarea
                ref="textareaRef"
                v-model="localMessage"
                @keydown="handleKeydown"
                @input="handleInput"
                :placeholder="placeholder"
                :disabled="disabled"
                :style="autoHeightStyle"
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
import { ref, watch, nextTick } from 'vue'
import { useAutoHeight } from './useAutoHeight.js'

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

// Auto-height functionality
const { autoHeightStyle, adjustHeight, adjustHeightNextTick } = useAutoHeight({
    elementRef: textareaRef,
    maxHeight: props.maxHeight
})

// Sync with parent (only watch for external changes)
watch(
    () => props.modelValue,
    newVal => {
        localMessage.value = newVal
        adjustHeightNextTick()
    }
)

const handleInput = () => {
    // Emit to parent when user types
    emit('update:modelValue', localMessage.value)
    adjustHeight()
}

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

const focus = () => {
    nextTick(() => {
        textareaRef.value?.focus()
    })
}

const clear = () => {
    localMessage.value = ''
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
