import { ref } from 'vue'

function isTextFoundInContent(searchText, targetContent) {
    const lowerCaseSearchText = searchText.toLowerCase()
    const lowerCaseTargetContent = targetContent.toLowerCase()
    return lowerCaseTargetContent.indexOf(lowerCaseSearchText) !== -1
}

function convertRowToSearchableFormat(dataRow) {
    const allValuesJoinedTogether = Object.values(dataRow).join('')
    const allValuesJoinedWithSpaces = Object.values(dataRow).join(' ')
    const searchableContent = allValuesJoinedTogether + ' ' + allValuesJoinedWithSpaces

    return {
        row: dataRow,
        normalized: searchableContent
    }
}

export function useTableFiltering(
    componentProps,
    originalItemsArray,
    currentTableData,
    navigateToPageCallback
) {
    const currentSearchTerm = ref(null)

    function determineIfRowMatchesSearch(searchableRow, searchValue) {
        return isTextFoundInContent(searchValue, searchableRow.normalized)
    }

    function handleSearchInputChange(inputEvent) {
        const userEnteredSearchValue = inputEvent.target.value
        currentSearchTerm.value = userEnteredSearchValue

        const shouldFilterDataLocally = !componentProps.remotePagination
        if (shouldFilterDataLocally) {
            const shouldResetToFirstPage = componentProps.paginate
            if (shouldResetToFirstPage) {
                navigateToPageCallback(1)
            }

            const itemsInSearchableFormat = originalItemsArray.map(convertRowToSearchableFormat)
            const rowsThatMatchSearchTerm = itemsInSearchableFormat.filter(searchableRow =>
                determineIfRowMatchesSearch(searchableRow, userEnteredSearchValue)
            )

            currentTableData.value = rowsThatMatchSearchTerm.map(searchResult =>
                searchResult ? searchResult.row : []
            )
        }

        return {
            eventData: {
                searchTerm: userEnteredSearchValue
            }
        }
    }

    return {
        searchTerm: currentSearchTerm,
        filterData: handleSearchInputChange
    }
}
