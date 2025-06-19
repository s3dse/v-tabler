import { ref, nextTick } from 'vue'

export function useDropdownPosition(
    containerRef,
    dropdownRef
) {
    const dropdownAbove = ref(false)
    const dropdownLeft = ref(false)

    async function updateDropdownPosition() {
        await nextTick()
        requestAnimationFrame(() => {
            const container = containerRef.value
            const dropdown = dropdownRef?.value
            if (!container || !dropdown) return

            const rect = container.getBoundingClientRect()
            const dropdownHeight = dropdown.offsetHeight
            const dropdownWidth = dropdown.offsetWidth

            const spaceBelow = window.innerHeight - rect.bottom
            dropdownAbove.value = spaceBelow < dropdownHeight

            const spaceLeft = window.innerWidth - rect.left
            dropdownLeft.value = spaceLeft < dropdownWidth
        })
    }

    return {
        dropdownAbove,
        dropdownLeft,
        updateDropdownPosition
    }

}