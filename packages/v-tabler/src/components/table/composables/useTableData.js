import { ref, computed, watch } from 'vue'

export function useTableData(props) {
    const currentTableDataArray = ref([...(props.items || [])])

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

    watch(
        () => props.items,
        newItemsArray => {
            currentTableDataArray.value = [...(newItemsArray || [])]
        }
    )

    return {
        tableData: currentTableDataArray,
        visibleFields: fieldsVisibleInTable,
        getValue: extractFormattedValueFromRecord,
        getUnformattedValue: extractRawValueFromRecord,
        getColumnLabel: getDisplayLabelForColumn,
        underscoresToSpaces: convertUnderscoresToSpaces
    }
}
