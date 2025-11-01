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

    // State
    const messages = ref([
        {
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const isTyping = ref(false)

    // Utilities
    const createTimestamp = () => {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    const createMessage = (role, content) => ({
        role,
        content,
        timestamp: createTimestamp()
    })

    // Message management
    const addMessage = message => {
        messages.value.push(message)
    }

    const addUserMessage = content => {
        const message = createMessage('user', content)
        addMessage(message)
        return message
    }

    const addAiMessage = content => {
        const message = createMessage('assistant', content)
        addMessage(message)
        return message
    }

    const addErrorMessage = (
        content = 'I apologize, but I encountered an error processing your request. Please try again.'
    ) => {
        const message = createMessage('assistant', content)
        addMessage(message)
        return message
    }

    // Scrolling
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

    // Core chat logic
    const sendMessage = async content => {
        const trimmedContent = content?.trim()
        if (!trimmedContent || isTyping.value) return

        // Add user message
        const userMessage = addUserMessage(trimmedContent)
        chatInputRef?.value?.clear()
        await scrollToBottom()

        // If no AI handler provided, just stop here
        if (!aiHandler) {
            return userMessage
        }

        // Show typing indicator
        isTyping.value = true

        // Create AbortController for this request
        currentAbortController.value = new AbortController()

        try {
            // Call AI handler function with AbortSignal
            const aiResponse = await aiHandler(userMessage, currentAbortController.value.signal)

            // Add AI response to chat
            const aiMessage = addAiMessage(aiResponse)
            await scrollToBottom()
            focusInput()

            return { userMessage, aiMessage }
        } catch (error) {
            // Handle abort specifically - just reset UI state
            if (error.name === 'AbortError') {
                console.log('AI request was aborted')
                return { userMessage, aborted: true }
            }

            console.error('AI handler error:', error)

            // Add error message for real errors
            const errorMessage = addErrorMessage()
            await scrollToBottom()

            return { userMessage, errorMessage, error }
        } finally {
            // Always clear typing indicator and abort controller
            isTyping.value = false
            currentAbortController.value = null
        }
    }

    // Cancel current request
    const cancelCurrentRequest = () => {
        if (currentAbortController.value) {
            currentAbortController.value.abort()
            currentAbortController.value = null
        }
    }

    // Recall last submitted message
    const recallLastMessage = () => {
        // Find the last user message in the messages array
        const userMessages = messages.value.filter(msg => msg.role === 'user')
        return userMessages.length > 0 ? userMessages[userMessages.length - 1].content : ''
    }

    // Clear chat and reset to initial state
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
