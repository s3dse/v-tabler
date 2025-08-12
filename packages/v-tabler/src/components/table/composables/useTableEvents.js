export function useTableEvents({
    columnFilters = new Map(),
    globalSearch = {},
    pagination = {},
    sort = {}
}) {
    const createEventPayload = eventName => {
        return {
            eventName,
            columnFilters,
            globalSearch,
            pagination,
            sort
        }
    }
    return {}
}
