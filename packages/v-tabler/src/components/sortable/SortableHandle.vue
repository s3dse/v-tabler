<script setup>
import { Primitive } from 'reka-ui'
import { useSortableItem } from './sortable-context'

defineProps({
    as: { type: [String, Object], default: 'span' },
    asChild: { type: Boolean, default: false }
})
const { root, value, element } = useSortableItem()
</script>

<template>
    <Primitive
        :as="as"
        :as-child="asChild"
        :draggable="!root.disabled.value"
        @dragstart="root.startDrag(value, element, $event)"
        @dragend="root.cancelDrag"
    >
        <slot />
    </Primitive>
</template>
