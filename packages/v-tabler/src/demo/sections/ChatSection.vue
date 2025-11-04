<template>
    <section>
        <h2 class="text-2xl font-bold mb-6 text-default">Chat Component</h2>

        <!-- Test Form to verify chat doesn't interfere with form submission -->
        <div class="mb-8 p-6 border border-border rounded-lg bg-surface">
            <h3 class="text-lg text-default font-semibold mb-4">Form Submission Test</h3>
            <p class="text-sm text-muted mb-4">
                This form tests that the chat component doesn't interfere with regular form
                submissions. Try using the chat component and submitting this form to ensure they
                work independently.
            </p>

            <form @submit.prevent="handleFormSubmit" class="space-y-4">
                <div>
                    <label for="testInput" class="block text-sm text-default font-medium mb-2"
                        >Test Input:</label
                    >
                    <input
                        id="testInput"
                        v-model="formData.testInput"
                        type="text"
                        class="form-inputfield text-default w-full max-w-md"
                        placeholder="Type something and press Enter or click Submit"
                        required
                    />
                </div>

                <div>
                    <label for="testTextarea" class="block text-sm text-default font-medium mb-2"
                        >Test Textarea:</label
                    >
                    <textarea
                        id="testTextarea"
                        v-model="formData.testTextarea"
                        class="form-inputfield text-default w-full max-w-md"
                        rows="3"
                        placeholder="Multi-line input - try Enter key here vs in chat"
                    ></textarea>
                </div>

                <div class="flex gap-3">
                    <button type="submit" class="btn-primary-md rounded px-4 py-2">
                        Submit Form
                    </button>
                    <button
                        type="button"
                        @click="resetForm"
                        class="btn-secondary-md rounded px-4 py-2"
                    >
                        Reset
                    </button>
                </div>

                <div
                    v-if="submissionResult"
                    class="mt-4 p-3 bg-success/10 border border-success/20 rounded text-success"
                >
                    ✅ Form submitted successfully! Data: {{ submissionResult }}
                </div>
            </form>
        </div>

        <!-- Chat Component Demo -->
        <div class="mb-8">
            <h3 class="text-lg text-default font-semibold mb-4">Chat Component</h3>
            <p class="text-sm text-muted mb-4">
                The chat component appears as a floating button in the bottom-right corner. This
                demo shows integration with a mock AI service. Test that:
            </p>
            <ul class="list-disc list-inside text-sm text-muted space-y-1 mb-4">
                <li>Pressing Enter in the chat sends a message (doesn't submit the form above)</li>
                <li>
                    Pressing Enter in the form inputs submits the form (doesn't send a chat message)
                </li>
                <li>Clicking the chat send button doesn't submit the form</li>
                <li>Clicking the form submit button doesn't affect the chat</li>
                <li>AI responses are generated based on your messages</li>
                <li>Typing indicator shows while AI is "thinking"</li>
            </ul>

            <!-- Chat Status Display -->
            <div class="mb-4 p-3 bg-surface border border-border rounded">
                <h4 class="text-sm font-medium text-default mb-2">Chat Status:</h4>
                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span class="text-muted">Messages sent:</span>
                        <span class="text-default font-medium ml-1">{{
                            chatStats.messagesSent
                        }}</span>
                    </div>
                    <div>
                        <span class="text-muted">AI responses:</span>
                        <span class="text-default font-medium ml-1">{{
                            chatStats.aiResponses
                        }}</span>
                    </div>
                    <div>
                        <span class="text-muted">Status:</span>
                        <span
                            class="ml-1 font-medium"
                            :class="isAiThinking ? 'text-warning' : 'text-success'"
                        >
                            {{ isAiThinking ? 'AI thinking...' : 'Ready' }}
                        </span>
                    </div>
                    <div>
                        <span class="text-muted">Last message:</span>
                        <span class="text-default font-medium ml-1">{{
                            lastMessageTime || 'None'
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Instructions -->
        <div class="p-4 bg-info/10 border border-info/20 rounded">
            <h4 class="font-semibold text-default mb-2">Testing Instructions:</h4>
            <ol class="list-decimal list-inside text-default text-sm space-y-1">
                <li>Open the chat by clicking the floating button in bottom-right</li>
                <li>Type a message in the chat and press Enter - should send chat message only</li>
                <li>
                    Type something in the form input above and press Enter - should submit form only
                </li>
                <li>Try clicking both send buttons to ensure they work independently</li>
                <li>Ask the AI different types of questions to see varied responses</li>
                <li>
                    <strong>NEW:</strong> During AI processing, the send button becomes a cancel
                    button (X icon)
                </li>
                <li><strong>NEW:</strong> Click the cancel button to abort ongoing AI requests</li>
                <li>Watch the status panel above to see chat activity tracking</li>
            </ol>
        </div>

        <!-- Chat Component -->
        <ChatComponent
            initial-message="Hello! I'm a demo AI assistant. Try asking me about programming, help, or just say hello! You can cancel my responses by clicking the X button during processing."
            placeholder="Ask me anything... (cancel with X button during processing)"
            :ai-handler="handleAiRequest"
        />
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChatComponent } from '@/components/chat'

const formData = ref({
    testInput: '',
    testTextarea: ''
})

const submissionResult = ref(null)

// Chat-related state
const chatStats = ref({
    messagesSent: 0,
    aiResponses: 0
})
const lastMessageTime = ref('')
const isAiThinking = ref(false)

const handleFormSubmit = () => {
    submissionResult.value = { ...formData.value, timestamp: new Date().toISOString() }
    console.log('Form submitted:', submissionResult.value)

    // Clear the result after 3 seconds
    setTimeout(() => {
        submissionResult.value = null
    }, 3000)
}

const resetForm = () => {
    formData.value = {
        testInput: '',
        testTextarea: ''
    }
    submissionResult.value = null
}

// AI handler function for the chat component
const handleAiRequest = async (message, signal) => {
    console.log('💬 Chat message received:', message.content)

    // Update stats
    chatStats.value.messagesSent++
    lastMessageTime.value = message.timestamp

    // Show AI thinking state
    isAiThinking.value = true

    try {
        // Simulate AI processing time
        const processingTime = 1000 + Math.random() * 2500 // 1-3.5 seconds

        // Create a promise that can be aborted
        await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(resolve, processingTime)

            // Listen for abort signal
            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId)
                    reject(new DOMException('Request was cancelled', 'AbortError'))
                })
            }
        })

        // Check if aborted before generating response
        if (signal?.aborted) {
            throw new DOMException('Request was cancelled', 'AbortError')
        }

        // Generate AI response
        const aiResponse = generateDemoAiResponse(message.content)

        // Update stats
        chatStats.value.aiResponses++

        console.log('🤖 AI response generated:', aiResponse)

        // Return the response - component will handle adding it to chat
        return { content: aiResponse, metadata: { demo: true } }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('🚫 AI request was cancelled by user')
            throw error // Re-throw abort errors so component can handle them
        }

        console.error('❌ Error generating AI response:', error)

        // Return error response for other errors
        return 'I apologize, but I encountered an error. Please try again.'
    } finally {
        isAiThinking.value = false
    }
}

// Demo AI response generator
const generateDemoAiResponse = userMessage => {
    const lowerMessage = userMessage.toLowerCase()

    // Greeting responses
    if (
        lowerMessage.includes('hello') ||
        lowerMessage.includes('hi') ||
        lowerMessage.includes('hey')
    ) {
        const greetings = [
            "Hello! Great to meet you. I'm the demo AI assistant for the v-tabler ChatComponent. How can I help?",
            "Hi there! I'm here to show how the ChatComponent integrates with AI services. What would you like to know?",
            "Hey! Welcome to the ChatComponent demo. I can help answer questions or just chat. What's on your mind?"
        ]
        return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // Programming questions
    if (
        lowerMessage.includes('vue') ||
        lowerMessage.includes('javascript') ||
        lowerMessage.includes('programming') ||
        lowerMessage.includes('code')
    ) {
        return "I'd love to help with programming questions! This ChatComponent is built with Vue 3 and demonstrates how easy it is to integrate AI responses. The component handles the UI while the parent component (this demo) processes messages and generates responses. Feel free to ask about Vue.js, JavaScript, or any other tech topics!"
    }

    // Component questions
    if (lowerMessage.includes('component') || lowerMessage.includes('chat')) {
        return 'The ChatComponent is designed to be simple yet powerful! It manages its own UI state (open/closed, messages, typing indicators) while letting parent components handle message processing. New features include cancellable requests - notice how the send button becomes a cancel button (X) during processing! This means you can easily connect it to any AI service like OpenAI, Claude, or your custom backend. Would you like to know more about how it works?'
    }

    // Help questions
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return "I'm a demo AI assistant showcasing the ChatComponent's capabilities! I can:\n\n• Answer questions about the component\n• Discuss programming topics\n• Show different types of responses\n• Demonstrate the typing indicator\n• Show cancellable requests (try clicking X during processing!)\n• Just have a friendly conversation\n\nTry asking me about Vue.js, the ChatComponent, or anything else!"
    }

    // Cancellation questions
    if (
        lowerMessage.includes('cancel') ||
        lowerMessage.includes('abort') ||
        lowerMessage.includes('stop')
    ) {
        return "Great question about cancellation! The ChatComponent now supports cancellable AI requests. When I'm processing your message, you'll see the send button (📤) change to a cancel button (❌). Click it to abort the current request! This is especially useful for long-running AI operations. The component handles all the cleanup automatically - no error messages, just clean cancellation. Try sending a message and then quickly clicking the X button!"
    }

    // Form testing questions
    if (lowerMessage.includes('form') || lowerMessage.includes('test')) {
        return "Great question about form interaction! This demo shows that the ChatComponent doesn't interfere with other forms on the page. Try typing in the form above and pressing Enter - it should submit the form, not send a chat message. The ChatComponent properly isolates its Enter key handling to avoid conflicts."
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! I'm glad I could help demonstrate the ChatComponent. Feel free to keep testing - try different types of messages to see how responses vary, or test the form interaction above to see how everything works together smoothly."
    }

    // Default varied responses
    const thoughtfulResponses = [
        `That's interesting! You mentioned "${userMessage}" - I'm a demo AI, so my responses are generated by the parent component to show how you'd integrate with real AI services.`,
        `Thanks for sharing "${userMessage}"! This demonstrates how the ChatComponent can handle any type of conversation while maintaining clean separation between UI and business logic.`,
        `I see you said "${userMessage}". In a real implementation, this would be processed by your chosen AI service. The ChatComponent makes it easy to connect to OpenAI, Claude, or any custom API!`,
        `Regarding "${userMessage}" - this is a demo response showing how flexible the ChatComponent is. You can customize responses, add context, implement conversation memory, or connect to any AI service you prefer.`
    ]

    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)]
}
</script>
