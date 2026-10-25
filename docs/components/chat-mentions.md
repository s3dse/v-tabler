# Chat Mentions

Chat mentions add asynchronous entity lookup and structured references to `ChatComponent` and
`ChatInput`. The feature is opt-in: without an option provider, the input remains a textarea with a
string model.

## Enable mentions

Pass a `mentionOptionProvider` that returns valid `{ id, label }` options. The provider receives the
canonical mention `type`, the current `query`, and an `AbortSignal`; pass the signal to network calls
so superseded lookups can be cancelled.

```vue
<script setup>
import { ChatComponent } from '@s3_dse/v-tabler'

const findMentionOptions = async ({ type, query, signal }) => {
    const response = await fetch(`/api/${type}s?q=${encodeURIComponent(query)}`, { signal })
    if (!response.ok) throw new Error(`Mention lookup failed with ${response.status}`)
    return response.json() // [{ id: 'brand-1', label: 'ADIDAS' }]
}
</script>

<template>
    <ChatComponent :mention-option-provider="findMentionOptions" />
</template>
```

Option IDs must be non-empty strings or numbers, and labels must be non-empty strings. The default
trigger provider recognizes `@brand`, `@Marke`, and `@partner`, independent of the interface locale.

Create a different trigger provider with the package-root export:

```js
import { createMentionTriggerProvider } from '@s3_dse/v-tabler'

const mentionTriggerProvider = createMentionTriggerProvider({
    brand: ['brand', 'Marke', 'label'],
    partner: ['partner', 'retailer']
})
```

Pass it as `:mention-trigger-provider="mentionTriggerProvider"`. A lower-level custom provider
receives `{ text, cursorIndex }` and returns `null` or:

```js
{
    type: 'brand',
    trigger: 'Marke',
    query: 'adi',
    replaceRange: { start: 12, end: 22 }
}
```

## Draft contract

With mentions enabled, the model is a structured `ChatDraft`, and the submitted user message
includes its three fields:

- `content` is readable text in which mention chips become their labels.
- `serializedContent` is portable text in which mentions use `@trigger[label]` syntax.
- `parts` is the canonical sequence of text and mention parts.

The following complete draft contains both resolved and unresolved mentions:

```json
{
    "content": "Compare ADIDAS with Unknown partner",
    "serializedContent": "Compare @brand[ADIDAS] with @partner[Unknown partner]",
    "parts": [
        { "kind": "text", "text": "Compare " },
        {
            "kind": "mention",
            "type": "brand",
            "trigger": "brand",
            "id": "brand-1",
            "label": "ADIDAS",
            "resolved": true
        },
        { "kind": "text", "text": " with " },
        {
            "kind": "mention",
            "type": "partner",
            "trigger": "partner",
            "id": null,
            "label": "Unknown partner",
            "resolved": false
        }
    ]
}
```

The subpath exports `ChatTextPart`, `ChatResolvedMentionPart`, `ChatUnresolvedMentionPart`,
`ChatMentionPart`, and `ChatDraft`. Part shapes are discriminated by `kind` and, for mentions,
`resolved`:

| Part | Required fields | Invariant |
| --- | --- | --- |
| Text | `kind: 'text'`, `text` | `text` is a string |
| Resolved mention | `kind: 'mention'`, `type`, `trigger`, `id`, `label`, `resolved: true` | `id` is a non-empty string or number |
| Unresolved mention | `kind: 'mention'`, `type`, `trigger`, `label`, `resolved: false` | `id` is omitted or `null` |

`content` and `serializedContent` must match the representations derived from `parts`. Import the
public runtime validator from the focused package entry when accepting an unknown value:

```js
import { isChatDraft } from '@s3_dse/v-tabler/mentions'

if (!isChatDraft(value)) {
    throw new TypeError('Expected a canonical ChatDraft.')
}
```

JavaScript projects can use the generated declarations through JSDoc without adopting TypeScript:

```js
/** @param {import('@s3_dse/v-tabler/mentions').ChatDraft} draft */
const submitDraft = (draft) => draft.serializedContent
```

Breaking changes to these documented shapes follow the package's normal semantic versioning.

## Resolution and editing

Selecting a suggestion creates a resolved mention with its provider ID. Pasted portable mentions
are unresolved because copied text deliberately omits environment-specific IDs. An unresolved chip
must be resolved through the current option provider or converted to plain text before submission.
Exactly one case-insensitive exact label match resolves automatically; otherwise the suggestions
remain available for an explicit choice.

Keyboard behavior:

- ArrowDown and ArrowUp move through suggestions and the “Use as plain text” choice.
- Enter accepts the highlighted choice; Enter submits when the menu is closed and all mentions are
  resolved.
- Enter or Space on an unresolved chip opens its resolution menu.
- Escape, Tab, and Shift+Tab close the menu without changing the draft; Tab keeps normal focus
  movement.
- Shift+Enter inserts a newline.

Portable labels escape `\`, `[` and `]`. Copying a chip produces syntax such as
`@Marke[ADIDAS]`; pasting recognized syntax creates an unresolved mention. Removing the option
provider at runtime replaces the mention composer with the legacy textarea and downgrades its model
to the draft's exact `serializedContent` string. Re-enabling mentions parses those tokens as
unresolved because portable text contains no IDs.

## Transport reference

v-tabler's draft is also the recommended client-owned transport payload. Preserve the field names
and their semantics rather than translating them into a second mention vocabulary:

```js
/** @param {import('@s3_dse/v-tabler/mentions').ChatDraft} draft */
const toChatDraftPayload = ({ content, serializedContent, parts }) => ({
    content,
    serializedContent,
    parts
})

const sendDraft = (draft, signal) =>
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: toChatDraftPayload(draft) }),
        signal
    })
```

This projection intentionally adds no backend-specific fields. HTTP envelopes, authentication,
backend validation, authorization, and persistence remain client responsibilities. A backend that
uses resolved IDs should validate incoming JSON at its own trust boundary.

See [Chat Component](/components/chat-component) for the surrounding chat API and layout options.
