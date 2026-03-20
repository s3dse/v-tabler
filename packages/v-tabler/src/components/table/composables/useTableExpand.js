import { reactive, computed, watch } from 'vue'

export function useTableExpand(externalExpanded) {
    const expandedRows = reactive(new Set())

    watch(
        () => externalExpanded?.value,
        newArray => {
            expandedRows.clear()
            if (newArray && Array.isArray(newArray)) {
                newArray.forEach(item => expandedRows.add(item))
            }
        },
        { immediate: true }
    )

    const toggleRowExpanded = row => {
        expandedRows.has(row) ? expandedRows.delete(row) : expandedRows.add(row)
    }

    const expandedArray = computed(() => Array.from(expandedRows))
    const isExpanded = row => expandedRows.has(row)
    const collapseAll = () => expandedRows.clear()

    return {
        expandedRows,
        expandedArray,
        toggleRowExpanded,
        isExpanded,
        collapseAll
    }
}
