import { ref, computed } from 'vue'

export const FILTER_I18N_DEFAULTS = {
    selectFilterPlaceholder: 'Search options...',
    selectFilterNoSelectionText: 'Select values...',
    selectFilterSingleSelectionTextFn: value => value,
    selectFilterMultipleSelectionTextFn: count => `${count} selected`
}

// Define available operators for comparison filters (numeric and date)
export const COMPARISON_OPERATORS = [
    { value: '=', label: '=', symbol: '=' },
    { value: '!=', label: '≠', symbol: '≠' },
    { value: '>', label: '>', symbol: '>' },
    { value: '>=', label: '≥', symbol: '≥' },
    { value: '<', label: '<', symbol: '<' },
    { value: '<=', label: '≤', symbol: '≤' }
]

// For backwards compatibility and clarity, export as FILTER_OPERATORS
export const FILTER_OPERATORS = {
    numeric: COMPARISON_OPERATORS,
    date: COMPARISON_OPERATORS
}

export function useColumnFiltering() {
    const columnFilters = ref({})

    // Apply all column filters to the data
    const applyColumnFilters = data => {
        if (!data || !Array.isArray(data)) return []

        const activeFilters = Object.entries(columnFilters.value).filter(([_, filter]) => filter)

        if (activeFilters.length === 0) {
            return [...data]
        }

        return data.filter(item => {
            return activeFilters.every(([fieldKey, filter]) => {
                const value = item[fieldKey]
                return applyFilter(value, filter)
            })
        })
    } // Apply a single filter to a value
    const applyFilter = (value, filter) => {
        if (!filter) return true

        const filterValue = filter.value

        switch (filter.type) {
            case 'text':
                if (filter.operator === 'contains') {
                    const searchValue = String(filterValue).toLowerCase()
                    const cellValue = String(value || '').toLowerCase()
                    return cellValue.indexOf(searchValue) !== -1
                }
                break

            case 'numeric':
                const numValue = Number(value)
                const numFilter = Number(filterValue)

                // If either value is NaN, or if filterValue is empty/null, return false
                if (
                    isNaN(numValue) ||
                    isNaN(numFilter) ||
                    filterValue === '' ||
                    filterValue == null
                )
                    return false

                switch (filter.operator) {
                    case '=':
                        return numValue === numFilter
                    case '!=':
                        return numValue !== numFilter
                    case '>':
                        return numValue > numFilter
                    case '>=':
                        return numValue >= numFilter
                    case '<':
                        return numValue < numFilter
                    case '<=':
                        return numValue <= numFilter
                    default:
                        return true
                }

            case 'date':
                const dateValue = new Date(value)
                const dateFilter = new Date(filterValue)

                if (isNaN(dateValue.getTime()) || isNaN(dateFilter.getTime())) return false

                // Compare only dates, not times
                const valueDateOnly = new Date(
                    dateValue.getFullYear(),
                    dateValue.getMonth(),
                    dateValue.getDate()
                )
                const filterDateOnly = new Date(
                    dateFilter.getFullYear(),
                    dateFilter.getMonth(),
                    dateFilter.getDate()
                )

                switch (filter.operator) {
                    case '=':
                        return valueDateOnly.getTime() === filterDateOnly.getTime()
                    case '>':
                        return valueDateOnly.getTime() > filterDateOnly.getTime()
                    case '>=':
                        return valueDateOnly.getTime() >= filterDateOnly.getTime()
                    case '<':
                        return valueDateOnly.getTime() < filterDateOnly.getTime()
                    case '<=':
                        return valueDateOnly.getTime() <= filterDateOnly.getTime()
                    default:
                        return true
                }

            case 'select':
                if (filter.operator === 'in') {
                    return Array.isArray(filterValue) && filterValue.includes(value)
                }
                break

            default:
                return true
        }

        return true
    }

    // Set a column filter
    const setColumnFilter = (fieldKey, filter) => {
        if (filter) {
            columnFilters.value[fieldKey] = filter
        } else {
            delete columnFilters.value[fieldKey]
        }

        // Trigger reactivity
        columnFilters.value = { ...columnFilters.value }
    }

    // Clear all column filters
    const clearAllColumnFilters = () => {
        columnFilters.value = {}
    }

    // Get active filters count
    const activeFiltersCount = computed(() => {
        return Object.keys(columnFilters.value).filter(key => columnFilters.value[key]).length
    })

    // Check if any filters are active
    const hasActiveFilters = computed(() => {
        return activeFiltersCount.value > 0
    })

    return {
        columnFilters,
        setColumnFilter,
        clearAllColumnFilters,
        activeFiltersCount,
        hasActiveFilters,
        applyColumnFilters
    }
}
