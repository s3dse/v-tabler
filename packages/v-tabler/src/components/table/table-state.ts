export interface TableState {
    searchTerm: string
    columnFilters: Record<string, any>
    currentPage: number
    pageSize: number
    numberOfPages: number
    sort: {
        dir: 'asc' | 'desc' | null
        key: string | null
    }
}
