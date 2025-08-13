/**
 * Utility composable for creating consistent event payloads
 */
export function useTableEvents(tableState) {
    function createEventPayload(eventName) {
        return {
            eventName,
            searchTerm: tableState.globalSearchTerm.value,
            columnFilters: Object.fromEntries(tableState.columnFilters.value.entries()),
            page: tableState.currentPage.value,
            perPage: tableState.effectiveItemsPerPage.value,
            numberOfPages: tableState.totalPages.value,
            sort: {
                dir: tableState.sortAscending.value ? 'asc' : 'desc',
                key: tableState.sortColumnKey.value
            }
        }
    }

    return {
        createEventPayload
    }
}
