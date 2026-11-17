import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import { useScrolling } from '../useScrolling.js'

const MESSAGE_TOP_STEP = 100
const VIEWPORT_HEIGHT = 400
const RESIZED_VIEWPORT_HEIGHT = 300
const PADDING_TOP = 10
const PADDING_BOTTOM = 20
const QUESTION_INDEX = 1
const FITTING_CONTENT_END = 250
const OVERFLOWING_CONTENT_END = 450
const EXPECTED_SCROLL_TOP = QUESTION_INDEX * MESSAGE_TOP_STEP
const EXPECTED_PIN_HEIGHT =
    EXPECTED_SCROLL_TOP + VIEWPORT_HEIGHT - PADDING_TOP - PADDING_BOTTOM
const EXPECTED_RESIZED_PIN_HEIGHT =
    EXPECTED_SCROLL_TOP + RESIZED_VIEWPORT_HEIGHT - PADDING_TOP - PADDING_BOTTOM
const mounted = []
const resizeObservers = []

class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback
        this.observe = vi.fn()
        this.disconnect = vi.fn()
        resizeObservers.push(this)
    }

    emit() {
        this.callback([])
    }
}

const createRect = ({ top, height = 40 }) => ({ top, bottom: top + height, height })

const observerFor = (target) =>
    resizeObservers.find((observer) =>
        observer.observe.mock.calls.some(([element]) => element === target)
    )

const mountScrolling = ({ markMessages = true } = {}) => {
    const messages = ref([{ role: 'assistant', content: 'Initial' }])
    const isTyping = ref(true)
    const viewportHeight = ref(VIEWPORT_HEIGHT)
    const contentEndOffset = ref(FITTING_CONTENT_END)
    const wrapper = mount({
        setup() {
            const container = ref(null)
            const contentEnd = ref(null)
            const scrolling = useScrolling(container, contentEnd, messages, isTyping)
            const messageAttributes = (index) =>
                markMessages ? scrolling.getMessageAttributes(index) : {}
            return { container, contentEnd, isTyping, messages, messageAttributes, ...scrolling }
        },
        template: `
            <div ref="container">
                <div>
                    <div>
                        <div
                            v-for="(message, index) in messages"
                            :key="index"
                            v-bind="messageAttributes(index)"
                        >{{ message.content }}</div>
                        <div ref="contentEnd" data-chat-content-end></div>
                    </div>
                </div>
            </div>
        `
    })
    mounted.push(wrapper)

    const container = wrapper.element
    container.style.paddingTop = `${PADDING_TOP}px`
    container.style.paddingBottom = `${PADDING_BOTTOM}px`
    Object.defineProperty(container, 'clientHeight', {
        configurable: true,
        get: () => viewportHeight.value
    })
    container.scrollTo = vi.fn(({ top }) => {
        container.scrollTop = top
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this === container) return createRect({ top: 0, height: viewportHeight.value })

        if (this.hasAttribute('data-chat-content-end')) {
            return createRect({
                top: PADDING_TOP + contentEndOffset.value - container.scrollTop,
                height: 0
            })
        }

        const messageIndex = this.getAttribute('data-chat-message')
        if (messageIndex === null) return createRect({ top: 0 })
        const messageOffset = Number(messageIndex) * MESSAGE_TOP_STEP
        return createRect({
            top: PADDING_TOP + messageOffset - container.scrollTop
        })
    })

    return {
        container,
        contentEnd: wrapper.get('[data-chat-content-end]').element,
        contentEndOffset,
        messages,
        viewportHeight,
        wrapper
    }
}

beforeEach(() => {
    resizeObservers.splice(0)
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('useScrolling', () => {
    it('arms the newest user message without scrolling while its answer fits', async () => {
        const { container, contentEnd, messages, wrapper } = mountScrolling()

        messages.value.push(
            { role: 'user', content: 'Question' },
            { role: 'assistant', content: 'Answer' }
        )
        await flushPromises()

        expect(wrapper.vm.pinHeight).toBe(EXPECTED_PIN_HEIGHT)
        expect(container.scrollTop).toBe(0)
        expect(container.scrollTo).not.toHaveBeenCalled()
        expect(observerFor(container).observe).toHaveBeenCalledWith(container, {
            box: 'border-box'
        })
        expect(observerFor(contentEnd.parentElement).observe).toHaveBeenCalledWith(
            contentEnd.parentElement,
            { box: 'border-box' }
        )
    })

    it.each([
        { reducedMotion: false, behavior: 'smooth' },
        { reducedMotion: true, behavior: 'instant' }
    ])(
        'pins once with $behavior scrolling when the answer crosses the viewport bottom',
        async ({ reducedMotion, behavior }) => {
            vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reducedMotion })))
            const { container, contentEnd, contentEndOffset, messages } = mountScrolling()
            messages.value.push({ role: 'user', content: 'Question' })
            await flushPromises()

            contentEndOffset.value = OVERFLOWING_CONTENT_END
            observerFor(contentEnd.parentElement).emit()
            await flushPromises()

            expect(container.scrollTo).toHaveBeenCalledOnce()
            expect(container.scrollTo).toHaveBeenCalledWith({
                top: EXPECTED_SCROLL_TOP,
                behavior
            })

            contentEndOffset.value += MESSAGE_TOP_STEP
            observerFor(contentEnd.parentElement).emit()
            expect(container.scrollTo).toHaveBeenCalledOnce()
        }
    )

    it('does not pin after user interaction cancels the pending pin', async () => {
        const { container, contentEnd, contentEndOffset, messages, wrapper } = mountScrolling()
        messages.value.push({ role: 'user', content: 'Question' })
        await flushPromises()

        wrapper.vm.cancelPendingPin()
        contentEndOffset.value = OVERFLOWING_CONTENT_END
        observerFor(contentEnd.parentElement).emit()

        expect(container.scrollTo).not.toHaveBeenCalled()
    })

    it('recalculates the pin height on resize without restoring the scroll position', async () => {
        const { container, messages, viewportHeight, wrapper } = mountScrolling()
        messages.value.push({ role: 'user', content: 'Question' })
        await flushPromises()
        container.scrollTop = 42

        viewportHeight.value = RESIZED_VIEWPORT_HEIGHT
        observerFor(container).emit()
        await flushPromises()

        expect(wrapper.vm.pinHeight).toBe(EXPECTED_RESIZED_PIN_HEIGHT)
        expect(container.scrollTop).toBe(42)
    })

    it('warns and clears the pin when the submitted question is not marked', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { container, messages, wrapper } = mountScrolling({ markMessages: false })

        messages.value.push({ role: 'user', content: 'Question' })
        await flushPromises()

        expect(warning).toHaveBeenCalledWith(
            '[ChatComponent] No marked element found for the submitted question; bind getMessageAttributes(index) in your custom messages slot.'
        )
        expect(wrapper.vm.pinHeight).toBe(0)
        expect(container.scrollTo).not.toHaveBeenCalled()
    })

    it('does not finish pinning after the pin is reset during nextTick', async () => {
        const { container, contentEndOffset, messages, wrapper } = mountScrolling()
        contentEndOffset.value = OVERFLOWING_CONTENT_END

        messages.value.push({ role: 'user', content: 'Question' })
        await wrapper.vm.$nextTick()
        wrapper.vm.resetPin()
        await flushPromises()

        expect(wrapper.vm.pinHeight).toBe(0)
        expect(container.scrollTo).not.toHaveBeenCalled()
    })
})
