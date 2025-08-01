import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

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

export function useTableFiltering(componentProps, originalItemsArray, currentTableData, navigateToPageCallback) {
    const currentSearchTerm = ref(null)

    const createDebouncedEventEmitter = (onDebouncedEvent) => {
        return useDebounceFn(
            () => {
                if (onDebouncedEvent) {
                    onDebouncedEvent({
                        shouldEmitFilterChangeDebounced: true,
                        eventData: {
                            searchTerm: currentSearchTerm.value
                        }
                    })
                }
            },
            componentProps.filterDebounce,
            { maxWait: componentProps.filterMaxWait }
        )
    }

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
            shouldEmitFilterChange: true,
            shouldEmitAfterFilter: shouldFilterDataLocally,
            eventData: {
                searchValue: userEnteredSearchValue,
                searchTerm: userEnteredSearchValue
            }
        }
    }

    function setupDebouncedEmission(onDebouncedEvent) {
        const emitDebouncedFilterEvent = createDebouncedEventEmitter(onDebouncedEvent)
        
        watch(currentSearchTerm, () => {
            emitDebouncedFilterEvent()
        })
    }

    return {
        searchTerm: currentSearchTerm,
        filterData: handleSearchInputChange,
        setupDebouncedEmission
    }
}
