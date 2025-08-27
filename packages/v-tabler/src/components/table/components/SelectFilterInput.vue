<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
            {{ label }}
        </DropdownMenuLabel>
        <input
            v-model="searchTerm"
            type="text"
            class="form-inputfield w-full text-default mb-2"
            :placeholder="placeholder"
            @keydown.stop
        />
        <div class="max-h-32 overflow-y-auto flex flex-col gap-2 p-1.5">
            <CheckboxComponent
                v-for="option in filteredOptions"
                :key="option.value"
                :name="option.value"
                :label="option.label"
                v-model="selectedValues"
                class="text-default text-xs"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { DropdownMenuLabel } from 'reka-ui'
import CheckboxComponent from '../../checkbox/CheckboxComponent.vue'

const props = defineProps({
    options: Array,
    placeholder: String,
    label: String
})

const selectedValues = defineModel('modelValue', { type: Array, default: () => [] })
const searchTerm = ref('')

const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options
    return props.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})
</script>
