<template>
    <div>
        <!-- Floating Chat Button -->
        <button
            type="button"
            @click="isOpen = !isOpen"
            class="fixed bottom-6 right-6 w-14 h-14 btn-primary-md rounded-full shadow-lg flex items-center justify-center z-50"
            :class="{ 'rotate-90': isOpen }"
        >
            <div v-if="!isOpen" class="i-tabler-message-chatbot w-6 h-6" />
            <div v-else class="i-tabler-x w-6 h-6" />
        </button>

        <!-- Chat Modal -->
        <Transition name="modal">
            <div
                v-if="isOpen"
                :class="['fixed bottom-24 right-6 h-[600px] card flex flex-col z-40', sizeClasses]"
            >
                <ChatHeader @clear-chat="clearChat" :chatTitle="chatTitle" />

                <div
                    ref="messagesContainer"
                    class="flex-1 overflow-y-auto p-4 space-y-4 bg-background with-scrollbar"
                >
                    <slot name="messages" v-bind="{ messages }">
                        <ChatMessage
                            v-for="(message, index) in messages"
                            :key="index"
                            :message="message"
                        />
                    </slot>

                    <TypingIndicator v-if="isTyping" />
                </div>

                <ChatInput
                    ref="chatInputRef"
                    v-model="inputMessage"
                    :disabled="isTyping"
                    :is-typing="isTyping"
                    :show-hint="true"
                    :placeholder="placeholder"
                    :recall-last-message="recallLastMessage"
                    @submit="handleSubmit"
                    @cancel="handleCancel"
                />
            </div>
        </Transition>

        <!-- Backdrop -->
        <Transition name="fade">
            <div
                v-if="isOpen"
                @click="isOpen = false"
                class="fixed inset-0 bg-background/20 z-30"
            ></div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ChatInput from './ChatInput.vue'
import ChatMessage from './ChatMessage.vue'
import ChatHeader from './ChatHeader.vue'
import TypingIndicator from './TypingIndicator.vue'
import { useChatLogic } from './useChatLogic.js'

const props = defineProps({
    initialMessage: {
        type: String,
        default: 'Hello! How can I help you today?'
    },
    placeholder: {
        type: String,
        default: 'Type your message...'
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
    }
})

const sizeClasses = computed(() => {
    const sizeMap = {
        auto: 'w-full sm:w-96 md:w-[600px] lg:w-[700px] xl:w-[800px]',
        compact: 'w-full md:w-96',
        default: 'w-full md:w-[600px]',
        wide: 'w-full md:w-[700px] lg:w-[800px]'
    }
    return sizeMap[props.size]
})

const isOpen = ref(false)
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

watch(isOpen, newVal => {
    if (newVal) {
        scrollToBottom().then(() => focusInput())
    }
})
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
