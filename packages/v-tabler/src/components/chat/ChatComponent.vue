<template>
    <div :class="rootClasses">
        <button
            v-if="floating"
            type="button"
            @click="isOpen = !isOpen"
            class="fixed bottom-6 right-6 w-14 h-14 btn-primary-md rounded-full shadow-lg flex items-center justify-center z-50"
            :class="{ 'rotate-90': isOpen }"
        >
            <div v-if="!isOpen" class="i-tabler-message-chatbot w-6 h-6" />
            <div v-else class="i-tabler-x w-6 h-6" />
        </button>

        <Transition name="modal" :css="floating">
            <div v-if="!floating || isOpen" :class="chatContainerClasses">
                <ChatHeader
                    :variant="variant"
                    :chat-title="chatTitle"
                    @clear-chat="handleClearChat"
                >
                    <template v-if="$slots.title" #title>
                        <slot name="title" />
                    </template>
                </ChatHeader>

                <div
                    ref="messagesContainer"
                    class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 with-scrollbar"
                    :class="isEmbedded ? 'bg-transparent' : 'bg-background'"
                >
                    <slot name="messages" v-bind="{ messages, variant }">
                        <ChatMessage
                            v-for="(message, index) in messages"
                            :key="index"
                            :message="message"
                            :variant="variant"
                        />
                    </slot>

                    <TypingIndicator v-if="isTyping" :variant="variant" />
                </div>

                <ChatInput
                    ref="chatInputRef"
                    v-model="inputMessage"
                    :disabled="isTyping"
                    :is-typing="isTyping"
                    :show-hint="true"
                    :placeholder="placeholder"
                    :recall-last-message="recallLastMessage"
                    :variant="variant"
                    @submit="handleSubmit"
                    @cancel="handleCancel"
                />
            </div>
        </Transition>

        <Transition name="fade">
            <div
                v-if="floating && isOpen"
                @click="isOpen = false"
                class="fixed inset-0 bg-background/20 z-30"
            ></div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch, watchEffect, computed } from 'vue'
import ChatInput from './ChatInput.vue'
import ChatMessage from './ChatMessage.vue'
import ChatHeader from './ChatHeader.vue'
import TypingIndicator from './TypingIndicator.vue'
import { useChatLogic } from './useChatLogic.js'
import {
    assertValidChatLayout,
    ChatVariant,
    DEFAULT_CHAT_VARIANT,
    isChatVariant
} from './chatVariants.js'

const props = defineProps({
    initialMessage: {
        type: String,
        default: 'Hello! How can I help you today?'
    },
    placeholder: {
        type: String,
        default: null
    },
    aiHandler: {
        type: Function,
        default: null
    },
    chatTitle: {
        type: String,
        default: 'AI Assistant'
    },
    size: {
        type: String,
        default: 'default',
        validator: value => ['auto', 'compact', 'default', 'wide'].includes(value)
    },
    floating: {
        type: Boolean,
        default: false
    },
    variant: {
        type: String,
        default: DEFAULT_CHAT_VARIANT,
        validator: isChatVariant
    }
})

watchEffect(() => {
    assertValidChatLayout({
        floating: props.floating,
        variant: props.variant
    })
})

const emit = defineEmits(['clear-chat'])

const isEmbedded = computed(() => props.variant === ChatVariant.EMBEDDED)

const rootClasses = computed(() => {
    return isEmbedded.value ? 'w-full h-full min-h-0 min-w-0' : undefined
})

const sizeClasses = computed(() => {
    const sizeMap = {
        auto: 'w-full sm:w-96 md:w-[600px] lg:w-[700px] xl:w-[800px] min-h-[600px] max-h-[75%]',
        compact: 'w-full md:w-96 h-[600px]',
        default: 'w-full md:w-[600px] h-[600px]',
        wide: 'w-full md:w-[700px] lg:w-[800px] h-[600px]'
    }
    return sizeMap[props.size]
})

const chatContainerClasses = computed(() => {
    if (isEmbedded.value) {
        return 'relative flex flex-col w-full h-full min-h-0 min-w-0 bg-transparent'
    }

    return [
        'card flex flex-col',
        props.floating ? 'fixed bottom-24 right-6 z-40' : 'relative',
        sizeClasses.value
    ]
})

const isOpen = ref(!props.floating)
const inputMessage = ref('')
const messagesContainer = ref(null)
const chatInputRef = ref(null)

const {
    messages,
    isTyping,
    sendMessage,
    cancelCurrentRequest,
    recallLastMessage,
    clearChat,
    scrollToBottom,
    focusInput
} = useChatLogic({
    initialMessage: props.initialMessage,
    aiHandler: props.aiHandler,
    messagesContainer,
    chatInputRef
})

const handleSubmit = async message => {
    await sendMessage(message)
}

const handleCancel = () => {
    cancelCurrentRequest()
}

const handleClearChat = () => {
    clearChat()
    emit('clear-chat')
}

watch(
    isOpen,
    newVal => {
        if (newVal) {
            scrollToBottom().then(() => focusInput())
        }
    },
    { immediate: true }
)
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

.modal-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

/* Fade Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
