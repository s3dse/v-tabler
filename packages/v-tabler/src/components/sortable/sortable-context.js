/** Native drag state stays at the edge; both drag and button moves share immutable ordering. */
import { inject, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'

export const SORTABLE_ROOT = Symbol('SortableRoot')
export const SORTABLE_ITEM = Symbol('SortableItem')
const SORTABLE_DRAG_TYPE = 'application/x-v-tabler-sortable'

const isValidId = value =>
    (typeof value === 'string' && value.trim().length > 0) ||
    (typeof value === 'number' && Number.isFinite(value))

const validateIds = ids => {
    if (!Array.isArray(ids) || !ids.every(isValidId)) {
        throw new TypeError('SortableRoot modelValue must be an array of non-empty string or finite-number IDs.')
    }
    if (new Set(ids).size !== ids.length) {
        throw new Error('SortableRoot modelValue must contain unique IDs.')
    }
}

const moveId = (ids, value, toIndex) => {
    const fromIndex = ids.indexOf(value)
    if (fromIndex === -1) throw new Error('SortableItem value must be present in SortableRoot modelValue.')
    if (toIndex < 0 || toIndex >= ids.length || fromIndex === toIndex) return ids

    const remainingIds = ids.filter(id => id !== value)
    return [...remainingIds.slice(0, toIndex), value, ...remainingIds.slice(toIndex)]
}

const destinationIndex = (ids, source, target, position) => {
    const insertionIndex = ids.indexOf(target) + (position === 'after' ? 1 : 0)
    return insertionIndex - (ids.indexOf(source) < insertionIndex ? 1 : 0)
}

export const useSortableRoot = () => {
    const root = inject(SORTABLE_ROOT, null)
    if (!root) throw new Error('SortableItem must be used inside SortableRoot.')
    return root
}

export const useSortableItem = () => {
    const item = inject(SORTABLE_ITEM, null)
    if (!item) throw new Error('SortableHandle must be used inside SortableItem.')
    return item
}

export const createSortableController = ({ modelValue, disabled, rootId, rootElement, emit }) => {
    const drag = shallowRef(null)
    const marker = shallowRef(null)

    const cancelDrag = () => {
        drag.value = null
        marker.value = null
    }

    watch(modelValue, ids => {
        validateIds(ids)
        cancelDrag()
    }, { immediate: true, deep: true })
    watch(disabled, cancelDrag)
    onBeforeUnmount(cancelDrag)

    const ownsDrag = event =>
        !disabled.value && drag.value !== null &&
        Array.from(event.dataTransfer?.types ?? []).includes(SORTABLE_DRAG_TYPE)

    const move = (value, toIndex, itemElement = null) => {
        if (disabled.value) return

        const ids = modelValue.value
        const nextIds = moveId(ids, value, toIndex)
        if (nextIds === ids) return

        const activeElement = itemElement?.ownerDocument.activeElement
        const trigger = itemElement?.contains(activeElement) ? activeElement : null
        cancelDrag()
        emit('update:modelValue', nextIds)
        emit('reorder', { value, fromIndex: ids.indexOf(value), toIndex })

        if (trigger) {
            nextTick(() => {
                if (!itemElement.isConnected) return
                const focusTarget = trigger.isConnected && !trigger.matches(':disabled')
                    ? trigger
                    : itemElement
                focusTarget.focus()
            })
        }
    }

    const startDrag = (value, itemElement, event) => {
        if (event.defaultPrevented) return
        if (disabled.value || !event.dataTransfer || event.target !== event.currentTarget) {
            event.preventDefault()
            return
        }

        const startedDrag = { value }
        drag.value = startedDrag
        marker.value = null
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData(SORTABLE_DRAG_TYPE, rootId)
        const bounds = itemElement.getBoundingClientRect()
        event.dataTransfer.setDragImage(itemElement, event.clientX - bounds.left, event.clientY - bounds.top)

        // asChild consumers may cancel dragstart after our merged handler has run.
        queueMicrotask(() => {
            if (event.defaultPrevented && drag.value === startedDrag) cancelDrag()
        })
    }

    const hoverItem = (value, event) => {
        if (!ownsDrag(event)) return

        const bounds = event.currentTarget.getBoundingClientRect()
        const position = event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after'
        const toIndex = destinationIndex(modelValue.value, drag.value.value, value, position)
        marker.value = toIndex === modelValue.value.indexOf(drag.value.value)
            ? null
            : { value, position }
    }

    const dragOver = event => {
        if (!ownsDrag(event) || !marker.value) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }

    const drop = event => {
        if (!ownsDrag(event)) return
        if (event.dataTransfer.getData(SORTABLE_DRAG_TYPE) !== rootId || !marker.value) {
            cancelDrag()
            return
        }

        event.preventDefault()
        const source = drag.value.value
        const { value, position } = marker.value
        move(source, destinationIndex(modelValue.value, source, value, position))
        cancelDrag()
    }

    const leaveRoot = event => {
        if (!rootElement.value?.contains(event.relatedTarget)) marker.value = null
    }

    const forgetItem = value => {
        if (drag.value?.value === value || marker.value?.value === value) cancelDrag()
    }

    return {
        modelValue, disabled, drag, marker,
        move, startDrag, hoverItem, dragOver, drop, leaveRoot, cancelDrag, forgetItem
    }
}
