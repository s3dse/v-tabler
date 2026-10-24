import { ref, nextTick } from 'vue'
import {
    createMentionDraft,
    hasUnresolvedMentions,
    isMentionDraft
} from './mentions/mentionDraft.js'

/** Manage chat messages, mention drafts, AI requests, recall, focus, and scrolling. */
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

    const createTimestamp = () => new Date()

    const createMessage = (role, { content, ...extraData }) => ({
        role,
        content,
        ...extraData,
        timestamp: createTimestamp()
    })

    const addMessage = (message) => {
        messages.value.push(message)
    }

    const isFirstUserMessage = () => !messages.value.some((message) => message.role === 'user')

    const addUserMessage = (input) => {
        const messageData = typeof input === 'string' ? { content: input } : input
        const message = createMessage('user', {
            ...messageData,
            newConversation: isFirstUserMessage()
        })
        addMessage(message)
        return message
    }

    const addAiMessage = (aiResponse) => {
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
            onScrollToBottom?.()
        })
    }

    const focusInput = () => {
        nextTick(() => {
            chatInputRef?.value?.focus()
            onFocusInput?.()
        })
    }

    const currentAbortController = ref(null)

    const trimDraftPart = (part, index, lastIndex) => {
        if (part.kind !== 'text') return { ...part }

        const withoutLeadingWhitespace = index === 0 ? part.text.trimStart() : part.text
        return {
            ...part,
            text:
                index === lastIndex ? withoutLeadingWhitespace.trimEnd() : withoutLeadingWhitespace
        }
    }

    const trimMentionDraft = (draft) =>
        createMentionDraft(
            draft.parts.map((part, index) => trimDraftPart(part, index, draft.parts.length - 1))
        )

    const prepareMessageInput = (input) => {
        if (isTyping.value) return null
        if (isMentionDraft(input)) {
            const trimmedDraft = trimMentionDraft(input)
            return !trimmedDraft.content || hasUnresolvedMentions(trimmedDraft)
                ? null
                : trimmedDraft
        }

        const trimmedContent = input?.trim()
        return trimmedContent || null
    }

    const clearInputAndScroll = async () => {
        chatInputRef?.value?.clear()
        await scrollToBottom()
    }

    const showTypingAndScroll = async () => {
        isTyping.value = true
        await scrollToBottom()
    }

    const scrollAndFocusInput = async () => {
        await scrollToBottom()
        focusInput()
    }

    const startAIRequest = () => {
        currentAbortController.value = new AbortController()
        return currentAbortController.value.signal
    }

    const clearAIRequest = () => {
        currentAbortController.value = null
    }

    const isAbortError = (error) => error.name === 'AbortError'

    const logError = (error) => {
        if (isAbortError(error)) {
            console.log('AI request was aborted')
        } else {
            console.error('AI handler error:', error)
        }
    }

    const handleRequestError = async (error) => {
        const errorMessage = addErrorMessage()
        await scrollToBottom()
        return { errorMessage, error }
    }

    const handleAIError = async (error) => {
        logError(error)
        return isAbortError(error) ? { aborted: true } : await handleRequestError(error)
    }

    const sendMessage = async (input) => {
        const validInput = prepareMessageInput(input)
        if (!validInput) return

        const userMessage = addUserMessage(validInput)
        await clearInputAndScroll()

        if (!aiHandler) {
            return userMessage
        }

        await showTypingAndScroll()
        const signal = startAIRequest()

        try {
            const aiResponse = await aiHandler(userMessage, signal)
            const aiMessage = addAiMessage(aiResponse)
            await scrollAndFocusInput()
            return { userMessage, aiMessage }
        } catch (error) {
            const errorResult = await handleAIError(error)
            return { userMessage, ...errorResult }
        } finally {
            isTyping.value = false
            clearAIRequest()
        }
    }

    const cancelCurrentRequest = () => {
        currentAbortController.value?.abort()
        currentAbortController.value = null
    }

    const recallLastMessage = () => {
        const userMessages = messages.value.filter((msg) => msg.role === 'user')
        const lastMessage = userMessages.at(-1)
        if (!lastMessage) return ''
        if (!lastMessage.parts) return lastMessage.content

        return {
            content: lastMessage.content,
            serializedContent: lastMessage.serializedContent,
            parts: lastMessage.parts.map((part) => ({ ...part }))
        }
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

    const resetMessages = () => {
        messages.value = []
    }

    return {
        messages,
        isTyping,
        addMessage,
        addUserMessage,
        addAiMessage,
        addErrorMessage,

        sendMessage,
        cancelCurrentRequest,
        recallLastMessage,
        clearChat,
        resetMessages,

        scrollToBottom,
        focusInput,
        createTimestamp,
        createMessage
    }
}
