import { reactive, ref } from 'vue'
export function useExpandFetch({
    fetchFn = () => Promise.resolve([]),
    key = item => item,
    cache = true
} = {}) {
    const detailCache = reactive(new Map())
    const fetchingIds = reactive(new Set())
    const expandedItems = ref([])

    const fetchDetailsForRow = async rowData => {
        const rowId = key(rowData)
        if (cache && detailCache.has(rowId)) {
            return detailCache.get(rowId)
        }

        if (fetchingIds.has(rowId)) {
            return []
        }

        try {
            fetchingIds.add(rowId)
            const details = await fetchFn(rowData)
            if (cache) {
                detailCache.set(rowId, details)
            }
            return details
        } finally {
            fetchingIds.delete(rowId)
        }
    }

    const onExpandToggle = async ({ item, expanded }) => {
        if (!expanded) return
        await fetchDetailsForRow(item)
    }

    const rowState = item => {
        const rowId = key(item)
        return {
            fetching: fetchingIds.has(rowId),
            details: detailCache.get(rowId) || []
        }
    }

    return {
        detailCache,
        fetchingIds,
        expandedItems,
        fetchDetailsForRow,
        onExpandToggle,
        rowState
    }
}
