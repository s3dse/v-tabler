<script setup>
import { Primitive, useForwardExpose } from 'reka-ui'
import { provide, toRef } from 'vue'
import { createSortableController, SORTABLE_ROOT } from './sortable-context'

const props = defineProps({
    modelValue: { type: Array, required: true },
    disabled: { type: Boolean, default: false },
    as: { type: [String, Object], default: 'div' },
    asChild: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'reorder'])
const { forwardRef, currentElement } = useForwardExpose()
const ROOT_TOKEN_WORD_COUNT = 4
const controller = createSortableController({
    modelValue: toRef(props, 'modelValue'),
    disabled: toRef(props, 'disabled'),
    rootId: crypto.getRandomValues(new Uint32Array(ROOT_TOKEN_WORD_COUNT)).join('-'),
    rootElement: currentElement,
    emit
})
provide(SORTABLE_ROOT, controller)
</script>

<template>
    <Primitive
        :ref="forwardRef"
        :as="as"
        :as-child="asChild"
        @dragover="controller.dragOver"
        @drop="controller.drop"
        @dragleave="controller.leaveRoot"
    >
        <slot />
    </Primitive>
</template>
