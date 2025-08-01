<template>
    <DropdownMenuRoot v-model:open="isDropdownOpen" :modal="false">
        <!-- Filter Toggle Button -->
        <DropdownMenuTrigger
            :class="[
                'ml-1 p-1 rounded hover:bg-surface-hover transition-colors',
                { 'text-primary': hasActiveFilter }
            ]"
            :title="`Filter ${field.label || field.key}`"
        >
            <div 
                class="w-4 h-4"
                :class="hasActiveFilter ? 'i-tabler-filter text-primary' : 'i-tabler-filter'"
            ></div>
        </DropdownMenuTrigger>

        <!-- Filter Dropdown -->
        <DropdownMenuPortal>
            <DropdownMenuContent
                class="bg-dropdown border border-dropdownBorder rounded-sm shadow-lg min-w-[200px] z-50"
                :side="'bottom'"
                :align="'end'"
                :side-offset="4"
                @click.stop
            >
                <div class="p-3">
                    <!-- Text/String Filter -->
                    <div v-if="filterType === 'text'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1">
                            Contains text:
                        </DropdownMenuLabel>
                        <input
                            v-model="textFilter"
                            type="text"
                            class="form-inputfield-sm w-full text-default"
                            :placeholder="`Filter ${field.label || field.key}...`"
                            @input="applyFilter"
                        />
                    </div>

                    <!-- Numeric Filter -->
                    <!-- Numeric Filter -->
                    <div v-else-if="filterType === 'numeric'">
                        <DropdownMenuLabel class="px-2 py-1 text-xs font-medium text-muted">
                            Number filter:
                        </DropdownMenuLabel>
                        <div class="px-2 py-1 space-y-2">
                            <select
                                v-model="numericOperator"
                                class="formfield w-full text-default rounded px-2 text-sm"
                                @change="onOperatorChange"
                            >
                                <option value="=">=</option>
                                <option value="!=">!=</option>
                                <option value=">">&gt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="<">&lt;</option>
                                <option value="<=">&lt;=</option>
                            </select>
                            <input
                                v-model="numericValue"
                                type="number"
                                class="form-inputfield-sm w-full text-default"
                                :placeholder="'Value...'"
                                @input="applyFilter"
                            />
                        </div>
                    </div>                    <!-- Date Filter -->
                    <div v-else-if="filterType === 'date'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1">
                            Date filter:
                        </DropdownMenuLabel>
                        <div class="space-y-2">
                            <div class="flex gap-1">
                                <select
                                    v-model="dateOperator"
                                    class="formfield px-2 py-1 text-sm text-default min-w-12 rounded"
                                    @change="applyFilter"
                                >
                                    <option value="=">=</option>
                                    <option value=">">&gt;</option>
                                    <option value=">=">&gt;=</option>
                                    <option value="<">&lt;</option>
                                    <option value="<=">&lt;=</option>
                                </select>
                                <input
                                    v-model="dateValue"
                                    type="date"
                                    class="form-inputfield-sm flex-1 text-default"
                                    @input="applyFilter"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Select Filter -->
                    <div v-else-if="filterType === 'select'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1">
                            Select values:
                        </DropdownMenuLabel>
                        <div class="max-h-32 overflow-y-auto">
                            <DropdownMenuCheckboxItem
                                v-for="option in selectOptions"
                                :key="option.value"
                                :model-value="selectedValues.includes(option.value)"
                                @update:model-value="(checked) => toggleSelectOption(option.value, checked)"
                                class="flex items-center text-sm text-default hover:bg-surface-hover px-1 py-1 rounded cursor-pointer"
                            >
                                <DropdownMenuItemIndicator class="mr-2">
                                    <div class="w-3 h-3 i-tabler-check"></div>
                                </DropdownMenuItemIndicator>
                                {{ option.label }}
                            </DropdownMenuCheckboxItem>
                        </div>
                    </div>

                    <!-- Clear Filter Button -->
                    <DropdownMenuSeparator class="my-2 h-px bg-border" />
                    <DropdownMenuItem
                        @click="clearFilter"
                        class="w-full text-xs text-subtle hover:text-default hover:bg-surface-hover px-2 py-1 rounded cursor-pointer"
                    >
                        Clear Filter
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
    DropdownMenuItemIndicator,
    DropdownMenuSeparator,
    DropdownMenuItem
} from 'reka-ui'

const props = defineProps({
    field: {
        type: Object,
        required: true
    },
    data: {
        type: Array,
        required: true
    },
    modelValue: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue', 'filter-change'])

// Dropdown state
const isDropdownOpen = ref(false)

// Filter values
const textFilter = ref('')
const numericOperator = ref('=')
const numericValue = ref('')
const dateOperator = ref('=')
const dateValue = ref('')
const selectedValues = ref([])

// Determine filter type based on field configuration or data analysis
const filterType = computed(() => {
    if (props.field.filterType) {
        return props.field.filterType
    }
    
    if (props.field.filterOptions) {
        return 'select'
    }
    
    if (props.field.type === 'numeric') {
        return 'numeric'
    }
    
    // Auto-detect from data
    const sampleValues = props.data
        .map(item => item[props.field.key])
        .filter(val => val != null && val !== '')
        .slice(0, 10)
    
    if (sampleValues.length === 0) return 'text'
    
    // Check if all values are numbers
    const allNumbers = sampleValues.every(val => !isNaN(Number(val)))
    if (allNumbers) return 'numeric'
    
    // Check if all values are dates
    const allDates = sampleValues.every(val => !isNaN(Date.parse(val)))
    if (allDates) return 'date'
    
    // Check if limited unique values (for select filter)
    const uniqueValues = [...new Set(sampleValues)]
    if (uniqueValues.length <= 10 && uniqueValues.length < sampleValues.length * 0.5) {
        return 'select'
    }
    
    return 'text'
})

// Generate select options
const selectOptions = computed(() => {
    if (props.field.filterOptions) {
        return props.field.filterOptions
    }
    
    if (filterType.value === 'select') {
        const uniqueValues = [...new Set(
            props.data
                .map(item => item[props.field.key])
                .filter(val => val != null && val !== '')
        )].sort()
        
        return uniqueValues.map(value => ({
            value,
            label: value
        }))
    }
    
    return []
})

// Check if filter is active
const hasActiveFilter = computed(() => {
    if (filterType.value === 'text') return textFilter.value.trim() !== ''
    if (filterType.value === 'numeric') {
        const numValue = String(numericValue.value || '').trim()
        return numValue !== '' && !isNaN(Number(numValue))
    }
    if (filterType.value === 'date') return dateValue.value !== ''
    if (filterType.value === 'select') return selectedValues.value.length > 0
    return false
})

// Build current filter object
const currentFilter = computed(() => {
    if (!hasActiveFilter.value) return null
    
    const filter = {
        field: props.field.key,
        type: filterType.value
    }
    
    if (filterType.value === 'text') {
        filter.value = textFilter.value.trim()
        filter.operator = 'contains'
    } else if (filterType.value === 'numeric') {
        const numValue = String(numericValue.value || '').trim()
        filter.value = numValue === '' ? null : Number(numValue)
        filter.operator = numericOperator.value
    } else if (filterType.value === 'date') {
        filter.value = dateValue.value
        filter.operator = dateOperator.value
    } else if (filterType.value === 'select') {
        filter.value = selectedValues.value
        filter.operator = 'in'
    }
    
    return filter
})

// Toggle select option
const toggleSelectOption = (value, checked) => {
    if (checked) {
        if (!selectedValues.value.includes(value)) {
            selectedValues.value.push(value)
        }
    } else {
        selectedValues.value = selectedValues.value.filter(v => v !== value)
    }
    applyFilter()
}

// Handle operator change for numeric filters
const onOperatorChange = () => {
    // Only apply if we have a value and an existing filter
    const numValue = String(numericValue.value || '').trim()
    if (filterType.value === 'numeric' && numValue !== '' && !isNaN(Number(numValue))) {
        applyFilter()
    }
}

// Apply filter
const applyFilter = () => {
    emit('update:modelValue', currentFilter.value)
    emit('filter-change', currentFilter.value)
}

// Clear filter
const clearFilter = () => {
    textFilter.value = ''
    numericValue.value = ''
    dateValue.value = ''
    selectedValues.value = []
    isDropdownOpen.value = false
    emit('update:modelValue', null)
    emit('filter-change', null)
}

// Initialize from modelValue
watch(() => props.modelValue, (newFilter) => {
    if (!newFilter) {
        textFilter.value = ''
        numericValue.value = ''
        dateValue.value = ''
        selectedValues.value = []
        return
    }
    
    if (newFilter.type === 'text') {
        textFilter.value = newFilter.value || ''
    } else if (newFilter.type === 'numeric') {
        numericValue.value = String(newFilter.value || '')
        numericOperator.value = newFilter.operator || '='
    } else if (newFilter.type === 'date') {
        dateValue.value = newFilter.value || ''
        dateOperator.value = newFilter.operator || '='
    } else if (newFilter.type === 'select') {
        selectedValues.value = newFilter.value || []
    }
}, { immediate: true })
</script>
