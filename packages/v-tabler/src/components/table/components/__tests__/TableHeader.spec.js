import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { TableHeader } from '@/components/table/components'
import DropdownComponent from '@/components/dropdown/DropdownComponent.vue'

describe('TableHeader', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(TableHeader, {
            props: {
                enableSearch: true,
                searchPlaceholder: 'Search...',
                filterInputId: 'search-input',
                searchTerm: '',
                searchInputClassList: 'search-class',
                configurablePageSize: true,
                pageSize: 10,
                pageSizes: [5, 10, 20],
                topRowsLength: 0,
                pageSizeButtonClassList: 'page-size-class',
                tableData: [],
                topRows: [],
                fields: [],
                enableColumnFilters: true,
                hasActiveFilters: true,
                showClearAllFiltersButton: true,
                clearAllFiltersButtonText: 'Clear All Filters'
            },
            global: {
                components: {
                    DropdownComponent
                }
            }
        })
    })

    it('renders the search input when enableSearch is true', () => {
        const searchInput = wrapper.find('input[name="search"]')
        expect(searchInput.exists()).toBe(true)
        expect(searchInput.attributes('placeholder')).toBe('Search...')
    })

    it('emits update:searchTerm and filter-data when typing in the search input', async () => {
        const searchInput = wrapper.find('input[name="search"]')
        await searchInput.setValue('test')

        expect(wrapper.emitted('update:searchTerm')).toBeTruthy()
        expect(wrapper.emitted('update:searchTerm')[0]).toEqual(['test'])

        expect(wrapper.emitted('filter-data')).toBeTruthy()
    })

    it('renders the dropdown for page size when configurablePageSize is true', () => {
        const dropdown = wrapper.findComponent(DropdownComponent)
        expect(dropdown.exists()).toBe(true)
        expect(dropdown.props('modelValue')).toBe(10)
    })

    it('emits update:pageSize when a new page size is selected', async () => {
        const dropdown = wrapper.findComponent(DropdownComponent)
        await dropdown.vm.$emit('update:modelValue', 20)

        expect(wrapper.emitted('update:pageSize')).toBeTruthy()
        expect(wrapper.emitted('update:pageSize')[0]).toEqual([20])
    })

    it('renders the clear all filters button when conditions are met', () => {
        const clearButton = wrapper.find('[data-testid="clear-all-filters-button"]')
        expect(clearButton.exists()).toBe(true)
        expect(clearButton.text()).toBe('Clear All Filters')
    })

    it('emits clear-all-filters when the clear all filters button is clicked', async () => {
        const clearButton = wrapper.find('[data-testid="clear-all-filters-button"]')
        await clearButton.trigger('click')

        expect(wrapper.emitted('clear-all-filters')).toBeTruthy()
    })

    it('does not render the search input when enableSearch is false', async () => {
        await wrapper.setProps({ enableSearch: false })
        const searchInput = wrapper.find('input[name="search"]')
        expect(searchInput.exists()).toBe(false)
    })

    it('does not render the clear all filters button when hasActiveFilters is false', async () => {
        await wrapper.setProps({ hasActiveFilters: false })
        const clearButton = wrapper.find('[data-testid="clear-all-filters-button"]')
        expect(clearButton.exists()).toBe(false)
    })
})
