import { computed, inject, provide } from 'vue'

// Injection key for table filter configuration
export const TABLE_FILTER_CONFIG_KEY = Symbol('tableFilterConfig')

/**
 * Composable to provide table filter configuration
 * Used by TableComponent to provide configuration to child components
 */
export function useTableFilterConfigProvider(config = {}) {
    const filterConfig = computed(() => ({
        // Default fallback i18n settings for when field-level i18n is not provided
        fallbackI18n: {
            selectFilterPlaceholder: config.selectFilterPlaceholder || 'Search options...',
            selectFilterNoSelectionText: config.selectFilterNoSelectionText || 'Select values...',
            selectFilterSingleSelectionTextFn: config.selectFilterSingleSelectionTextFn || ((value) => value),
            selectFilterMultipleSelectionTextFn: config.selectFilterMultipleSelectionTextFn || ((count) => `${count} selected`),
            // Future: Add more filter type i18n settings here
            numericFilterLabel: config.numericFilterLabel || 'Number filter:',
            dateFilterLabel: config.dateFilterLabel || 'Date filter:',
            textFilterLabel: config.textFilterLabel || 'Text filter:'
        },
        // Other global filter settings can be added here
        debounceMs: config.filterDebounce || 250,
        maxWaitMs: config.filterMaxWait || 2000
    }))

    provide(TABLE_FILTER_CONFIG_KEY, filterConfig)

    return {
        filterConfig
    }
}

/**
 * Composable to consume table filter configuration
 * Used by filter components to access configuration without prop drilling
 */
export function useTableFilterConfig() {
    const filterConfig = inject(TABLE_FILTER_CONFIG_KEY, null)
    
    if (!filterConfig) {
        // Provide sensible defaults if not used within a table context
        return {
            fallbackI18n: {
                selectFilterPlaceholder: 'Search options...',
                selectFilterNoSelectionText: 'Select values...',
                selectFilterSingleSelectionTextFn: (value) => value,
                selectFilterMultipleSelectionTextFn: (count) => `${count} selected`,
                numericFilterLabel: 'Number filter:',
                dateFilterLabel: 'Date filter:',
                textFilterLabel: 'Text filter:'
            },
            debounceMs: 250,
            maxWaitMs: 2000
        }
    }

    return filterConfig.value
}
