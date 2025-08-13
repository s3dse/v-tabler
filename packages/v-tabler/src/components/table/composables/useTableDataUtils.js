import { computed } from 'vue'

/**
 * Utility composable for table data extraction and field management.
 * These are pure utility functions that don't manage state.
 */
export function useTableDataUtils(props) {
    const fieldsVisibleInTable = computed(() => {
        const hasValidFields = props.fields && Array.isArray(props.fields)
        if (!hasValidFields) return []

        const fieldsWithVisibilityDefaults = props.fields.map(field => ({
            visible: true,
            ...field
        }))

        return fieldsWithVisibilityDefaults.filter(field => field.visible)
    })

    function extractFormattedValueFromRecord(dataRecord, columnDefinition) {
        if (!dataRecord) return ''

        const rawValue = dataRecord[columnDefinition.key]

        return columnDefinition.formatter ? columnDefinition.formatter(rawValue) : rawValue
    }

    function extractRawValueFromRecord(dataRecord, columnDefinition) {
        if (!dataRecord) return ''
        return dataRecord[columnDefinition.key]
    }

    function getDisplayLabelForColumn(columnDefinition) {
        return columnDefinition.label ? columnDefinition.label : columnDefinition.key
    }

    function convertUnderscoresToSpaces(textValue) {
        return textValue ? textValue.replaceAll('_', ' ') : textValue
    }

    return {
        visibleFields: fieldsVisibleInTable,
        getValue: extractFormattedValueFromRecord,
        getUnformattedValue: extractRawValueFromRecord,
        getColumnLabel: getDisplayLabelForColumn,
        underscoresToSpaces: convertUnderscoresToSpaces
    }
}
