// Test to demonstrate the fix for column filtering + sorting issue
import { describe, it, expect } from 'vitest'
import { useTableState } from '../useTableState.js'

describe('useTableState - Column Filter + Sort Integration', () => {
    const mockProps = {
        items: [
            { id: 1, name: 'John', age: 30, department: 'IT' },
            { id: 2, name: 'Jane', age: 25, department: 'HR' },
            { id: 3, name: 'Bob', age: 35, department: 'IT' },
            { id: 4, name: 'Alice', age: 28, department: 'HR' }
        ],
        fields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
            { key: 'department', label: 'Department' }
        ],
        topRows: [],
        bottomRows: [],
        paginate: true,
        perPage: 10,
        pageSizes: [5, 10, 25],
        remotePagination: false,
        sortNullsFirst: null
    }

    it('should properly sort data after column filtering is applied', () => {
        const tableState = useTableState(mockProps)

        // Step 1: Apply column filter to show only IT department
        tableState.setColumnFilter('department', {
            type: 'text',
            operator: 'contains',
            value: 'IT'
        })

        // Verify only IT employees are shown
        expect(tableState.allFilteredData.value).toHaveLength(2)
        expect(tableState.allFilteredData.value.every(row => row.department === 'IT')).toBe(true)

        // Step 2: Apply sorting by name
        const nameField = mockProps.fields.find(f => f.key === 'name')
        tableState.setSortColumn(nameField)

        // Verify data is sorted by name within filtered results
        const sortedNames = tableState.allFilteredData.value.map(row => row.name)
        expect(sortedNames).toEqual(['Bob', 'John']) // IT employees sorted by name A-Z

        // Step 3: Change sort direction
        tableState.setSortColumn(nameField) // Click same column to reverse sort

        // Verify data is now sorted in reverse
        const reverseSortedNames = tableState.allFilteredData.value.map(row => row.name)
        expect(reverseSortedNames).toEqual(['John', 'Bob']) // IT employees sorted by name Z-A

        // Step 4: Change column filter to HR
        tableState.setColumnFilter('department', {
            type: 'text',
            operator: 'contains',
            value: 'HR'
        })

        // Verify HR employees are shown, still sorted by name Z-A
        expect(tableState.allFilteredData.value).toHaveLength(2)
        expect(tableState.allFilteredData.value.every(row => row.department === 'HR')).toBe(true)

        const hrSortedNames = tableState.allFilteredData.value.map(row => row.name)
        expect(hrSortedNames).toEqual(['Jane', 'Alice']) // HR employees sorted by name Z-A
    })

    it('should maintain consistent pipeline: filter → sort → paginate', () => {
        const tableState = useTableState({
            ...mockProps,
            perPage: 2 // Small page size to test pagination
        })

        // Apply filter and sort
        tableState.setColumnFilter('department', {
            type: 'text',
            operator: 'contains',
            value: 'IT'
        })

        const ageField = mockProps.fields.find(f => f.key === 'age')
        tableState.setSortColumn(ageField)

        // Check the complete pipeline
        const allData = tableState.allFilteredData.value
        expect(allData).toHaveLength(2) // Filtered to IT
        expect(allData.map(row => row.age)).toEqual([30, 35]) // Sorted by age ascending

        // Check paginated data
        const paginatedData = tableState.tableData.value
        expect(paginatedData).toHaveLength(2) // Both fit on first page with perPage=2
        expect(paginatedData).toEqual(allData) // Same as all data since both fit on page

        // Test with smaller page size
        tableState.setPageSize(1)
        const paginatedDataSmall = tableState.tableData.value
        expect(paginatedDataSmall).toHaveLength(1) // Only first item
        expect(paginatedDataSmall[0].name).toBe('John') // Youngest IT employee (age 30)
    })

    it('should reset to first page when filters or sort change', () => {
        const tableState = useTableState({
            ...mockProps,
            perPage: 2
        })

        // Go to page 2
        tableState.setCurrentPage(2)
        expect(tableState.currentPage.value).toBe(2)

        // Apply filter - should reset to page 1
        tableState.setColumnFilter('department', {
            type: 'text',
            operator: 'contains',
            value: 'IT'
        })
        expect(tableState.currentPage.value).toBe(1)

        // Go to page 2 again
        tableState.setCurrentPage(2)
        expect(tableState.currentPage.value).toBe(2)

        // Apply sort - should reset to page 1
        const nameField = mockProps.fields.find(f => f.key === 'name')
        tableState.setSortColumn(nameField)
        expect(tableState.currentPage.value).toBe(1)
    })
})
