import { ref, nextTick } from 'vue'

/**
 * Composable for chat logic and message management
 * Handles messages, AI integration, typing states, and scrolling
 */
export function useChatLogic(options = {}) {
    const {
        initialMessage = 'Hello! How can I help you today?',
        aiHandler = null,
        messagesContainer = null,
        chatInputRef = null,
        onScrollToBottom = null,
        onFocusInput = null
    } = options

    const messages = ref([
        {
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date()
        }
    ])
    const isTyping = ref(false)

    const createTimestamp = () => {
        return new Date()
    }

    const createMessage = (role, { content, ...extraData }) => ({
        role,
        content,
        ...extraData,
        timestamp: createTimestamp()
    })

    const addMessage = message => {
        messages.value.push(message)
    }

    const isFirstUserMessage = () => {
        return messages.value.some(msg => msg.role === 'user') === false
    }

    const addUserMessage = content => {
        const message = createMessage('user', { content, newConversation: isFirstUserMessage() })
        addMessage(message)
        return message
    }

    const addAiMessage = aiResponse => {
        const message = createMessage('assistant', aiResponse)
        addMessage(message)
        return message
    }

    const addErrorMessage = (
        content = 'I apologize, but I encountered an error processing your request. Please try again.'
    ) => {
        const message = createMessage('assistant', { content })
        addMessage(message)
        return message
    }

    const scrollToBottom = () => {
        return nextTick().then(() => {
            if (messagesContainer?.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
            }
            // Allow parent to hook into scroll behavior
            onScrollToBottom?.()
        })
    }

    const focusInput = () => {
        nextTick(() => {
            chatInputRef?.value?.focus()
            // Allow parent to hook into focus behavior
            onFocusInput?.()
        })
    }

    // Track current request for cancellation
    const currentAbortController = ref(null)

    const validateInput = content => {
        const trimmedContent = content?.trim()
        return !trimmedContent || isTyping.value ? null : trimmedContent
    }

    const updateUIForUserMessage = async () => {
        chatInputRef?.value?.clear()
        await scrollToBottom()
    }

    const updateUIForWaiting = async () => {
        isTyping.value = true
        await scrollToBottom()
    }

    const updateUIForAIResponse = async () => {
        await scrollToBottom()
        focusInput()
    }

    const setupAIRequest = () => {
        currentAbortController.value = new AbortController()
        return currentAbortController.value.signal
    }

    const cleanupAIRequest = () => {
        currentAbortController.value = null
    }

    const isAbortError = error => error.name === 'AbortError'

    const logError = error => {
        if (isAbortError(error)) {
            console.log('AI request was aborted')
        } else {
            console.error('AI handler error:', error)
        }
    }

    const handleAbortError = () => ({ aborted: true })

    const handleRequestError = async error => {
        const errorMessage = addErrorMessage()
        await scrollToBottom()
        return { errorMessage, error }
    }

    const handleAIError = async error => {
        logError(error)
        return isAbortError(error) ? handleAbortError() : await handleRequestError(error)
    }

    // Main message sending function
    const sendMessage = async content => {
        const validContent = validateInput(content)
        if (!validContent) return

        const userMessage = addUserMessage(validContent)
        await updateUIForUserMessage()

        if (!aiHandler) {
            return userMessage
        }

        await updateUIForWaiting()
        const signal = setupAIRequest()

        try {
            const aiResponse = await aiHandler(userMessage, signal)
            const aiMessage = addAiMessage(aiResponse)
            await updateUIForAIResponse()
            return { userMessage, aiMessage }
        } catch (error) {
            const errorResult = await handleAIError(error)
            return { userMessage, ...errorResult }
        } finally {
            isTyping.value = false
            cleanupAIRequest()
        }
    }

    // Cancel current request
    const cancelCurrentRequest = () => {
        if (currentAbortController.value) {
            currentAbortController.value.abort()
            currentAbortController.value = null
        }
    }

    const recallLastMessage = () => {
        const userMessages = messages.value.filter(msg => msg.role === 'user')
        return userMessages.length > 0 ? userMessages[userMessages.length - 1].content : ''
    }

    const clearChat = () => {
        messages.value = [
            {
                role: 'assistant',
                content: initialMessage,
                timestamp: createTimestamp()
            }
        ]
    }

    // Reset messages completely
    const resetMessages = () => {
        messages.value = []
    }

    return {
        // State
        messages,
        isTyping,

        // Message management
        addMessage,
        addUserMessage,
        addAiMessage,
        addErrorMessage,

        // Core functionality
        sendMessage,
        cancelCurrentRequest,
        recallLastMessage,
        clearChat,
        resetMessages,

        // Utilities
        scrollToBottom,
        focusInput,
        createTimestamp,
        createMessage
    }
}
