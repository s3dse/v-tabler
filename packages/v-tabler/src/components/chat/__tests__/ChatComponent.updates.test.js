import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import ChatComponent from '../ChatComponent.vue'
import ChatMessage from '../ChatMessage.vue'
import TypingIndicator from '../TypingIndicator.vue'

const mounted = []
afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
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
                messages: ({ messages }) =>
                    messages.map((message) =>
                        h(
                            'p',
                            {
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
    })
})
