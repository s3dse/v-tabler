import { ref, computed } from 'vue'

export function useTablePagination(componentProps, itemsPerPageValue, currentTableData) {
    const currentlyViewedPageNumber = ref(1)
    
    const findFirstValidPageSizeOption = () => {
        const topRowsCount = componentProps.topRows?.length || 0
        const suitablePageSize = componentProps.pageSizes?.find(size => size > topRowsCount)
        return suitablePageSize || 5
    }
    
    const internalPageSizeValue = ref(
        componentProps.perPage > (componentProps.topRows?.length || 0)
            ? componentProps.perPage
            : findFirstValidPageSizeOption()
    )

    const effectivePageSize = computed({
        get() {
            const topRowsCount = componentProps.topRows?.length || 0
            const currentValueIsValid = internalPageSizeValue.value > topRowsCount
            
            return currentValueIsValid
                ? internalPageSizeValue.value
                : findFirstValidPageSizeOption()
        },
        set(newValue) {
            const topRowsCount = componentProps.topRows?.length || 0
            const proposedValueIsValid = newValue > topRowsCount
            
            internalPageSizeValue.value = proposedValueIsValid 
                ? newValue 
                : findFirstValidPageSizeOption()
        }
    })

    const totalAvailablePages = computed(() => {
        const safeItemsPerPage = itemsPerPageValue.value || 1
        const isUsingRemotePagination = componentProps.remotePagination
        
        if (isUsingRemotePagination) {
            const totalItemsFromServer = componentProps.totalItems || 0
            return Math.ceil(totalItemsFromServer / safeItemsPerPage)
        } else {
            const localDataLength = currentTableData.value?.length || 0
            return Math.ceil(localDataLength / safeItemsPerPage)
        }
    })

    function navigateToSpecificPage(targetPageNumber) {
        const isNavigatingToSamePage = targetPageNumber === currentlyViewedPageNumber.value
        if (isNavigatingToSamePage) return null
        
        const previousPageNumber = currentlyViewedPageNumber.value
        currentlyViewedPageNumber.value = targetPageNumber

        return {
            shouldEmitPageChange: true,
            shouldEmitAfterPageChange: true,
            eventData: {
                page: targetPageNumber,
                oldPage: previousPageNumber,
                newPage: targetPageNumber
            }
        }
    }

    function extractRowsForCurrentPage(dataSource = currentTableData.value, shouldPaginate = componentProps.paginate) {
        const safeDataArray = dataSource || []
        const shouldApplyLocalPagination = shouldPaginate && !componentProps.remotePagination
        
        if (shouldApplyLocalPagination) {
            const safeItemsPerPage = itemsPerPageValue.value || 1
            const startingIndex = (currentlyViewedPageNumber.value - 1) * safeItemsPerPage
            const endingIndex = startingIndex + safeItemsPerPage
            return safeDataArray.slice(startingIndex, endingIndex)
        } else {
            return safeDataArray
        }
    }

    return {
        currentPage: currentlyViewedPageNumber,
        pageSize: effectivePageSize,
        numberOfPages: totalAvailablePages,
        changePage: navigateToSpecificPage,
        getRows: extractRowsForCurrentPage
    }
}
