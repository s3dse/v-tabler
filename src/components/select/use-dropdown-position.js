import { ref, nextTick, toValue } from 'vue'

export function useDropdownPosition(containerRef) {
    const dropdownAbove = ref(false)
    const dropdownLeft = ref(false)
    const dropdownStyles = ref({})

    async function updateDropdownPosition(contentRef) {
        await nextTick()
        requestAnimationFrame(() => {
            const container = containerRef.value
            const dropdown = toValue(contentRef)
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
