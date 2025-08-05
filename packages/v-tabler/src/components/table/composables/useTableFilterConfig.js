// Simple i18n fallback defaults for select filters
export const FILTER_I18N_DEFAULTS = {
    selectFilterPlaceholder: 'Search options...',
    selectFilterNoSelectionText: 'Select values...',
    selectFilterSingleSelectionTextFn: value => value,
    selectFilterMultipleSelectionTextFn: count => `${count} selected`
}
