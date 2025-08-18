<template>
    <div class="flex items-center gap-2 relative">
        <input
            ref="input"
            type="checkbox"
            :id="$id"
            :value="$name"
            :name="$name"
            v-model="checked"
            v-bind="attrs"
            :disabled="disabled"
            :aria-disabled="disabled"
            :aria-checked="ariaChecked"
            class="shrink-0 appearance-none form-inputfield rounded checked:bg-primary indeterminate:bg-primary h-5 w-5 disabled:cursor-pointer-default peer"
        />
        <label :for="$id" :class="[disabled ? `${$attrs.class} text-subtle!` : $attrs.class]">{{
            label
        }}</label>
        <div
            class="absolute w-5 h-5 hidden text-onprimary i-tabler-check peer-checked:block pointer-events-none"
        ></div>
        <div
            class="absolute w-5 h-5 hidden text-onprimary i-tabler-minus peer-indeterminate:block pointer-events-none"
        ></div>
    </div>
</template>
<script setup>
import { useId, useAttrs, computed, onMounted, watch, useTemplateRef } from 'vue'
defineOptions({
    name: 'CheckboxComponent',
    inheritAttrs: false
})
const props = defineProps({
    name: { type: String, default: null },
    id: { type: String, default: null },
    label: { type: String, default: '' },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
})

const attrs = useAttrs()

const $id = props.id || `checkbox-${useId()}`
const $name = props.name || $id

const checked = defineModel({
    required: true,
    type: [Boolean, Array]
})

const inputRef = useTemplateRef('input')

onMounted(() => {
    if (inputRef.value) {
        inputRef.value.indeterminate = props.indeterminate
    }
})

watch(
    () => props.indeterminate,
    val => {
        if (inputRef.value) {
            inputRef.value.indeterminate = val
        }
    }
)

const ariaChecked = computed(() => {
    if (!inputRef.value) return 'false'
    if (props.indeterminate) return 'mixed'
    return checked.value ? 'true' : 'false'
})
</script>
