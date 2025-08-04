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
})