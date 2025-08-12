import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TableComponent from '@/components/table/TableComponent.vue'

describe('TableComponent with perPage setting', () => {
    const props = {
        perPage: 5,
        topRows: [{ a: 11 }, { a: 12 }, { a: 13 }, { a: 14 }, { a: 15 }],
        items: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
        fields: [{ key: 'a' }]
    }

    it('page size should be greater than top-rows, 5 => 10', async () => {
        const wrapper = mount(TableComponent, {
            props,
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
        // Access pageSize through the component's exposed properties
        expect(wrapper.vm.pageSize).toBe(10)
    })

    it('page size should be greater than top-rows, 7 => 7', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, perPage: 7 },
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
        expect(wrapper.vm.pageSize).toBe(7)
    })

    it('page size should be greater than top-rows, 0 => 10', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, perPage: 0 },
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
        expect(wrapper.vm.pageSize).toBe(10)
    })

    it('should render 11 entries over 3 pages with 5 per page', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, perPage: 5, items: [...Array(11).keys()].map(k => ({ a: k })) },
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
        expect(wrapper.vm.tableData.length).toBe(11)
        expect(wrapper.vm.numberOfPages).toBe(3)
        expect(wrapper.vm.getRows().length).toBe(5)
        wrapper.vm.changePage(2)
        expect(wrapper.emitted()).toHaveProperty('page-change')
        expect(wrapper.vm.getRows().length).toBe(5)
        wrapper.vm.changePage(3)
        expect(wrapper.vm.getRows().length).toBe(1)
    })

    it('should emit per-page-change when page size changes', async () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, topRows: [], perPage: 5 },
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
        expect(wrapper.emitted()['per-page-change']).toBeFalsy()
        await wrapper.setProps({ perPage: 7 })
        expect(wrapper.emitted()['per-page-change']).toBeTruthy()
        expect(wrapper.emitted()['per-page-change'][0]).toEqual([
            {
                columnFilters: new Map(),
                page: 1,
                eventName: 'per-page-change',
                numberOfPages: 1,
                perPage: 7,
                searchTerm: null,
                sort: {
                    dir: 'desc',
                    key: ''
                }
            }
        ])
    })
})

describe('TableComponent without top rows', () => {
    it('page size should not be zero', () => {
        const wrapper = mount(TableComponent, {
            props: {
                perPage: 0,
                topRows: [],
                items: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
                fields: [{ key: 'a' }]
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
        expect(wrapper.vm.pageSize).toBe(5)
    })
})

describe('TableComponent functionality', () => {
    const items = [...Array(100).keys()].map(k => ({ name: `item-${k}`, value: k }))
    const shuffledItems = [...items].sort(() => 0.5 - Math.random())
    const props = {
        perPage: 10,
        topRows: [],
        items: shuffledItems,
        filterDebounce: 0,
        filterMaxWait: 0,
        fields: [{ key: 'name' }, { key: 'value' }]
    }

    const globalConfig = {
        global: {
            stubs: {
                'table-title': true,
                'table-header': {
                    template:
                        '<div><input v-if="enableSearch" @input="$emit(\'filter-data\', $event)" /></div>',
                    props: ['enableSearch'],
                    emits: ['filter-data']
                },
                'table-head': {
                    template:
                        '<thead><th v-for="field in visibleFields" @click="$emit(\'sort-table\', field)"><div class="i-tabler-arrows-sort"></div></th></thead>',
                    props: ['visibleFields'],
                    emits: ['sort-table']
                },
                'table-body': {
                    template:
                        '<tbody><tr v-for="item in rows"><td v-for="field in visibleFields">{{ getValue(item, field) }}</td></tr></tbody>',
                    props: ['rows', 'visibleFields', 'getValue']
                },
                'table-footer': true
            }
        }
    }

    const intValuesOfColumn = (wrapper, column) =>
        wrapper
            .findAll(`td:nth-child(${column})`)
            .map(domWrapper => domWrapper.text())
            .map(value => parseInt(value))

    it('should sort ascendingly on first column-click', async () => {
        const wrapper = mount(TableComponent, { props, ...globalConfig })
        await wrapper.vm.$nextTick()

        const headers = wrapper.findAll('th')
        await headers[1].find('.i-tabler-arrows-sort').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('sort-change')
        expect(wrapper.vm.tableData.map(td => td.value)).toStrictEqual([...Array(100).keys()])

        const values = intValuesOfColumn(wrapper, 2)
        expect(values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    it('should sort descendingly on second column-click', async () => {
        const wrapper = mount(TableComponent, { props, ...globalConfig })
        await wrapper.vm.$nextTick()

        // First click - ascending
        const headers = wrapper.findAll('th')
        await headers[1].find('.i-tabler-arrows-sort').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('sort-change')

        // Second click - descending
        await headers[1].trigger('click')
        expect(wrapper.vm.tableData.map(td => td.value)).toStrictEqual(
            [...Array(100).keys()].reverse()
        )

        const values = intValuesOfColumn(wrapper, 2)
        expect(values).toStrictEqual([99, 98, 97, 96, 95, 94, 93, 92, 91, 90])
    })

    it('should filter data', async () => {
        const testProps = { ...props, items }
        const wrapper = mount(TableComponent, {
            props: testProps,
            ...globalConfig
        })
        await wrapper.vm.$nextTick()

        const filterInput = wrapper.find('input')
        await filterInput.setValue('1')
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('filter-change')
        expect(wrapper.emitted()).toHaveProperty('filter-change-debounced')
        expect(wrapper.vm.tableData.map(td => td.value).sort()).toStrictEqual([
            1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 31, 41, 51, 61, 71, 81, 91
        ])

        const values = intValuesOfColumn(wrapper, 2)
        expect(values).toStrictEqual([1, 10, 11, 12, 13, 14, 15, 16, 17, 18])
    })

    it('should filter an empty result when no match', async () => {
        const wrapper = mount(TableComponent, { props, ...globalConfig })
        await wrapper.vm.$nextTick()

        const input = wrapper.find('input')
        await input.setValue('test')
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('filter-change')
        expect(wrapper.emitted()).toHaveProperty('filter-change-debounced')
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findAll('td')).toStrictEqual([])
    })
})

describe('TableComponent configurablePageSize', () => {
    const props = {
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        fields: [{ key: 'a' }]
    }

    it('should pass configurablePageSize prop to table-header', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, configurablePageSize: false },
            global: {
                stubs: {
                    'table-title': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true,
                    'dropdown-component': true
                }
            }
        })

        const tableHeader = wrapper.findComponent({ name: 'table-header' })
        expect(tableHeader.exists()).toBe(true)
        expect(tableHeader.props().configurablePageSize).toBe(false)
    })

    it('should default configurablePageSize to true when not specified', () => {
        const wrapper = mount(TableComponent, {
            props,
            global: {
                stubs: {
                    'table-title': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true,
                    'dropdown-component': true
                }
            }
        })

        const tableHeader = wrapper.findComponent({ name: 'table-header' })
        expect(tableHeader.exists()).toBe(true)
        expect(tableHeader.props().configurablePageSize).toBe(true)
    })

    it('should hide page size dropdown when configurablePageSize is false', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, configurablePageSize: false },
            global: {
                stubs: {
                    'table-title': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true,
                    'dropdown-component': true
                }
            }
        })

        const dropdown = wrapper.findComponent({ name: 'dropdown-component' })
        expect(dropdown.exists()).toBe(false)
    })

    it('should show page size dropdown when configurablePageSize is true', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, configurablePageSize: true },
            global: {
                stubs: {
                    'table-title': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true,
                    'dropdown-component': true
                }
            }
        })

        const dropdown = wrapper.findComponent({ name: 'dropdown-component' })
        expect(dropdown.exists()).toBe(true)
    })
})

describe('TableComponent title slot', () => {
    const props = {
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        fields: [{ key: 'a' }]
    }

    it('should render title prop when provided', () => {
        const wrapper = mount(TableComponent, {
            props: { ...props, title: 'Test Table Title' },
            global: {
                stubs: {
                    'table-header': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true
                }
            }
        })

        const tableTitle = wrapper.findComponent({ name: 'table-title' })
        expect(tableTitle.exists()).toBe(true)
        expect(tableTitle.props().title).toBe('Test Table Title')
    })

    it('should render title slot when provided', () => {
        const wrapper = mount(TableComponent, {
            props,
            slots: {
                title: '<h1>Custom Title Slot</h1>'
            },
            global: {
                stubs: {
                    'table-header': true,
                    'table-head': true,
                    'table-body': true,
                    'table-footer': true
                }
            }
        })

        const tableTitle = wrapper.findComponent({ name: 'table-title' })
        expect(tableTitle.exists()).toBe(true)
        expect(wrapper.html()).toContain('<h1>Custom Title Slot</h1>')
    })
})
