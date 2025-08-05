/**
 * Auto-detection utilities for column filter types
 * Library maintainers can easily enable/disable auto-detection by modifying this file
 */

// Configuration - easily toggle auto-detection features
export const FILTER_DETECTION_CONFIG = {
    enabled: true,
    sampleSize: 10,
    maxSelectOptions: 50,
    selectCardinality: 0.5, // If unique values are less than 50% of sample, consider select filter
    maxSelectUniqueValues: 10
}

/**
 * Auto-detect the appropriate filter type for a column based on its data
 * @param {Object} field - The field configuration
 * @param {Array} data - The data array to analyze
 * @returns {string} - The detected filter type ('text', 'numeric', 'date', 'select')
 */
export function detectFilterType(field, data) {
    // If auto-detection is disabled, default to text
    if (!FILTER_DETECTION_CONFIG.enabled) {
        return 'text'
    }

    // Explicit field configuration takes precedence
    if (field.filterType) {
        return field.filterType
    }
    
    if (field.filterOptions) {
        return 'select'
    }
    
    if (field.type === 'numeric') {
        return 'numeric'
    }
    
    // Auto-detect from data
    const sampleValues = data
        .map(item => item[field.key])
        .filter(val => val != null && val !== '')
        .slice(0, FILTER_DETECTION_CONFIG.sampleSize)
    
    if (sampleValues.length === 0) return 'text'
    
    // Check if all values are numbers
    if (isNumericColumn(sampleValues)) {
        return 'numeric'
    }
    
    // Check if limited unique values (for select filter) - do this BEFORE date check
    if (isSelectColumn(sampleValues, data, field)) {
        return 'select'
    }
    
    // Check if all values are dates (after select check)
    if (isDateColumn(sampleValues, data, field)) {
        return 'date'
    }
    
    return 'text'
}

/**
 * Check if column contains numeric values
 */
function isNumericColumn(sampleValues) {
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
