<template>
    <div>
        <!-- Floating Chat Button -->
        <button
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
                class="fixed bottom-24 right-6 w-96 h-[600px] card flex flex-col z-40"
            >
                <ChatHeader @clear-chat="clearChat" />

                <div
                    ref="messagesContainer"
                    class="flex-1 overflow-y-auto p-4 space-y-4 bg-background with-scrollbar"
                >
                    <ChatMessage
                        v-for="(message, index) in messages"
                        :key="index"
                        :message="message"
                    />

                    <TypingIndicator v-if="isTyping" />
                </div>

                <ChatInput
                    ref="chatInputRef"
                    v-model="inputMessage"
                    :disabled="isTyping"
                    :show-hint="true"
                    @submit="sendMessage"
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
import { ref, nextTick, watch } from 'vue'
import ChatInput from './ChatInput.vue'
import ChatMessage from './ChatMessage.vue'
import ChatHeader from './ChatHeader.vue'
import TypingIndicator from './TypingIndicator.vue'

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref([
    {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
])
const isTyping = ref(false)
const messagesContainer = ref(null)
const chatInputRef = ref(null)

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const sendMessage = async message => {
    if (!message?.trim() || isTyping.value) return

    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    messages.value.push(userMessage)

    scrollToBottom()

    // Simulate AI response
    isTyping.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))

    const aiMessage = {
        role: 'assistant',
        content: `I received your message: "${message}"\n\nThis is a demo response. Integrate your LLM API here!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    messages.value.push(aiMessage)
    isTyping.value = false
    scrollToBottom()

    // Ensure focus returns to input after AI response with a small delay
    setTimeout(() => {
        chatInputRef.value?.focus()
    }, 100)
}

const clearChat = () => {
    messages.value = [
        {
            role: 'assistant',
            content: 'Chat cleared. How can I help you?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]
}

watch(isOpen, newVal => {
    if (newVal) {
        scrollToBottom()
        // Focus input when modal opens with a slight delay to ensure DOM is ready
        setTimeout(() => {
            chatInputRef.value?.focus()
        }, 100)
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
