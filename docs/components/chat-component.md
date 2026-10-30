# Chat Component

The `ChatComponent` is a chat interface component designed for AI assistants. It provides a modern, customizable chat UI with message history, and configurable request/response handling.

## Features

- **Floating Chat Button** - Fixed position chat toggle button with smooth animations
- **Embedded Workspace Mode** - Parent-sized, neutral chat presentation for page layouts
- **Modal Chat Interface** - Slide-up chat window with backdrop
- **Message History** - Scrollable message container with auto-scroll to bottom
- **Typing Indicator** - Visual feedback when AI/assistant is responding
- **AI Integration** - Promise responses or incremental updates through an optional callback
- **Optional Mentions** - Async brand and partner autocomplete with portable mention chips

## Props

| Prop Name                | Type     | Default                              | Description                                                                                                                 |
| ------------------------ | -------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `initialMessage`         | String   | `'Hello! How can I help you today?'` | The first message displayed when the chat is opened                                                                         |
| `placeholder`            | String   | `'Type your message...'`             | Placeholder text for the message input field                                                                                |
| `aiHandler`              | Function | `null`                               | Receives the user message, AbortSignal, and update callback; resolves with a response object or completes published updates |
| `mentionOptionProvider`  | Function | `null`                               | Enables mentions and returns entity options for the active trigger                                                          |
| `mentionTriggerProvider` | Function | default provider                     | Overrides how active mention triggers are detected                                                                          |
| `chatTitle`              | String   | `'AI Assistant'`                     | Title displayed in the chat header                                                                                          |
| `size`                   | String   | `'default'`                          | Card size: `'auto'`, `'compact'`, `'default'`, or `'wide'`; ignored by the embedded variant                                 |
| `floating`               | Boolean  | `false`                              | Renders a fixed launcher, overlay, and card chat when enabled                                                               |
| `variant`                | String   | `'card'`                             | Visual presentation: `'card'` or `'embedded'`; embedded cannot be combined with `floating`                                  |

## Slots

| Slot name  | Slot props                                 | Description                                                                |
| ---------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `title`    | none                                       | Replaces the default chat title                                            |
| `messages` | `{ messages, variant }`                    | Provides a custom message view and exposes the active presentation variant |
| `input`    | `{ inputProps, inputEvents, setInputRef }` | Replaces the built-in input while retaining chat state and handlers        |

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

## Visual Variants

The default `card` variant preserves the bordered chat window and supports all `size` values. It
can render inline or as a floating launcher:

```vue
<ChatComponent />
<ChatComponent floating size="wide" />
```

Use `variant="embedded"` when the chat is one pane of a larger page. Embedded chat removes card
chrome, uses neutral surfaces, and fills its parent. The parent must provide a constrained height
when the message history should scroll internally:

```vue
<template>
    <div class="h-[600px] min-h-0">
        <ChatComponent variant="embedded" />
    </div>
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'
</script>
```

`variant="embedded"` cannot be combined with `floating`. Custom message renderers receive the
active `variant` through the `messages` slot and are responsible for adapting their own visual
presentation:

```vue
<ChatComponent variant="embedded">
    <template #messages="{ messages, variant }">
        <CustomMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :variant="variant"
        />
    </template>
</ChatComponent>
```

`ChatHeader`, `ChatInput`, and `TypingIndicator` also accept the same `variant` values when they are
used independently.

## Mentions

Mentions are opt-in. Supplying an option provider replaces the textarea with the mention composer;
without one, `ChatInput` keeps its existing string model and behavior. The default trigger provider
recognizes `@brand`, `@Marke`, and `@partner`:

```vue
<script setup>
const findMentionOptions = async ({ type, query, signal }) => {
    const response = await fetch(`/api/${type}s?q=${encodeURIComponent(query)}`, { signal })
    return response.json() // [{ id, label }]
}
</script>

<template>
    <ChatComponent :mention-option-provider="findMentionOptions" />
</template>
```

Mention-enabled inputs use a structured draft rather than a string. See
[Chat Mentions](/components/chat-mentions) for the provider APIs, interaction behavior, portable
syntax, public draft contract, and transport guidance.

### Custom input

Use the `input` slot for a complete input replacement. Bind the supplied props and events and
register a component that exposes `focus()` and `clear()`:

```vue
<ChatComponent>
    <template #input="{ inputProps, inputEvents, setInputRef }">
        <CustomChatInput
            :ref="setInputRef"
            v-bind="inputProps"
            v-on="inputEvents"
        />
    </template>
</ChatComponent>
```

### Additional input hints

`ChatInput` provides an optional `additional-hints` slot between the keyboard shortcuts and the
AI disclaimer. Its content inherits the hint block's muted text styling and spacing, and is
hidden together with the built-in hints when `showHint` is `false`.

```vue
<ChatInput v-model="draft">
    <template #additional-hints>
        <p>Additional guidance for this input.</p>
    </template>
</ChatInput>
```

To use this within `ChatComponent`, render `ChatInput` through the `input` slot above, preserving
the supplied props, events, and input reference registration.

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

### Different Card Sizes

The `size` prop adjusts card width to suit its content. All card sizes are responsive (full-width
on mobile, fixed on desktop). Embedded chat ignores this prop and fills its parent.

```vue
<template>
    <!-- Auto: Fully responsive - adapts to all breakpoints -->
    <ChatComponent size="auto" />

    <!-- Compact: 384px on desktop - good for simple text chat -->
    <ChatComponent size="compact" />

    <!-- Default: 600px on desktop - balanced for most content -->
    <ChatComponent size="default" />

    <!-- Wide: 700-800px on desktop - ideal for rich content like charts -->
    <ChatComponent size="wide" />
</template>

<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'
</script>
```

**Size Breakdown:**

- `auto`: Responsive across all breakpoints (384px → 600px → 700px → 800px)
- `compact`: 384px on md+ screens
- `default`: 600px on md+ screens
- `wide`: 700px on md+, 800px on lg+ screens

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
const handleAiMessage = async (userMessage, signal) => {
    // userMessage object contains: { role, content, timestamp }

    try {
        // Call your AI API
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage.content
            })
        })

        const data = await response.json()

        return { content: data.response }
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

const handleAiWithContext = async (userMessage) => {
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

    return { content: data.response }
}
</script>
```

## Message Object Structure

Messages in the chat follow this structure:

```javascript
{
    role: 'user' | 'assistant',  // Message sender
    content: String,              // Message text
    serializedContent?: String,  // Portable mention syntax when mentions are enabled
    parts?: Array,               // Structured text and mention parts
    timestamp: Date,             // Created once when the message is inserted
    requestState?: 'streaming' | 'complete' | 'cancelled' | 'error',
    requestError?: String        // Safe generic error text after an incremental reply fails
}
```

## Styling

The component uses UnoCSS/Tailwind classes and includes:

- **Modal Transitions** - Smooth slide-up animation for chat window
- **Fade Transitions** - Backdrop fade in/out
- **Button Animation** - Rotate animation on open/close
- **Responsive Card Design** - Fixed positioning and mobile-friendly sizing
- **Embedded Layout** - Full-width and full-height layout controlled by the parent

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

const mockAiHandler = async (userMessage) => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock response
    return { content: `You said: "${userMessage.content}". This is a mock response!` }
}
</script>

<template>
    <ChatComponent :ai-handler="mockAiHandler" />
</template>
```

## Best Practices

1. **Error Handling** - Always handle errors in your `aiHandler` function
2. **Loading States** - The component handles typing indicators automatically
3. **Response Format** - Return `{ content, ...metadata }`, or publish updates and resolve without a final response
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
interface AIResponse {
    content: string
    id?: string
    [key: string]: unknown
}

type MessageUpdate = Partial<AIResponse>

type AIHandler = (
    userMessage: Message,
    signal: AbortSignal,
    updateMessage: (patch: MessageUpdate) => void
) => Promise<MessageUpdate | void>

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    newConversation?: boolean
}
```

**Expected Behavior:**

- Existing handlers can keep accepting only the user message and AbortSignal;
  they may ignore the new third argument. Final-only handlers must return an
  object with string `content`.
- `updateMessage(patch)` synchronously creates or updates one assistant reply.
  `content` is the complete text so far: it replaces content rather than appending
  a delta. Other supplied fields shallow-merge; omitted fields retain their values.
- Metadata may arrive before content. A server-owned `id` can arrive later without
  replacing the placeholder or its timestamp. Custom message slots see the same
  reactive message object throughout the request.
- A final returned object merges into that reply. A returned aggregate replaces
  content once, so it is not duplicated. After publishing an update, a handler
  may instead resolve with `undefined` to finalize its latest reply. Completing
  without either updates or a response is an error.
- Updates must be non-null, non-array objects. A supplied `content` must be a
  string. `role`, `timestamp`, `requestState`, `requestError`, and `__proto__` are
  protected fields; publishing them is a handler error. Final patches after
  updates follow the same rules. Other metadata remains application-owned.

#### Incremental replies

The transport remains in your application. In this example, `appReplyStream`
represents your own adapter producing message patches with complete text so far:

```javascript
const handleAiMessage = async (userMessage, signal, updateMessage) => {
    for await (const patch of appReplyStream(userMessage, signal)) {
        updateMessage(patch)
    }
    // No final response is needed after publishing updates.
}
```

Callback-created replies expose `requestState`: `streaming` while the handler is
pending, followed by `complete`, `cancelled`, or `error`. On failure,
`requestError` contains the existing safe generic error text. These fields belong
to the library. Final-only replies retain their existing shape.

The default renderer shows activity for an empty active reply, preserves partial
text with a stopped label on cancellation, and shows a safe error notice on the
same reply after failure. Custom message slots can use those lifecycle fields
and their own progress metadata. `isTyping` continues to mean that a request is
active, keeping input disabled and the cancel control available. The composable's
`isAwaitingResponse` controls the separate typing indicator before a placeholder
exists; once updates begin, the reply itself shows activity.

#### Cancellation and cleanup

Use the supplied AbortSignal in your transport. Cancel aborts it and releases the
local busy state. Clearing or resetting the chat also cancels first, and
`ChatComponent` cancels on unmount. Direct `useChatLogic()` consumers must call
`cancelCurrentRequest()` when disposing their UI.

Late updates, final responses, and errors from cancelled or cleared requests are
ignored, including when a newer request is already running. Updates stop being
accepted as soon as the handler settles. Partial text remains visible on cancel;
no generic error message is added. A failure after updates marks the existing
reply instead of inserting another assistant message. Raw exception details are
logged rather than displayed.

Aborting the signal cannot stop a handler that ignores it. Server-side work and
cleanup acknowledgment remain the transport adapter's responsibility.

## Troubleshooting

### Chat button not appearing

- Ensure the component is properly imported and registered
- Check z-index conflicts with other fixed/absolute positioned elements

### AI responses not showing

- Verify your `aiHandler` returns `{ content: '...' }` or publishes message updates
- Check browser console for errors in your AI handler
- Ensure the Promise is resolving correctly

### Messages not scrolling

- Check that the messages container has proper overflow properties
- Verify no CSS conflicts with scrolling behavior

### Typing indicator stuck

- Ensure your `aiHandler` either resolves or rejects, never hangs
- Add timeout logic to your AI API calls
