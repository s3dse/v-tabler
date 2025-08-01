<template>
    <div class="flex items-center gap-2">
        <input
            type="checkbox"
            :id="$id"
            :value="$name"
            v-model="checked"
            v-bind="attrs"
            class="relative shrink-0 appearance-none formfield rounded checked:bg-primary h-5 w-5 disabled:cursor-pointer-default peer"
        />
        <label :for="$id" class="">{{ label }}</label>
        <div
            class="absolute w-5 h-5 hidden text-onprimary i-tabler-check peer-checked:block pointer-events-none"
        ></div>
    </div>
</template>
<script setup>
import { useId, useAttrs } from 'vue'
const props = defineProps({
    name: { type: String, default: null },
    id: { type: String, default: null },
    label: { type: String, default: '' }
})

const attrs = useAttrs()

const $id = props.id || `checkbox-${useId()}`
const $name = props.name || $id

const checked = defineModel({
    required: true,
    type: [Boolean, Array]
})
</script>
<style scoped></style>
