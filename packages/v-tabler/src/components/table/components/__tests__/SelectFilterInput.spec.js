import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectFilterInput from '../SelectFilterInput.vue'
import CheckboxComponent from '../../../checkbox/CheckboxComponent.vue'

const mockOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' }
]

describe('SelectFilterInput', () => {
    it('should render with default props', () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('input').attributes('placeholder')).toBe('Search...')
    })

    it('should display default no selection text when no items are selected', () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        expect(wrapper.text()).toContain('Select values:')
    })

    it('should display custom no selection text when provided', () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...',
                noSelectionText: 'Choose departments...'
            }
        })

        expect(wrapper.text()).toContain('Choose departments...')
    })

    it('should display single selection text using custom function', () => {
        const singleSelectionTextFn = (value) => `Selected: ${value}`
        
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: ['engineering'],
                options: mockOptions,
                placeholder: 'Search...',
                singleSelectionTextFn
            }
        })

        expect(wrapper.text()).toContain('Selected: Engineering')
    })

    it('should display multiple selection text using custom function', () => {
        const multipleSelectionTextFn = (count) => `${count} departments selected`
        
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: ['engineering', 'marketing'],
                options: mockOptions,
                placeholder: 'Search...',
                multipleSelectionTextFn
            }
        })

        expect(wrapper.text()).toContain('2 departments selected')
    })

    it('should fall back to default text when no custom functions provided', () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: ['engineering', 'marketing'],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        expect(wrapper.text()).toContain('2 selected')
    })

    it('should filter options based on search term', async () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        const searchInput = wrapper.find('input')
        await searchInput.setValue('eng')

        const checkboxes = wrapper.findAllComponents(CheckboxComponent)
        expect(checkboxes).toHaveLength(1)
        expect(checkboxes[0].props('label')).toBe('Engineering')
    })

    it('should emit update:modelValue when selection changes', async () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        const firstCheckbox = wrapper.findAllComponents(CheckboxComponent)[0]
        await firstCheckbox.vm.$emit('change')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('should update selectedValues when modelValue prop changes', async () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...'
            }
        })

        await wrapper.setProps({ modelValue: ['engineering'] })
        
        expect(wrapper.vm.selectedValues).toEqual(['engineering'])
    })
})
