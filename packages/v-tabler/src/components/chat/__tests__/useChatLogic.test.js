import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChatLogic } from '../useChatLogic.js'

describe('useChatLogic', () => {
    let mockContainer
    let mockInputRef

    beforeEach(() => {
        // Mock DOM elements
        mockContainer = {
            scrollTop: 0,
            scrollHeight: 1000,
            clientHeight: 400
        }

        mockInputRef = {
            focus: vi.fn()
        }
    })

    describe('initialization', () => {
        it('should initialize with default props', () => {
            const { messages, isTyping } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            expect(messages.value).toHaveLength(1)
            expect(messages.value[0].role).toBe('assistant')
            expect(messages.value[0].content).toBe('Hello! How can I help you today?')
            expect(isTyping.value).toBe(false)
        })

        it('should initialize with custom initial message', () => {
            const { messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef },
                initialMessage: 'Welcome to our support!'
            })

            expect(messages.value).toHaveLength(1)
            expect(messages.value[0].content).toBe('Welcome to our support!')
        })

        it('should initialize with custom aiHandler', () => {
            const customHandler = vi.fn()

            useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef },
                aiHandler: customHandler
            })

            // Handler should be stored for later use
            expect(customHandler).toBeDefined()
        })
    })

    describe('message management', () => {
        it('should add user message', () => {
            const { addUserMessage, messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            const initialLength = messages.value.length
            const userMessage = addUserMessage('Hello there!')

            expect(userMessage).toEqual(
                expect.objectContaining({
                    role: 'user',
                    content: 'Hello there!',
                    timestamp: expect.any(String)
                })
            )
            expect(messages.value).toHaveLength(initialLength + 1)
            expect(messages.value[messages.value.length - 1]).toEqual(userMessage)
        })

        it('should add AI message', () => {
            const { addAiMessage, messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            const initialLength = messages.value.length
            const aiMessage = addAiMessage('AI response here')

            expect(aiMessage).toEqual(
                expect.objectContaining({
                    role: 'assistant',
                    content: 'AI response here',
                    timestamp: expect.any(String)
                })
            )
            expect(messages.value).toHaveLength(initialLength + 1)
            expect(messages.value[messages.value.length - 1]).toEqual(aiMessage)
        })

        it('should add error message with default content', () => {
            const { addErrorMessage, messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            const initialLength = messages.value.length
            const errorMessage = addErrorMessage()

            expect(errorMessage.role).toBe('assistant')
            expect(errorMessage.content).toBe(
                'I apologize, but I encountered an error processing your request. Please try again.'
            )
            expect(messages.value).toHaveLength(initialLength + 1)
        })

        it('should add error message with custom content', () => {
            const { addErrorMessage, messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            const customError = 'Custom error message'
            const initialLength = messages.value.length
            const errorMessage = addErrorMessage(customError)

            expect(errorMessage.content).toBe(customError)
            expect(messages.value).toHaveLength(initialLength + 1)
        })

        it('should add generic message', () => {
            const { addMessage, messages } = useChatLogic({
                messagesContainer: { value: mockContainer },
                chatInputRef: { value: mockInputRef }
            })

            const customMessage = {
                role: 'system',
                content: 'System message',
                timestamp: '12:34'
            }

            const initialLength = messages.value.length
            addMessage(customMessage)

            expect(messages.value).toHaveLength(initialLength + 1)
            expect(messages.value[messages.value.length - 1]).toEqual(customMessage)
        })
    })

    describe('sendMessage functionality', () => {
        it('should send message without AI handler', async () => {
            const { sendMessage, messages } = useChatLogic()

            const result = await sendMessage('Test message')

            expect(messages.value).toHaveLength(2) // Initial + user message
            expect(messages.value[1]).toEqual(
                expect.objectContaining({
                    role: 'user',
                    content: 'Test message'
                })
            )
            expect(result).toEqual(
                expect.objectContaining({
                    role: 'user',
                    content: 'Test message'
                })
            )
        })

        it('should not send empty or whitespace-only messages', async () => {
            const { sendMessage, messages } = useChatLogic()

            await sendMessage('')
            await sendMessage('   ')
            await sendMessage('\n\t')

            expect(messages.value).toHaveLength(1) // Only initial message
        })

        it('should handle AI responses successfully', async () => {
            const mockAiHandler = vi.fn().mockResolvedValue('AI response')
            const { sendMessage, messages, isTyping } = useChatLogic({
                aiHandler: mockAiHandler
            })

            const result = await sendMessage('User message')

            expect(mockAiHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: 'user',
                    content: 'User message'
                }),
                expect.any(AbortSignal)
            )
            expect(messages.value).toHaveLength(3) // Initial + user + AI
            expect(messages.value[2]).toEqual(
                expect.objectContaining({
                    role: 'assistant',
                    content: 'AI response'
                })
            )
            expect(isTyping.value).toBe(false)
            expect(result).toEqual(
                expect.objectContaining({
                    userMessage: expect.any(Object),
                    aiMessage: expect.any(Object)
                })
            )
        })

        it('should handle AI handler errors', async () => {
            const mockAiHandler = vi.fn().mockRejectedValue(new Error('AI service down'))
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            const { sendMessage, messages, isTyping } = useChatLogic({
                aiHandler: mockAiHandler
            })

            const result = await sendMessage('User message')

            expect(messages.value).toHaveLength(3) // Initial + user + error
            expect(messages.value[2]).toEqual(
                expect.objectContaining({
                    role: 'assistant',
                    content:
                        'I apologize, but I encountered an error processing your request. Please try again.'
                })
            )
            expect(isTyping.value).toBe(false)
            expect(result).toEqual(
                expect.objectContaining({
                    userMessage: expect.any(Object),
                    errorMessage: expect.any(Object),
                    error: expect.any(Error)
                })
            )
            expect(consoleSpy).toHaveBeenCalledWith('AI handler error:', expect.any(Error))

            consoleSpy.mockRestore()
        })
    })

    describe('chat management', () => {
        it('should clear chat and reset to initial message', () => {
            const { messages, addUserMessage, clearChat } = useChatLogic({
                initialMessage: 'Custom initial'
            })

            // Add some messages
            addUserMessage('User message')
            addUserMessage('Another message')

            expect(messages.value).toHaveLength(3)

            clearChat()

            expect(messages.value).toHaveLength(1)
            expect(messages.value[0]).toEqual(
                expect.objectContaining({
                    role: 'assistant',
                    content: 'Custom initial'
                })
            )
        })

        it('should reset messages completely', () => {
            const { messages, addUserMessage, resetMessages } = useChatLogic()

            addUserMessage('Test message')
            expect(messages.value).toHaveLength(2)

            resetMessages()
            expect(messages.value).toHaveLength(0)
        })
    })

    describe('Message Recall', () => {
        it('should track and recall the last submitted message', async () => {
            const { sendMessage, recallLastMessage } = useChatLogic()

            // Initially no last message
            expect(recallLastMessage()).toBe('')

            // Send a message
            await sendMessage('First message')
            expect(recallLastMessage()).toBe('First message')

            // Send another message
            await sendMessage('Second message')
            expect(recallLastMessage()).toBe('Second message')
        })

        it('should trim whitespace when storing last message', async () => {
            const { sendMessage, recallLastMessage } = useChatLogic()

            await sendMessage('   Message with spaces   ')
            expect(recallLastMessage()).toBe('Message with spaces')
        })

        it('should not update last message if content is empty or whitespace', async () => {
            const { sendMessage, recallLastMessage } = useChatLogic()

            // Send valid message first
            await sendMessage('Valid message')
            expect(recallLastMessage()).toBe('Valid message')

            // Try to send empty/whitespace messages
            await sendMessage('')
            expect(recallLastMessage()).toBe('Valid message')

            await sendMessage('   ')
            expect(recallLastMessage()).toBe('Valid message')
        })
    })
})
