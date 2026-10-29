<script setup>
import { ref } from 'vue'
import { CardComponent } from '../../card'
import { SortableRoot, SortableItem, SortableHandle } from '..'

const EXAMPLE_ITEM_COUNT = 12
const order = ref(Array.from({ length: EXAMPLE_ITEM_COUNT }, (_, index) => `analysis-${index + 1}`))
const disabled = ref(false)
const announcement = ref('')
const announce = ({ value, toIndex }) => {
    announcement.value = `${value} moved to position ${toIndex + 1} of ${order.value.length}.`
}
</script>

<template>
    <Story title="Sortable / Native list">
        <Variant title="Cards, insertion markers, and move buttons">
            <div class="sortable-example">
                <label><input v-model="disabled" type="checkbox" /> Disable sorting</label>
                <p>Drag a handle or use the move buttons. The order changes only on drop.</p>
                <p class="announcement" role="status" aria-live="polite">{{ announcement }}</p>
                <SortableRoot v-model="order" :disabled="disabled" as="ul" class="sortable-list" aria-label="Saved analyses" @reorder="announce">
                    <SortableItem
                        v-for="id in order"
                        :key="id"
                        :value="id"
                        as="li"
                        class="sortable-row"
                        v-slot="{ canMoveUp, canMoveDown, moveUp, moveDown }"
                    >
                        <CardComponent classes="example-card">
                            <SortableHandle as-child>
                                <span class="drag-handle" title="Drag to reorder" aria-hidden="true">⠿</span>
                            </SortableHandle>
                            <span class="item-label">{{ id }}</span>
                            <button type="button" :aria-label="`Move ${id} up`" :disabled="!canMoveUp" @click="moveUp">↑</button>
                            <button type="button" :aria-label="`Move ${id} down`" :disabled="!canMoveDown" @click="moveDown">↓</button>
                        </CardComponent>
                    </SortableItem>
                </SortableRoot>
                <output>{{ order.join(', ') }}</output>
            </div>
        </Variant>
    </Story>
</template>

<style scoped>
.sortable-example { max-width: 40rem; padding: 1rem; }
.sortable-list { display: flex; flex-direction: column; gap: 1rem; max-height: 22rem; overflow-y: auto; list-style: none; margin: 1rem 0; padding: 0.5rem; }
.sortable-row { position: relative; }
.sortable-row[data-dragging] { opacity: 0.5; }
.sortable-row[data-drop-position]::after { content: ''; position: absolute; left: 0; right: 0; border-top: 3px solid #2563eb; pointer-events: none; }
.sortable-row[data-drop-position='before']::after { top: -0.5rem; }
.sortable-row[data-drop-position='after']::after { bottom: -0.5rem; }
.sortable-row:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.example-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid #94a3b8; border-radius: 0.25rem; }
.drag-handle { cursor: grab; user-select: none; padding: 0.5rem; }
.item-label { flex: 1; }
button { padding: 0.25rem 0.75rem; border: 1px solid #94a3b8; border-radius: 0.25rem; }
button:disabled { opacity: 0.4; }
.announcement { min-height: 1.5rem; }
</style>
