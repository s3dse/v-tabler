import { ref, nextTick, toValue } from 'vue'

export const POSITION_RELATIVE_TO_TRIGGER = Object.freeze({
    COVER: 'cover',
    ADJACENT: 'adjacent'
})

const getTop = (rect, dropdown, shouldOpenAbove, positionToTrigger) => {
    if (positionToTrigger === POSITION_RELATIVE_TO_TRIGGER.COVER) {
        return shouldOpenAbove
            ? rect.bottom + window.scrollY - dropdown.offsetHeight
            : rect.top + window.scrollY
    } else if (positionToTrigger === POSITION_RELATIVE_TO_TRIGGER.ADJACENT) {
        return shouldOpenAbove
            ? rect.top + window.scrollY - dropdown.offsetHeight
            : rect.bottom + window.scrollY
    }
}

const shouldPlaceAbove = (trigger, dropdown) => {
    const rect = trigger.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = dropdown.offsetHeight

    return spaceBelow < dropdownHeight
}

export function useDropdownPosition(
    triggerRef,
    { positionToTrigger = POSITION_RELATIVE_TO_TRIGGER.COVER } = {}
) {
    if (!Object.values(POSITION_RELATIVE_TO_TRIGGER).includes(positionToTrigger)) {
        return new Error(
            `Invalid positionToTrigger value: ${positionToTrigger}. Valid values are: ${Object.keys(POSITION_RELATIVE_TO_TRIGGER).join(', ')}`
        )
    }

    const dropdownAbove = ref(false)
    const dropdownLeft = ref(false)
    const dropdownStyles = ref({})

    function updateDropdownPosition(contentRef) {
        nextTick().then(() => {
            requestAnimationFrame(() => {
                const trigger = triggerRef.value
                const dropdown = toValue(contentRef)
                if (!trigger || !dropdown) return

                const rect = trigger.getBoundingClientRect()
                const shouldOpenAbove = shouldPlaceAbove(trigger, dropdown)

                dropdownStyles.value = {
                    position: 'absolute',
                    left: `${rect.left + window.scrollX}px`,
                    top: `${getTop(rect, dropdown, shouldOpenAbove, positionToTrigger)}px`,
                    width: `${dropdown.width}px`,
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
