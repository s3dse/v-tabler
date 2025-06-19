import { ref, nextTick } from 'vue'

export function useDropdownPosition(containerRef, contentRef) {
    const dropdownAbove = ref(false)
    const dropdownLeft = ref(false)
    const dropdownStyles = ref({})

    async function updateDropdownPosition() {
        await nextTick()
        requestAnimationFrame(() => {
            const container = containerRef.value
            const dropdown = contentRef?.value?.dropdownRef
            if (!container || !dropdown) return

            const rect = container.getBoundingClientRect()

            const spaceBelow = window.innerHeight - rect.bottom
            const dropdownHeight = dropdown.offsetHeight

            const shouldOpenAbove = spaceBelow < dropdownHeight
            dropdownAbove.value = shouldOpenAbove

            dropdownStyles.value = {
                position: 'absolute',
                left: `${rect.left + window.scrollX}px`,
                top: shouldOpenAbove
                    ? `${rect.top + window.scrollY - dropdownHeight}px`
                    : `${rect.bottom + window.scrollY}px`,
                width: `${rect.width}px`,
                zIndex: 501
            }
        })
    }

    return {
        dropdownAbove,
        dropdownLeft,
        updateDropdownPosition,
        dropdownStyles
    }
}
