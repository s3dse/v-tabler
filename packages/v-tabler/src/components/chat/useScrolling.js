import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const MESSAGE_ATTRIBUTE = 'data-chat-message'

const measureSpan = (elements) => {
    const firstRect = elements[0].getBoundingClientRect()
    const lastRect = elements.at(-1).getBoundingClientRect()
    return lastRect.bottom - firstRect.top
}

const measureReveal = (container, messageIndex) => {
    if (!container) return null

    const elements = [
        ...container.querySelectorAll(`[${MESSAGE_ATTRIBUTE}="${messageIndex}"]`)
    ]
    const firstElement = elements[0]
    if (!firstElement) return null

    const containerRect = container.getBoundingClientRect()
    const firstElementRect = firstElement.getBoundingClientRect()
    const topPadding = Number.parseFloat(getComputedStyle(container).paddingTop) || 0
    const desiredScrollTop = Math.max(
        0,
        container.scrollTop + firstElementRect.top - containerRect.top - topPadding
    )
    const maximumScrollTop = Math.max(0, container.scrollHeight - container.clientHeight)

    return {
        elements,
        desiredScrollTop,
        missingScrollRange: Math.max(0, desiredScrollTop - maximumScrollTop),
        initialSpan: measureSpan(elements)
    }
}

/**
 * Reveal each assistant reply once: submission arms the reveal, the first assistant
 * message is aligned to the viewport top, user scrolling cancels a pending reveal,
 * later stream updates do not scroll, and trailing space shrinks as the reply grows.
 * getMessageAttributes must receive indexes from the original, unfiltered messages array.
 * Limit: only the first new assistant message in an armed reveal contributes to spacer
 * shrinkage; use shared turn IDs when one request can own several replies.
 */
export function useScrolling(containerRef, messages) {
    const isRevealArmed = ref(false)
    const reveal = shallowRef(null)
    const spanHeight = ref(0)

    useResizeObserver(
        () => reveal.value?.elements ?? [],
        () => {
            const currentReveal = reveal.value
            if (currentReveal) spanHeight.value = measureSpan(currentReveal.elements)
        },
        { box: 'border-box' }
    )

    const tailSpace = computed(() => {
        const currentReveal = reveal.value
        if (!currentReveal) return 0

        const messageGrowth = spanHeight.value - currentReveal.initialSpan
        return Math.max(0, currentReveal.missingScrollRange - messageGrowth)
    })

    const resetReveal = () => {
        isRevealArmed.value = false
        reveal.value = null
    }

    const armReveal = () => {
        resetReveal()
        isRevealArmed.value = true
    }

    const cancelPendingReveal = () => {
        if (!isRevealArmed.value) return
        resetReveal()
    }

    watch(
        () => messages.value.length,
        async (messageCount, previousMessageCount) => {
            if (!isRevealArmed.value || messageCount <= previousMessageCount) return

            const targetIndex = messages.value.findIndex(
                (message, index) =>
                    index >= previousMessageCount && message.role === 'assistant'
            )
            if (targetIndex === -1) return

            await nextTick()
            if (!isRevealArmed.value) return

            const layout = measureReveal(containerRef.value, targetIndex)
            if (!layout) {
                if (import.meta.env.DEV) {
                    console.warn(
                        '[ChatComponent] No marked element found for the incoming message; bind getMessageAttributes(index) in your custom messages slot.'
                    )
                }
                resetReveal()
                return
            }

            spanHeight.value = layout.initialSpan
            reveal.value = layout
            await nextTick()

            if (!isRevealArmed.value) return
            isRevealArmed.value = false
            containerRef.value.scrollTop = layout.desiredScrollTop
        }
    )

    return {
        tailSpace,
        getMessageAttributes: (index) => ({ [MESSAGE_ATTRIBUTE]: String(index) }),
        armReveal,
        cancelPendingReveal,
        resetReveal
    }
}
