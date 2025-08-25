export function useTableValidation() {
    function ensureComponentPropsAreValid(
        pageSize,
        topRowsLength,
        remotePagination,
        totalItems,
        fields
    ) {
        let allPropsAreValid = true

        const pageSizeIsTooSmall = pageSize <= topRowsLength
        if (pageSizeIsTooSmall) {
            console.error("'pageSize' must be higher than length of 'topRows'.")
            allPropsAreValid = false
        }

        const remotePaginationNeedsTotalItems =
            remotePagination && (totalItems === undefined || totalItems === null)
        if (remotePaginationNeedsTotalItems) {
            console.error("'remotePagination === true' requires a 'totalItems' (int) prop")
            allPropsAreValid = false
        }

        const duplicateKeys = Object.entries(Object.groupBy(fields, f => f.key)).filter(
            ([, value]) => value.length > 1
        )
        const fieldsHaveDuplicates = duplicateKeys.length > 0
        if (fieldsHaveDuplicates) {
            console.warn(
                'Fields have duplicate keys:',
                duplicateKeys.map(([key]) => key).join(', ')
            )
            allPropsAreValid = false
        }

        return allPropsAreValid
    }

    return {
        validateProps: ensureComponentPropsAreValid
    }
}
