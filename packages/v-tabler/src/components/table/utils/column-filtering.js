export const FILTER_I18N_DEFAULTS = {
    selectFilterPlaceholder: 'Search options...',
    selectFilterNoSelectionText: 'Select values:',
    selectFilterSingleSelectionTextFn: value => value,
    selectFilterMultipleSelectionTextFn: count => `${count} selected`,
    clearFilterLabel: 'Clear Filter'
}

export const COMPARISON_OPERATORS = [
    { value: '=', label: '=', symbol: '=' },
    { value: '!=', label: '≠', symbol: '≠' },
    { value: '>', label: '>', symbol: '>' },
    { value: '>=', label: '≥', symbol: '≥' },
    { value: '<', label: '<', symbol: '<' },
    { value: '<=', label: '≤', symbol: '≤' }
]

export const FILTER_OPERATORS = {
    numeric: COMPARISON_OPERATORS,
    date: COMPARISON_OPERATORS
}

export const applyFilter = (value, filter) => {
    if (!filter) return true

    const filterValue = filter.value

    const typeHandlers = {
        text: filter => {
            if (filter.operator === 'contains') {
                const searchValue = String(filterValue).toLowerCase()
                const cellValue = String(value || '').toLowerCase()
                return cellValue.includes(searchValue)
            }
            return true
        },
        numeric: filter => {
            const numValue = Number(value)
            const numFilter = Number(filterValue)

            if (isNaN(numValue) || isNaN(numFilter) || filterValue === '' || filterValue == null)
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
        },
        date: filter => {
            const dateValue = new Date(value)
            const dateFilter = new Date(filterValue)

            if (isNaN(dateValue.getTime()) || isNaN(dateFilter.getTime())) return false

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
        },
        select: filter => {
            if (filter.operator === 'in') {
                return Array.isArray(filterValue) && filterValue.includes(value)
            }
            return true
        },
        default: () => true
    }
    const filterType = filter.type || 'default'
    const handler = typeHandlers[filterType] || typeHandlers['default']
    return handler(filter)
}
