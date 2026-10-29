# Sortable

`SortableRoot`, `SortableItem`, and `SortableHandle` add native desktop drag-and-drop to existing components. They are headless: you render the cards, handles, move buttons, and insertion markers. Sorting is vertical and stays within one list. No extra dependency or library stylesheet is needed.

Items stay in place while dragging. Their upper and lower halves indicate insertion before or after the item. The model changes once on an effective drop, or once when a move callback is called. Dropping outside the list or cancelling the drag leaves the order unchanged.

## Example: decorate an existing card

```vue
<script setup>
import { ref } from 'vue'
import { CardComponent, SortableRoot, SortableItem, SortableHandle } from '@s3_dse/v-tabler'

const records = {
    sales: { title: 'Weekly sales' },
    traffic: { title: 'Monthly traffic' },
    availability: { title: 'Product availability' }
}
const order = ref(['sales', 'traffic', 'availability'])
const disabled = ref(false)
const announcement = ref('')
const announce = ({ value, toIndex }) => {
    announcement.value = `${records[value].title} moved to position ${toIndex + 1} of ${order.value.length}.`
}
</script>

<template>
    <p role="status" aria-live="polite">{{ announcement }}</p>
    <SortableRoot v-model="order" :disabled="disabled" aria-label="Saved analyses" @reorder="announce">
        <SortableItem
            v-for="id in order"
            :key="id"
            :value="id"
            as-child
            v-slot="{ canMoveUp, canMoveDown, moveUp, moveDown }"
        >
            <CardComponent class="sortable-card">
                <SortableHandle as-child>
                    <span class="drag-handle" title="Drag to reorder" aria-hidden="true">⠿</span>
                </SortableHandle>
                <h2>{{ records[id].title }}</h2>
                <button type="button" :disabled="!canMoveUp" :aria-label="`Move ${records[id].title} up`" @click="moveUp">↑</button>
                <button type="button" :disabled="!canMoveDown" :aria-label="`Move ${records[id].title} down`" @click="moveDown">↓</button>
            </CardComponent>
        </SortableItem>
    </SortableRoot>
</template>

<style scoped>
.sortable-card { position: relative; margin-block: 1rem; }
.sortable-card[data-dragging] { opacity: 0.5; }
.sortable-card[data-drop-position]::after { content: ''; position: absolute; left: 0; right: 0; border-top: 3px solid var(--color-primary, #2563eb); pointer-events: none; }
.sortable-card[data-drop-position='before']::after { top: -0.5rem; }
.sortable-card[data-drop-position='after']::after { bottom: -0.5rem; }
.sortable-card:focus-visible { outline: 2px solid var(--color-primary, #2563eb); outline-offset: 2px; }
.drag-handle { cursor: grab; user-select: none; }
</style>
```

For semantic lists, use `SortableRoot as="ul"` or `as="ol"` and `SortableItem as="li"`, placing the card inside each item. The primitives do not impose listbox roles or selection behavior.

## Props

All components accept `as` (`string | Component`) and `asChild` (`boolean`, default `false`). Their default elements are `div`, `div`, and `span`, respectively.

| Component | Prop | Type | Default | Purpose |
| --- | --- | --- | --- | --- |
| `SortableRoot` | `modelValue` | `Array<string \| number>` | Required | Complete order of unique, non-empty string or finite-number IDs. |
| `SortableRoot` | `disabled` | `boolean` | `false` | Disables handles and move callbacks; cancels any active drag. |
| `SortableItem` | `value` | `string \| number` | Required | An ID present in the root model. |

Use stable IDs and matching Vue keys, with one item per ID. IDs are not coerced: numeric `1` and string `'1'` are different IDs. Invalid IDs, duplicates, missing item IDs, and missing component contexts throw descriptive errors. Replacing or mutating the model externally cancels an active drag.

`asChild` composes behavior onto one child element or Vue component without adding a wrapper. A custom child component must have a single DOM root, forward attributes and event handlers, and preserve the injected `draggable`, `tabindex`, and data attributes. Existing consumer handlers remain attached; cancelling `dragstart` with `preventDefault()` cancels the drag.

## SortableItem default slot

| Property | Type | Meaning |
| --- | --- | --- |
| `index` | `number` | Current zero-based position. |
| `isDragging` | `boolean` | This item is the active drag source. |
| `dropPosition` | `'before' \| 'after' \| null` | Insertion marker for this item. |
| `canMoveUp`, `canMoveDown` | `boolean` | Whether that movement is currently allowed. |
| `moveUp()`, `moveDown()` | `function` | Move one position; no-op at boundaries or when disabled. |

## Events and styling

`SortableRoot` emits:

- `update:modelValue(nextIds)` with a new array, without mutating the supplied array.
- `reorder({ value, fromIndex, toIndex })` after an effective move. Both indices are zero-based; `toIndex` is the final position after removing and reinserting the item.

No model or reorder event is emitted while hovering, for a cancelled drag, or for an unchanged order. Foreign drops and transfers between roots are ignored. Only `SortableHandle` is draggable; the containing item supplies the native drag image.

Items expose `data-dragging` while being dragged and `data-drop-position="before|after"` at a valid insertion point. Use these attributes or the slot state to render feedback without changing item geometry. The previous insertion point remains droppable while crossing gaps within the root. Leaving the root clears its marker; re-entering establishes another target. `dragend` clears the active drag.

## Accessibility and touch

Native dragging is a pointer interaction. Consumers **must provide labelled move buttons**, using `canMoveUp`/`canMoveDown` for their disabled state, so keyboard and touch users can reorder. Provide a polite live region and use the `reorder` event for localized announcements, as in the example. Do not use the deprecated `aria-grabbed` or `aria-dropeffect` attributes.

After a button move, focus returns to the triggering control. If that control becomes disabled at a boundary, focus moves to the item through its default `tabindex="-1"`; style its focus indicator. Focus management only runs when the triggering control was inside the moved item.

Touch dragging, horizontal/grid layouts, nested sortable lists, cross-list transfers, and custom autoscrolling are outside this version. Test native drag images and scrolling in your supported browsers. Reorder-mode guards, draft order, Save/Cancel, and backend persistence belong to the consuming application.
