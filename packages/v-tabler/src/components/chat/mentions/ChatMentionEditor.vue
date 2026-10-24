<template>
  <div
    ref="editorRef"
    role="combobox"
    aria-autocomplete="list"
    aria-multiline="true"
    :aria-label="placeholder"
    :aria-expanded="menuOpen"
    :aria-controls="menuOpen ? menuId : undefined"
    :aria-activedescendant="activeDescendant"
    :aria-disabled="disabled"
    :contenteditable="disabled ? 'false' : 'true'"
    :data-placeholder="placeholder"
    :style="autoHeightStyle"
    class="mention-editor min-w-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words text-default outline-none with-scrollbar"
    :class="isEmbedded ? 'border-0 bg-transparent px-2 py-1 shadow-none' : 'form-inputfield'"
    @input="handleInput"
    @keydown="handleKeydown"
    @keyup="emitCaretChange"
    @click="emitCaretChange"
    @paste="handlePaste"
    @copy="handleCopy"
    @cut="handleCut"
    @compositionstart="isComposing = true"
    @compositionend="handleCompositionEnd"
  >
    <template v-for="(part, index) in draft.parts" :key="`${part.kind}-${index}`">
      <span v-if="part.kind === 'text'" data-text-part>{{ part.text }}</span>
      <ChatMentionChip
        v-else
        :data-mention-index="index"
        :mention="part"
        :disabled="disabled"
        @activate="emit('resolve', index)"
      />
    </template>
    <br v-if="draft.content.endsWith('\n')" data-trailing-break aria-hidden="true" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUpdated, ref, shallowRef } from 'vue'
import { useAutoHeight } from '../useAutoHeight.js'
import { ChatVariant } from '../chatVariants.js'
import { mentionPartSpans, mergeMentionParts } from './mentionDraft.js'
import ChatMentionChip from './ChatMentionChip.vue'

const IME_PROCESS_KEY_CODE = 229

const props = defineProps({
  draft: { type: Object, required: true },
  placeholder: { type: String, default: '' },
  disabled: Boolean,
  maxHeight: { type: [Number, String], default: 150 },
  variant: { type: String, required: true },
  menuOpen: Boolean,
  menuId: { type: String, required: true },
  activeDescendant: { type: String, default: undefined }
})

const emit = defineEmits([
  'input-parts',
  'caret-change',
  'keydown',
  'paste',
  'copy',
  'cut',
  'delete-range',
  'resolve'
])

const editorRef = ref(null)
const renderedChildren = shallowRef([])
const isComposing = ref(false)
const isEmbedded = computed(() => props.variant === ChatVariant.EMBEDDED)

const { autoHeightStyle, adjustHeight, adjustHeightNextTick } = useAutoHeight({
  elementRef: editorRef,
  maxHeight: props.maxHeight
})

const selectionBelongsToEditor = (selection) =>
  selection?.rangeCount &&
  editorRef.value?.contains(selection.getRangeAt(0).commonAncestorContainer)

const offsetWithinEditor = (container, offset) => {
  const range = document.createRange()
  range.selectNodeContents(editorRef.value)
  range.setEnd(container, offset)
  return range.toString().length
}

const getSelectionRange = () => {
  const selection = window.getSelection()
  if (!selectionBelongsToEditor(selection)) {
    const end = props.draft.content.length
    return { start: end, end }
  }

  const range = selection.getRangeAt(0)
  const anchor = offsetWithinEditor(range.startContainer, range.startOffset)
  const focus = offsetWithinEditor(range.endContainer, range.endOffset)
  return { start: Math.min(anchor, focus), end: Math.max(anchor, focus) }
}

const findCaretPoint = (root, targetOffset) => {
  let consumed = 0

  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent.length
      if (targetOffset <= consumed + length) {
        return { node, offset: Math.max(0, targetOffset - consumed) }
      }
      consumed += length
      return null
    }

    if (!(node instanceof HTMLElement)) return null
    if (node.hasAttribute('data-mention-index')) {
      const length = node.textContent.length
      if (targetOffset <= consumed) {
        return {
          node: node.parentNode,
          offset: Array.from(node.parentNode.childNodes).indexOf(node)
        }
      }
      if (targetOffset <= consumed + length) {
        return {
          node: node.parentNode,
          offset: Array.from(node.parentNode.childNodes).indexOf(node) + 1
        }
      }
      consumed += length
      return null
    }

    for (const child of node.childNodes) {
      const point = visit(child)
      if (point) return point
    }
    return null
  }

  return visit(root) ?? { node: root, offset: root.childNodes.length }
}

const setCaretOffset = (offset) => {
  const editor = editorRef.value
  if (!editor) return

  const point = findCaretPoint(editor, Math.max(0, offset))
  const range = document.createRange()
  range.setStart(point.node, point.offset)
  range.collapse(true)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

const createTextParts = (text) => (text ? [{ kind: 'text', text }] : [])

const readDomNodeParts = (node) => {
  if (node.nodeType === Node.TEXT_NODE) return createTextParts(node.textContent)
  if (!(node instanceof HTMLElement) || node.hasAttribute('data-trailing-break')) return []

  const mentionIndex = node.getAttribute('data-mention-index')
  if (mentionIndex !== null) {
    const mention = props.draft.parts[Number(mentionIndex)]
    return mention?.kind === 'mention' ? [{ ...mention }] : []
  }
  if (node.tagName === 'BR') return createTextParts('\n')
  return Array.from(node.childNodes).flatMap(readDomNodeParts)
}

const readDomParts = () =>
  mergeMentionParts(Array.from(editorRef.value.childNodes).flatMap(readDomNodeParts))

const rememberRenderedChildren = () => {
  renderedChildren.value = Array.from(editorRef.value?.childNodes ?? [])
}

const renderedChildrenAreCurrent = () => {
  const currentChildren = Array.from(editorRef.value?.childNodes ?? [])
  return (
    currentChildren.length === renderedChildren.value.length &&
    currentChildren.every((child, index) => child === renderedChildren.value[index])
  )
}

const restoreRenderedChildren = () => {
  if (renderedChildrenAreCurrent()) return
  editorRef.value?.replaceChildren(...renderedChildren.value)
}

const handleInput = () => {
  if (isComposing.value) return
  const caretIndex = getSelectionRange().end
  const parts = readDomParts()
  restoreRenderedChildren()
  emit('input-parts', { parts, caretIndex })
  adjustHeight()
}

const handleCompositionEnd = () => {
  isComposing.value = false
  handleInput()
}

const getMentionRanges = () =>
  mentionPartSpans(props.draft.parts).flatMap(({ part, start, end }) =>
    part.kind === 'mention' ? [{ start, end }] : []
  )

const handleAtomicDelete = (event) => {
  if (!['Backspace', 'Delete'].includes(event.key)) return false
  const selectionRange = getSelectionRange()
  if (selectionRange.start !== selectionRange.end) return false

  const mentionRange = getMentionRanges().find((range) =>
    event.key === 'Backspace'
      ? selectionRange.start === range.end
      : selectionRange.start === range.start
  )
  if (!mentionRange) return false

  event.preventDefault()
  emit('delete-range', mentionRange)
  return true
}

const isCompositionEvent = (event) =>
  isComposing.value || event.isComposing || event.keyCode === IME_PROCESS_KEY_CODE

const handleKeydown = (event) => {
  if (isCompositionEvent(event)) return
  if (handleAtomicDelete(event)) return
  emit('keydown', event)
}

const emitCaretChange = (event) => {
  if (isCompositionEvent(event)) return
  emit('caret-change', getSelectionRange().end)
}

const handlePaste = (event) => {
  event.preventDefault()
  emit('paste', {
    text: event.clipboardData?.getData('text/plain') ?? '',
    range: getSelectionRange()
  })
}

const handleCopy = (event) => {
  emit('copy', { event, range: getSelectionRange() })
}

const handleCut = (event) => {
  emit('cut', { event, range: getSelectionRange() })
}

const focus = () => editorRef.value?.focus()
const containsTarget = (target) => editorRef.value?.contains(target) ?? false

const restoreCaret = (offset) => {
  nextTick(() => {
    editorRef.value?.focus()
    setCaretOffset(offset)
    adjustHeight()
  })
}

onMounted(rememberRenderedChildren)
onUpdated(rememberRenderedChildren)

defineExpose({ focus, containsTarget, getSelectionRange, restoreCaret, adjustHeightNextTick })
</script>

<style scoped>
.mention-editor:empty::before {
  content: attr(data-placeholder);
  opacity: 0.6;
  pointer-events: none;
}
</style>
