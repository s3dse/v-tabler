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

const mountScrolling = ({ markMessages = true } = {}) => {
    const messages = ref([{ role: 'assistant', content: 'Initial' }])
    const viewportHeight = ref(VIEWPORT_HEIGHT)
    const wrapper = mount({
        setup() {
            const container = ref(null)
            const scrolling = useScrolling(container, messages)
            const messageAttributes = (index) =>
                markMessages ? scrolling.getMessageAttributes(index) : {}
            return { container, messages, messageAttributes, ...scrolling }
        },
        template: `
            <div ref="container">
                <div
                    v-for="(message, index) in messages"
                    :key="index"
                    v-bind="messageAttributes(index)"
                >{{ message.content }}</div>
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
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this === container) return createRect({ top: 0, height: viewportHeight.value })

        const messageIndex = this.getAttribute('data-chat-message')
        if (messageIndex === null) return createRect({ top: 0 })
        const messageOffset = Number(messageIndex) * MESSAGE_TOP_STEP
        return createRect({
            top: PADDING_TOP + messageOffset - container.scrollTop
        })
    })

    return { container, messages, viewportHeight, wrapper }
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
    it('pins the newest user message when an answer is added in the same tick', async () => {
        const { container, messages, wrapper } = mountScrolling()

        messages.value.push(
            { role: 'user', content: 'Question' },
            { role: 'assistant', content: 'Answer' }
        )
        await flushPromises()

        expect(wrapper.vm.pinHeight).toBe(EXPECTED_PIN_HEIGHT)
        expect(container.scrollTop).toBe(EXPECTED_SCROLL_TOP)
        expect(resizeObservers.at(-1).observe).toHaveBeenCalledWith(container, {
            box: 'border-box'
        })
    })

    it('recalculates the pin height on resize without restoring the scroll position', async () => {
        const { container, messages, viewportHeight, wrapper } = mountScrolling()
        messages.value.push({ role: 'user', content: 'Question' })
        await flushPromises()
        container.scrollTop = 42

        viewportHeight.value = RESIZED_VIEWPORT_HEIGHT
        resizeObservers.at(-1).emit()
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
        expect(container.scrollTop).toBe(0)
    })

    it('does not finish pinning after the pin is reset during nextTick', async () => {
        const { container, messages, wrapper } = mountScrolling()

        messages.value.push({ role: 'user', content: 'Question' })
        await wrapper.vm.$nextTick()
        wrapper.vm.resetPin()
        await flushPromises()

        expect(wrapper.vm.pinHeight).toBe(0)
        expect(container.scrollTop).toBe(0)
    })
})
