import { reactive } from 'vue'

export function useTableExpand() {
    const expandedRows = reactive(new Set())

    const toggleRowExpanded = row => {
        expandedRows.has(row) ? expandedRows.delete(row) : expandedRows.add(row)
    }

    const isExpanded = row => expandedRows.has(row)

    const collapseAll = () => {
        expandedRows.clear()
    }

    return {
        expandedRows,
        toggleRowExpanded,
        isExpanded,
        collapseAll
    }
}
