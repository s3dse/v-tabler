import { ref, nextTick } from 'vue'
import { useListKeyboardNavigation } from '../useListKeyboardNavigation'
import { describe, it, beforeEach, expect, vi } from 'vitest'

describe('useListKeyboardNavigation', () => {
    let itemsRef
    let listTemplateRef

    beforeEach(() => {
        itemsRef = ref(['Item 1', 'Item 2', 'Item 3'])
        listTemplateRef = ref({
            querySelectorAll: vi.fn(() => [
                { focus: vi.fn() },
                { focus: vi.fn() },
                { focus: vi.fn() }
            ])
        })
    })

    it('should initialize with focusedIndex as 0', () => {
        const { focusedIndex } = useListKeyboardNavigation({ itemsRef, listTemplateRef })
        expect(focusedIndex.value).toBe(0)
    })

    it('should move focus down on ArrowDown key', async () => {
        const { focusedIndex, onArrowKey } = useListKeyboardNavigation({
            itemsRef,
            listTemplateRef
        })

        await onArrowKey({ key: 'ArrowDown', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(1)

        await onArrowKey({ key: 'ArrowDown', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(2)

        await onArrowKey({ key: 'ArrowDown', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(0) // Wraps around
    })

    it('should move focus up on ArrowUp key', async () => {
        const { focusedIndex, onArrowKey } = useListKeyboardNavigation({
            itemsRef,
            listTemplateRef
        })

        await onArrowKey({ key: 'ArrowUp', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(2) // Wraps around

        await onArrowKey({ key: 'ArrowUp', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(1)

        await onArrowKey({ key: 'ArrowUp', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(0)
    })

    it('should reset focus to 0', async () => {
        const { focusedIndex, resetFocus, onArrowKey } = useListKeyboardNavigation({
            itemsRef,
            listTemplateRef
        })

        await onArrowKey({ key: 'ArrowDown', preventDefault: vi.fn() })
        expect(focusedIndex.value).toBe(1)

        resetFocus()
        expect(focusedIndex.value).toBe(0)
    })

    it('should call focus on the correct list item', async () => {
        const { onArrowKey } = useListKeyboardNavigation({ itemsRef, listTemplateRef })

        await onArrowKey({ key: 'ArrowDown', preventDefault: vi.fn() })
        await nextTick()

        const listItems = listTemplateRef.value.querySelectorAll.mock.results[0].value
        expect(listTemplateRef.value.querySelectorAll).toHaveBeenCalledWith('li')
        expect(listItems[1].focus).toHaveBeenCalled()
    })
})
