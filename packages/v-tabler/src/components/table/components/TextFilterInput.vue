<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1" :for="inputId">
            {{ label }}
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

defineProps({
    inputId: String,
    placeholder: String,
    label: String
})

const modelValue = defineModel({ type: String, default: '' })
</script>
