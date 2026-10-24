<template>
    <div class="relative min-w-0 flex-1">
        <PopoverRoot :open="mentionOptions.open.value" @update:open="handlePopoverOpenChange">
            <PopoverAnchor as-child>
                <div data-mention-anchor class="min-w-0 w-full">
                    <ChatMentionEditor
                        ref="editorRef"
                        :draft="draft"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :max-height="maxHeight"
                        :variant="variant"
                        :menu-open="mentionOptions.open.value"
                        :menu-id="menuId"
                        :active-descendant="activeDescendant"
                        @input-parts="handleInputParts"
                        @caret-change="updateActiveTrigger"
                        @keydown="handleKeydown"
                        @paste="handlePaste"
                        @copy="handleCopy"
                        @cut="handleCut"
                        @delete-range="deleteRange"
                        @resolve="resolveMention"
                    />
                </div>
            </PopoverAnchor>

            <PopoverPortal>
                <PopoverContent
                    as-child
                    side="bottom"
                    align="start"
                    :side-offset="4"
                    :collision-padding="8"
                    :avoid-collisions="true"
                    :side-flip="true"
                    position-strategy="fixed"
                    :hide-when-detached="true"
                    @open-auto-focus.prevent
                    @close-auto-focus.prevent
                    @interact-outside="handleMenuInteractOutside"
                >
                    <ChatMentionMenu
                        :loading="mentionOptions.loading.value"
                        :error="mentionOptions.error.value"
                        :options="mentionOptions.options.value"
                        :highlighted-index="mentionOptions.highlightedIndex.value"
                        :menu-id="menuId"
                        :allow-plain-text="activeContext?.mode === 'resolve'"
                        @highlight="mentionOptions.highlight"
                        @select="selectOption"
                        @use-plain-text="convertActiveMentionToText"
                    />
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>

        <p v-if="hasUnresolved" role="alert" class="mt-1 text-xs text-amber">
            {{ t('vTabler.chat.mentions.blocked') }}
        </p>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, useId, watch } from 'vue'
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'
import { useI18n } from '@/composables/useI18n.js'
import ChatMentionEditor from './ChatMentionEditor.vue'
import ChatMentionMenu from './ChatMentionMenu.vue'
import {
    contentLength,
    createMentionDraft,
    hasUnresolvedMentions,
    mentionPartSpans,
    normalizeMentionDraft,
    parseSerializedMentions,
    replaceMentionRange,
    serializeMentionRange
} from './mentionDraft.js'
import { defaultMentionTriggerProvider } from './mentionTriggerProvider.js'
import { useMentionOptions } from './useMentionOptions.js'

const props = defineProps({
    optionProvider: { type: Function, required: true },
    triggerProvider: { type: Function, default: null },
    placeholder: { type: String, default: '' },
    disabled: Boolean,
    maxHeight: { type: [Number, String], default: 150 },
    recallLastMessage: { type: Function, default: null },
    variant: { type: String, required: true }
})

const model = defineModel({ type: [String, Object], default: '' })
const emit = defineEmits(['submit'])
const { t } = useI18n()
const triggerProvider = computed(() => props.triggerProvider ?? defaultMentionTriggerProvider)
const draft = ref(normalizeMentionDraft(model.value, triggerProvider.value))
const editorRef = ref(null)
const menuId = `chat-mention-menu-${useId()}`
const activeContext = ref(null)
const dismissedTriggerMatch = ref(null)
const mentionOptions = useMentionOptions(context => props.optionProvider(context))

const hasUnresolved = computed(() => hasUnresolvedMentions(draft.value))
const activeDescendant = computed(() =>
    mentionOptions.open.value && mentionOptions.options.value.length
        ? `${menuId}-option-${mentionOptions.highlightedIndex.value}`
        : undefined
)

const sameTriggerMatch = (left, right) =>
    left?.type === right?.type &&
    left?.query === right?.query &&
    left?.replaceRange.start === right?.replaceRange.start &&
    left?.replaceRange.end === right?.replaceRange.end

const emitDraft = nextDraft => {
    draft.value = nextDraft
    model.value = nextDraft
}

const partsAreEqual = (leftParts, rightParts) =>
    leftParts.length === rightParts.length &&
    leftParts.every((leftPart, index) => {
        const rightPart = rightParts[index]
        return (
            Object.keys(leftPart).every(key => leftPart[key] === rightPart?.[key]) &&
            Object.keys(rightPart ?? {}).every(key => rightPart[key] === leftPart[key])
        )
    })

const restoreEditor = caretIndex => editorRef.value?.restoreCaret(caretIndex)

const closeOptions = () => {
    activeContext.value = null
    mentionOptions.close()
}

const dismissOptions = () => {
    if (activeContext.value?.mode === 'insert') {
        dismissedTriggerMatch.value = activeContext.value.match
    }
    closeOptions()
}

const handlePopoverOpenChange = open => {
    if (!open) dismissOptions()
}

const handleMenuInteractOutside = event => {
    if (editorRef.value?.containsTarget(event.target)) event.preventDefault()
}

const updateActiveTrigger = caretIndex => {
    if (activeContext.value?.mode === 'resolve') return

    const match = triggerProvider.value({ text: draft.value.content, cursorIndex: caretIndex })
    if (!match) {
        dismissedTriggerMatch.value = null
        closeOptions()
        return
    }
    if (sameTriggerMatch(dismissedTriggerMatch.value, match)) return
    dismissedTriggerMatch.value = null
    if (sameTriggerMatch(activeContext.value?.match, match)) return

    activeContext.value = { mode: 'insert', match }
    mentionOptions.search(match)
}

const applyParts = (parts, caretIndex, detectTrigger = true) => {
    emitDraft(createMentionDraft(parts))
    restoreEditor(caretIndex)
    if (detectTrigger) updateActiveTrigger(caretIndex)
}

const replaceDraftRange = (range, parts) => {
    closeOptions()
    applyParts(
        replaceMentionRange(draft.value.parts, range, parts),
        range.start + contentLength(parts),
        false
    )
}

const handleInputParts = ({ parts, caretIndex }) => applyParts(parts, caretIndex)

const selectedOption = () => mentionOptions.options.value[mentionOptions.highlightedIndex.value]

const partStart = partIndex =>
    mentionPartSpans(draft.value.parts)[Math.max(0, partIndex)]?.start ??
    contentLength(draft.value.parts)

const selectOption = option => {
    const context = activeContext.value
    if (!context) return

    if (context.mode === 'resolve') {
        const currentMention = draft.value.parts[context.partIndex]
        if (currentMention?.kind !== 'mention') return

        const nextParts = draft.value.parts.map((part, index) =>
            index === context.partIndex
                ? { ...currentMention, id: option.id, label: option.label, resolved: true }
                : part
        )
        const caretIndex = partStart(context.partIndex) + option.label.length
        closeOptions()
        applyParts(nextParts, caretIndex, false)
        return
    }

    const mention = {
        kind: 'mention',
        type: context.match.type,
        trigger: context.match.trigger,
        id: option.id,
        label: option.label,
        resolved: true
    }
    const nextParts = replaceMentionRange(draft.value.parts, context.match.replaceRange, [mention])
    const caretIndex = context.match.replaceRange.start + option.label.length
    closeOptions()
    applyParts(nextParts, caretIndex, false)
}

const insertText = text => {
    const range = editorRef.value?.getSelectionRange() ?? {
        start: draft.value.content.length,
        end: draft.value.content.length
    }
    replaceDraftRange(range, [{ kind: 'text', text }])
}

const handleRecall = () => {
    if (!props.recallLastMessage) return false
    const range = editorRef.value?.getSelectionRange()
    if (draft.value.content.trim() && range?.start !== 0) return false

    const recalledValue = props.recallLastMessage()
    if (!recalledValue) return false

    const recalledDraft = normalizeMentionDraft(recalledValue, triggerProvider.value)
    closeOptions()
    emitDraft(recalledDraft)
    restoreEditor(recalledDraft.content.length)
    return true
}

const handleKeydown = event => {
    if (mentionOptions.open.value) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            mentionOptions.moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
            return
        }
        if (event.key === 'Escape') {
            event.preventDefault()
            dismissOptions()
            return
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (selectedOption()) selectOption(selectedOption())
            return
        }
    }

    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault()
        insertText('\n')
        return
    }
    if (event.key === 'Enter') {
        event.preventDefault()
        if (hasUnresolved.value) {
            const unresolvedIndex = draft.value.parts.findIndex(
                part => part.kind === 'mention' && !part.resolved
            )
            resolveMention(unresolvedIndex)
            return
        }
        emit('submit', draft.value)
        return
    }
    if (event.key === 'ArrowUp' && !mentionOptions.open.value && handleRecall()) {
        event.preventDefault()
    }
}

const handlePaste = ({ text, range }) => {
    const pastedParts = parseSerializedMentions(text, triggerProvider.value)
    replaceDraftRange(range, pastedParts)
}

const copyRange = ({ event, range }) => {
    if (range.start === range.end) return false
    event.preventDefault()
    event.clipboardData?.setData('text/plain', serializeMentionRange(draft.value.parts, range))
    return true
}

const handleCopy = payload => copyRange(payload)

const handleCut = payload => {
    if (!copyRange(payload)) return
    deleteRange(payload.range)
}

const deleteRange = range => {
    replaceDraftRange(range, [])
}

const resolveMention = async partIndex => {
    const mention = draft.value.parts[partIndex]
    if (mention?.kind !== 'mention' || mention.resolved) return

    activeContext.value = { mode: 'resolve', partIndex }
    const candidates = await mentionOptions.searchImmediately({
        type: mention.type,
        query: mention.label
    })
    if (!candidates) return

    const exactMatches = candidates.filter(
        option => option.label.toLowerCase() === mention.label.toLowerCase()
    )
    if (exactMatches.length === 1) selectOption(exactMatches[0])
}

const convertActiveMentionToText = () => {
    const context = activeContext.value
    if (context?.mode !== 'resolve') return
    const mention = draft.value.parts[context.partIndex]
    if (mention?.kind !== 'mention') return

    const start = partStart(context.partIndex)
    const nextParts = draft.value.parts.flatMap((part, index) =>
        index === context.partIndex ? [{ kind: 'text', text: mention.label }] : [part]
    )
    closeOptions()
    applyParts(nextParts, start + mention.label.length, false)
}

const focus = () => editorRef.value?.focus()

const clear = () => {
    closeOptions()
    emitDraft(createMentionDraft([]))
    restoreEditor(0)
}

watch(model, value => {
    const nextDraft = normalizeMentionDraft(value, triggerProvider.value)
    if (partsAreEqual(nextDraft.parts, draft.value.parts)) return
    draft.value = nextDraft
    closeOptions()
    editorRef.value?.adjustHeightNextTick()
})

onMounted(() => emitDraft(draft.value))

defineExpose({ focus, clear })
</script>
