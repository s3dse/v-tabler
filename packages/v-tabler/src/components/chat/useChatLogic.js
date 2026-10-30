import { computed, ref, nextTick } from 'vue'
import {
    createMentionDraft,
    hasUnresolvedMentions,
    isMentionDraft
} from './mentions/mentionDraft.js'

const DEFAULT_REQUEST_ERROR =
    'I apologize, but I encountered an error processing your request. Please try again.'
const PROTECTED_UPDATE_FIELDS = ['role', 'timestamp', 'requestState', 'requestError', '__proto__']

function validateMessageUpdate(patch) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
        throw new TypeError('Message updates must be objects')
    }
    if (Object.hasOwn(patch, 'content') && typeof patch.content !== 'string') {
        throw new TypeError('Message update content must be a string')
    }
    const protectedField = PROTECTED_UPDATE_FIELDS.find((field) => Object.hasOwn(patch, field))
    if (protectedField) {
        throw new TypeError(`Message updates cannot set the library-owned field ${protectedField}`)
    }
}

/**
 * Own one reply per request. The optional handler callback replaces full content;
 * request identity prevents late updates after cancellation or conversation reset.
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
    const activeRequest = ref(null)
    const isAwaitingResponse = computed(() => isTyping.value && !activeRequest.value?.message)
    const ownsRequest = (request) =>
        activeRequest.value === request && !request.controller.signal.aborted

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
        return messages.value.at(-1)
    }

    const addErrorMessage = (content = DEFAULT_REQUEST_ERROR) => {
        const message = createMessage('assistant', { content })
        addMessage(message)
        return message
    }

    const scrollToBottom = (request = null) => {
        return nextTick().then(() => {
            if (request && !ownsRequest(request)) return
            if (messagesContainer?.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
            }
            onScrollToBottom?.()
        })
    }

    const focusInput = (request = null) => {
        return nextTick(() => {
            if (request && !ownsRequest(request)) return
            chatInputRef?.value?.focus()
            onFocusInput?.()
        })
    }

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

    const clearInputAndScroll = async (request = null) => {
        chatInputRef?.value?.clear()
        await scrollToBottom(request)
    }

    const startAIRequest = () => {
        activeRequest.value = {
            controller: new AbortController(),
            message: null,
            acceptsUpdates: true
        }
        isTyping.value = true
        return activeRequest.value
    }

    const applyMessageUpdate = (request, patch) => {
        validateMessageUpdate(patch)
        if (!request.message) {
            request.message = addAiMessage({ content: '', requestState: 'streaming' })
        }
        Object.assign(request.message, patch)
    }

    const sendMessage = async (input) => {
        const validInput = prepareMessageInput(input)
        if (!validInput) return

        const request = aiHandler ? startAIRequest() : null
        const userMessage = addUserMessage(validInput)

        if (!request) {
            await clearInputAndScroll()
            return userMessage
        }

        const updateMessage = (patch) => {
            if (!ownsRequest(request) || !request.acceptsUpdates) return
            applyMessageUpdate(request, patch)
            void scrollToBottom(request)
        }

        try {
            await clearInputAndScroll(request)
            if (!ownsRequest(request)) return { userMessage, aborted: true }
            const aiResponse = await aiHandler(
                userMessage,
                request.controller.signal,
                updateMessage
            )
            request.acceptsUpdates = false
            if (!ownsRequest(request)) return { userMessage, aborted: true }
            if (request.message) {
                if (aiResponse !== undefined) applyMessageUpdate(request, aiResponse)
            } else {
                if (
                    !aiResponse ||
                    typeof aiResponse !== 'object' ||
                    Array.isArray(aiResponse) ||
                    typeof aiResponse.content !== 'string'
                ) {
                    throw new TypeError(
                        'AI handlers must return an object with string content or publish a message update'
                    )
                }
            }
            const aiMessage = request.message ?? addAiMessage(aiResponse)
            await scrollToBottom(request)
            await focusInput(request)
            if (!ownsRequest(request)) return { userMessage, aborted: true }
            if (request.message) request.message.requestState = 'complete'
            return { userMessage, aiMessage }
        } catch (error) {
            request.acceptsUpdates = false
            if (!ownsRequest(request)) return { userMessage, aborted: true }
            if (error?.name === 'AbortError') {
                if (request.message) request.message.requestState = 'cancelled'
                return { userMessage, aborted: true }
            }
            console.error('AI handler error:', error)
            if (request.message) {
                request.message.requestState = 'error'
                request.message.requestError = DEFAULT_REQUEST_ERROR
            }
            const errorMessage = request.message ?? addErrorMessage()
            await scrollToBottom(request)
            return ownsRequest(request)
                ? { userMessage, errorMessage, error }
                : { userMessage, aborted: true }
        } finally {
            if (activeRequest.value === request) {
                isTyping.value = false
                activeRequest.value = null
            }
        }
    }

    const cancelCurrentRequest = () => {
        const request = activeRequest.value
        if (!request) return
        activeRequest.value = null
        isTyping.value = false
        if (request.message?.requestState === 'streaming') {
            request.message.requestState = 'cancelled'
            delete request.message.requestError
        }
        request.controller.abort()
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
        cancelCurrentRequest()
        messages.value = [
            {
                role: 'assistant',
                content: initialMessage,
                timestamp: createTimestamp()
            }
        ]
    }

    const resetMessages = () => {
        cancelCurrentRequest()
        messages.value = []
    }

    return {
        messages,
        isTyping,
        isAwaitingResponse,
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
