<script setup>
import { Primitive, useForwardExpose } from 'reka-ui'
import { computed, onBeforeUnmount, provide, toRef, watch } from 'vue'
import { SORTABLE_ITEM, useSortableRoot } from './sortable-context'

const props = defineProps({
    value: { type: [String, Number], required: true },
    as: { type: [String, Object], default: 'div' },
    asChild: { type: Boolean, default: false }
})
const root = useSortableRoot()
const { forwardRef, currentElement } = useForwardExpose()
const index = computed(() => root.modelValue.value.indexOf(props.value))
const isDragging = computed(() => root.drag.value?.value === props.value)
const dropPosition = computed(() => root.marker.value?.value === props.value
    ? root.marker.value.position
    : null)
const canMoveUp = computed(() => !root.disabled.value && index.value > 0)
const canMoveDown = computed(() => !root.disabled.value && index.value < root.modelValue.value.length - 1)
const moveUp = () => root.move(props.value, index.value - 1, currentElement.value)
const moveDown = () => root.move(props.value, index.value + 1, currentElement.value)

watch(index, itemIndex => {
    if (itemIndex === -1) throw new Error('SortableItem value must be present in SortableRoot modelValue.')
}, { immediate: true })
onBeforeUnmount(() => root.forgetItem(props.value))
provide(SORTABLE_ITEM, { root, value: toRef(props, 'value'), element: currentElement })
</script>

<template>
    <Primitive
        :ref="forwardRef"
        :as="as"
        :as-child="asChild"
        tabindex="-1"
        :data-dragging="isDragging ? '' : undefined"
        :data-drop-position="dropPosition ?? undefined"
        @dragover="root.hoverItem(value, $event)"
    >
        <slot
            :index="index"
            :is-dragging="isDragging"
            :drop-position="dropPosition"
            :can-move-up="canMoveUp"
            :can-move-down="canMoveDown"
            :move-up="moveUp"
            :move-down="moveDown"
        />
    </Primitive>
</template>
