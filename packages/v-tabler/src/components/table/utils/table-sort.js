function numSort(a, b, ascending, nullsFirst) {
    if (a === null || a === undefined) {
        return nullsFirst ? -1 : 1
    }
    if (b === null || b === undefined) {
        return nullsFirst ? 1 : -1
    }
    return ascending ? a - b : b - a
}

function alnumSort(a, b, ascending, nullsFirst) {
    const direction = ascending ? 1 : -1
    if (!validForAlnumSort(a)) {
        return nullsFirst ? -1 : 1
    }
    if (!validForAlnumSort(b)) {
        return nullsFirst ? 1 : -1
    }
    const aVal = a.toString()
    const bVal = b.toString()
    const comparison = aVal.localeCompare(bVal, undefined, {
        sensitivity: 'base'
    })
    return comparison * direction
}

const sortTypes = Object.freeze({ NUMERIC: 'numeric', ALPHANUMERIC: 'alphanumeric' })

const validForAlnumSort = val => {
    return val && typeof ('' + val) === 'string'
}

const validForNumSort = val => val && typeof val === 'number' && Number.isNaN(val) === false

export function guessSortType(tableData, col) {
    const hasNonNumeric = tableData
        .filter(row => row[col.key])
        .some(row => !validForNumSort(row[col.key]))
    return hasNonNumeric ? sortTypes.ALPHANUMERIC : sortTypes.NUMERIC
}

const getSortFn = (tableData, col) => {
    const sortFunctions = {
        numeric: numSort,
        alphanumeric: alnumSort
    }
    const sortFunction = sortFunctions[col.type]
    return sortFunction ? sortFunction : sortFunctions[guessSortType(tableData, col)]
}

export function sortTable(tableData, col, { ascending = true, nullsFirst = null } = {}) {
    const sortFn = getSortFn(tableData, col)
    return tableData.sort((a, b) => {
        const aVal = a[col.key]
        const bVal = b[col.key]
        return sortFn(aVal, bVal, ascending, nullsFirst === null ? !ascending : nullsFirst)
    })
}
