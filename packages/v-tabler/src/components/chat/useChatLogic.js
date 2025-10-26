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

    // Core chat logic
    const sendMessage = async content => {
        if (!content?.trim() || isTyping.value) return

        // Add user message
        const userMessage = addUserMessage(content)
        chatInputRef?.value?.clear()
        await scrollToBottom()

        // If no AI handler provided, just stop here
        if (!aiHandler) {
            return userMessage
        }

        // Show typing indicator
        isTyping.value = true

        try {
            // Call AI handler function
            const aiResponse = await aiHandler(userMessage)

            // Add AI response to chat
            const aiMessage = addAiMessage(aiResponse)
            await scrollToBottom()
            focusInput()

            return { userMessage, aiMessage }
        } catch (error) {
            console.error('AI handler error:', error)

            // Add error message
            const errorMessage = addErrorMessage()
            await scrollToBottom()

            return { userMessage, errorMessage, error }
        } finally {
            // Always hide typing indicator
            isTyping.value = false
        }
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
        clearChat,
        resetMessages,

        // Utilities
        scrollToBottom,
        focusInput,
        createTimestamp,
        createMessage
    }
}
