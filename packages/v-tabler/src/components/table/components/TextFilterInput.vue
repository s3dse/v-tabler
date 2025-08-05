<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1" :for="inputId">
            Contains text:
        </DropdownMenuLabel>
        <input
            :id="inputId"
            v-model="modelValue"
            type="text"
            class="form-inputfield w-full text-default"
            :placeholder="placeholder"
            @keydown.stop
        />
    </div>
</template>
<script setup>
import { DropdownMenuLabel } from 'reka-ui'
const props = defineProps({
    inputId: String,
    placeholder: String
})
const modelValue = defineModel({ type: String, default: '' })
</script>
