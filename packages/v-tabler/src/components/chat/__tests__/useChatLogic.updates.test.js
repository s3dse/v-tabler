import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, watch } from 'vue'
import { useChatLogic } from '../useChatLogic.js'

function controlledHandler() {
    const started = Promise.withResolvers()
    const response = Promise.withResolvers()
    return {
        ...response,
        started: started.promise,
        handler: vi.fn((message, signal, updateMessage) => {
            started.resolve({ message, signal, updateMessage })
            return response.promise
        })
    }
}

afterEach(() => vi.restoreAllMocks())

describe('incremental AI replies', () => {
    it('leaves final-only response metadata unchanged', async () => {
        const response = {
            content: 'Final-only answer',
            requestState: 'streaming',
            id: 'existing-id'
        }
        const chat = useChatLogic({ aiHandler: async () => response })
        const { aiMessage } = await chat.sendMessage('Hello')
        expect(aiMessage.content).toBe(response.content)
        expect(aiMessage.requestState).toBe(response.requestState)
        expect(aiMessage.id).toBe(response.id)
        expect(aiMessage.requestError).toBeUndefined()
    })

    it('merges metadata, text snapshots and the final aggregate into one reactive reply', async () => {
        const turn = controlledHandler()
        const chat = useChatLogic({ aiHandler: turn.handler })
        const completion = chat.sendMessage('Hello')
        expect(chat.isTyping.value).toBe(true)
        expect(chat.isAwaitingResponse.value).toBe(true)
        const { updateMessage } = await turn.started
        const metadata = { filename: 'example.json' }
        updateMessage({ reference: metadata })
        const reply = chat.messages.value.at(-1)
        const timestamp = reply.timestamp
        expect(chat.isAwaitingResponse.value).toBe(false)
        expect(reply.content).toBe('')
        updateMessage({ content: 'Hello' })
        updateMessage({ content: 'Hello world.' })
        turn.resolve({ content: 'Hello world.', id: 'server-answer' })
        const result = await completion
        expect(result.aiMessage).toBe(reply)
        expect(chat.messages.value).toHaveLength(3)
        expect(reply.content).toBe('Hello world.')
        expect(reply.timestamp).toBe(timestamp)
        expect(reply.reference).toEqual(metadata)
        expect(reply.id).toBe('server-answer')
        expect(reply.requestState).toBe('complete')
        expect(chat.isTyping.value).toBe(false)
        updateMessage({ content: 'Late content' })
        expect(reply.content).toBe('Hello world.')
    })

    it('can complete from updates without a returned final response', async () => {
        const chat = useChatLogic({
            aiHandler: async (message, signal, updateMessage) =>
                updateMessage({ content: 'Finished.' })
        })
        const { aiMessage } = await chat.sendMessage('Hello')
        expect(aiMessage.content).toBe('Finished.')
        expect(aiMessage.requestState).toBe('complete')
        expect(chat.messages.value).toHaveLength(3)
    })

    it('stops accepting updates before post-completion focus callbacks run', async () => {
        const turn = controlledHandler()
        const chat = useChatLogic({
            aiHandler: turn.handler,
            onFocusInput: () => callbacks.updateMessage({ content: 'After completion' })
        })
        const completion = chat.sendMessage('Hello')
        const callbacks = await turn.started
        callbacks.updateMessage({ content: 'Partial' })
        turn.resolve({ content: 'Final answer' })
        expect((await completion).aiMessage.content).toBe('Final answer')
        expect(chat.messages.value.at(-1).requestState).toBe('complete')
    })

    it('does not publish completion before cancellation during UI cleanup', async () => {
        const turn = controlledHandler()
        const chat = useChatLogic({
            aiHandler: turn.handler,
            onFocusInput: () => chat.cancelCurrentRequest()
        })
        const completion = chat.sendMessage('Hello')
        const { updateMessage } = await turn.started
        updateMessage({ content: 'Partial' })
        const reply = chat.messages.value.at(-1)
        const states = []
        const stop = watch(
            () => reply.requestState,
            (state) => states.push(state),
            { flush: 'sync' }
        )
        turn.resolve({ content: 'Final text' })
        expect((await completion).aborted).toBe(true)
        expect(states).toEqual(['cancelled'])
        stop()
    })

    it('cancels before the first update without creating an assistant reply', async () => {
        const turn = controlledHandler()
        const chat = useChatLogic({ aiHandler: turn.handler })
        const completion = chat.sendMessage('Hello')
        const { signal, updateMessage } = await turn.started
        chat.cancelCurrentRequest()
        expect(signal.aborted).toBe(true)
        expect(chat.isTyping.value).toBe(false)
        updateMessage({ content: 'Late content' })
        turn.resolve({ content: 'Late final response' })
        expect((await completion).aborted).toBe(true)
        expect(chat.messages.value).toHaveLength(2)
    })

    it('rejects a second submission even before the handler starts', async () => {
        const turn = controlledHandler()
        const chat = useChatLogic({ aiHandler: turn.handler })
        const completion = chat.sendMessage('First')
        expect(await chat.sendMessage('Second')).toBeUndefined()
        await turn.started
        turn.resolve({ content: 'Only answer' })
        await completion
        expect(turn.handler).toHaveBeenCalledOnce()
        expect(chat.messages.value).toHaveLength(3)
    })

    it('keeps cancelled partial text and isolates a newer request from old callbacks and finally blocks', async () => {
        const first = controlledHandler()
        const second = controlledHandler()
        const focus = vi.fn()
        const chat = useChatLogic({
            aiHandler: vi
                .fn()
                .mockImplementationOnce(first.handler)
                .mockImplementationOnce(second.handler),
            onFocusInput: focus
        })
        const firstCompletion = chat.sendMessage('First')
        const original = await first.started
        original.updateMessage({ content: 'Partial answer' })
        const reply = chat.messages.value.at(-1)
        chat.cancelCurrentRequest()
        expect(reply.requestState).toBe('cancelled')
        const secondCompletion = chat.sendMessage('Second')
        const current = await second.started
        original.updateMessage({ content: 'Stale update' })
        first.resolve({ content: 'Stale final response' })
        expect((await firstCompletion).aborted).toBe(true)
        expect(reply.content).toBe('Partial answer')
        expect(chat.isTyping.value).toBe(true)
        expect(current.signal.aborted).toBe(false)
        expect(focus).not.toHaveBeenCalled()
        current.updateMessage({ content: 'Current answer' })
        second.resolve()
        await secondCompletion
        expect(chat.messages.value.at(-1).content).toBe('Current answer')
        expect(focus).toHaveBeenCalledOnce()
    })

    it.each(['clearChat', 'resetMessages'])(
        '%s aborts and ignores late work and queued scrolls',
        async (action) => {
            const turn = controlledHandler()
            const scroll = vi.fn()
            const chat = useChatLogic({ aiHandler: turn.handler, onScrollToBottom: scroll })
            const completion = chat.sendMessage('Hello')
            const { signal, updateMessage } = await turn.started
            scroll.mockClear()
            updateMessage({ content: 'Partial' })
            chat[action]()
            updateMessage({ content: 'Late' })
            turn.resolve({ content: 'Late final' })
            expect((await completion).aborted).toBe(true)
            await nextTick()
            expect(signal.aborted).toBe(true)
            expect(chat.messages.value.map((message) => message.content)).toEqual(
                action === 'clearChat' ? ['Hello! How can I help you today?'] : []
            )
            expect(scroll).not.toHaveBeenCalled()
        }
    )

    it('does not start a handler cancelled while clearing the input', async () => {
        const handler = vi.fn()
        const chat = useChatLogic({ aiHandler: handler })
        const completion = chat.sendMessage('Hello')
        chat.clearChat()
        expect((await completion).aborted).toBe(true)
        expect(handler).not.toHaveBeenCalled()
    })

    it('does not cancel another composable instance', async () => {
        const first = controlledHandler()
        const second = controlledHandler()
        const firstChat = useChatLogic({ aiHandler: first.handler })
        const secondChat = useChatLogic({ aiHandler: second.handler })
        const firstCompletion = firstChat.sendMessage('First')
        const secondCompletion = secondChat.sendMessage('Second')
        const [original, current] = await Promise.all([first.started, second.started])
        firstChat.cancelCurrentRequest()
        expect(original.signal.aborted).toBe(true)
        expect(current.signal.aborted).toBe(false)
        first.resolve()
        second.resolve({ content: 'Independent answer' })
        await Promise.all([firstCompletion, secondCompletion])
        expect(secondChat.messages.value.at(-1).content).toBe('Independent answer')
    })

    it('marks a partial reply as failed without duplicating it or exposing exception text', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const failure = new Error('PRIVATE_DETAIL')
        const chat = useChatLogic({
            aiHandler: async (message, signal, updateMessage) => {
                updateMessage({ content: 'Partial' })
                throw failure
            }
        })
        const { errorMessage, error } = await chat.sendMessage('Hello')
        expect(error).toBe(failure)
        expect(chat.messages.value).toHaveLength(3)
        expect(errorMessage).toBe(chat.messages.value.at(-1))
        expect(errorMessage.content).toBe('Partial')
        expect(errorMessage.requestState).toBe('error')
        expect(errorMessage.requestError).toContain('error processing your request')
        expect(errorMessage.requestError).not.toContain('PRIVATE_DETAIL')
    })

    it('treats handler AbortError as cancellation of a partial reply', async () => {
        const chat = useChatLogic({
            aiHandler: async (message, signal, updateMessage) => {
                updateMessage({ content: 'Partial' })
                throw new DOMException('Stopped', 'AbortError')
            }
        })
        expect((await chat.sendMessage('Hello')).aborted).toBe(true)
        expect(chat.messages.value.at(-1).requestState).toBe('cancelled')
        expect(chat.messages.value.at(-1).requestError).toBeUndefined()
    })

    it.each([
        null,
        [],
        'delta',
        { content: 123 },
        { role: 'user' },
        { timestamp: new Date() },
        { requestState: 'complete' },
        { requestError: 'Unsafe error' },
        JSON.parse('{"__proto__":{"polluted":true}}')
    ])('fails safely for an invalid message patch: %j', async (patch) => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const chat = useChatLogic({
            aiHandler: async (message, signal, updateMessage) => updateMessage(patch)
        })
        const result = await chat.sendMessage('Hello')
        expect(result.error).toBeInstanceOf(TypeError)
        expect(result.errorMessage.role).toBe('assistant')
        expect(result.errorMessage.content).toContain('error processing your request')
        expect(chat.messages.value).toHaveLength(3)
        expect(chat.isTyping.value).toBe(false)
    })

    it('rejects protected fields in the final patch as well', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const chat = useChatLogic({
            aiHandler: async (message, signal, updateMessage) => {
                updateMessage({ content: 'Partial' })
                return { role: 'user', content: 'Forged' }
            }
        })
        const { errorMessage } = await chat.sendMessage('Hello')
        expect(errorMessage.content).toBe('Partial')
        expect(errorMessage.role).toBe('assistant')
        expect(errorMessage.requestState).toBe('error')
    })

    it.each([undefined, 'a string', {}, { content: 123 }])(
        'rejects invalid final-only responses: %j',
        async (response) => {
            vi.spyOn(console, 'error').mockImplementation(() => {})
            const chat = useChatLogic({ aiHandler: async () => response })
            const { error } = await chat.sendMessage('Hello')
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toContain('an object with string content')
            expect(chat.messages.value.at(-1).content).toContain('error processing your request')
        }
    )
})
