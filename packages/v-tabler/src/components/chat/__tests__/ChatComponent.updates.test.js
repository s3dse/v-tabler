import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import ChatComponent from '../ChatComponent.vue'
import ChatMessage from '../ChatMessage.vue'
import TypingIndicator from '../TypingIndicator.vue'
import { useScrolling } from '../useScrolling.js'

const mounted = []
const resizeObservers = []
const VIEWPORT_HEIGHT = 400
const CONTENT_HEIGHT = 500
const INITIAL_SCROLL_TOP = 100
const MESSAGE_TOP_STEP = 100
const MESSAGE_ELEMENT_HEIGHT = 40
const MESSAGE_ELEMENT_GAP = 16
const INCOMING_MESSAGE_INDEX = 2
const INCOMING_MESSAGE_TOP = 300

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

beforeEach(() => {
    resizeObservers.splice(0)
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

async function startChat(props = {}, slots = {}) {
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
    wrapper.findComponent({ name: 'ChatInput' }).vm.$emit('submit', 'Hello')
    return { wrapper, ...response, ...(await started.promise) }
}

const createRect = ({ top, height }) => ({ top, bottom: top + height, height })

function configureRevealLayout(wrapper, onMessageMeasure = () => {}) {
    const container = wrapper.get('[data-chat-message]').element.parentElement
    const elementRectsByMessage = new Map()

    Object.defineProperties(container, {
        clientHeight: { configurable: true, value: VIEWPORT_HEIGHT },
        scrollHeight: { configurable: true, value: CONTENT_HEIGHT }
    })
    container.scrollTop = INITIAL_SCROLL_TOP
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this === container) return createRect({ top: 0, height: VIEWPORT_HEIGHT })

        const messageIndex = this.getAttribute('data-chat-message')
        if (messageIndex === null) return createRect({ top: 0, height: 0 })

        onMessageMeasure()
        const messageElements = [
            ...container.querySelectorAll(`[data-chat-message="${messageIndex}"]`)
        ]
        const elementIndex = messageElements.indexOf(this)
        const defaultRect = {
            top:
                (Number(messageIndex) + 1) * MESSAGE_TOP_STEP +
                elementIndex * (MESSAGE_ELEMENT_HEIGHT + MESSAGE_ELEMENT_GAP),
            height: MESSAGE_ELEMENT_HEIGHT
        }
        const elementRect = elementRectsByMessage.get(messageIndex)?.[elementIndex] ?? defaultRect
        return createRect(elementRect)
    })

    return {
        container,
        setMessageElementRects: (messageIndex, elementRects) => {
            elementRectsByMessage.set(String(messageIndex), elementRects)
        }
    }
}

describe('useScrolling', () => {
    it('reveals the first assistant message when several are added in one tick', async () => {
        const messages = ref([
            { role: 'assistant', content: 'Initial' },
            { role: 'user', content: 'Question' }
        ])
        const wrapper = mount({
            setup() {
                const container = ref(null)
                return { container, messages, ...useScrolling(container, messages) }
            },
            template: `
                <div ref="container">
                    <div
                        v-for="(message, index) in messages"
                        :key="index"
                        v-bind="getMessageAttributes(index)"
                    >{{ message.content }}</div>
                    <div v-if="tailSpace" :style="{ height: tailSpace + 'px' }"></div>
                </div>
            `
        })
        mounted.push(wrapper)
        const { container } = configureRevealLayout(wrapper)

        wrapper.vm.armReveal()
        messages.value.push(
            { role: 'assistant', content: 'First answer' },
            { role: 'assistant', content: 'Second answer' }
        )
        await flushPromises()

        const activeResizeObserver = resizeObservers.at(-1)
        expect(container.scrollTop).toBe(400)
        expect(activeResizeObserver.observe).toHaveBeenCalledTimes(1)
        expect(activeResizeObserver.observe.mock.calls[0][0].dataset.chatMessage).toBe(
            String(INCOMING_MESSAGE_INDEX)
        )
    })
})

describe('ChatComponent incremental replies with the real composable', () => {
    it('shrinks the reveal spacer as the incoming reply grows without moving the viewport', async () => {
        const turn = await startChat()
        const { container, setMessageElementRects } = configureRevealLayout(turn.wrapper)

        turn.updateMessage({ content: 'Partial' })
        await flushPromises()

        expect(container.lastElementChild.style.height).toBe('300px')
        expect(container.scrollTop).toBe(400)
        const activeResizeObserver = resizeObservers.at(-1)
        const messageElements = container.querySelectorAll(
            `[data-chat-message="${INCOMING_MESSAGE_INDEX}"]`
        )
        expect(activeResizeObserver.observe).toHaveBeenCalledWith(
            messageElements.item(0),
            { box: 'border-box' }
        )

        container.dispatchEvent(new Event('wheel', { bubbles: true }))
        await nextTick()

        expect(container.lastElementChild.style.height).toBe('300px')
        expect(activeResizeObserver.disconnect).not.toHaveBeenCalled()

        setMessageElementRects(INCOMING_MESSAGE_INDEX, [
            { top: INCOMING_MESSAGE_TOP, height: 140 }
        ])
        activeResizeObserver.emit()
        await nextTick()

        expect(container.lastElementChild.style.height).toBe('200px')
        expect(container.scrollTop).toBe(400)

        turn.resolve()
        await flushPromises()
    })

    it('reveals a final-only reply after rendering enough trailing space', async () => {
        const turn = await startChat()
        const typingIndicatorVisibilityDuringMeasurement = []
        const { container } = configureRevealLayout(turn.wrapper, () => {
            typingIndicatorVisibilityDuringMeasurement.push(
                turn.wrapper.findComponent(TypingIndicator).exists()
            )
        })

        turn.resolve({ content: 'Final answer' })
        await flushPromises()

        expect(typingIndicatorVisibilityDuringMeasurement.length).toBeGreaterThan(0)
        expect(typingIndicatorVisibilityDuringMeasurement).not.toContain(true)
        expect(container.lastElementChild.style.height).toBe('300px')
        expect(container.scrollTop).toBe(400)
    })

    it('does not reveal a reply after the user scrolls while waiting', async () => {
        const turn = await startChat()
        const { container } = configureRevealLayout(turn.wrapper)

        container.dispatchEvent(new Event('wheel', { bubbles: true }))
        turn.updateMessage({ content: 'Partial' })
        await flushPromises()

        expect(container.scrollTop).toBe(100)
        expect(container.lastElementChild.matches('[data-chat-message]')).toBe(true)

        turn.resolve()
        await flushPromises()
    })

    it('warns when a custom messages slot does not mark its messages', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const turn = await startChat(
            {},
            {
                messages: ({ messages }) =>
                    messages.map((message) => h('p', {}, message.content))
            }
        )

        turn.updateMessage({ content: 'Partial' })
        await flushPromises()

        expect(warning).toHaveBeenCalledWith(
            '[ChatComponent] No marked element found for the incoming message; bind getMessageAttributes(index) in your custom messages slot.'
        )

        turn.resolve()
        await flushPromises()
    })

    it('tracks the combined span of multiple elements for one message', async () => {
        const turn = await startChat(
            {},
            {
                messages: ({ messages, getMessageAttributes }) =>
                    messages.flatMap((message, index) =>
                        ['summary', 'detail'].map((part) =>
                            h(
                                'p',
                                {
                                    ...getMessageAttributes(index),
                                    key: `${index}-${part}`,
                                    'data-part': part
                                },
                                message.content
                            )
                        )
                    )
            }
        )
        const { container, setMessageElementRects } = configureRevealLayout(turn.wrapper)

        turn.updateMessage({ content: 'Partial' })
        await flushPromises()

        const activeResizeObserver = resizeObservers.at(-1)
        const incomingElements = [
            ...container.querySelectorAll(
                `[data-chat-message="${INCOMING_MESSAGE_INDEX}"]`
            )
        ]
        expect(container.scrollTop).toBe(400)
        expect(container.lastElementChild.style.height).toBe('300px')
        expect(activeResizeObserver.observe.mock.calls.map(([element]) => element)).toEqual(
            incomingElements
        )

        setMessageElementRects(INCOMING_MESSAGE_INDEX, [
            { top: INCOMING_MESSAGE_TOP, height: MESSAGE_ELEMENT_HEIGHT },
            {
                top: INCOMING_MESSAGE_TOP + MESSAGE_ELEMENT_HEIGHT + MESSAGE_ELEMENT_GAP,
                height: 100
            }
        ])
        activeResizeObserver.emit()
        await nextTick()

        expect(container.lastElementChild.style.height).toBe('240px')
        expect(container.scrollTop).toBe(400)

        turn.resolve()
        await flushPromises()
    })

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
