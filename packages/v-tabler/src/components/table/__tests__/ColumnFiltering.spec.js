import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TableComponent from '@/components/table/TableComponent.vue'
import ColumnFilter from '@/components/table/components/ColumnFilter.vue'
import { useColumnFiltering } from '@/components/table/composables/useColumnFiltering.js'
import { TABLE_FILTER_CONFIG_KEY } from '@/components/table/composables/useTableFilterConfig.js'

// Test data similar to the demo
const testData = [
    {
        id: 1,
        name: 'Alice Johnson',
        department: 'Engineering',
        salary: 75000,
        hire_date: '2023-01-15',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Bob Smith',
        department: 'Marketing',
        salary: 65000,
        hire_date: '2022-03-20',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Carol Davis',
        department: 'Engineering',
        salary: 85000,
        hire_date: '2021-07-10',
        status: 'Active'
    },
    {
        id: 4,
        name: 'David Wilson',
        department: 'Sales',
        salary: 55000,
        hire_date: '2023-05-01',
        status: 'Inactive'
    },
    {
        id: 5,
        name: 'Eva Brown',
        department: 'HR',
        salary: 70000,
        hire_date: '2020-11-25',
        status: 'Active'
    }
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
            expect(filtered.map(item => item.department)).toEqual([
                'Engineering',
                'Marketing',
                'Engineering'
            ])
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

        it('should clear all column filters when clearAllColumnFilters is called', () => {
            const {
                applyColumnFilters,
                setColumnFilter,
                clearAllColumnFilters,
                columnFilters,
                hasActiveFilters
            } = columnFiltering

            // Apply multiple filters
            setColumnFilter('name', {
                type: 'text',
                operator: 'contains',
                value: 'John'
            })

            setColumnFilter('salary', {
                type: 'numeric',
                operator: '>',
                value: 70000
            })

            setColumnFilter('department', {
                type: 'select',
                operator: 'in',
                value: ['Engineering']
            })

            // Verify filters are active
            expect(hasActiveFilters.value).toBe(true)
            expect(Object.keys(columnFilters.value)).toHaveLength(3)

            // Clear all filters
            clearAllColumnFilters()

            // Verify all filters are cleared
            expect(hasActiveFilters.value).toBe(false)
            expect(Object.keys(columnFilters.value)).toHaveLength(0)
            expect(columnFilters.value).toEqual({})

            // Verify no filtering is applied
            const filtered = applyColumnFilters(testData)
            expect(filtered).toHaveLength(testData.length)
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

        describe('Select Options Generation', () => {
            it('should use explicit filterOptions when provided', () => {
                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: {
                            key: 'department',
                            filterType: 'select',
                            filterOptions: [
                                { value: 'Engineering', label: 'Engineering Dept' },
                                { value: 'Marketing', label: 'Marketing Dept' }
                            ]
                        },
                        data: testData,
                        modelValue: {}
                    }
                })

                const options = wrapper.vm.selectOptions
                expect(options).toHaveLength(2)
                expect(options[0]).toEqual({ value: 'Engineering', label: 'Engineering Dept' })
                expect(options[1]).toEqual({ value: 'Marketing', label: 'Marketing Dept' })
            })

            it('should auto-generate options from data when no filterOptions provided', () => {
                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: {
                            key: 'department',
                            filterType: 'select'
                            // No filterOptions provided
                        },
                        data: testData,
                        modelValue: {}
                    }
                })

                const options = wrapper.vm.selectOptions
                expect(options).toHaveLength(4) // Engineering, HR, Marketing, Sales
                expect(options.map(o => o.value)).toEqual([
                    'Engineering',
                    'HR',
                    'Marketing',
                    'Sales'
                ])
                expect(options.map(o => o.label)).toEqual([
                    'Engineering',
                    'HR',
                    'Marketing',
                    'Sales'
                ])
            })

            it('should auto-detect select type for low cardinality data', () => {
                const lowCardinalityData = [
                    { status: 'Active' },
                    { status: 'Active' },
                    { status: 'Inactive' },
                    { status: 'Active' },
                    { status: 'Pending' },
                    { status: 'Active' },
                    { status: 'Inactive' },
                    { status: 'Active' },
                    { status: 'Pending' },
                    { status: 'Active' }
                ]

                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: { key: 'status' }, // No explicit filterType
                        data: lowCardinalityData,
                        modelValue: {}
                    }
                })

                expect(wrapper.vm.filterType).toBe('select')
                const options = wrapper.vm.selectOptions
                expect(options).toHaveLength(3) // Active, Inactive, Pending
                expect(options.map(o => o.value).sort()).toEqual(['Active', 'Inactive', 'Pending'])
            })

            it('should fallback to text type for high cardinality data', () => {
                const highCardinalityData = [
                    { id: 1, name: 'Person 1' },
                    { id: 2, name: 'Person 2' },
                    { id: 3, name: 'Person 3' },
                    { id: 4, name: 'Person 4' },
                    { id: 5, name: 'Person 5' },
                    { id: 6, name: 'Person 6' },
                    { id: 7, name: 'Person 7' },
                    { id: 8, name: 'Person 8' },
                    { id: 9, name: 'Person 9' },
                    { id: 10, name: 'Person 10' }
                ]

                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: { key: 'name' }, // No explicit filterType
                        data: highCardinalityData,
                        modelValue: {}
                    }
                })

                expect(wrapper.vm.filterType).toBe('text') // Should fallback to text
            })

            it('should handle empty data gracefully', () => {
                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: { key: 'department' },
                        data: [],
                        modelValue: {}
                    }
                })

                expect(wrapper.vm.filterType).toBe('text') // Default fallback
                expect(wrapper.vm.selectOptions).toEqual([])
            })

            it('should handle data with null/undefined values', () => {
                const dataWithNulls = [
                    { status: 'Active' },
                    { status: null },
                    { status: 'Inactive' },
                    { status: undefined },
                    { status: '' },
                    { status: 'Active' },
                    { status: 'Pending' },
                    { status: null },
                    { status: 'Active' },
                    { status: 'Inactive' }
                ]

                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: { key: 'status', filterType: 'select' },
                        data: dataWithNulls,
                        modelValue: {}
                    }
                })

                const options = wrapper.vm.selectOptions
                expect(options).toHaveLength(3) // Should exclude null, undefined, empty string
                expect(options.map(o => o.value).sort()).toEqual(['Active', 'Inactive', 'Pending'])
            })

            it('should limit auto-generated options to prevent performance issues', () => {
                // This test will be added when we implement the safety limit
                // For now, let's create data that would exceed reasonable limits
                const largeUniqueData = Array.from({ length: 100 }, (_, i) => ({
                    department: `Department ${i + 1}`
                }))

                const wrapper = mount(ColumnFilter, {
                    props: {
                        field: { key: 'department', filterType: 'select' },
                        data: largeUniqueData,
                        modelValue: {}
                    }
                })

                const options = wrapper.vm.selectOptions
                // Currently this will generate 100 options, but we'll limit this later
                expect(options.length).toBeGreaterThan(0)
                // TODO: Add safety limit and update this test
            })
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

        it('should reset column filter visual state when clear all filters is clicked', async () => {
            const wrapper = mount(TableComponent, {
                props: {
                    ...defaultProps,
                    showClearAllFiltersButton: true
                },
                global: {
                    stubs: {
                        'table-title': true,
                        'table-footer': true
                    }
                }
            })

            await flushPromises()

            // Apply multiple filters to test different filter types

            // 1. Apply a text filter
            wrapper.vm.setColumnFilter('name', {
                type: 'text',
                operator: 'contains',
                value: 'Alice'
            })

            // 2. Apply a numeric filter
            wrapper.vm.setColumnFilter('salary', {
                type: 'numeric',
                operator: '=',
                value: 75000
            })

            // 3. Apply a select filter
            wrapper.vm.setColumnFilter('department', {
                type: 'select',
                operator: 'in',
                value: ['Engineering']
            })

            await flushPromises()

            // Verify filters are active and data is filtered
            expect(wrapper.vm.hasActiveFilters).toBe(true)
            expect(Object.keys(wrapper.vm.columnFilters).length).toBe(3)

            // The filtered data should only contain Alice Johnson
            expect(wrapper.vm.dataForPagination).toHaveLength(1)
            expect(wrapper.vm.dataForPagination[0].name).toBe('Alice Johnson')

            // Check that column filters show active state
            expect(wrapper.vm.columnFilters.name).toEqual({
                type: 'text',
                operator: 'contains',
                value: 'Alice'
            })
            expect(wrapper.vm.columnFilters.salary).toEqual({
                type: 'numeric',
                operator: '=',
                value: 75000
            })
            expect(wrapper.vm.columnFilters.department).toEqual({
                type: 'select',
                operator: 'in',
                value: ['Engineering']
            })

            // Find and click the clear all filters button
            const clearButton = wrapper.find('[data-testid="clear-all-filters-button"]')
            if (!clearButton.exists()) {
                // Fallback: try to find by button text or class
                const buttons = wrapper.findAll('button')
                const clearAllButton = buttons.find(
                    btn =>
                        btn.text().includes('Clear All Filters') ||
                        btn.element.title?.includes('Clear All Filters')
                )
                expect(clearAllButton.exists()).toBe(true)
                await clearAllButton.trigger('click')
            } else {
                await clearButton.trigger('click')
            }

            await flushPromises()

            // Verify that all filters are cleared from the reactive state
            expect(wrapper.vm.hasActiveFilters).toBe(false)
            expect(Object.keys(wrapper.vm.columnFilters).length).toBe(0)
            expect(wrapper.vm.columnFilters).toEqual({})

            // Verify that data is back to showing all items
            expect(wrapper.vm.dataForPagination).toHaveLength(testData.length)

            // CRITICAL: Verify that each column filter component receives null/undefined modelValue
            // This is the core of the bug - the ColumnFilter components should reset their internal state

            // Find all ColumnFilter components
            const columnFilters = wrapper.findAllComponents(ColumnFilter)
            expect(columnFilters.length).toBeGreaterThan(0)

            // Each ColumnFilter should have a null/undefined modelValue after clearing
            columnFilters.forEach(filterComponent => {
                const modelValue = filterComponent.props('modelValue')
                expect(modelValue).toBeUndefined()
            })

            // Additionally, we should verify that the ColumnFilter internal state is reset
            columnFilters.forEach(filterComponent => {
                // Check that hasActiveFilter computed is false (this controls the visual highlighting)
                expect(filterComponent.vm.hasActiveFilter).toBe(false)

                // Check that internal filter values are reset
                if (['date', 'numeric'].includes(filterComponent.vm.filterType)) {
                    expect(filterComponent.vm.filterState.value).toBe('')
                    expect(filterComponent.vm.filterState.operator).toBe('=')
                } else if (filterComponent.vm.filterType === 'text') {
                    expect(filterComponent.vm.filterState.value).toBe('')
                } else if (filterComponent.vm.filterType === 'select') {
                    expect(filterComponent.vm.filterState.value).toEqual([])
                }
            })
        })
    })

    describe('Field-level i18n configuration', () => {
        it('should use field-level i18n settings for select filters', () => {
            const fieldWithI18n = {
                key: 'department',
                label: 'Department',
                filterType: 'select',
                filterOptions: [
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Marketing', label: 'Marketing' }
                ],
                i18n: {
                    placeholder: 'Search departments...',
                    noSelectionText: 'Choose departments...',
                    singleSelectionTextFn: value => `Selected: ${value}`,
                    multipleSelectionTextFn: count => `${count} dept(s) selected`
                }
            }

            const wrapper = mount(ColumnFilter, {
                props: {
                    field: fieldWithI18n,
                    data: testData,
                    modelValue: null
                }
            })

            expect(wrapper.exists()).toBe(true)

            // Verify that the i18n settings are properly passed to the filter component
            expect(wrapper.vm.i18nSettings.placeholder).toBe('Search departments...')
            expect(wrapper.vm.i18nSettings.noSelectionText).toBe('Choose departments...')
            expect(wrapper.vm.i18nSettings.singleSelectionTextFn('Engineering')).toBe(
                'Selected: Engineering'
            )
            expect(wrapper.vm.i18nSettings.multipleSelectionTextFn(2)).toBe('2 dept(s) selected')
        })

        it('should fall back to component props when field i18n is not provided', () => {
            const fieldWithoutI18n = {
                key: 'department',
                label: 'Department',
                filterType: 'select',
                filterOptions: [
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Marketing', label: 'Marketing' }
                ]
            }

            const wrapper = mount(ColumnFilter, {
                props: {
                    field: fieldWithoutI18n,
                    data: testData,
                    modelValue: null
                },
                global: {
                    provide: {
                        [TABLE_FILTER_CONFIG_KEY]: {
                            value: {
                                fallbackI18n: {
                                    selectFilterPlaceholder: 'Fallback placeholder...',
                                    selectFilterNoSelectionText: 'Fallback no selection...',
                                    selectFilterSingleSelectionTextFn: value => value,
                                    selectFilterMultipleSelectionTextFn: count =>
                                        `${count} selected`
                                }
                            }
                        }
                    }
                }
            })

            expect(wrapper.vm.i18nSettings.placeholder).toBe('Fallback placeholder...')
            expect(wrapper.vm.i18nSettings.noSelectionText).toBe('Fallback no selection...')
        })
    })
})
