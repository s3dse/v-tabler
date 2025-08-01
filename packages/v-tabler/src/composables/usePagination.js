import { computed } from 'vue'

const PAGE_CHANGED_EVENT = 'page-changed'

const calculateIntermediatePageRange = (currentPage, maxIntermediateButtons, totalPages) => {
    if (totalPages < maxIntermediateButtons) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const isNearStart = currentPage <= Math.ceil((maxIntermediateButtons - 1) / 2) || currentPage === 1
    if (isNearStart) {
        return Array.from({ length: maxIntermediateButtons }, (_, index) => index + 1)
    }

    const isAtEnd = currentPage === totalPages
    if (isAtEnd) {
        return Array.from({ length: maxIntermediateButtons }, (_, index) => totalPages - index).reverse()
    }

    const halfRange = Math.ceil((maxIntermediateButtons - 1) / 2)
    return Array.from({ length: maxIntermediateButtons }, (_, index) => 
        index + currentPage - halfRange
    )
}

export function usePagination(props) {
    const visiblePageNumbers = computed(() => {
        const safeCurrentPage = props.currentPage || 1
        const safeTotalPages = props.totalPages || 0
        const safeMaxVisible = props.maxVisibleButtons || 5
        
        const intermediateRange = calculateIntermediatePageRange(
            safeCurrentPage,
            safeMaxVisible - 2,
            safeTotalPages
        )
        
        const firstPage = 1
        const lastPage = safeTotalPages > 0 ? [safeTotalPages] : []
        
        return [...new Set([firstPage, ...intermediateRange, ...lastPage])]
    })

    const isOnFirstPage = computed(() => {
        return (props.currentPage || 1) === 1
    })

    const isOnLastPage = computed(() => {
        const safeCurrentPage = props.currentPage || 1
        const safeTotalPages = props.totalPages || 0
        return safeCurrentPage === safeTotalPages || safeTotalPages === 0
    })

    const finalPageLabel = computed(() => {
        const hasCustomLastLabel = props.lastLabel !== ''
        return hasCustomLastLabel ? props.lastLabel : (props.totalPages || 0)
    })

    const entriesDisplayText = computed(() => {
        const safePerPage = props.perPage || 0
        const safeCurrentPage = props.currentPage || 1
        const safeTotalEntries = props.totalEntries || 0
        
        const firstEntryOnPage = Math.max(1, safePerPage * safeCurrentPage - safePerPage + 1)
        const lastEntryOnPage = Math.min(safeTotalEntries, safePerPage * safeCurrentPage)
        
        return `Showing entries ${firstEntryOnPage} to ${lastEntryOnPage} of ${safeTotalEntries} entries`
    })

    const createNavigationHandler = (targetPage) => () => {
        return {
            shouldEmitPageChanged: true,
            eventData: targetPage,
            eventName: PAGE_CHANGED_EVENT
        }
    }

    const navigateToFirstPage = createNavigationHandler(1)

    const navigateToPreviousPage = () => {
        const safeCurrentPage = props.currentPage || 1
        const canGoBack = safeCurrentPage > 1
        if (canGoBack) {
            return {
                shouldEmitPageChanged: true,
                eventData: safeCurrentPage - 1,
                eventName: PAGE_CHANGED_EVENT
            }
        }
        return null
    }

    const navigateToSpecificPage = (pageNumber) => {
        return {
            shouldEmitPageChanged: true,
            eventData: pageNumber,
            eventName: PAGE_CHANGED_EVENT
        }
    }

    const navigateToNextPage = () => {
        const safeCurrentPage = props.currentPage || 1
        const safeTotalPages = props.totalPages || 0
        const canGoForward = safeCurrentPage < safeTotalPages
        if (canGoForward) {
            return {
                shouldEmitPageChanged: true,
                eventData: safeCurrentPage + 1,
                eventName: PAGE_CHANGED_EVENT
            }
        }
        return null
    }

    const navigateToLastPage = () => {
        const safeTotalPages = props.totalPages || 0
        return {
            shouldEmitPageChanged: true,
            eventData: safeTotalPages,
            eventName: PAGE_CHANGED_EVENT
        }
    }

    const isCurrentlySelectedPage = (pageNumber) => {
        const safeCurrentPage = props.currentPage || 1
        return safeCurrentPage === pageNumber
    }

    return {
        pages: visiblePageNumbers,
        isInFirstPage: isOnFirstPage,
        isInLastPage: isOnLastPage,
        last: finalPageLabel,
        paginationLabel: entriesDisplayText,
        onClickFirstPage: navigateToFirstPage,
        onClickPreviousPage: navigateToPreviousPage,
        onClickPage: navigateToSpecificPage,
        onClickNextPage: navigateToNextPage,
        onClickLastPage: navigateToLastPage,
        isPageSelected: isCurrentlySelectedPage,
        PAGE_CHANGED_EVENT
    }
}
