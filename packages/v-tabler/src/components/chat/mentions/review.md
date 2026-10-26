What this change does: The latest commits correctly fix stale option reuse, external-model normalization, mention overlap, IME handling, keyboard activation, menu scrolling, and disabled-state behavior. The redundant palette test is also gone. The component structure remains sound; five functional/integration items and one cleanup item remain.

## Must fix

1. **Editing during resolution can still apply an ID to the wrong mention** ([ChatMentionComposer.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionComposer.vue:384))
    - **What this is:** Resolution still stores a mutable `partIndex` while awaiting the provider.
    - **Problem:** Resolve mention B, then delete preceding parts while the request is pending. Mention C can move into B’s old index and receive B’s result.
    - **Fix:** Cancel the active resolution whenever `handleInputParts()` receives an editor change. Add one deferred-provider regression test that edits preceding content.
    - **If we skip it:** A chip can display one entity while carrying another entity’s ID.

    -> Fixed

2. **Line-break parsing and caret offsets still use different rules** ([ChatMentionEditor.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionEditor.vue:86))
    - **What this is:** DOM parsing counts `<br>` as `\n`, but `Range.toString()` and `findCaretPoint()` do not count it.
    - **Problem:** A mobile keyboard or browser-generated `<br>` makes trigger and replacement offsets one character short.
    - **Fix:** Centralize logical DOM length calculation and count `<br>` as one character everywhere. Extend the existing `<br>` test to assert the caret and a subsequent mention replacement.
    - **If we skip it:** Multiline editing can replace the wrong text on some browsers.

    -> Fixed

3. **Resolved chips still suppress the editor’s caret update** ([ChatMentionChip.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/ChatMentionChip.vue:16))
    - **What this is:** `@click.stop` runs for resolved and unresolved chips.
    - **Problem:** Clicking a resolved chip while autocomplete is open leaves the old trigger context active. Selecting an option can still replace that old trigger.
    - **Fix:** Remove `.stop` from the click handler; keep propagation suppression for keyboard activation. Add one open-menu/resolved-chip regression test.
    - **If we skip it:** The menu can act on a caret position the user has left.

    -> Fixed

4. **The OASIStant transport contract is still undecided** ([explanation.md](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/explanation.md:266), [oasistant-chat.js](/Users/sebastian/git/trendentify/trendentify_app/vueapp/src/services/oasistant-chat.js:63))
    - **What this is:** v-tabler emits `{ kind, type, resolved }`, while the proposed transport uses `{ type, entityType, status }`. The current OASIStant client still sends only `content`.
    - **Problem:** Resolved IDs disappear before reaching the backend.
    - **Fix:** Select one schema before integration, validate it at the request boundary, and test that `parts` reach the backend unchanged.
    - **If we skip it:** Mentions look resolved but provide no deterministic grounding to OASIStant.

    -> Fixed on v-tabler side

## Should fix

5. **Removing the provider still exposes an object through the textarea** ([ChatInput.vue](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/ChatInput.vue:17))
    - **What this is:** Provider presence switches between the structured composer and string textarea.
    - **Problem:** Changing `mentionOptionProvider` from a function to `null` leaves a structured draft in `v-model`; the textarea displays `[object Object]`.
    - **Fix:** Convert the draft to `serializedContent` when mentions are disabled, or explicitly document and enforce that provider presence is immutable.
    - **If we skip it:** Runtime feature flags and provider removal break the input.

    -> Fixed

6. **A stale review report is committed beside production components** ([review.md](/Users/sebastian/git/v-tabler/packages/v-tabler/src/components/chat/mentions/review.md:1))
    - **What this is:** The file contains absolute local paths and says six already-fixed defects remain.
    - **Problem:** It is unreferenced and now contradicts the implementation.
    - **Fix:** Delete it or move historical review notes outside the component source.
    - **If we skip it:** Future maintainers may treat outdated findings as current documentation.

The newly added tests mostly protect concrete regressions and public behavior; I would keep them. No broad component split or new abstraction is warranted.

Verified: all 460 tests passed, and focused ESLint checks passed.

Verdict: fix 1–3 before releasing the component; settle 4 before OASIStant integration.  
Lean: −49 lines possible. Not checked: production build or manual Chrome/Safari/mobile editing; native `contenteditable` selection and undo remain the main risk.
