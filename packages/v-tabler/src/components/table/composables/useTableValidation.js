export function useTableValidation() {
    function ensureComponentPropsAreValid(pageSize, topRowsLength, remotePagination, totalItems) {
        let allPropsAreValid = true
        
        const pageSizeIsTooSmall = pageSize <= topRowsLength
        if (pageSizeIsTooSmall) {
            console.error("'pageSize' must be higher than length of 'topRows'.")
            allPropsAreValid = false
        }
        
        const remotePaginationNeedsTotalItems = remotePagination && (totalItems === undefined || totalItems === null)
        if (remotePaginationNeedsTotalItems) {
            console.error("'remotePagination === true' requires a 'totalItems' (int) prop")
            allPropsAreValid = false
        }
        
        return allPropsAreValid
    }

    return {
        validateProps: ensureComponentPropsAreValid
    }
}
