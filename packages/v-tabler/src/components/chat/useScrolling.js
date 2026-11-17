import { nextTick, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const MESSAGE_ATTRIBUTE = 'data-chat-message'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

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
 * Keep each submitted question in place while its answer fits. If content overflows,
 * pin the question to the viewport top once. A final overflow check runs when the turn
 * ends, then the pending pin expires. Indexes must come from the original messages array.
 */
export function useScrolling(containerRef, contentEndRef, messages, isTyping) {
    const anchorIndex = ref(null)
    const isPinPending = ref(false)
    const pinHeight = ref(0)

    const resetPin = () => {
        anchorIndex.value = null
        isPinPending.value = false
        pinHeight.value = 0
    }

    const cancelPendingPin = () => {
        isPinPending.value = false
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

    const pinIfContentOverflows = () => {
        if (!isPinPending.value) return

        const container = containerRef.value
        const contentEnd = contentEndRef.value
        if (!container || !contentEnd) return

        const containerRect = container.getBoundingClientRect()
        const paddingBottom = Number.parseFloat(getComputedStyle(container).paddingBottom) || 0
        if (contentEnd.getBoundingClientRect().bottom <= containerRect.bottom - paddingBottom) return

        const layout = measureCurrentPin()
        if (!layout) return

        isPinPending.value = false
        const behavior = globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches
            ? 'instant'
            : 'smooth'
        container.scrollTo({ top: layout.anchorOffsetTop, behavior })
    }

    const expirePendingPin = async () => {
        await nextTick()
        if (isTyping.value || !isPinPending.value) return

        pinIfContentOverflows()
        isPinPending.value = false
    }

    useResizeObserver(containerRef, measureCurrentPin, { box: 'border-box' })
    useResizeObserver(
        () => contentEndRef.value?.parentElement,
        pinIfContentOverflows,
        { box: 'border-box' }
    )

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
            isPinPending.value = true
            const layout = measureCurrentPin()
            if (!layout) return

            await nextTick()
            if (anchorIndex.value !== targetIndex || !isPinPending.value) return
            pinIfContentOverflows()
            if (!isTyping.value) isPinPending.value = false
        },
        { flush: 'post' }
    )

    watch(
        isTyping,
        (typing) => {
            if (!typing) expirePendingPin()
        },
        { flush: 'post' }
    )

    return {
        pinHeight,
        getMessageAttributes: (index) => ({ [MESSAGE_ATTRIBUTE]: String(index) }),
        cancelPendingPin,
        resetPin
    }
}
