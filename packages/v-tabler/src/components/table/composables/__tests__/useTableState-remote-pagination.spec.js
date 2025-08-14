import { describe, it, expect, beforeEach } from 'vitest'
import { useTableState } from '../useTableState.js'

describe('useTableState - Remote Pagination Page Reset', () => {
    let tableState
    const testData = [
        { id: 1, name: 'Alice', department: 'Engineering' },
        { id: 2, name: 'Bob', department: 'Marketing' },
        { id: 3, name: 'Carol', department: 'Engineering' }
    ]

    const remotePaginationProps = {
        items: testData,
        fields: [
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department' }
        ],
        paginate: true,
        perPage: 2,
        remotePagination: true,
        topRows: [],
        sortNullsFirst: false,
        totalItems: 100, // Simulate many pages of remote data
        pageSizes: [2, 5, 10, 25]
    }

    beforeEach(() => {
        tableState = useTableState(remotePaginationProps)
    })

    it('should reset to page 1 when setting global search in remote mode', () => {
        // Navigate to page 3
        tableState.setCurrentPage(3)
        expect(tableState.currentPage.value).toBe(3)

        // Set global search - should reset to page 1
        tableState.setGlobalSearch('test search')
        expect(tableState.currentPage.value).toBe(1)
        expect(tableState.globalSearchTerm.value).toBe('test search')
    })

    it('should reset to page 1 when setting column filter in remote mode', () => {
        // Navigate to page 4
        tableState.setCurrentPage(4)
        expect(tableState.currentPage.value).toBe(4)

        // Set column filter - should reset to page 1
        tableState.setColumnFilter('department', {
            type: 'select',
            operator: 'in',
            value: ['Engineering']
        })
        expect(tableState.currentPage.value).toBe(1)
    })

    it('should reset to page 1 when changing sort in remote mode', () => {
        // Navigate to page 5
        tableState.setCurrentPage(5)
        expect(tableState.currentPage.value).toBe(5)

        // Change sort - should reset to page 1
        const fieldDefinition = { key: 'name', label: 'Name' }
        tableState.setSortColumn(fieldDefinition)
        expect(tableState.currentPage.value).toBe(1)
        expect(tableState.sortColumnKey.value).toBe('name')
    })

    it('should reset to page 1 when changing page size in remote mode', () => {
        // Navigate to page 3
        tableState.setCurrentPage(3)
        expect(tableState.currentPage.value).toBe(3)

        // Change page size - should reset to page 1
        tableState.setPageSize(5)
        expect(tableState.currentPage.value).toBe(1)
        expect(tableState.pageSize.value).toBe(5)
    })

    it('should reset to page 1 when navigating to page beyond total pages', () => {
        // Try to navigate to a page that doesn't exist (beyond totalItems/perPage)
        const maxPages = Math.ceil(remotePaginationProps.totalItems / remotePaginationProps.perPage)
        const beyondMaxPage = maxPages + 10

        tableState.setCurrentPage(beyondMaxPage)
        expect(tableState.currentPage.value).toBe(1) // Should be reset to 1
    })

    it('should reset current page when totalItems changes and current page becomes invalid', async () => {
        // Start with current props and navigate to a valid page
        tableState.setCurrentPage(10) // Valid for 100 total items with 2 per page
        expect(tableState.currentPage.value).toBe(10)

        // Simulate totalItems changing to a smaller number (like after filtering)
        // We need to create a new tableState with different totalItems
        const newProps = {
            ...remotePaginationProps,
            totalItems: 15 // Now only 8 pages max (15/2 = 7.5, rounded up = 8)
        }

        const newTableState = useTableState(newProps)

        // Try to set to page 10 (which would be invalid for totalItems = 15)
        newTableState.setCurrentPage(10)
        expect(newTableState.currentPage.value).toBe(1) // Should be reset
    })

    it('should validate current page and reset if invalid', () => {
        // Set to a valid page first
        tableState.setCurrentPage(5)
        expect(tableState.currentPage.value).toBe(5)

        // Manually trigger validation (this would typically happen when totalItems changes)
        const wasReset = tableState.validateCurrentPage()
        expect(wasReset).toBe(false) // Should be valid, no reset needed

        // Create a scenario where the current page would be invalid
        // by creating new table state with fewer total items
        const smallDataProps = {
            ...remotePaginationProps,
            totalItems: 6 // Only 3 pages (6/2 = 3)
        }
        const smallTableState = useTableState(smallDataProps)
        smallTableState.setCurrentPage(5) // This should be reset to 1
        expect(smallTableState.currentPage.value).toBe(1)
    })

    it('should handle edge cases for page validation', () => {
        // Test page 0 or negative
        tableState.setCurrentPage(0)
        expect(tableState.currentPage.value).toBe(1) // Should be at least 1

        tableState.setCurrentPage(-5)
        expect(tableState.currentPage.value).toBe(1) // Should be at least 1
    })
})

describe('useTableState - Helper Functions', () => {
    it('should validate page numbers correctly with getValidPageForRemotePagination', () => {
        const props = {
            items: [],
            fields: [],
            paginate: true,
            perPage: 5,
            remotePagination: true,
            totalItems: 25, // 5 pages total
            pageSizes: [5, 10, 25]
        }

        const tableState = useTableState(props)

        // Test valid pages
        expect(tableState.getValidPageForRemotePagination(1)).toBe(1)
        expect(tableState.getValidPageForRemotePagination(3)).toBe(3)
        expect(tableState.getValidPageForRemotePagination(5)).toBe(5) // Last valid page

        // Test invalid pages (beyond max)
        expect(tableState.getValidPageForRemotePagination(6)).toBe(1) // Should reset to 1
        expect(tableState.getValidPageForRemotePagination(10)).toBe(1) // Should reset to 1

        // Test edge cases
        expect(tableState.getValidPageForRemotePagination(0)).toBe(1) // Should be at least 1
        expect(tableState.getValidPageForRemotePagination(-5)).toBe(1) // Should be at least 1
    })

    it('should pass through pages unchanged for local pagination', () => {
        const props = {
            items: Array(25)
                .fill(null)
                .map((_, i) => ({ id: i })),
            fields: [{ key: 'id' }],
            paginate: true,
            perPage: 5,
            remotePagination: false, // Local pagination
            pageSizes: [5, 10, 25]
        }

        const tableState = useTableState(props)

        // For local pagination, the helper should pass through the requested page
        // (local pagination logic handles validation elsewhere)
        expect(tableState.getValidPageForRemotePagination(1)).toBe(1)
        expect(tableState.getValidPageForRemotePagination(6)).toBe(6) // Passes through
        expect(tableState.getValidPageForRemotePagination(0)).toBe(1) // Still ensures minimum of 1
    })

    it('should handle zero or undefined totalItems correctly', () => {
        const props = {
            items: [],
            fields: [],
            paginate: true,
            perPage: 5,
            remotePagination: true,
            totalItems: 0, // No items
            pageSizes: [5, 10, 25]
        }

        const tableState = useTableState(props)

        // With no items, any page request should be valid (will show empty state)
        expect(tableState.getValidPageForRemotePagination(1)).toBe(1)
        expect(tableState.getValidPageForRemotePagination(5)).toBe(5) // Should pass through
    })
})
