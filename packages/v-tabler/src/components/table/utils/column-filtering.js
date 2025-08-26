import { useI18n } from '../../../composables/useI18n.js'

export const FILTER_I18N_DEFAULTS = {
    selectFilterPlaceholder: 'Search options...',
    selectFilterNoSelectionText: 'Select values:',
    selectFilterSingleSelectionTextFn: value => value,
    selectFilterMultipleSelectionTextFn: count => `${count} selected`,
    clearFilterLabel: 'Clear Filter'
}

/**
 * Get filter i18n settings with vue-i18n integration
 * Fallbacks in order:
 * 1. Field-level i18n
 * 2. Default constants
 */
export function getFilterI18n(fieldI18n = {}) {
    const { t } = useI18n()

    return {
        textLabel: fieldI18n.textLabel || t('vTabler.table.filters.textLabel', 'Contains text:'),
        numericLabel:
            fieldI18n.numericLabel || t('vTabler.table.filters.numericLabel', 'Number filter:'),
        dateLabel: fieldI18n.dateLabel || t('vTabler.table.filters.dateLabel', 'Date filter:'),
        selectLabel:
            fieldI18n.selectLabel || t('vTabler.table.filters.selectLabel', 'Select values:'),
        clearFilterLabel:
            fieldI18n.clearFilterLabel ||
            t('vTabler.table.filters.clearFilterLabel', FILTER_I18N_DEFAULTS.clearFilterLabel),
        placeholder:
            fieldI18n.placeholder ||
            t(
                'vTabler.table.filters.searchPlaceholder',
                FILTER_I18N_DEFAULTS.selectFilterPlaceholder
            ),
        noSelectionText:
            fieldI18n.noSelectionText ||
            t(
                'vTabler.table.filters.noSelectionText',
                FILTER_I18N_DEFAULTS.selectFilterNoSelectionText
            ),
        singleSelectionTextFn:
            fieldI18n.singleSelectionTextFn ||
            FILTER_I18N_DEFAULTS.selectFilterSingleSelectionTextFn,
        multipleSelectionTextFn:
            fieldI18n.multipleSelectionTextFn ||
            (x =>
                t(
                    'vTabler.table.filters.multipleSelectionText',
                    FILTER_I18N_DEFAULTS.selectFilterMultipleSelectionTextFn(x),
                    { count: x }
                )),
        textPlaceholder:
            fieldI18n.textPlaceholder ||
            t('vTabler.table.filters.textPlaceholder', 'Enter text...'),
        numericPlaceholder:
            fieldI18n.numericPlaceholder ||
            t('vTabler.table.filters.numericPlaceholder', 'Value...'),
        datePlaceholder:
            fieldI18n.datePlaceholder ||
            t('vTabler.table.filters.datePlaceholder', 'Select date...')
    }
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
