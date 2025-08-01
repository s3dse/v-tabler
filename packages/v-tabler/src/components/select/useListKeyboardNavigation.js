import { ref, nextTick } from 'vue'

/**
 * A composable for managing keyboard navigation in a list component.
 * It allows for focusing on list items using arrow keys and resetting focus.
 *
 * @param {Object} params - The parameters for the keyboard navigation.
 * @param {Ref<Array>} params.itemsRef - A reactive reference to the list items.
 * @param {Ref<HTMLElement>} params.listTemplateRef - A reactive reference to the list template element.
 * @returns {Object} An object containing methods and properties for managing keyboard navigation.
 */
export function useListKeyboardNavigation({ itemsRef, listTemplateRef }) {
    const focusedIndex = ref(0)

    const moveFocus = direction => {
        const items = itemsRef.value
        if (!items.length) return

        focusedIndex.value = (focusedIndex.value + direction + items.length) % items.length
        focusCurrentItem()
    }

    const focusCurrentItem = () => {
        nextTick(() => {
            const listItems = listTemplateRef.value.querySelectorAll('li')
            listItems?.[focusedIndex.value]?.focus()
        })
    }

    const arrowHandlers = {
        ArrowDown: () => moveFocus(1),
        ArrowUp: () => moveFocus(-1)
    }

    const onArrowKey = event => {
        if (arrowHandlers[event.key]) {
            event.preventDefault()
            arrowHandlers[event.key]()
        }
    }

    const globalHandlers = {
        ArrowDown: () => onArrowKey({ key: 'ArrowDown', preventDefault: () => {} }),
        ArrowUp: () => onArrowKey({ key: 'ArrowUp', preventDefault: () => {} })
    }

    const resetFocus = () => {
        focusedIndex.value = 0
        focusCurrentItem()
    }

    const onGlobalArrowKey = kbdEvent => {
        if (!listTemplateRef?.value) return
        const handler = globalHandlers[kbdEvent.key]
        if (handler) {
            kbdEvent.preventDefault()
            kbdEvent.stopPropagation()
            handler()
        }
    }

    return {
        focusedIndex,
        onArrowKey,
        onGlobalArrowKey,
        resetFocus
    }
}
