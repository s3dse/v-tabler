import { ref, nextTick, toValue } from 'vue'

export function useDropdownPosition(containerRef) {
    const dropdownAbove = ref(false)
    const dropdownLeft = ref(false)
    const dropdownStyles = ref({})

    function updateDropdownPosition(contentRef) {
        nextTick().then(() => {
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
                        ? `${rect.bottom + window.scrollY - dropdownHeight}px`
                        : `${rect.top + window.scrollY}px`,
                    width: `${rect.width}px`,
                    zIndex: 501
                }
                dropdown.classList.remove('invisible')
            })
        })
    }

    return {
        dropdownAbove,
        dropdownLeft,
        updateDropdownPosition,
        dropdownStyles
    }
}
