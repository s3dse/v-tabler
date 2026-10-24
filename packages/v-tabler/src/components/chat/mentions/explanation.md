The implementation is split cleanly: `ChatInput` selects legacy versus mention mode, `ChatMentionComposer` coordinates behavior, and the editor/menu/chip components own their respective DOM concerns.

One important caveat: the current public draft still uses `kind` / `type` / `resolved`. The newer OASIStant-oriented `type` / `entityType` / `status` contract we discussed has not yet been applied.

## 1. Public entry points

[ChatComponent.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/ChatComponent.vue:44) exposes:

- `mentionOptionProvider`
- `mentionTriggerProvider`
- The full `input` slot with `inputProps`, `inputEvents`, and `setInputRef`

It passes the mention providers through its computed input props at [ChatComponent.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/ChatComponent.vue:189).

[ChatInput.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/ChatInput.vue:17) contains the compatibility switch:

```text
mentionOptionProvider installed?
├── no  → original textarea and String model
└── yes → ChatMentionComposer and structured ChatDraft
```

The switch is deliberately based only on the option provider at [ChatInput.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/ChatInput.vue:155). A trigger provider alone does not enable mentions because v-tabler would have no entity data to show.

## 2. The draft model

[mentionDraft.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/mentionDraft.js:32) is the domain layer. Components do not manually maintain three competing representations. `createMentionDraft(parts)` derives:

- `content`: readable text containing labels
- `serializedContent`: portable clipboard representation
- `parts`: structured text and mentions

For example:

```js
{
    content: 'Sales for DYSON',
    serializedContent: 'Sales for @Marke[DYSON]',
    parts: [
        { kind: 'text', text: 'Sales for ' },
        {
            kind: 'mention',
            type: 'brand',
            trigger: 'Marke',
            id: '123',
            label: 'DYSON',
            resolved: true
        }
    ]
}
```

The same module owns:

- Parsing copied mentions into unresolved parts at [mentionDraft.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/mentionDraft.js:49)
- Runtime validation of incoming drafts
- Immutable range replacement at [mentionDraft.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/mentionDraft.js:115)
- Escaping `\`, `[` and `]`
- Atomic clipboard serialization
- Merging adjacent text parts

That keeps string-index calculations out of the Vue components.

## 3. Trigger detection

[mentionTriggerProvider.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/mentionTriggerProvider.js:48) creates trigger providers from definitions such as:

```js
createMentionTriggerProvider({
    brand: ['brand', 'Marke'],
    partner: ['partner']
})
```

The generated provider examines only the text before the supplied caret. It returns:

```js
{
    type: 'brand',
    trigger: 'Marke',
    query: 'adi',
    replaceRange: { start, end }
}
```

Notable behavior:

- Matching is case-insensitive.
- Trigger aliases are independent of the interface locale.
- Queries may contain spaces.
- Matching works in the middle of an existing prompt.
- Email-like text is excluded through the trigger boundary.
- Duplicate aliases across entity types fail immediately.

The exported default provider is created at [mentionTriggerProvider.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/mentionTriggerProvider.js:94).

## 4. Composer orchestration

[ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:122) is the coordinator. It owns:

- The current structured draft
- The active insertion or resolution context
- Trigger detection
- Option lookup
- Selection
- Keyboard behavior
- Clipboard behavior
- Recall
- Submission

When the editor reports a caret position, `updateActiveTrigger()` runs the trigger provider. If it finds a new match, the composer stores an insertion context and starts a search.

The Escape fix lives around [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:127). The composer remembers the dismissed match, so the keyup/caret event following Escape cannot immediately reopen it. A genuinely changed query clears that suppression.

Selecting an option at [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:209):

1. Creates a resolved mention part.
2. Replaces the entire `@Marke adi` range atomically.
3. Regenerates the draft.
4. Places the caret after the chip.
5. Closes the menu without retriggering lookup.

Keyboard behavior is centralized at [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:267):

- Up/down navigates candidates.
- Enter selects while the menu is open.
- Escape dismisses the current trigger.
- Shift+Enter inserts `\n`.
- Enter submits when no unresolved mentions remain.
- Up recalls the last user draft when permitted.

## 5. The contenteditable editor

[ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:1) owns browser-specific editing mechanics.

It renders:

- Text parts as spans
- Mentions as `ChatMentionChip`
- A render-only trailing `<br>` for a visible final blank line

The trailing break at [ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:38) is why one Shift+Enter now immediately produces a visible newline. `readDomParts()` explicitly ignores this sentinel so it never enters the model.

Selection ranges are translated between DOM positions and plain-text offsets at [ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:117). A chip occupies `label.length` characters in that logical coordinate system.

`readDomParts()` at [ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:192) walks the edited DOM back into text and mention parts. Mention DOM elements retain their structured object rather than being reduced to their label.

The focus-flicker safeguard is at [ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:220):

- The editor element is never keyed by its content.
- Its DOM identity remains stable.
- Normal typing only compares the current top-level child identities.
- If the browser destructively rewrites the editable DOM, the saved Vue-owned nodes are restored before Vue patches the new draft.
- The fallback is not invoked during ordinary typing.

Atomic Backspace/Delete behavior is handled at [ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:261). IME composition events are ignored until composition completes.

## 6. Chips

[ChatMentionChip.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionChip.vue:1) is intentionally small.

The chip is `contenteditable="false"`, so the browser treats it as an atomic object. It renders only the label, while type and resolution information are exposed through styling, title, and accessible text.

Unresolved chips additionally become keyboard-accessible buttons. Activating one asks the composer to resolve it.

## 7. Remote option lookup

[useMentionOptions.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/useMentionOptions.js:51) isolates async behavior.

A normal lookup:

1. Opens the menu in loading state.
2. Waits for the 200 ms debounce.
3. Aborts the previous request.
4. Calls the client provider with `{ type, query, signal }`.
5. Validates that the result is an array of usable `{ id, label }` objects.
6. Ignores stale, out-of-order responses.
7. Publishes options or an error state.

Unresolved-chip resolution bypasses the debounce via `searchImmediately()`.

This composable knows nothing about HTTP, authentication, tenants, or entity endpoints. Those stay in the client-supplied provider.

## 8. Menu positioning and accessibility

[ChatMentionMenu.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionMenu.vue:1) is still an accessible listbox, while Reka’s Popover handles geometry.

The Reka composition in [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:31):

- Anchors to the full editor width
- Prefers the bottom
- Flips above when necessary
- Shifts horizontally inside the viewport
- Uses fixed positioning
- Hides if its anchor becomes detached
- Prevents Popover autofocus from disturbing the caret

The editor exposes `aria-expanded`, `aria-controls`, and `aria-activedescendant`; each candidate is a `role="option"`.

## 9. Copy, paste, and unresolved mentions

Copying uses portable text such as:

```text
@Marke[ADIDAS]
```

The ID is deliberately omitted because it may not be valid in another customer or environment.

Pasting at [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:309) recognizes configured triggers and creates an unresolved mention with `id: null`.

Resolving an unresolved chip at [ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:336):

- Searches using its entity type and label.
- Automatically resolves exactly one case-insensitive exact match.
- Otherwise leaves the candidates visible.
- Offers “Use as plain text” if resolution is impossible or unwanted.

Submission remains blocked while any unresolved mention exists.

## 10. Submission and OASIStant handoff

[useChatLogic.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/useChatLogic.js:163) accepts either a string or structured draft.

For a mention draft it:

1. Trims only the outer text parts.
2. Rejects unresolved mentions.
3. Stores readable `content`.
4. Preserves `serializedContent` and `parts`.
5. Calls the AI handler with the complete user message.

The AI handler therefore receives something like:

```js
{
    role: 'user',
    content: 'How much sales did DYSON have?',
    serializedContent: 'How much sales did @brand[DYSON] have?',
    parts: [...],
    newConversation: true,
    timestamp: Date
}
```

For OASIStant, Trendentify must forward `parts`; sending only `content` would discard the entity-resolution benefit.

Recall at [useChatLogic.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/useChatLogic.js:199) clones the structured parts so resolved mentions remain resolved within the current chat.

## 11. Customization and exports

`ChatInput`, the default/custom trigger providers, and trigger definitions are exported through [chat/index.js](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/index.js:1) and the package root.

A client can customize at two levels:

- Keep the mention composer and replace only trigger detection.
- Replace the entire input through the `ChatComponent` input slot.

## Pending contract decision

The current v-tabler shape and our proposed OASIStant transport shape map as follows:

| Current v-tabler  | Proposed transport    |
| ----------------- | --------------------- |
| `kind: 'mention'` | `type: 'mention'`     |
| `type: 'brand'`   | `entityType: 'brand'` |
| `resolved: true`  | `status: 'resolved'`  |

Because the feature is not released yet, I would align these before integrating OASIStant rather than maintain two nearly identical contracts.

No code changed or tests were rerun for this read-only walkthrough. The main remaining integration risk is forwarding only readable `content` and accidentally dropping the structured entity parts.
