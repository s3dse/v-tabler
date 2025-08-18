<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
            {{ selectionText }}
        </DropdownMenuLabel>
        <input
            v-model="searchTerm"
            type="text"
            class="form-inputfield w-full text-default mb-2"
            :placeholder="placeholder"
            @keydown.stop
        />
        <div class="max-h-32 overflow-y-auto space-y-1">
            <CheckboxComponent
                v-for="option in filteredOptions"
                :key="option.value"
                :name="option.value"
                :label="option.label"
                v-model="selectedValues"
                class="text-default px-1 py-0.5 rounded text-xs"
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
    noSelectionText: String,
    singleSelectionTextFn: { type: Function, default: x => x },
    multipleSelectionTextFn: { type: Function, default: x => `${x} selected` }
})

const selectedValues = defineModel('modelValue', { type: Array, default: () => [] })
const searchTerm = ref('')

const selectionText = computed(() => {
    if (!selectedValues.value || selectedValues.value.length === 0) {
        return props.noSelectionText
    }

    if (selectedValues.value.length === 1) {
        const selectedOption = props.options.find(opt => opt.value === selectedValues.value[0])
        const displayValue = selectedOption ? selectedOption.label : selectedValues.value[0]
        return props.singleSelectionTextFn(displayValue)
    }

    return props.multipleSelectionTextFn(selectedValues.value.length)
})

const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options
    return props.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})
</script>
