The implementation is split cleanly: `ChatInput` selects legacy versus mention mode, `ChatMentionComposer` coordinates behavior, and the editor/menu/chip components own their respective DOM concerns.

The existing `kind` / `type` / `resolved` vocabulary is the canonical public contract. Its JSDoc types and runtime validator are published from `@s3_dse/v-tabler/mentions`.

## 1. Public entry points

[ChatComponent.vue](../ChatComponent.vue) exposes:

- `mentionOptionProvider`
- `mentionTriggerProvider`
- The full `input` slot with `inputProps`, `inputEvents`, and `setInputRef`

It passes both mention providers through its computed input props.

[ChatInput.vue](../ChatInput.vue) contains the compatibility switch:

```text
mentionOptionProvider installed?
├── no  → original textarea and String model
└── yes → ChatMentionComposer and structured ChatDraft
```

The switch is deliberately based only on the option provider. A trigger provider alone does not enable mentions because v-tabler would have no entity data to show.

Removing the option provider at runtime converts the current structured draft to its portable `serializedContent` string before rendering the legacy textarea.

## 2. The draft model

[mentionDraft.js](./mentionDraft.js) is the domain layer. Components do not manually maintain three competing representations. `createMentionDraft(parts)` derives:

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

- Parsing copied mentions into unresolved parts
- Runtime validation of incoming drafts
- Immutable range replacement
- Escaping `\`, `[` and `]`
- Atomic clipboard serialization
- Merging adjacent text parts

That keeps string-index calculations out of the Vue components.

## 3. Trigger detection

[mentionTriggerProvider.js](./mentionTriggerProvider.js) creates trigger providers from definitions such as:

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

The module also exports a default provider for the built-in triggers.

## 4. Composer orchestration

[ChatMentionComposer.vue](./ChatMentionComposer.vue) is the coordinator. It owns:

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

The composer remembers a dismissed match, so the keyup/caret event following Escape cannot immediately reopen it. A genuinely changed query clears that suppression.

Selecting an option:

1. Creates a resolved mention part.
2. Replaces the entire `@Marke adi` range atomically.
3. Regenerates the draft.
4. Places the caret after the chip.
5. Closes the menu without retriggering lookup.

Keyboard behavior is centralized in the composer:

- Up/down navigates candidates.
- Enter selects while the menu is open.
- Escape dismisses the current trigger.
- Shift+Enter inserts `\n`.
- Enter submits when no unresolved mentions remain.
- Up recalls the last user draft when permitted.

## 5. The contenteditable editor

[ChatMentionEditor.vue](./ChatMentionEditor.vue) owns browser-specific editing mechanics.

It renders:

- Text parts as spans
- Mentions as `ChatMentionChip`
- A render-only trailing `<br>` for a visible final blank line

The trailing break is why one Shift+Enter immediately produces a visible newline. DOM parsing and caret mapping ignore this sentinel and a browser's lone unmarked placeholder `<br>` in an otherwise empty editor; every other `<br>` counts as one `\n` in both the draft and logical caret offsets.

Selection ranges are translated between DOM positions and plain-text offsets. A chip occupies `label.length` characters in that logical coordinate system.

`readDomParts()` walks the edited DOM back into normalized text and mention parts. Mention DOM elements retain their structured object rather than being reduced to their label.

The focus-flicker safeguard works as follows:

- The editor element is never keyed by its content.
- Its DOM identity remains stable.
- Normal typing only compares the current top-level child identities.
- If the browser destructively rewrites the editable DOM, the saved Vue-owned nodes are restored before Vue patches the new draft.
- The fallback is not invoked during ordinary typing.

Backspace and Delete treat mentions atomically. IME composition events are ignored until composition completes.

## 6. Chips

[ChatMentionChip.vue](./ChatMentionChip.vue) is intentionally small.

The chip is `contenteditable="false"`, so the browser treats it as an atomic object. It renders only the label, while type and resolution information are exposed through styling, title, and accessible text.

Unresolved chips additionally become keyboard-accessible buttons. Activating one asks the composer to resolve it. When the input is disabled, they remain exposed as disabled buttons but leave the Tab sequence and cannot start resolution. Disabling the input also closes the menu and cancels pending lookups. Their warning colors use the theme's `warning` status family, which clients can override.

## 7. Remote option lookup

[useMentionOptions.js](./useMentionOptions.js) isolates async behavior.

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

[ChatMentionMenu.vue](./ChatMentionMenu.vue) is an accessible listbox, while Reka’s Popover handles geometry.

The Reka composition:

- Anchors to the full editor width
- Prefers the bottom
- Flips above when necessary
- Shifts horizontally inside the viewport
- Uses fixed positioning
- Hides if its anchor becomes detached
- Prevents Popover autofocus from disturbing the caret

The editor exposes `aria-expanded`, `aria-controls`, and `aria-activedescendant`; each candidate is a `role="option"`.
Arrow keys cycle through candidates and, during chip resolution, the final “Use as plain text” option.
Enter accepts the highlighted choice while focus stays in the editor. Conversion requires an explicit
arrow-key, hover, or click choice; loading, empty, and error states do not select it automatically.
Option buttons stay outside the Tab sequence, and the highlighted row scrolls into view.
Escape and Tab dismiss without selecting; Tab and Shift+Tab retain normal focus movement.

## 9. Copy, paste, and unresolved mentions

Copying uses portable text such as:

```text
@Marke[ADIDAS]
```

The ID is deliberately omitted because it may not be valid in another customer or environment.

Pasting recognizes configured triggers and creates an unresolved mention with `id: null`.

Resolving an unresolved chip:

- Searches using its entity type and label.
- Automatically resolves exactly one case-insensitive exact match unless plain text was explicitly highlighted.
- Otherwise leaves the candidates visible.
- Offers “Use as plain text” if resolution is impossible or unwanted.

Submission remains blocked while any unresolved mention exists.

## 10. Submission and client handoff

[useChatLogic.js](../useChatLogic.js) accepts either a string or structured draft.

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

Clients that need resolved entity IDs must forward `parts`; sending only `content` discards the entity-resolution benefit.

Recall clones the structured parts so resolved mentions remain resolved within the current chat.

## 11. Customization and exports

`ChatInput`, the default/custom trigger providers, and trigger definitions are exported through [chat/index.js](../index.js) and the package root.

A client can customize at two levels:

- Keep the mention composer and replace only trigger detection.
- Replace the entire input through the `ChatComponent` input slot.

Unresolved states use `colors.warning.{DEFAULT,bg,border,hover}`. The base preset also provides the matching `success` family, and custom themes can override either status through the existing theme merge.

## Public contract

The package subpath `@s3_dse/v-tabler/mentions` publishes JSDoc declarations for the draft and part types together with `isChatDraft()` for runtime validation. The component payload and the transport shape therefore share the same `content`, `serializedContent`, and `parts` semantics without a second field vocabulary.

HTTP envelopes, authentication, backend validation, and persistence remain client responsibilities. The main integration risk is forwarding only readable `content` and accidentally dropping the structured entity parts.
