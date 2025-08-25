import { inject, ref } from 'vue'

// Default translations for all components - used as fallback when vue-i18n is not available
const DEFAULT_TRANSLATIONS = {
    'vTabler.table.filters.textLabel': 'Contains text:',
    'vTabler.table.filters.numericLabel': 'Number filter:',
    'vTabler.table.filters.dateLabel': 'Date filter:',
    'vTabler.table.filters.selectLabel': 'Select values:',
    'vTabler.table.filters.clearFilterLabel': 'Clear Filter',
    'vTabler.table.filters.clearAllFiltersLabel': 'Clear All Filters',
    'vTabler.table.filters.searchPlaceholder': 'Search options...',
    'vTabler.table.filters.noSelectionText': 'Select values:',
    'vTabler.table.filters.textPlaceholder': 'Enter text...',
    'vTabler.table.filters.numericPlaceholder': 'Value...',
    'vTabler.table.filters.datePlaceholder': 'Select date...'
}

// Global state to hold the i18n instance if provided
const globalI18nInstance = ref(null)

/**
 * Set the global i18n instance for v-tabler to use
 * This should be called in your main.js after setting up vue-i18n
 * @param {Object} i18nInstance - The vue-i18n instance
 */
export function setVTablerI18n(i18nInstance) {
    globalI18nInstance.value = i18nInstance
}

/**
 * Use i18n with vue-i18n integration and fallback support
 * This composable works in multiple ways:
 * 1. Uses globally set i18n instance via setVTablerI18n()
 * 2. Tries to inject from vue-i18n's provide/inject pattern
 * 3. Falls back to default English translations
 */
export function useI18n() {
    // Try to get vue-i18n instance from:
    // 1. Global instance set via setVTablerI18n()
    // 2. Vue-i18n's standard injection keys
    const vueI18n = globalI18nInstance.value || inject('i18n', null) || inject('$i18n', null)

    return {
        t: (key, defaultValue = null, interpolationValues = {}) => {
            return translate(vueI18n, key, defaultValue, interpolationValues)
        },
        te: key => {
            return translationExists(vueI18n, key)
        }
    }
}

/**
 * Get translation with vue-i18n integration and fallback
 */
function translate(vueI18n, key, fallback = null, values = {}) {
    // Try vue-i18n first
    if (vueI18n && typeof vueI18n.t === 'function') {
        try {
            // Check if key exists in vue-i18n
            if (vueI18n.te && vueI18n.te(key)) {
                return vueI18n.t(key, values)
            }
            // Try without namespace prefix for backward compatibility
            const shortKey = key.replace('vTabler.', '')
            if (vueI18n.te && vueI18n.te(shortKey)) {
                return vueI18n.t(shortKey, values)
            }
        } catch (e) {
            console.warn(`v-tabler: Error translating key "${key}":`, e)
        }
    }

    // Fallback to provided value or default translations
    if (fallback !== null) {
        return fallback
    }

    return DEFAULT_TRANSLATIONS[key] || key
}

/**
 * Check if translation exists
 */
function translationExists(vueI18n, key) {
    if (vueI18n && typeof vueI18n.te === 'function') {
        return vueI18n.te(key) || vueI18n.te(key.replace('vTabler.', ''))
    }
    return Object.prototype.hasOwnProperty.call(DEFAULT_TRANSLATIONS, key)
}

/**
 * Get all default translation keys for vue-i18n setup
 * This helper function can be used by clients to easily set up their i18n configuration
 */
export function getDefaultTranslationKeys() {
    return { ...DEFAULT_TRANSLATIONS }
}
