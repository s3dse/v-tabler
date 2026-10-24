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
                        @copy="copyRangeToClipboard"
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
                    :side-offset="MENTION_MENU_SIDE_OFFSET"
                    :collision-padding="MENTION_MENU_COLLISION_PADDING"
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
                        :allow-plain-text="activeMentionContext?.mode === 'resolve'"
                        @highlight="mentionOptions.highlight"
                        @select="selectOption"
                        @use-plain-text="convertActiveMentionToText"
                    />
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>

        <p v-if="containsUnresolvedMentions" role="alert" class="mt-1 text-xs text-warning">
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

const MENTION_MENU_SIDE_OFFSET = 4
const MENTION_MENU_COLLISION_PADDING = 8

const props = defineProps({
    optionProvider: { type: Function, required: true },
    triggerProvider: { type: Function, default: null },
    placeholder: { type: String, default: '' },
    disabled: Boolean,
    maxHeight: { type: [Number, String], default: 150 },
    recallLastMessage: { type: Function, default: null },
    variant: { type: String, required: true }
})

const draftModel = defineModel({ type: [String, Object], default: '' })
const emit = defineEmits(['submit'])
const { t } = useI18n()
const activeTriggerProvider = computed(() => props.triggerProvider ?? defaultMentionTriggerProvider)
const draft = ref(normalizeMentionDraft(draftModel.value, activeTriggerProvider.value))
const editorRef = ref(null)
const menuId = `chat-mention-menu-${useId()}`
const activeMentionContext = ref(null)
const dismissedTrigger = ref(null)
const mentionOptions = useMentionOptions((context) => props.optionProvider(context))

const containsUnresolvedMentions = computed(() => hasUnresolvedMentions(draft.value))
const activeDescendant = computed(() =>
    mentionOptions.open.value && mentionOptions.options.value.length
        ? `${menuId}-option-${mentionOptions.highlightedIndex.value}`
        : undefined
)

const triggerMatchesAreEqual = (left, right) =>
    left?.type === right?.type &&
    left?.query === right?.query &&
    left?.replaceRange.start === right?.replaceRange.start &&
    left?.replaceRange.end === right?.replaceRange.end

const setDraft = (nextDraft) => {
    draft.value = nextDraft
    draftModel.value = nextDraft
}

const mentionPartsAreEqual = (leftParts, rightParts) =>
    leftParts.length === rightParts.length &&
    leftParts.every((leftPart, index) => {
        const rightPart = rightParts[index]
        return (
            Object.keys(leftPart).every((key) => leftPart[key] === rightPart?.[key]) &&
            Object.keys(rightPart ?? {}).every((key) => rightPart[key] === leftPart[key])
        )
    })

const restoreCaret = (caretIndex) => editorRef.value?.restoreCaret(caretIndex)

const closeMentionMenu = () => {
    activeMentionContext.value = null
    mentionOptions.close()
}

const dismissMentionMenu = () => {
    if (activeMentionContext.value?.mode === 'insert') {
        dismissedTrigger.value = activeMentionContext.value.match
    }
    closeMentionMenu()
}

const handlePopoverOpenChange = (open) => {
    if (!open) dismissMentionMenu()
}

const handleMenuInteractOutside = (event) => {
    if (editorRef.value?.containsTarget(event.target)) event.preventDefault()
}

const updateActiveTrigger = (caretIndex) => {
    if (activeMentionContext.value?.mode === 'resolve') return

    const match = activeTriggerProvider.value({
        text: draft.value.content,
        cursorIndex: caretIndex
    })
    if (!match) {
        dismissedTrigger.value = null
        closeMentionMenu()
        return
    }
    if (triggerMatchesAreEqual(dismissedTrigger.value, match)) return
    dismissedTrigger.value = null
    if (triggerMatchesAreEqual(activeMentionContext.value?.match, match)) return

    activeMentionContext.value = { mode: 'insert', match }
    mentionOptions.search(match)
}

const setDraftParts = (parts, caretIndex, detectTrigger = true) => {
    setDraft(createMentionDraft(parts))
    restoreCaret(caretIndex)
    if (detectTrigger) updateActiveTrigger(caretIndex)
}

const replaceDraftRange = (range, parts) => {
    closeMentionMenu()
    setDraftParts(
        replaceMentionRange(draft.value.parts, range, parts),
        range.start + contentLength(parts),
        false
    )
}

const handleInputParts = ({ parts, caretIndex }) => setDraftParts(parts, caretIndex)

const getHighlightedOption = () =>
    mentionOptions.options.value[mentionOptions.highlightedIndex.value]

const getPartRange = (partIndex) => {
    const span = mentionPartSpans(draft.value.parts)[partIndex]
    return span ? { start: span.start, end: span.end } : null
}

const createResolvedMention = (match, option) => ({
    kind: 'mention',
    type: match.type,
    trigger: match.trigger,
    id: option.id,
    label: option.label,
    resolved: true
})

const resolveMentionWithOption = (context, option) => {
    const currentMention = draft.value.parts[context.partIndex]
    const range = getPartRange(context.partIndex)
    if (currentMention?.kind !== 'mention' || !range) return

    replaceDraftRange(range, [
        { ...currentMention, id: option.id, label: option.label, resolved: true }
    ])
}

const insertMentionOption = (context, option) => {
    replaceDraftRange(context.match.replaceRange, [createResolvedMention(context.match, option)])
}

const selectOption = (option) => {
    const context = activeMentionContext.value
    if (!context) return

    if (context.mode === 'resolve') {
        resolveMentionWithOption(context, option)
        return
    }
    insertMentionOption(context, option)
}

const insertText = (text) => {
    const range = editorRef.value?.getSelectionRange() ?? {
        start: draft.value.content.length,
        end: draft.value.content.length
    }
    replaceDraftRange(range, [{ kind: 'text', text }])
}

const tryRecallLastMessage = () => {
    if (!props.recallLastMessage) return false
    const range = editorRef.value?.getSelectionRange()
    if (draft.value.content.trim() && range?.start !== 0) return false

    const recalledValue = props.recallLastMessage()
    if (!recalledValue) return false

    const recalledDraft = normalizeMentionDraft(recalledValue, activeTriggerProvider.value)
    closeMentionMenu()
    setDraft(recalledDraft)
    restoreCaret(recalledDraft.content.length)
    return true
}

const handleMentionMenuKeydown = (event) => {
    if (!mentionOptions.open.value) return false
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        mentionOptions.moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
        return true
    }
    if (event.key === 'Escape') {
        event.preventDefault()
        dismissMentionMenu()
        return true
    }
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        const option = getHighlightedOption()
        if (option) selectOption(option)
        return true
    }
    return false
}

const submitDraftOrResolveMention = () => {
    const unresolvedIndex = draft.value.parts.findIndex(
        (part) => part.kind === 'mention' && !part.resolved
    )
    if (unresolvedIndex >= 0) {
        resolveMention(unresolvedIndex)
        return
    }
    emit('submit', draft.value)
}

const handleKeydown = (event) => {
    if (handleMentionMenuKeydown(event)) return

    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault()
        insertText('\n')
        return
    }
    if (event.key === 'Enter') {
        event.preventDefault()
        submitDraftOrResolveMention()
        return
    }
    if (event.key === 'ArrowUp' && tryRecallLastMessage()) {
        event.preventDefault()
    }
}

const handlePaste = ({ text, range }) => {
    const pastedParts = parseSerializedMentions(text, activeTriggerProvider.value)
    replaceDraftRange(range, pastedParts)
}

const copyRangeToClipboard = ({ event, range }) => {
    if (range.start === range.end) return false
    event.preventDefault()
    event.clipboardData?.setData('text/plain', serializeMentionRange(draft.value.parts, range))
    return true
}

const handleCut = (payload) => {
    if (!copyRangeToClipboard(payload)) return
    deleteRange(payload.range)
}

const deleteRange = (range) => {
    replaceDraftRange(range, [])
}

const findSingleExactOption = (options, label) => {
    const exactMatches = options.filter(
        (option) => option.label.toLowerCase() === label.toLowerCase()
    )
    return exactMatches.length === 1 ? exactMatches[0] : null
}

const resolveMention = async (partIndex) => {
    const mention = draft.value.parts[partIndex]
    if (mention?.kind !== 'mention' || mention.resolved) return

    activeMentionContext.value = { mode: 'resolve', partIndex }
    const candidates = await mentionOptions.searchImmediately({
        type: mention.type,
        query: mention.label
    })
    if (!candidates) return

    const exactMatch = findSingleExactOption(candidates, mention.label)
    if (exactMatch) selectOption(exactMatch)
}

const convertActiveMentionToText = () => {
    const context = activeMentionContext.value
    if (context?.mode !== 'resolve') return
    const mention = draft.value.parts[context.partIndex]
    const range = getPartRange(context.partIndex)
    if (mention?.kind !== 'mention' || !range) return

    replaceDraftRange(range, [{ kind: 'text', text: mention.label }])
}

const focus = () => editorRef.value?.focus()

const clear = () => {
    closeMentionMenu()
    setDraft(createMentionDraft([]))
    restoreCaret(0)
}

watch(draftModel, (value) => {
    const nextDraft = normalizeMentionDraft(value, activeTriggerProvider.value)
    if (mentionPartsAreEqual(nextDraft.parts, draft.value.parts)) return
    draft.value = nextDraft
    closeMentionMenu()
    editorRef.value?.adjustHeightNextTick()
})

onMounted(() => setDraft(draft.value))

defineExpose({ focus, clear })
</script>
