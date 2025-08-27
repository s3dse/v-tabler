import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectFilterInput from '../SelectFilterInput.vue'
import CheckboxComponent from '../../../checkbox/CheckboxComponent.vue'
import { DropdownMenuLabel } from 'reka-ui'

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

    it('should display a title label when provided', () => {
        const wrapper = mount(SelectFilterInput, {
            props: {
                modelValue: [],
                options: mockOptions,
                placeholder: 'Search...',
                label: 'Select values:'
            }
        })

        const labelWrapper = wrapper.getComponent(DropdownMenuLabel)
        console.log(labelWrapper.html())

        expect(wrapper.text()).toContain('Select values:')
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
        const checkboxInput = firstCheckbox.find('input[type="checkbox"]')
        await checkboxInput.setChecked(true)

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
