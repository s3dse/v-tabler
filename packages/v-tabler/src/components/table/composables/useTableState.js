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
    // ============================================================================
    // STATE
    // ============================================================================

    // Source data
    const rawTableData = ref([...(props.items || [])])

    // Global search
    const globalSearchTerm = ref(null)

    // Column filters
    const columnFilters = ref(new Map())

    // Sorting
    const sortColumnKey = ref('')
    const sortAscending = ref(true)

    // Pagination
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

    // ============================================================================
    // COMPUTED METADATA
    // ============================================================================

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

    // ============================================================================
    // ACTIONS
    // ============================================================================

    function setGlobalSearch(searchTerm) {
        globalSearchTerm.value = searchTerm
        // Reset to first page when search changes (both local and remote)
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

        // Reset to first page when filters change (both local and remote)
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

        // Reset to first page when sort changes (both local and remote)
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

        // For remote pagination, we need to validate against totalPages
        // For local pagination, the computed totalPages will handle this
        let targetPage = page

        if (props.remotePagination && props.paginate) {
            const maxPages = totalPages.value
            if (maxPages > 0 && page > maxPages) {
                targetPage = 1 // Reset to first page if trying to navigate beyond available pages
            }
        }

        currentPage.value = Math.max(1, targetPage) // Ensure page is at least 1

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

        // Reset to first page when page size changes (both local and remote)
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

    function getSortIconClass(columnKey) {
        const isColumnCurrentlySorted = columnKey === sortColumnKey.value

        if (!isColumnCurrentlySorted) {
            return 'i-tabler-arrows-sort'
        }

        return sortAscending.value ? 'i-tabler-sort-ascending' : 'i-tabler-sort-descending'
    }

    function validateCurrentPage() {
        const maxPages = totalPages.value
        if (maxPages > 0 && currentPage.value > maxPages) {
            currentPage.value = 1
            return true // Page was reset
        }
        return false // Page is valid
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
                const maxPages = Math.ceil((newTotalItems || 0) / effectiveItemsPerPage.value)
                if (maxPages > 0 && currentPage.value > maxPages) {
                    currentPage.value = 1
                }
            }
        }
    )

    // ============================================================================
    // RETURN API
    // ============================================================================

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
        validateCurrentPage
    }
}
