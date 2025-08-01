export function useTableStyles() {
    function extractStandardCellClasses(columnDefinition) {
        return columnDefinition.tdClassList || ''
    }

    function extractTopRowCellClasses(columnDefinition) {
        const hasSpecialTopRowStyling = columnDefinition.tdTopRowClassList
        return hasSpecialTopRowStyling 
            ? columnDefinition.tdTopRowClassList 
            : extractStandardCellClasses(columnDefinition)
    }

    function extractBottomRowCellClasses(columnDefinition) {
        const hasSpecialBottomRowStyling = columnDefinition.tdBottomRowClassList
        return hasSpecialBottomRowStyling 
            ? columnDefinition.tdBottomRowClassList 
            : extractStandardCellClasses(columnDefinition)
    }

    function addLeftPaddingToFirstColumn(columnIndex) {
        const isFirstColumn = columnIndex === 0
        return isFirstColumn ? 'pe-6' : ''
    }

    function addRightPaddingToLastColumn(columnIndex, totalNumberOfColumns) {
        const isLastColumn = columnIndex === totalNumberOfColumns - 1
        return isLastColumn ? 'pe-6' : ''
    }

    return {
        getClassList: extractStandardCellClasses,
        getTopRowClassList: extractTopRowCellClasses,
        getBottomRowClassList: extractBottomRowCellClasses,
        leftPadFirstCol: addLeftPaddingToFirstColumn,
        rightPadLastCol: addRightPaddingToLastColumn
    }
}
