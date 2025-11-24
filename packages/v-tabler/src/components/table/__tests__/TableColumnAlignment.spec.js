import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableComponent from '@/components/table/TableComponent.vue'

const testData = [
    { id: 1, name: 'Alice', amount: 100 },
    { id: 2, name: 'Bob', amount: 200 }
]

describe('Table Column Alignment', () => {
    it('should apply table-col-left alignment to header', () => {
        const fields = [
            {
                key: 'name',
                label: 'Name',
                thClassList: 'table-col-left'
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields
            }
        })

        // Find the header cell
        const headerCell = wrapper.find('th')
        expect(headerCell.classes()).toContain('table-col-left')

        // Check that the inner flex container has justify-start
        const flexContainer = headerCell.find('div.flex')
        expect(flexContainer.classes()).toContain('justify-start')
    })

    it('should apply table-col-right alignment to header', () => {
        const fields = [
            {
                key: 'id',
                label: 'ID',
                thClassList: 'table-col-right'
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields
            }
        })

        const headerCell = wrapper.find('th')
        expect(headerCell.classes()).toContain('table-col-right')

        const flexContainer = headerCell.find('div.flex')
        expect(flexContainer.classes()).toContain('justify-end')
    })

    it('should apply table-col-center alignment to header', () => {
        const fields = [
            {
                key: 'amount',
                label: 'Amount',
                thClassList: 'table-col-center'
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields
            }
        })

        const headerCell = wrapper.find('th')
        expect(headerCell.classes()).toContain('table-col-center')

        const flexContainer = headerCell.find('div.flex')
        expect(flexContainer.classes()).toContain('justify-center')
    })

    it('should not add justify classes when no table-col-* classes are present', () => {
        const fields = [
            {
                key: 'name',
                label: 'Name',
                thClassList: 'some-other-class'
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields
            }
        })

        const flexContainer = wrapper.find('th div.flex')
        expect(flexContainer.classes()).not.toContain('justify-start')
        expect(flexContainer.classes()).not.toContain('justify-end')
        expect(flexContainer.classes()).not.toContain('justify-center')
    })

    it('should work with column filters and maintain alignment', () => {
        const fields = [
            {
                key: 'name',
                label: 'Name',
                thClassList: 'table-col-right',
                filterType: 'text'
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields,
                enableColumnFilters: true
            }
        })

        const flexContainer = wrapper.find('th div.flex')
        expect(flexContainer.classes()).toContain('justify-end')

        // Verify that column filter is present
        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' })
        expect(columnFilter.exists()).toBe(true)
    })

    it('should handle missing column keys without value shifting (regression test)', () => {
        // Test data with specific structure to reproduce the original bug
        const bugTestData = [
            { row_id: 1, brand_name: 'Apple', product_name: 'iPhone' }
            // Note: missing 'brand_extra_info' key entirely
        ]

        const fields = [
            { key: 'row_id', label: 'ID', tdClassList: 'table-col-left' },
            { key: 'brand_name', label: 'Brand', tdClassList: 'table-col-left' },
            { key: 'brand_extra_info', label: 'Extra Info', tdClassList: 'table-col-left' }, // Missing in data!
            { key: 'product_name', label: 'Product', tdClassList: 'table-col-left' }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: bugTestData,
                fields: fields
            }
        })

        // Get all table cells in the first data row
        const tableCells = wrapper.findAll('tbody td')
        expect(tableCells).toHaveLength(4)

        // Verify that each cell contains the correct data (no shifting)
        expect(tableCells[0].text()).toBe('1') // row_id should be in first cell
        expect(tableCells[1].text()).toBe('Apple') // brand_name should be in second cell  
        expect(tableCells[2].text()).toBe('') // brand_extra_info should be empty (missing key)
        expect(tableCells[3].text()).toBe('iPhone') // product_name should be in fourth cell

        // Verify CSS classes are applied correctly without conflicts
        tableCells.forEach(cell => {
            expect(cell.classes()).toContain('table-col-left')
            // Should NOT contain justify-* classes in cells (only text alignment)
            expect(cell.classes().some(cls => cls.startsWith('justify-'))).toBe(false)
        })
    })

    it('should not have conflicting justify classes in cell contexts', () => {
        const fields = [
            {
                key: 'name',
                label: 'Name', 
                tdClassList: 'table-col-left table-col-right' // Multiple alignment classes
            }
        ]

        const wrapper = mount(TableComponent, {
            props: {
                items: testData,
                fields: fields
            }
        })

        const tableCell = wrapper.find('tbody td')
        const classes = tableCell.classes()
        
        // Should have text alignment classes
        expect(classes).toContain('table-col-left')
        expect(classes).toContain('table-col-right')
        
        // Should NOT have any justify-* classes that could interfere with table layout
        const hasJustifyClasses = classes.some(cls => cls.startsWith('justify-'))
        expect(hasJustifyClasses).toBe(false)
    })
})
