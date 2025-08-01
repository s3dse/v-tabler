import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TableComponent from '@/components/table/TableComponent.vue'
import ColumnFilter from '@/components/table/components/ColumnFilter.vue'
import { useColumnFiltering } from '@/components/table/composables/useColumnFiltering.js'

// Test data similar to the demo
const testData = [
    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 75000, hire_date: '2023-01-15', status: 'Active' },
    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000, hire_date: '2022-03-20', status: 'Active' },
    { id: 3, name: 'Carol Davis', department: 'Engineering', salary: 85000, hire_date: '2021-07-10', status: 'Active' },
    { id: 4, name: 'David Wilson', department: 'Sales', salary: 55000, hire_date: '2023-05-01', status: 'Inactive' },
    { id: 5, name: 'Eva Brown', department: 'HR', salary: 70000, hire_date: '2020-11-25', status: 'Active' }
]

const testFields = [
    {
        key: 'id',
        label: 'ID',
        type: 'numeric'
    },
    {
        key: 'name',
        label: 'Employee Name',
        filterType: 'text'
    },
    {
        key: 'department',
        label: 'Department',
        filterType: 'select',
        filterOptions: [
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Sales', label: 'Sales' },
            { value: 'HR', label: 'Human Resources' }
        ]
    },
    {
        key: 'salary',
        label: 'Salary',
        type: 'numeric'
    },
    {
        key: 'hire_date',
        label: 'Hire Date',
        filterType: 'date'
    },
    {
        key: 'status',
        label: 'Status',
        filterType: 'select'
    }
]

describe('Column Filtering', () => {
    describe('useColumnFiltering composable', () => {
        let columnFiltering

        beforeEach(() => {
            columnFiltering = useColumnFiltering()
        })

        it('should initialize with empty filters', () => {
            expect(columnFiltering.columnFilters.value).toEqual({})
            expect(columnFiltering.hasActiveFilters.value).toBe(false)
            expect(columnFiltering.activeFiltersCount.value).toBe(0)
        })

        it('should apply numeric filters correctly', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            // Test equals operator
            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 75000
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('Alice Johnson')
            expect(filtered[0].salary).toBe(75000)
        })

        it('should handle numeric equals filter with no matches', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 99999 // No employee has this salary
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(0)
        })

        it('should handle the specific bug: numeric equals filter should not break table rendering', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            // This was the original bug - when typing a number, all data would vanish
            // and the table header would disappear
            setColumnFilter('salary', {
                type: 'numeric', 
                operator: '=',
                value: 75000
            })

            const filtered = applyColumnFilters(testData)
            
            // Should return exactly one match (Alice Johnson with salary 75000)
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('Alice Johnson')
            expect(filtered[0].salary).toBe(75000)
            
            // Most importantly: should return a valid array, not undefined/null
            expect(Array.isArray(filtered)).toBe(true)
        })

        it('should handle numeric greater than filter', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            setColumnFilter('salary', {
                type: 'numeric',
                operator: '>',
                value: 70000
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(2) // Alice (75000) and Carol (85000)
            expect(filtered.map(item => item.name)).toEqual(['Alice Johnson', 'Carol Davis'])
        })

        it('should handle numeric less than or equal filter', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            setColumnFilter('salary', {
                type: 'numeric',
                operator: '<=',
                value: 65000
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(2) // Bob (65000) and David (55000)
            expect(filtered.map(item => item.name)).toEqual(['Bob Smith', 'David Wilson'])
        })

        it('should handle empty or invalid numeric filter values', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            // Test empty string
            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: ''
            })

            let filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(0) // Should return no results for empty filter

            // Test null value
            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: null
            })

            filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(0) // Should return no results for null filter

            // Test NaN value
            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 'not-a-number'
            })

            filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(0) // Should return no results for invalid number
        })

        it('should handle text filters correctly', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            setColumnFilter('name', {
                type: 'text',
                operator: 'contains',
                value: 'johnson'
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('Alice Johnson')
        })

        it('should handle select filters correctly', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            setColumnFilter('department', {
                type: 'select',
                operator: 'in',
                value: ['Engineering', 'Marketing']
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(3) // Alice, Bob, Carol
            expect(filtered.map(item => item.department)).toEqual(['Engineering', 'Marketing', 'Engineering'])
        })

        it('should handle multiple filters combined', () => {
            const { applyColumnFilters, setColumnFilter } = columnFiltering

            // Filter for Engineering department AND salary > 70000
            setColumnFilter('department', {
                type: 'select',
                operator: 'in',
                value: ['Engineering']
            })

            setColumnFilter('salary', {
                type: 'numeric',
                operator: '>',
                value: 70000
            })

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(2) // Alice (75000) and Carol (85000)
            expect(filtered.every(item => item.department === 'Engineering')).toBe(true)
            expect(filtered.every(item => item.salary > 70000)).toBe(true)
        })

        it('should clear filters correctly', () => {
            const { applyColumnFilters, setColumnFilter, clearAllColumnFilters } = columnFiltering

            // Set a filter
            setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 75000
            })

            expect(columnFiltering.hasActiveFilters.value).toBe(true)

            // Clear all filters
            clearAllColumnFilters()

            expect(columnFiltering.hasActiveFilters.value).toBe(false)
            expect(columnFiltering.columnFilters.value).toEqual({})

            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(testData.length) // Should return all data
        })
    })

    describe('ColumnFilter component', () => {
        it('should render numeric filter correctly', () => {
            const wrapper = mount(ColumnFilter, {
                props: {
                    field: { key: 'salary', label: 'Salary', type: 'numeric' },
                    data: testData,
                    modelValue: {}
                }
            })

            expect(wrapper.exists()).toBe(true)
            // The filter type should be detected as numeric
            expect(wrapper.vm.filterType).toBe('numeric')
        })

        it('should render filter trigger button', () => {
            const wrapper = mount(ColumnFilter, {
                props: {
                    field: { key: 'salary', label: 'Salary', type: 'numeric' },
                    data: testData,
                    modelValue: {}
                }
            })

            // Should have a filter trigger button
            const triggerButton = wrapper.find('button')
            expect(triggerButton.exists()).toBe(true)
        })

        it('should auto-detect filter type correctly', () => {
            // Test numeric auto-detection
            const numericWrapper = mount(ColumnFilter, {
                props: {
                    field: { key: 'salary' }, // No explicit filterType
                    data: testData,
                    modelValue: {}
                }
            })
            expect(numericWrapper.vm.filterType).toBe('numeric')

            // Test text auto-detection
            const textWrapper = mount(ColumnFilter, {
                props: {
                    field: { key: 'name' }, // No explicit filterType
                    data: testData,
                    modelValue: {}
                }
            })
            expect(textWrapper.vm.filterType).toBe('text')
        })
    })

    describe('TableComponent with column filtering', () => {
        const defaultProps = {
            items: testData,
            fields: testFields,
            enableColumnFilters: true
        }

        it('should render table with column filters enabled', () => {
            const wrapper = mount(TableComponent, {
                props: defaultProps,
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-head': true,
                        'table-body': true,
                        'table-footer': true
                    }
                }
            })

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.props('enableColumnFilters')).toBe(true)
        })

        it('should filter data when column filter is applied', async () => {
            const wrapper = mount(TableComponent, {
                props: defaultProps,
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-head': true,
                        'table-body': true,
                        'table-footer': true
                    }
                }
            })

            // Apply a numeric filter
            wrapper.vm.setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 75000
            })

            await flushPromises()

            // The dataForPagination should be filtered
            expect(wrapper.vm.dataForPagination).toHaveLength(1)
            expect(wrapper.vm.dataForPagination[0].name).toBe('Alice Johnson')
        })

        it('should emit column filter events', async () => {
            const wrapper = mount(TableComponent, {
                props: defaultProps,
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-head': true,
                        'table-body': true,
                        'table-footer': true
                    }
                }
            })

            const filter = {
                type: 'numeric',
                operator: '=',
                value: 75000,
                field: 'salary'
            }

            // Simulate column filter event from child component
            await wrapper.vm.handleColumnFilterInternal(filter)
            await flushPromises()

            // Check emitted events
            const filterChangeEvents = wrapper.emitted('column-filter-change')
            const afterFilterEvents = wrapper.emitted('after-column-filter')

            expect(filterChangeEvents).toBeTruthy()
            expect(afterFilterEvents).toBeTruthy()
        })

        it('should handle edge case: empty data array', () => {
            const wrapper = mount(TableComponent, {
                props: {
                    ...defaultProps,
                    items: []
                },
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-head': true,
                        'table-body': true,
                        'table-footer': true
                    }
                }
            })

            // Apply filter to empty data
            wrapper.vm.setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 75000
            })

            // Should not throw error and return empty array
            expect(wrapper.vm.dataForPagination).toEqual([])
        })

        it('should keep table header visible when filtering results in zero matches', () => {
            const wrapper = mount(TableComponent, {
                props: defaultProps,
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-footer': true
                    }
                }
            })

            // Apply a filter that will match nothing
            wrapper.vm.setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 999999 // No employee has this salary
            })

            // Should have zero data rows
            expect(wrapper.vm.dataForPagination).toHaveLength(0)
            
            // But table header should still be present
            const tableHead = wrapper.find('thead')
            expect(tableHead.exists()).toBe(true)
            
            // And should contain header cells for each field
            const headerCells = wrapper.findAll('th')
            expect(headerCells.length).toBeGreaterThan(0)
        })

        it('should handle edge case: null/undefined items prop', () => {
            const wrapper = mount(TableComponent, {
                props: {
                    ...defaultProps,
                    items: null
                },
                global: {
                    stubs: {
                        'table-title': true,
                        'table-header': true,
                        'table-head': true,
                        'table-body': true,
                        'table-footer': true
                    }
                }
            })

            // Should not throw error
            expect(wrapper.vm.dataForPagination).toEqual([])
        })
    })
})
