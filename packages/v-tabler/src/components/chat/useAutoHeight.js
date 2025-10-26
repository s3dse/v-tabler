import { computed, nextTick } from 'vue'

/**
 * Composable for auto-adjusting textarea height based on content
 * @param {Object} options - Configuration options
 * @param {Ref} options.elementRef - Reference to the textarea element
 * @param {Ref|Number|String} options.maxHeight - Maximum height (default: 150)
 * @returns {Object} - Auto-height utilities
 */
export function useAutoHeight(options = {}) {
    const { elementRef, maxHeight = 150 } = options

    // Computed style for CSS binding
    const autoHeightStyle = computed(() => {
        const maxHeightValue = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
        return {
            'min-height': '2.375rem',
            'max-height': maxHeightValue
        }
    })

    // Adjust height based on content
    const adjustHeight = () => {
        const element = elementRef?.value
        if (!element) return

        // Reset height to calculate scrollHeight correctly
        element.style.height = 'auto'

        // Convert maxHeight to pixels if it's a number
        const maxHeightPx = typeof maxHeight === 'number' ? maxHeight : parseFloat(maxHeight)
        const newHeight = Math.min(element.scrollHeight, maxHeightPx)
        element.style.height = `${newHeight}px`
    }

    // Adjust height on next tick (useful for when content changes)
    const adjustHeightNextTick = () => {
        nextTick(() => adjustHeight())
    }

    return {
        autoHeightStyle,
        adjustHeight,
        adjustHeightNextTick
    }
}
