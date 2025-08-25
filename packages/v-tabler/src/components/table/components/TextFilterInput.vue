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
import { useI18n } from '../../../composables/useI18n.js'

const props = defineProps({
    inputId: String,
    placeholder: String,
    label: String
})

const { t } = useI18n()

// Use prop label if provided, otherwise use i18n
const label = props.label || t('vTabler.table.filters.textLabel', 'Contains text:')

const modelValue = defineModel({ type: String, default: '' })
</script>
