import { nextTick, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const MESSAGE_ATTRIBUTE = 'data-chat-message'

const measurePin = (container, messageIndex) => {
    if (!container) return null

    const anchorElement = container.querySelector(
        `[${MESSAGE_ATTRIBUTE}="${messageIndex}"]`
    )
    if (!anchorElement) return null

    const containerRect = container.getBoundingClientRect()
    const anchorRect = anchorElement.getBoundingClientRect()
    const containerStyle = getComputedStyle(container)
    const paddingTop = Number.parseFloat(containerStyle.paddingTop) || 0
    const paddingBottom = Number.parseFloat(containerStyle.paddingBottom) || 0
    const anchorOffsetTop =
        container.scrollTop + anchorRect.top - containerRect.top - paddingTop

    return {
        anchorOffsetTop,
        pinHeight: Math.max(
            0,
            anchorOffsetTop + container.clientHeight - paddingTop - paddingBottom
        )
    }
}

/**
 * Pin the latest submitted question to the viewport top once. The flex layout keeps
 * the available space below it stable while answers grow or shrink, and later updates
 * never change scrollTop. Indexes must come from the original, unfiltered messages array.
 */
export function useScrolling(containerRef, messages) {
    const anchorIndex = ref(null)
    const pinHeight = ref(0)

    const resetPin = () => {
        anchorIndex.value = null
        pinHeight.value = 0
    }

    const measureCurrentPin = () => {
        if (anchorIndex.value === null) return null

        const layout = measurePin(containerRef.value, anchorIndex.value)
        if (!layout) {
            if (import.meta.env.DEV) {
                console.warn(
                    '[ChatComponent] No marked element found for the submitted question; bind getMessageAttributes(index) in your custom messages slot.'
                )
            }
            resetPin()
            return null
        }

        pinHeight.value = layout.pinHeight
        return layout
    }

    useResizeObserver(containerRef, measureCurrentPin, { box: 'border-box' })

    watch(
        () => messages.value.length,
        async (messageCount, previousMessageCount) => {
            if (messageCount <= previousMessageCount) return

            const targetIndex = messages.value.findLastIndex(
                (message, index) =>
                    index >= previousMessageCount && message.role === 'user'
            )
            if (targetIndex === -1) return

            anchorIndex.value = targetIndex
            const layout = measureCurrentPin()
            if (!layout) return

            await nextTick()
            if (anchorIndex.value !== targetIndex) return

            const container = containerRef.value
            if (container) container.scrollTop = layout.anchorOffsetTop
        },
        { flush: 'post' }
    )

    return {
        pinHeight,
        getMessageAttributes: (index) => ({ [MESSAGE_ATTRIBUTE]: String(index) }),
        resetPin
    }
}
