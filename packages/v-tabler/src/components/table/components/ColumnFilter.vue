<template>
    <DropdownMenuRoot v-model:open="isDropdownOpen" :modal="false">
        <!-- Filter Toggle Button -->
        <DropdownMenuTrigger
            :class="[
                'ml-1 p-1 rounded bg-surface transition-colors',
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
                class="bg-surface border border-border rounded-sm shadow-lg min-w-[200px] z-50"
                :side="'bottom'"
                :align="'end'"
                :side-offset="4"
                @click.stop
            >
                <div class="p-3">
                    <!-- Text/String Filter -->
                    <div v-if="filterType === 'text'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1" :for="textInputId">
                            Contains text:
                        </DropdownMenuLabel>
                        <input
                            :id="textInputId"
                            v-model="textFilter"
                            type="text"
                            class="form-inputfield w-full text-default"
                            :placeholder="`Filter ${field.label || field.key}...`"
                            @input="applyFilter"
                            @keydown.stop
                        />
                    </div>

                    <!-- Numeric Filter -->
                    <div v-else-if="filterType === 'numeric'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
                            Number filter:
                        </DropdownMenuLabel>
                        <div class="space-y-3">
                            <!-- Operator Toggle Group -->
                            <div class="flex justify-center">
                                <ToggleGroupRoot
                                    v-model="numericOperator"
                                    type="single"
                                    class="flex"
                                    @update:model-value="onOperatorChange"
                                >
                                    <ToggleGroupItem
                                        v-for="operator in FILTER_OPERATORS.numeric"
                                        :key="operator.value"
                                        :value="operator.value"
                                        class="btn-base-md data-[state=on]:bg-primary data-[state=on]:text-onprimary first:rounded-l last:rounded-r"
                                        v-html="operator.symbol"
                                    >
                                    </ToggleGroupItem>
                                </ToggleGroupRoot>
                            </div>
                            
                            <!-- Numeric Value Input -->
                            <input
                                :id="numericInputId"
                                v-model="numericValue"
                                type="number"
                                class="form-inputfield w-full text-default"
                                :placeholder="'Value...'"
                                @input="applyFilter"
                                @keydown.stop
                            />
                        </div>
                    </div>                    <!-- Date Filter -->
                    <div v-else-if="filterType === 'date'">
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
                            Date filter:
                        </DropdownMenuLabel>
                        <div class="space-y-3">
                            <!-- Operator Toggle Group -->
                            <div class="flex justify-center">
                                <ToggleGroupRoot
                                    v-model="dateOperator"
                                    type="single"
                                    class="flex"
                                    @update:model-value="onOperatorChange"
                                >
                                    <ToggleGroupItem
                                        v-for="operator in FILTER_OPERATORS.date"
                                        :key="operator.value"
                                        :value="operator.value"
                                        class="btn-base-md data-[state=on]:bg-primary data-[state=on]:text-onprimary first:rounded-l last:rounded-r"
                                        v-html="operator.symbol"
                                    >
                                    </ToggleGroupItem>
                                </ToggleGroupRoot>
                            </div>
                            
                            <!-- Date Value Input -->
                            <input
                                :id="dateInputId"
                                v-model="dateValue"
                                type="date"
                                class="form-inputfield w-full text-default"
                                :placeholder="'Select date...'"
                                @input="applyFilter"
                                @keydown.stop
                            />
                        </div>
                    </div>

                    <!-- Select Filter -->
                    <div v-else-if="filterType === 'select'" @click.stop @mouseenter.stop @mouseleave.stop>
                        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1">
                            Select values:
                        </DropdownMenuLabel>
                        <ListSelect
                            v-model="selectedValues"
                            :options="selectOptions"
                            :multiple="true"
                            :portal="true"
                            :dropDownWidth="'15rem'"
                            :optionSize="32"
                            :trackBy="'value'"
                            :input-placeholder="selectPlaceholderText"
                            :search-options-text-fn="() => props.selectFilterPlaceholder"
                            class="w-full"
                            @update:model-value="applyFilter"
                            @click.stop
                            @mouseenter.stop
                            @mouseleave.stop
                        />
                    </div>

                    <!-- Clear Filter Button -->
                    <DropdownMenuSeparator class="my-2 h-px bg-border" />
                    <DropdownMenuItem
                        @click="clearFilter"
                        @mouseenter.stop
                        @mouseleave.stop
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
import { ref, computed, watch, useId } from 'vue'
import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    ToggleGroupRoot,
    ToggleGroupItem
} from 'reka-ui'
import ListSelect from '@/components/listselect/ListSelect.vue'
import { FILTER_OPERATORS } from '../composables/useColumnFiltering.js'

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
        default: undefined
    },
    // Internationalization props for select filter labels
    selectFilterPlaceholder: {
        type: String,
        default: 'Search options...'
    },
    selectFilterNoSelectionText: {
        type: String,
        default: 'Select values...'
    },
    selectFilterSingleSelectionTextFn: {
        type: Function,
        default: (value) => value
    },
    selectFilterMultipleSelectionTextFn: {
        type: Function,
        default: (count) => `${count} selected`
    }
})

const emit = defineEmits(['update:modelValue', 'filter-change'])

// Generate unique IDs for form elements
const textInputId = useId()
const numericInputId = useId()
const numericSelectId = useId()
const dateInputId = useId()
const dateSelectId = useId()

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
    
    // Check if limited unique values (for select filter) - do this BEFORE date check
    const uniqueValues = [...new Set(sampleValues)]
    if (uniqueValues.length <= 10 && uniqueValues.length < sampleValues.length * 0.5) {
        // Double-check against full dataset for high cardinality
        const allUniqueValues = [...new Set(
            props.data
                .map(item => item[props.field.key])
                .filter(val => val != null && val !== '')
        )]
        
        // Fallback to text if too many unique values
        if (allUniqueValues.length > 50) {
            return 'text'
        }
        
        return 'select'
    }
    
    // Check if all values are dates (after select check)
    const allDates = sampleValues.every(val => {
        // More strict date validation - should look like actual dates
        const dateValue = Date.parse(val)
        return !isNaN(dateValue) && 
               // Exclude obviously non-date strings like "Person 1"
               /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{4}|^\d{1,2}-\d{1,2}-\d{4}/.test(val)
    })
    if (allDates) {
        // Even for dates, check cardinality - if too many unique dates, use text filter
        const allUniqueValues = [...new Set(
            props.data
                .map(item => item[props.field.key])
                .filter(val => val != null && val !== '')
        )]
        
        if (allUniqueValues.length > 50) {
            return 'text'
        }
        
        return 'date'
    }
    
    return 'text'
})

// Generate select options
const selectOptions = computed(() => {
    if (props.field.filterOptions) {
        return props.field.filterOptions
    }
    
    if (filterType.value === 'select') {
        const allValues = props.data
            .map(item => item[props.field.key])
            .filter(val => val != null && val !== '')
        
        const uniqueValues = [...new Set(allValues)]
        
        // Safety check - only apply to auto-detected select filters, not explicit ones
        if (!props.field.filterType && uniqueValues.length > 50) {
            console.warn(`Column "${props.field.key}" has ${uniqueValues.length} unique values. Consider providing explicit filterOptions for better performance.`)
            // Fallback to text filter for high cardinality data (auto-detected only)
            return []
        }
        
        return uniqueValues.sort().map(value => ({
            value: value,
            label: String(value)
        }))
    }
    
    return []
})

// Generate ListSelect placeholder text based on selection state
const selectPlaceholderText = computed(() => {
    const selectionCount = Array.isArray(selectedValues.value) ? selectedValues.value.length : 0
    
    if (selectionCount === 0) {
        return props.selectFilterNoSelectionText
    } else if (selectionCount === 1) {
        return props.selectFilterSingleSelectionTextFn(selectedValues.value[0].label)
    } else {
        return props.selectFilterMultipleSelectionTextFn(selectionCount)
    }
})

// Check if filter is active
const hasActiveFilter = computed(() => {
    if (filterType.value === 'text') return textFilter.value.trim() !== ''
    if (filterType.value === 'numeric') {
        const numValue = String(numericValue.value || '').trim()
        return numValue !== '' && !isNaN(Number(numValue))
    }
    if (filterType.value === 'date') return dateValue.value !== ''
    if (filterType.value === 'select') return Array.isArray(selectedValues.value) && selectedValues.value.length > 0
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
        // Extract values from ListSelect option objects
        filter.value = selectedValues.value.map(option => option.value)
        filter.operator = 'in'
    }
    
    return filter
})

// Handle operator change for comparison filters (numeric and date)
const onOperatorChange = () => {
    // Only apply if we have a value and an existing filter
    if (filterType.value === 'numeric') {
        const numValue = String(numericValue.value || '').trim()
        if (numValue !== '' && !isNaN(Number(numValue))) {
            applyFilter()
        }
    } else if (filterType.value === 'date') {
        if (dateValue.value !== '') {
            applyFilter()
        }
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
        // Convert filter values back to ListSelect option objects
        const filterValues = newFilter.value || []
        selectedValues.value = selectOptions.value.filter(option => 
            filterValues.includes(option.value)
        )
    }
}, { immediate: true })
</script>
