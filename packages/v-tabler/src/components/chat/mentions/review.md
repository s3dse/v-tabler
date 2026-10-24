What this change does: It adds optional mention autocomplete, structured drafts, and portable copy/paste syntax to chat input. **The component boundaries are good, but six behavior defects need fixing before release.**

The strongest choices are the pure draft helpers, separate async lookup composable, client-supplied providers, and small menu/chip components. I would keep this structure and focus the refactoring on state consistency and editing events.

**Must fix**

1. **[P1] Stale suggestions can assign the wrong entity ID** — [useMentionOptions.js:94](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/useMentionOptions.js:94)
    - **What this is:** Clicking an unresolved chip starts an immediate lookup.
    - **Problem:** That lookup retains previous options. Load brand suggestions, activate an unresolved partner chip, then press Enter while loading: the partner receives the old brand’s ID and label. I reproduced this.
    - **Fix:** Clear options and reset highlighting for every new lookup. Reject selection while loading.
    - **If skipped:** A valid-looking resolved mention can reference the wrong entity.

2. **[P2] External model updates bypass the unresolved-mention block** — [ChatMentionComposer.vue:370](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:370)
    - **What this is:** The composer accepts strings and normalizes them into drafts.
    - **Problem:** After mounting, set `modelValue` to `Sales for @brand[ADIDAS]`. The editor displays an unresolved chip, but the send button remains enabled and submits the raw string.
    - **Fix:** Publish the normalized draft back to the model. Rendering, validation, and submission must use the same normalized value.
    - **If skipped:** The UI and submitted data disagree.

3. **[P2] Trigger detection can replace an existing resolved chip** — [ChatMentionComposer.vue:160](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:160)
    - **What this is:** Trigger detection scans readable content, where chips appear as ordinary labels.
    - **Problem:** Put plain text `@brand ` before an existing ADIDAS chip and move the caret after it. The detector treats the chip’s label as the query; selecting a suggestion replaces the existing chip too.
    - **Fix:** Reject trigger matches whose replacement range intersects a mention.
    - **If skipped:** Editing surrounding text can silently overwrite resolved entities.

4. **[P2] IME composition still reaches trigger detection** — [ChatMentionEditor.vue:237](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:237)
    - **What this is:** Input and keydown handlers pause during composition, but keyup still emits caret changes.
    - **Problem:** During Japanese composition, the DOM contains characters absent from the draft. Keyup passes that newer caret offset into the older text, producing a `RangeError`. I reproduced this.
    - **Fix:** Suppress caret-change events during composition and detect triggers after committing the composed input.
    - **If skipped:** IME input produces errors during normal typing.

5. **[P2] “Use as plain text” lacks working keyboard activation** — [ChatMentionMenu.vue:40](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionMenu.vue:40)
    - **What this is:** Menu buttons perform actions exclusively on `mousedown`.
    - **Problem:** Native button activation generates `click`, which does nothing here. The fallback is also absent from the composer’s arrow/Enter navigation.
    - **Fix:** Move activation to `click`, retain mouse-down prevention for caret preservation, and provide keyboard access to the fallback. Keep navigation consistent with the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
    - **If skipped:** Keyboard and assistive-technology users cannot reliably convert unresolved mentions.

6. **[P2] Disabled inputs still allow chip resolution** — [ChatMentionChip.vue:44](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionChip.vue:44)
    - **What this is:** Disabling changes the editor’s `contenteditable` attribute.
    - **Problem:** Unresolved chips remain interactive. Clicking one while disabled still calls the provider and updates the draft.
    - **Fix:** Propagate disabled state to chips, guard mutations, and close/cancel active lookups when disabled.
    - **If skipped:** The input can change while consumers expect it to be locked.

The most useful architectural polish is **one normalized draft shared by rendering, validation, and submission**, plus consistent handling of loading, composition, and disabled states. The existing component split supports those fixes without additional layers.

All **111 existing chat tests passed**. I confirmed the six defects with temporary tests outside the repository. No project code or tests changed; permanent regression tests should protect these behaviors rather than duplicate CSS class lists.

**Verdict: keep the design; fix 1–6 before release.**

Not checked: real-browser editing, mobile keyboards, screen readers, or the production build. Native undo and selection behavior remain unverified.
