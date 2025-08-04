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
                :value="option.value"
                :label="option.label"
                v-model="selectedValues"
                @change="onChange"
                class="text-default px-1 py-0.5 rounded text-xs"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { DropdownMenuLabel } from 'reka-ui'
import CheckboxComponent from '../../checkbox/CheckboxComponent.vue'
const props = defineProps({
    modelValue: Array,
    options: Array,
    placeholder: String,
    noSelectionText: String,
    singleSelectionTextFn: Function,
    multipleSelectionTextFn: Function
})
const emit = defineEmits(['update:modelValue'])
const selectedValues = ref(props.modelValue || [])
const searchTerm = ref('')

// Computed selection text based on current selection
const selectionText = computed(() => {
    if (!selectedValues.value || selectedValues.value.length === 0) {
        return props.noSelectionText || 'Select values:'
    }

    if (selectedValues.value.length === 1) {
        const selectedOption = props.options.find(opt => opt.value === selectedValues.value[0])
        const displayValue = selectedOption ? selectedOption.label : selectedValues.value[0]
        return props.singleSelectionTextFn
            ? props.singleSelectionTextFn(displayValue)
            : displayValue
    }

    return props.multipleSelectionTextFn
        ? props.multipleSelectionTextFn(selectedValues.value.length)
        : `${selectedValues.value.length} selected`
})

watch(
    () => props.modelValue,
    v => (selectedValues.value = v || [])
)
const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options
    return props.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})
function onChange() {
    emit('update:modelValue', selectedValues.value)
}
</script>
