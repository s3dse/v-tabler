// mockApi.js

const TOTAL_ITEMS = 123
const generateItem = i => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.round(Math.random() * 1000),
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    status: ['active', 'inactive', 'pending'][i % 3]
})

const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => generateItem(i))

function applyColumnFilter(item, filter, key) {
    if (!filter || !filter.type) return true
    const value = item[key]
    const filterValue = filter.value
    switch (filter.type) {
        case 'numeric': {
            const numValue = Number(value)
            const numFilter = Number(filterValue)
            if (isNaN(numValue) || isNaN(numFilter) || filterValue === '' || filterValue == null)
                return false
            switch (filter.operator) {
                case '=':
                    return numValue === numFilter
                case '!=':
                    return numValue !== numFilter
                case '>':
                    return numValue > numFilter
                case '>=':
                    return numValue >= numFilter
                case '<':
                    return numValue < numFilter
                case '<=':
                    return numValue <= numFilter
                default:
                    return true
            }
        }
        case 'date': {
            const dateValue = new Date(value)
            const dateFilter = new Date(filterValue)
            if (isNaN(dateValue.getTime()) || isNaN(dateFilter.getTime())) return false
            const valueDateOnly = new Date(
                dateValue.getFullYear(),
                dateValue.getMonth(),
                dateValue.getDate()
            )
            const filterDateOnly = new Date(
                dateFilter.getFullYear(),
                dateFilter.getMonth(),
                dateFilter.getDate()
            )
            const valueTime = valueDateOnly.getTime()
            const filterTime = filterDateOnly.getTime()
            switch (filter.operator) {
                case '=':
                    return valueTime === filterTime
                case '!=':
                    return valueTime !== filterTime
                case '>':
                    return valueTime > filterTime
                case '>=':
                    return valueTime >= filterTime
                case '<':
                    return valueTime < filterTime
                case '<=':
                    return valueTime <= filterTime
                default:
                    return true
            }
        }
        case 'text': {
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        }
        case 'select': {
            return Array.isArray(filterValue) && filterValue.includes(value)
        }
        default:
            return true
    }
}

export const fetchPaginatedData =
    (timeoutMillis = 300) =>
    ({ page = 1, perPage = 10, searchTerm = '', columnFilters = {}, sort = {} }) => {
        let items = [...allItems]

        // Per-column filters (type-based)
        Object.entries(columnFilters).forEach(([key, filter]) => {
            if (
                filter &&
                filter.value !== undefined &&
                filter.value !== null &&
                filter.value !== ''
            ) {
                items = items.filter(item => applyColumnFilter(item, filter, key))
            }
        })

        // Global search: match any field
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            items = items.filter(item =>
                Object.values(item).join(' ').toLowerCase().includes(searchLower)
            )
        }

        // Sorting
        if (sort.key) {
            items.sort((a, b) => {
                if (sort.dir === 'desc') {
                    return a[sort.key] < b[sort.key] ? 1 : -1
                } else {
                    return a[sort.key] > b[sort.key] ? 1 : -1
                }
            })
        }

        const totalItems = items.length
        const start = (page - 1) * perPage
        const pagedItems = items.slice(start, start + perPage)

        return new Promise(resolve => {
            setTimeout(() => resolve({ items: pagedItems, totalItems }), timeoutMillis)
        })
    }
