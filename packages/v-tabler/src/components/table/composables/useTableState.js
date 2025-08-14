import { ref, computed, watch } from 'vue'
import { sortTable } from '../utils/table-sort'
import { applyFilter as applyColumnFilter } from '../utils/column-filtering'

/**
 * Centralized table state management that handles the complete data pipeline:
 * Raw Data → Global Filter → Column Filters → Sort → Pagination
 *
 * This ensures consistent data flow and prevents race conditions between
 * different table operations.
 */
export function useTableState(props) {
    const rawTableData = ref([...(props.items || [])])
    const globalSearchTerm = ref(null)
    const columnFilters = ref(new Map())
    const sortColumnKey = ref('')
    const sortAscending = ref(true)
    const currentPage = ref(1)
    const pageSize = ref(
        props.perPage > (props.topRows?.length || 0) ? props.perPage : findFirstValidPageSize()
    )

    // ============================================================================
    // COMPUTED DATA PIPELINE
    // ============================================================================

    /**
     * Step 1: Apply global search filter
     */
    const globalFilteredData = computed(() => {
        if (!globalSearchTerm.value || props.remotePagination) {
            return rawTableData.value
        }

        const searchValue = globalSearchTerm.value.toLowerCase()
        return rawTableData.value.filter(item => {
            const searchableContent = Object.values(item).join(' ').toLowerCase()
            return searchableContent.includes(searchValue)
        })
    })

    /**
     * Step 2: Apply column filters
     */
    const columnFilteredData = computed(() => {
        if (columnFilters.value.size === 0 || props.remotePagination) {
            return globalFilteredData.value
        }

        const activeFilters = [...columnFilters.value.entries()]
        return globalFilteredData.value.filter(item => {
            return activeFilters.every(([fieldKey, filter]) => {
                return applyColumnFilter(item[fieldKey], filter)
            })
        })
    })

    /**
     * Step 3: Apply sorting
     */
    const sortedData = computed(() => {
        if (!sortColumnKey.value || props.remotePagination) {
            return [...columnFilteredData.value]
        }

        const dataToSort = [...columnFilteredData.value]
        const fieldDefinition = props.fields?.find(f => f.key === sortColumnKey.value)

        if (fieldDefinition) {
            sortTable(dataToSort, fieldDefinition, {
                ascending: sortAscending.value,
                nullsFirst: props.sortNullsFirst
            })
        }

        return dataToSort
    })

    /**
     * Step 4: Apply pagination (final step)
     */
    const paginatedData = computed(() => {
        if (!props.paginate || props.remotePagination) {
            return sortedData.value
        }

        const itemsPerPage = effectiveItemsPerPage.value
        const startIndex = (currentPage.value - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage

        return sortedData.value.slice(startIndex, endIndex)
    })

    const effectiveItemsPerPage = computed(() => {
        const topRowsCount = props.topRows?.length || 0
        return Math.max(1, pageSize.value - topRowsCount)
    })

    const totalPages = computed(() => {
        if (props.remotePagination) {
            const totalItems = props.totalItems || 0
            return Math.ceil(totalItems / effectiveItemsPerPage.value)
        } else {
            const dataLength = sortedData.value.length
            return Math.ceil(dataLength / effectiveItemsPerPage.value)
        }
    })

    const hasActiveColumnFilters = computed(() => {
        return columnFilters.value.size > 0
    })

    const currentSortState = computed(() => ({
        column: sortColumnKey.value,
        ascending: sortAscending.value
    }))

    function setGlobalSearch(searchTerm) {
        globalSearchTerm.value = searchTerm
        if (props.paginate) {
            currentPage.value = 1
        }

        return {
            eventData: {
                searchTerm: searchTerm
            }
        }
    }

    function setColumnFilter(fieldKey, filter) {
        if (filter) {
            columnFilters.value.set(fieldKey, filter)
        } else {
            columnFilters.value.delete(fieldKey)
        }

        if (props.paginate) {
            currentPage.value = 1
        }

        return {
            eventData: {
                field: fieldKey,
                filter: filter
            }
        }
    }

    function clearAllColumnFilters() {
        columnFilters.value.clear()

        return {
            eventData: {}
        }
    }

    function setSortColumn(columnDefinition) {
        const isClickingSameColumn = sortColumnKey.value === columnDefinition.key

        if (isClickingSameColumn) {
            sortAscending.value = !sortAscending.value
        } else {
            sortColumnKey.value = columnDefinition.key
            sortAscending.value = true
        }

        if (props.paginate) {
            currentPage.value = 1
        }

        return {
            eventData: {
                column: columnDefinition,
                ascending: sortAscending.value
            }
        }
    }

    function setCurrentPage(page) {
        const oldPage = currentPage.value
        const targetPage = getValidPageForRemotePagination(page)
        currentPage.value = targetPage

        return {
            eventData: {
                page: currentPage.value,
                oldPage: oldPage,
                newPage: currentPage.value
            }
        }
    }
    function setPageSize(newPageSize) {
        const topRowsCount = props.topRows?.length || 0
        const validPageSize = newPageSize > topRowsCount ? newPageSize : findFirstValidPageSize()
        pageSize.value = validPageSize
        currentPage.value = 1

        return {
            eventData: {
                pageSize: validPageSize
            }
        }
    }

    function findFirstValidPageSize() {
        const topRowsCount = props.topRows?.length || 0
        const suitablePageSize = props.pageSizes?.find(size => size > topRowsCount)
        return suitablePageSize || 5
    }

    /**
     * Helper function to validate and correct page numbers for remote pagination
     * @param {number} requestedPage - The page number to validate
     * @returns {number} - Valid page number: `1` if requested page is invalid, otherwise `requestedPage`
     */
    function getValidPageForRemotePagination(requestedPage) {
        const minValidPage = Math.max(1, requestedPage)

        if (!props.remotePagination || !props.paginate) {
            return minValidPage
        }

        if (minValidPage > totalPages.value) return 1

        return minValidPage
    }

    function getSortIconClass(columnKey) {
        const isColumnCurrentlySorted = columnKey === sortColumnKey.value

        if (!isColumnCurrentlySorted) {
            return 'i-tabler-arrows-sort'
        }

        return sortAscending.value ? 'i-tabler-sort-ascending' : 'i-tabler-sort-descending'
    }

    function validateCurrentPage() {
        const validPage = getValidPageForRemotePagination(currentPage.value)
        const wasReset = validPage !== currentPage.value

        if (wasReset) {
            currentPage.value = validPage
        }

        return wasReset // Returns true if page was reset
    }

    // Watch raw data
    watch(
        () => props.items,
        newItems => {
            rawTableData.value = [...(newItems || [])]
        }
    )

    // Watch for changes in per-page
    watch(
        () => props.perPage,
        newPerPage => {
            if (newPerPage > (props.topRows?.length || 0)) {
                setPageSize(newPerPage)
            }
        }
    )

    // Watch for changes in totalItems for remote pagination
    // Reset to page 1 if current page becomes invalid
    watch(
        () => props.totalItems,
        (newTotalItems, oldTotalItems) => {
            if (props.remotePagination && props.paginate && newTotalItems !== oldTotalItems) {
                const validPage = getValidPageForRemotePagination(currentPage.value)
                if (validPage !== currentPage.value) {
                    currentPage.value = validPage
                }
            }
        }
    )

    return {
        tableData: paginatedData, // paginated data to render for the current page
        allFilteredData: sortedData, // For components that need unfiltered data, e.g. pagination

        // State (read-only)
        globalSearchTerm: computed(() => globalSearchTerm.value),
        columnFilters: computed(() => columnFilters.value),
        currentPage: computed(() => currentPage.value),
        pageSize: computed(() => pageSize.value),
        effectiveItemsPerPage,
        totalPages,
        sortColumnKey: computed(() => sortColumnKey.value),
        sortAscending: computed(() => sortAscending.value),
        currentSortState,
        hasActiveColumnFilters,

        // Actions
        setGlobalSearch,
        setColumnFilter,
        clearAllColumnFilters,
        setSortColumn,
        setCurrentPage,
        setPageSize,

        // Utilities
        getSortIconClass,
        validateCurrentPage,
        getValidPageForRemotePagination
    }
}
