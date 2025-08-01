import { ref, computed } from 'vue'
import { sortTable } from '../table-sort'

export function useTableSorting(tableDataArray, isRemotePaginationEnabled, shouldSortNullsFirst) {
    const isSortedInAscendingOrder = ref(false)
    const currentlySortedColumnKey = ref('')

    const currentSortConfiguration = computed(() => ({
        column: currentlySortedColumnKey.value,
        ascending: isSortedInAscendingOrder.value
    }))

    function executeColumnSort(columnDefinition, navigateToFirstPageCallback) {
        const isClickingOnSameColumn = currentlySortedColumnKey.value === columnDefinition.key
        
        if (isClickingOnSameColumn) {
            isSortedInAscendingOrder.value = !isSortedInAscendingOrder.value
        } else {
            isSortedInAscendingOrder.value = true
            currentlySortedColumnKey.value = columnDefinition.key
        }

        const sortEventData = { 
            column: columnDefinition, 
            ascending: isSortedInAscendingOrder.value 
        }
        
        const shouldHandleSortingLocally = !isRemotePaginationEnabled
        if (shouldHandleSortingLocally) {
            sortTable(tableDataArray.value, columnDefinition, { 
                ascending: isSortedInAscendingOrder.value, 
                nullsFirst: shouldSortNullsFirst 
            })
            
            const shouldResetToFirstPage = navigateToFirstPageCallback
            if (shouldResetToFirstPage) {
                navigateToFirstPageCallback(1)
            }
        }

        return {
            shouldEmitSortChange: true,
            shouldEmitAfterSort: shouldHandleSortingLocally,
            eventData: sortEventData
        }
    }

    function determineSortIconClass(columnKey) {
        const isColumnCurrentlySorted = columnKey === currentlySortedColumnKey.value
        
        if (!isColumnCurrentlySorted) {
            return 'i-tabler-arrows-sort'
        }
        
        return isSortedInAscendingOrder.value 
            ? 'i-tabler-sort-ascending' 
            : 'i-tabler-sort-descending'
    }

    return {
        ascending: isSortedInAscendingOrder,
        sortColumnKey: currentlySortedColumnKey,
        sortState: currentSortConfiguration,
        handleSort: executeColumnSort,
        getSortIconClass: determineSortIconClass
    }
}
