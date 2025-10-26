# Chat Component

The `ChatComponent` is a chat interface component designed for AI assistants. It provides a modern, customizable chat UI with message history, and configurable request/response handling.

## Features

- **Floating Chat Button** - Fixed position chat toggle button with smooth animations
- **Modal Chat Interface** - Slide-up chat window with backdrop
- **Message History** - Scrollable message container with auto-scroll to bottom
- **Typing Indicator** - Visual feedback when AI/assistant is responding
- **AI Integration** - Easy integration with custom AI handlers

## Props

| Prop Name        | Type     | Default                              | Description                                                                       |
| ---------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| `initialMessage` | String   | `'Hello! How can I help you today?'` | The first message displayed when the chat is opened                               |
| `placeholder`    | String   | `'Type your message...'`             | Placeholder text for the message input field                                      |
| `aiHandler`      | Function | `null`                               | Async function to handle AI responses. Receives user message, returns AI response |
| `chatTitle`      | String   | `'AI Assistant'`                     | Title displayed in the chat header                                                |

## Slots

| Slot name  | Slot-Props                      | Description                   |
| ---------- | ------------------------------- | ----------------------------- |
| `messages` | `{ messages }` list of messages | Provide a custom message view |

## Usage

### Basic Chat

```vue
<template>
    <ChatComponent />
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'
</script>
```

### Customized Chat

```vue
<template>
    <ChatComponent
        chat-title="Customer Support"
        initial-message="Hi there! How can I assist you today?"
        placeholder="Ask me anything..."
    />
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'
</script>
```

### Chat with AI Integration

```vue
<template>
    <ChatComponent
        chat-title="My AI Assistant"
        :ai-handler="handleAiMessage"
        initial-message="Hello! I'm your AI assistant. How can I help?"
    />
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'

// Example AI handler function
const handleAiMessage = async userMessage => {
    // userMessage object contains: { role, content, timestamp }

    try {
        // Call your AI API
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage.content
            })
        })

        const data = await response.json()

        // Return the AI response as a string
        return data.response
    } catch (error) {
        console.error('AI Error:', error)
        throw error // Component will handle error display
    }
}
</script>
```

### Advanced: Custom AI Handler with Context

```vue
<template>
    <ChatComponent chat-title="Context-Aware Assistant" :ai-handler="handleAiWithContext" />
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'
import { ref } from 'vue'

const conversationContext = ref([])

const handleAiWithContext = async userMessage => {
    // Add user message to context
    conversationContext.value.push({
        role: 'user',
        content: userMessage.content
    })

    // Send entire conversation context to AI
    const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: conversationContext.value
        })
    })

    const data = await response.json()

    // Add AI response to context
    conversationContext.value.push({
        role: 'assistant',
        content: data.response
    })

    return data.response
}
</script>
```

## Message Object Structure

Messages in the chat follow this structure:

```javascript
{
    role: 'user' | 'assistant',  // Message sender
    content: String,              // Message text
    timestamp: String             // Formatted time (HH:MM)
}
```

## Styling

The component uses UnoCSS/Tailwind classes and includes:

- **Modal Transitions** - Smooth slide-up animation for chat window
- **Fade Transitions** - Backdrop fade in/out
- **Button Animation** - Rotate animation on open/close
- **Responsive Design** - Fixed positioning and mobile-friendly sizing

### Custom Styling

The component can be styled using standard Tailwind/UnoCSS classes. Key CSS classes:

```css
/* Chat button position and size */
.fixed.bottom-6.right-6.w-14.h-14

/* Chat modal dimensions */
.w-96.h-[600px]

/* Messages container scrolling */
.overflow-y-auto.with-scrollbar
```

## Accessibility

- **Keyboard Support** - Enter to send, Esc to close (via backdrop)
- **Focus Management** - Auto-focus input when chat opens
- **ARIA Labels** - Semantic HTML structure
- **Visual Feedback** - Typing indicators and message states

## Examples

### Without AI Handler

When no `aiHandler` is provided, the chat acts as a simple message logger:

```vue
<ChatComponent chat-title="Message Log" placeholder="Type a message..." />
```

Messages will be added to the chat, but no AI responses will be generated.

### With Mock AI Handler

```vue
<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'

const mockAiHandler = async userMessage => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return mock response
    return `You said: "${userMessage.content}". This is a mock response!`
}
</script>

<template>
    <ChatComponent :ai-handler="mockAiHandler" />
</template>
```

## Best Practices

1. **Error Handling** - Always handle errors in your `aiHandler` function
2. **Loading States** - The component handles typing indicators automatically
3. **Response Format** - Ensure `aiHandler` returns a string or throws an error
4. **Performance** - For long conversations, consider implementing message pagination/virtualization
5. **Context Management** - Maintain conversation context in your `aiHandler` for better AI responses

## Common Use Cases

- AI chatbots and virtual assistants
- Customer support interfaces
- Interactive help systems
- Live chat applications
- Conversational forms
- Educational tutoring interfaces

## Browser Support

Works with all modern browsers that support:

- CSS Grid and Flexbox
- ES6+ JavaScript
- Vue 3 Composition API
- CSS Transitions

## Related Components

- [DialogComponent](/components/dialog-component) - For modal dialogs
- [CardComponent](/components/card-component) - For card-based layouts
- [Typography](/components/typography) - For text styling

## API Reference

### Props Details

#### aiHandler

The `aiHandler` prop accepts an async function with the following signature:

```typescript
type AIHandler = (userMessage: Message) => Promise<string>

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}
```

**Expected Behavior:**

- Receives the user's message object
- Should return a Promise that resolves to a string (the AI response)
- Can throw an error, which will be caught and displayed as an error message
- The typing indicator will show while the Promise is pending

## Troubleshooting

### Chat button not appearing

- Ensure the component is properly imported and registered
- Check z-index conflicts with other fixed/absolute positioned elements

### AI responses not showing

- Verify your `aiHandler` function returns a string
- Check browser console for errors in your AI handler
- Ensure the Promise is resolving correctly

### Messages not scrolling

- Check that the messages container has proper overflow properties
- Verify no CSS conflicts with scrolling behavior

### Typing indicator stuck

- Ensure your `aiHandler` either resolves or rejects, never hangs
- Add timeout logic to your AI API calls
