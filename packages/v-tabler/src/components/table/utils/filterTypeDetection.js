/**
 * Auto-detection utilities for column filter types.
 * 
 * Typed filters allow for data type-specific filtering logic to improve performance and user experience.
 * This module provides functions to detect the appropriate filter type based on the data in a column,
 * as well as to generate select options for columns that use a select filter.
 * As a fallback, it provides default text filtering logic.
 */

export const FILTER_DETECTION_CONFIG = {
    enabled: true,
    minSampleSize: 10, // Minimum sample size to consider auto-detection
    relativeSampleSize: 0.1, // Relative sample size (10% of total data)
    maxSelectOptions: 50, // Maximum unique options for select filter
    selectCardinality: 0.5, // If unique values are less than 50% of sample, consider select filter
    maxSelectUniqueValues: 10 // Maximum unique values in a sample to consider select filter
}

const isTypeDetectionNecessary = field => {
    // filterType preceeds field.type preceeds filterOptions preceeds FILTER_DETECTION_CONFIG
    if (field.filterType) {
        return { typeDetectionNecessary: false, type: field.filterType }
    } else if (field.type === 'numeric') {
        return { typeDetectionNecessary: false, type: 'numeric' }
    } else if (field.filterOptions) {
        return { typeDetectionNecessary: false, type: 'select' }
    } else if (!FILTER_DETECTION_CONFIG.enabled) {
        return { typeDetectionNecessary: false, type: 'text' }
    }
    return { typeDetectionNecessary: true }
}

const sampleData = (field, data) => {
    const sampleSize = Math.max(
        FILTER_DETECTION_CONFIG.minSampleSize,
        Math.ceil(FILTER_DETECTION_CONFIG.relativeSampleSize * data.length)
    )

    return data
        .map(item => item[field.key])
        .filter(val => val != null && val !== '')
        .slice(0, sampleSize)
}

/**
 * Auto-detect the appropriate filter type for a column based on its data
 * @param {Object} field - The field configuration
 * @param {Array} data - The data array to analyze
 * @returns {string} - The detected filter type ('text', 'numeric', 'date', 'select')
 */
export function detectFilterType(field, data) {
    const { typeDetectionNecessary, type } = isTypeDetectionNecessary(field)
    if (!typeDetectionNecessary) return type

    const sampleValues = sampleData(field, data)
    if (sampleValues.length === 0) return 'text'

    // Check if all values are numbers
    if (allNumeric(sampleValues)) {
        return 'numeric'
    }

    // Check if limited unique values (for select filter) - do this BEFORE date check
    else if (isSelectColumn(sampleValues, data, field)) {
        return 'select'
    }

    // Check if all values are dates (after select check)
    else if (isDateColumn(sampleValues, data, field)) {
        return 'date'
    } else {
        return 'text'
    }

}

/**
 * Check if column contains numeric values
 */
function allNumeric(sampleValues) {
    return sampleValues.every(val => !isNaN(Number(val)))
}

/**
 * Check if column should use select filter based on cardinality
 */
function isSelectColumn(sampleValues, data, field) {
    const uniqueValues = [...new Set(sampleValues)]

    if (uniqueValues.length <= FILTER_DETECTION_CONFIG.maxSelectUniqueValues &&
        uniqueValues.length < sampleValues.length * FILTER_DETECTION_CONFIG.selectCardinality) {

        // Double-check against full dataset for high cardinality
        const allUniqueValues = [...new Set(
            data
                .map(item => item[field.key])
                .filter(val => val != null && val !== '')
        )]

        // Fallback to text if too many unique values
        if (allUniqueValues.length > FILTER_DETECTION_CONFIG.maxSelectOptions) {
            return false
        }

        return true
    }

    return false
}

/**
 * Check if column contains date values
 */
function isDateColumn(sampleValues, data, field) {
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
            data
                .map(item => item[field.key])
                .filter(val => val != null && val !== '')
        )]

        if (allUniqueValues.length > FILTER_DETECTION_CONFIG.maxSelectOptions) {
            return false
        }

        return true
    }

    return false
}

/**
 * Generate select options for a field
 * @param {Object} field - The field configuration
 * @param {Array} data - The data array
 * @param {string} filterType - The detected filter type
 * @returns {Array} - Array of select options
 */
export function generateSelectOptions(field, data, filterType) {
    if (field.filterOptions) {
        // filterOptions is now just a direct array of options
        return field.filterOptions
    }

    if (filterType === 'select') {
        const allValues = data
            .map(item => item[field.key])
            .filter(val => val != null && val !== '')

        const uniqueValues = [...new Set(allValues)]

        // Safety check - only apply to auto-detected select filters, not explicit ones
        if (!field.filterType && uniqueValues.length > FILTER_DETECTION_CONFIG.maxSelectOptions) {
            console.warn(`Column "${field.key}" has ${uniqueValues.length} unique values. Consider providing explicit filterOptions for better performance.`)
            // Fallback to text filter for high cardinality data (auto-detected only)
            return []
        }

        return uniqueValues.sort().map(value => ({
            value: value,
            label: String(value)
        }))
    }

    return []
}
