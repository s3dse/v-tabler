import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TableComponent } from '@/components/table'
import { useTableExpand } from '@/components/table/composables/useTableExpand'

describe('useTableExpand composable', () => {
    it('toggleRowExpanded adds item to set, calling again removes it', () => {
        const { toggleRowExpanded, expandedRows } = useTableExpand()
        const row = { id: 1, name: 'test' }

        toggleRowExpanded(row)
        expect(expandedRows.has(row)).toBe(true)

        toggleRowExpanded(row)
        expect(expandedRows.has(row)).toBe(false)
    })

    it('isExpanded returns correct state', () => {
        const { toggleRowExpanded, isExpanded } = useTableExpand()
        const row = { id: 1, name: 'test' }

        expect(isExpanded(row)).toBe(false)
        toggleRowExpanded(row)
        expect(isExpanded(row)).toBe(true)
        toggleRowExpanded(row)
        expect(isExpanded(row)).toBe(false)
    })

    it('collapseAll clears all expanded rows', () => {
        const { toggleRowExpanded, isExpanded, collapseAll } = useTableExpand()
        const row1 = { id: 1 }
        const row2 = { id: 2 }
        const row3 = { id: 3 }

        toggleRowExpanded(row1)
        toggleRowExpanded(row2)
        toggleRowExpanded(row3)
        expect(isExpanded(row1)).toBe(true)
        expect(isExpanded(row2)).toBe(true)
        expect(isExpanded(row3)).toBe(true)

        collapseAll()
        expect(isExpanded(row1)).toBe(false)
        expect(isExpanded(row2)).toBe(false)
        expect(isExpanded(row3)).toBe(false)
    })

    it('works with object references (no ID field needed)', () => {
        const { toggleRowExpanded, isExpanded } = useTableExpand()
        const row1 = { name: 'alpha' }
        const row2 = { name: 'alpha' }

        toggleRowExpanded(row1)
        expect(isExpanded(row1)).toBe(true)
        expect(isExpanded(row2)).toBe(false)
    })
})

describe('TableComponent expandable integration', () => {
    const items = [
        { name: 'item-0', value: 0 },
        { name: 'item-1', value: 1 },
        { name: 'item-2', value: 2 },
        { name: 'item-3', value: 3 },
        { name: 'item-4', value: 4 }
    ]
    const fields = [{ key: 'name' }, { key: 'value' }]

    const globalStubs = {
        global: {
            stubs: {
                'table-title': true,
                'table-header': true,
                'table-head': true,
                'table-body': {
                    template:
                        '<tbody><tr v-for="item in rows"><td v-for="field in visibleFields">{{ getValue(item, field) }}</td></tr></tbody>',
                    props: ['rows', 'visibleFields', 'getValue', 'expandable', 'isExpanded']
                },
                'table-footer': true
            }
        }
    }

    it('when expandable is false (default), expandable defaults to false', () => {
        const wrapper = mount(TableComponent, {
            props: { items, fields },
            ...globalStubs
        })

        expect(wrapper.vm.$props.expandable).toBe(false)
    })

    it('when expandable is true, the prop is set', () => {
        const wrapper = mount(TableComponent, {
            props: { items, fields, expandable: true },
            ...globalStubs
        })

        expect(wrapper.vm.$props.expandable).toBe(true)
    })

    it('handleExpandToggle emits row-expand-toggle event with { item, index, expanded }', () => {
        const wrapper = mount(TableComponent, {
            props: { items, fields, expandable: true },
            ...globalStubs
        })

        const item = items[2]
        wrapper.vm.handleExpandToggle(item, 2)

        expect(wrapper.emitted()).toHaveProperty('row-expand-toggle')
        expect(wrapper.emitted()['row-expand-toggle'][0]).toEqual([
            { item, index: 2, expanded: true }
        ])
    })

    it('expanding rows does NOT change pagination (regularRowsForDisplay length stays same)', () => {
        const manyItems = [...Array(15).keys()].map(k => ({ name: `item-${k}`, value: k }))
        const wrapper = mount(TableComponent, {
            props: { items: manyItems, fields, expandable: true, perPage: 5 },
            ...globalStubs
        })

        expect(wrapper.vm.regularRowsForDisplay.length).toBe(5)

        wrapper.vm.handleExpandToggle(manyItems[0], 0)
        wrapper.vm.handleExpandToggle(manyItems[1], 1)

        expect(wrapper.vm.regularRowsForDisplay.length).toBe(5)
    })

    it('expanding a row, navigating to page 2 and back — row stays expanded', () => {
        const manyItems = [...Array(20).keys()].map(k => ({ name: `item-${k}`, value: k }))
        const wrapper = mount(TableComponent, {
            props: { items: manyItems, fields, expandable: true, perPage: 10 },
            ...globalStubs
        })

        const itemToExpand = manyItems[3]
        wrapper.vm.handleExpandToggle(itemToExpand, 3)

        expect(wrapper.emitted()['row-expand-toggle'][0]).toEqual([
            { item: itemToExpand, index: 3, expanded: true }
        ])

        wrapper.vm.changePage(2)
        expect(wrapper.vm.regularRowsForDisplay.some(r => r.name === 'item-3')).toBe(false)

        wrapper.vm.changePage(1)
        expect(wrapper.vm.regularRowsForDisplay.some(r => r.name === 'item-3')).toBe(true)

        // Toggle again to verify it was still expanded (toggling removes it)
        wrapper.vm.handleExpandToggle(itemToExpand, 3)
        expect(wrapper.emitted()['row-expand-toggle'][1]).toEqual([
            { item: itemToExpand, index: 3, expanded: false }
        ])
    })
})
