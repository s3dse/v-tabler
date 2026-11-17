import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import ChatComponent from '../ChatComponent.vue'
import ChatMessage from '../ChatMessage.vue'
import TypingIndicator from '../TypingIndicator.vue'

const mounted = []
const resizeObservers = []
const VIEWPORT_HEIGHT = 400
const PADDING_TOP = 10
const PADDING_BOTTOM = 20
const MESSAGE_TOP_STEP = 100
const FIRST_QUESTION_INDEX = 1
const SECOND_QUESTION_INDEX = 3
const FITTING_CONTENT_END = 250
const OVERFLOWING_CONTENT_END = 450
const FIRST_QUESTION_SCROLL_TOP = FIRST_QUESTION_INDEX * MESSAGE_TOP_STEP
const SECOND_QUESTION_SCROLL_TOP = SECOND_QUESTION_INDEX * MESSAGE_TOP_STEP
const FIRST_PIN_HEIGHT =
    FIRST_QUESTION_SCROLL_TOP + VIEWPORT_HEIGHT - PADDING_TOP - PADDING_BOTTOM
const SECOND_PIN_HEIGHT =
    SECOND_QUESTION_SCROLL_TOP + VIEWPORT_HEIGHT - PADDING_TOP - PADDING_BOTTOM

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

const observerFor = (target) =>
    resizeObservers.find((observer) =>
        observer.observe.mock.calls.some(([element]) => element === target)
    )

beforeEach(() => {
    resizeObservers.splice(0)
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

const createRect = ({ top, height = 40 }) => ({ top, bottom: top + height, height })

function configurePinLayout(wrapper) {
    const contentEnd = wrapper.get('[data-chat-content-end]').element
    const contentArea = contentEnd.parentElement
    const pinArea = contentArea.parentElement
    const container = pinArea.parentElement
    const contentEndOffset = ref(FITTING_CONTENT_END)
    container.style.paddingTop = `${PADDING_TOP}px`
    container.style.paddingBottom = `${PADDING_BOTTOM}px`
    Object.defineProperty(container, 'clientHeight', {
        configurable: true,
        value: VIEWPORT_HEIGHT
    })
    container.scrollTo = vi.fn(({ top }) => {
        container.scrollTop = top
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this === container) return createRect({ top: 0, height: VIEWPORT_HEIGHT })

        if (this === contentEnd) {
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

    return { container, contentArea, contentEndOffset, pinArea }
}

async function startChat(props = {}, slots = {}, { withLayout = false } = {}) {
    const started = Promise.withResolvers()
    const response = Promise.withResolvers()
    const wrapper = mount(ChatComponent, {
        props: {
            ...props,
            aiHandler: (message, signal, updateMessage) => {
                started.resolve({ message, signal, updateMessage })
                return response.promise
            }
        },
        slots
    })
    mounted.push(wrapper)
    if (props.floating) await wrapper.get('button').trigger('click')
    const layout = withLayout ? configurePinLayout(wrapper) : null
    wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('submit', 'Hello')
    return { wrapper, layout, ...response, ...(await started.promise) }
}

describe('ChatComponent question pinning with the real composable', () => {
    it('arms the submitted question and renders the CSS-filled column', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()

        const { container, contentArea, pinArea } = turn.layout
        expect(container.scrollTop).toBe(0)
        expect(container.scrollTo).not.toHaveBeenCalled()
        expect(pinArea.style.minHeight).toBe(`${FIRST_PIN_HEIGHT}px`)
        expect([...pinArea.classList]).toEqual(
            expect.arrayContaining(['flex', 'flex-col', 'min-w-0'])
        )
        expect(contentArea.classList).toContain('gap-4')
        expect(pinArea.lastElementChild.classList).toContain('flex-1')
        expect(pinArea.lastElementChild.getAttribute('aria-hidden')).toBe('true')
        expect(observerFor(container).observe).toHaveBeenCalledWith(container, {
            box: 'border-box'
        })
        expect(observerFor(contentArea).observe).toHaveBeenCalledWith(contentArea, {
            box: 'border-box'
        })

        turn.resolve({ content: 'Done' })
        await flushPromises()
    })

    it('pins once when a streaming answer overflows', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, contentArea, contentEndOffset, pinArea } = turn.layout

        turn.updateMessage({ content: 'Partial' })
        contentEndOffset.value = OVERFLOWING_CONTENT_END
        observerFor(contentArea).emit()
        await flushPromises()

        expect(container.scrollTo).toHaveBeenCalledOnce()
        expect(container.scrollTo).toHaveBeenCalledWith({
            top: FIRST_QUESTION_SCROLL_TOP,
            behavior: 'smooth'
        })
        expect(pinArea.style.minHeight).toBe(`${FIRST_PIN_HEIGHT}px`)

        contentEndOffset.value += MESSAGE_TOP_STEP
        observerFor(contentArea).emit()
        turn.resolve({ content: 'Done' })
        await flushPromises()
        expect(container.scrollTo).toHaveBeenCalledOnce()
    })

    it('does not pin after the user scrolls while the pin is pending', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, contentArea, contentEndOffset } = turn.layout

        container.dispatchEvent(new Event('wheel', { bubbles: true }))
        contentEndOffset.value = OVERFLOWING_CONTENT_END
        observerFor(contentArea).emit()

        expect(container.scrollTo).not.toHaveBeenCalled()
        turn.resolve({ content: 'Done' })
        await flushPromises()
    })

    it('does not scroll or change the pin for a final-only answer', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, pinArea } = turn.layout
        container.scrollTop = 42

        turn.resolve({ content: 'Final answer' })
        await flushPromises()

        expect(container.scrollTop).toBe(42)
        expect(container.scrollTo).not.toHaveBeenCalled()
        expect(pinArea.style.minHeight).toBe(`${FIRST_PIN_HEIGHT}px`)
        expect(turn.wrapper.findComponent(TypingIndicator).exists()).toBe(false)
    })

    it('pins a final-only answer that overflows on arrival', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, contentEndOffset } = turn.layout
        contentEndOffset.value = OVERFLOWING_CONTENT_END

        turn.resolve({ content: 'Long final answer' })
        await flushPromises()

        expect(container.scrollTo).toHaveBeenCalledOnce()
        expect(container.scrollTo).toHaveBeenCalledWith({
            top: FIRST_QUESTION_SCROLL_TOP,
            behavior: 'smooth'
        })
    })

    it('does not pin when content grows after the turn has completed', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, contentArea, contentEndOffset } = turn.layout
        turn.resolve({ content: 'Short final answer' })
        await flushPromises()

        contentEndOffset.value = OVERFLOWING_CONTENT_END
        observerFor(contentArea).emit()

        expect(container.scrollTo).not.toHaveBeenCalled()
    })

    it('does not scroll or clear the pin when the request is cancelled', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()
        const { container, pinArea } = turn.layout
        container.scrollTop = 42

        turn.wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('cancel')
        await nextTick()

        expect(container.scrollTop).toBe(42)
        expect(container.scrollTo).not.toHaveBeenCalled()
        expect(pinArea.style.minHeight).toBe(`${FIRST_PIN_HEIGHT}px`)
        expect(turn.signal.aborted).toBe(true)

        turn.resolve()
        await flushPromises()
    })

    it('keeps the previous pin height until the next question takes over', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        turn.resolve({ content: 'Short answer' })
        await flushPromises()
        const { container, pinArea } = turn.layout

        turn.wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('submit', 'Next question')
        expect(pinArea.style.minHeight).toBe(`${FIRST_PIN_HEIGHT}px`)
        await flushPromises()

        expect(pinArea.style.minHeight).toBe(`${SECOND_PIN_HEIGHT}px`)
        expect(container.scrollTo).not.toHaveBeenCalled()
    })

    it('clears the pin when the chat is cleared', async () => {
        const turn = await startChat({}, {}, { withLayout: true })
        await flushPromises()

        await turn.wrapper.get('button[title="Clear Chat"]').trigger('click')

        expect(turn.layout.pinArea.style.minHeight).toBe('0px')
        turn.resolve()
        await flushPromises()
    })

    it('warns when a custom messages slot does not mark the submitted question', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const turn = await startChat(
            {},
            {
                messages: ({ messages }) =>
                    messages.map((message) => h('p', {}, message.content))
            }
        )

        await flushPromises()
        expect(warning).toHaveBeenCalledWith(
            '[ChatComponent] No marked element found for the submitted question; bind getMessageAttributes(index) in your custom messages slot.'
        )

        turn.resolve({ content: 'Done' })
        await flushPromises()
    })
})

describe('ChatComponent incremental replies with the real composable', () => {
    it.each([{ variant: 'embedded' }, { floating: true }])(
        'renders one reply before completion in %j',
        async (props) => {
            const turn = await startChat(props)
            expect(turn.wrapper.findComponent(TypingIndicator).exists()).toBe(true)
            turn.updateMessage({ reference: 'metadata-before-text' })
            await nextTick()
            const reply = turn.wrapper.findAllComponents(ChatMessage).at(-1)
            const element = reply.element
            expect(reply.get('[role="status"]').text()).toBe('Responding…')
            expect(turn.wrapper.findComponent(TypingIndicator).exists()).toBe(false)
            turn.updateMessage({ content: 'Hello' })
            await nextTick()
            expect(reply.text()).toContain('Hello')
            expect(reply.props('message').reference).toBe('metadata-before-text')
            expect(turn.wrapper.findComponent({ name: 'ChatInput' }).props('isTyping')).toBe(true)
            turn.updateMessage({ content: 'Hello world.' })
            turn.resolve({ content: 'Hello world.', id: 'server-answer' })
            await flushPromises()
            expect(turn.wrapper.findAllComponents(ChatMessage)).toHaveLength(3)
            expect(reply.element).toBe(element)
            expect(reply.get('p').text()).toBe('Hello world.')
            expect(reply.props('message').requestState).toBe('complete')
            expect(turn.wrapper.findComponent({ name: 'ChatInput' }).props('isTyping')).toBe(false)
        }
    )

    it('updates metadata and lifecycle in a custom message slot', async () => {
        const turn = await startChat(
            {},
            {
                messages: ({ messages, getMessageAttributes }) =>
                    messages.map((message, index) =>
                        h(
                            'p',
                            {
                                ...getMessageAttributes(index),
                                'data-reference': message.reference,
                                'data-state': message.requestState
                            },
                            message.content
                        )
                    )
            }
        )
        turn.updateMessage({ reference: 'attachment', content: 'Partial' })
        await nextTick()
        expect(turn.wrapper.get('[data-reference="attachment"]').text()).toBe('Partial')
        turn.resolve()
        await flushPromises()
        expect(turn.wrapper.get('[data-reference="attachment"]').attributes('data-state')).toBe(
            'complete'
        )
    })

    it('keeps partial text and shows stopped status when the input cancels', async () => {
        const turn = await startChat()
        turn.updateMessage({ content: 'Partial' })
        turn.wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('cancel')
        await nextTick()
        expect(turn.signal.aborted).toBe(true)
        expect(turn.wrapper.get('[role="status"]').text()).toBe('Stopped')
        turn.updateMessage({ content: 'Late' })
        turn.resolve({ content: 'Late final' })
        await flushPromises()
        expect(turn.wrapper.findAllComponents(ChatMessage)).toHaveLength(3)
        expect(turn.wrapper.findAllComponents(ChatMessage).at(-1).get('p').text()).toBe('Partial')
    })

    it('renders safe failure on the same reply after partial output', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const turn = await startChat()
        turn.updateMessage({ content: 'Partial' })
        turn.reject(new Error('PRIVATE_DETAIL'))
        await flushPromises()
        expect(turn.wrapper.findAllComponents(ChatMessage)).toHaveLength(3)
        expect(turn.wrapper.get('[role="alert"]').text()).toContain('error processing your request')
        expect(turn.wrapper.text()).toContain('Partial')
        expect(turn.wrapper.text()).not.toContain('PRIVATE_DETAIL')
    })

    it('aborts on unmount and ignores late updates and completion', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const turn = await startChat()
        turn.updateMessage({ content: 'Partial' })
        await nextTick()
        const message = turn.wrapper.findAllComponents(ChatMessage).at(-1).props('message')
        turn.wrapper.unmount()
        expect(turn.signal.aborted).toBe(true)
        turn.updateMessage({ content: 'Late' })
        turn.resolve({ content: 'Late final' })
        await flushPromises()
        expect(message.content).toBe('Partial')
        expect(message.requestState).toBe('cancelled')
        expect(warning).not.toHaveBeenCalled()
    })
})
