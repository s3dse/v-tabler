<template>
    <DropdownMenuRoot v-model:open="isDropdownOpen" :modal="false">
        <!-- Filter Toggle Button -->
        <DropdownMenuTrigger
            :class="[
                'ml-1 p-1 rounded bg-thead-background hover:bg-surface transition-colors',
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
                class="bg-surface border border-solid border-border rounded-sm shadow-lg min-w-[200px] z-50"
                :side="'bottom'"
                :align="'end'"
                :side-offset="4"
                @click.stop
            >
                <div class="p-3">
                    <component
                        :is="filterComponent"
                        v-bind="filterProps"
                        @update:modelValue="onFilterValueUpdate"
                        @update:operator="onOperatorUpdate"
                    />
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
    DropdownMenuSeparator,
    DropdownMenuItem,
} from 'reka-ui'
import { FILTER_OPERATORS } from '../composables/useColumnFiltering.js'
import TextFilterInput from './TextFilterInput.vue'
import NumericFilterInput from './NumericFilterInput.vue'
import DateFilterInput from './DateFilterInput.vue'
import SelectFilterInput from './SelectFilterInput.vue'

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
const selectSearchTerm = ref('')
// Dynamic filter component mapping
const filterComponent = computed(() => {
  switch (filterType.value) {
    case 'text': return TextFilterInput
    case 'numeric': return NumericFilterInput
    case 'date': return DateFilterInput
    case 'select': return SelectFilterInput
    default: return TextFilterInput
  }
})

// Props for each filter input
const filterProps = computed(() => {
  if (filterType.value === 'text') {
    return {
      modelValue: textFilter.value,
      inputId: textInputId,
      placeholder: `Filter ${props.field.label || props.field.key}...`
    }
  }
  if (filterType.value === 'numeric') {
    return {
      modelValue: numericValue.value,
      operator: numericOperator.value,
      operators: FILTER_OPERATORS.numeric,
      inputId: numericInputId
    }
  }
  if (filterType.value === 'date') {
    return {
      modelValue: dateValue.value,
      operator: dateOperator.value,
      operators: FILTER_OPERATORS.date,
      inputId: dateInputId
    }
  }
  if (filterType.value === 'select') {
    return {
      modelValue: selectedValues.value,
      options: filteredSelectOptions.value,
      placeholder: props.selectFilterPlaceholder
    }
  }
  return {}
})

// Event handlers for filter input components
function onFilterValueUpdate(val) {
  if (filterType.value === 'text') textFilter.value = val
  if (filterType.value === 'numeric') numericValue.value = val
  if (filterType.value === 'date') dateValue.value = val
  if (filterType.value === 'select') selectedValues.value = val
  applyFilter()
}
function onOperatorUpdate(val) {
  if (filterType.value === 'numeric') numericOperator.value = val
  if (filterType.value === 'date') dateOperator.value = val
  onOperatorChange()
}

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

// Filtered select options based on search term
const filteredSelectOptions = computed(() => {
    if (!selectSearchTerm.value) {
        return selectOptions.value
    }
    
    return selectOptions.value.filter(option => 
        option.label.toLowerCase().includes(selectSearchTerm.value.toLowerCase())
    )
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
        // selectedValues is now an array of primitive values from checkboxes
        filter.value = selectedValues.value
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
        selectedValues.value = newFilter.value || []
    }
}, { immediate: true })
</script>
