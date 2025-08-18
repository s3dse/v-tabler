import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ColumnFilter from '../ColumnFilter.vue'
import TextFilterInput from '../TextFilterInput.vue'
import NumericFilterInput from '../NumericFilterInput.vue'
import DateFilterInput from '../DateFilterInput.vue'
import SelectFilterInput from '../SelectFilterInput.vue'
import { DropdownMenuContent, DropdownMenuTrigger } from 'reka-ui'

describe('ColumnFilter', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ColumnFilter, {
            props: {
                field: { key: 'name', label: 'Name' },
                data: [
                    { name: 'Alice', age: 25 },
                    { name: 'Bob', age: 30 }
                ]
            }
        })
    })

    it('renders the filter toggle button with the correct title', () => {
        const trigger = wrapper.findComponent(DropdownMenuTrigger)
        expect(trigger.exists()).toBe(true)
        expect(trigger.attributes('title')).toBe('Filter Name')
    })

    it('opens the dropdown when the toggle button is clicked', async () => {
        const trigger = wrapper.find('.i-tabler-filter')
        expect(wrapper.vm.isDropdownOpen).toBe(false)

        await trigger.trigger('click')
        expect(wrapper.vm.isDropdownOpen).toBe(true)
    })

    it('renders the correct filter component based on the field type', async () => {
        const trigger = wrapper.findComponent(DropdownMenuTrigger)
        await wrapper.setProps({ field: { key: 'age', label: 'Age', type: 'numeric' } })
        await trigger.trigger('click')
        expect(wrapper.findComponent(NumericFilterInput).exists()).toBe(true)
        await trigger.trigger('click')

        await wrapper.setProps({ field: { key: 'birthdate', label: 'Birthdate', type: 'date' } })
        await trigger.trigger('click')
        expect(wrapper.findComponent(DateFilterInput).exists()).toBe(true)
        await trigger.trigger('click')

        await wrapper.setProps({ field: { key: 'name', label: 'Name', type: 'text' } })
        await trigger.trigger('click')
        expect(wrapper.findComponent(TextFilterInput).exists()).toBe(true)
        await trigger.trigger('click')

        await wrapper.setProps({
            field: { key: 'status', label: 'Status', type: 'text', filterType: 'select' }
        })
        await trigger.trigger('click')
        expect(wrapper.findComponent(SelectFilterInput).exists()).toBe(true)
    })

    it('emits filter-change when the filter value is updated', async () => {
        const trigger = wrapper.findComponent(DropdownMenuTrigger)
        await trigger.trigger('click')
        const textFilter = wrapper.findComponent(TextFilterInput)
        await textFilter.vm.$emit('update:modelValue', 'Alice')

        expect(wrapper.emitted('filter-change')).toBeTruthy()
        expect(wrapper.emitted('filter-change')[0][0]).toEqual({
            field: 'name',
            type: 'text',
            value: 'Alice',
            operator: 'contains'
        })
    })

    it('clears the filter when the clear button is clicked', async () => {
        const trigger = wrapper.findComponent(DropdownMenuTrigger)
        await trigger.trigger('click')
        const contentWrapper = wrapper.getComponent(DropdownMenuContent)
        const clearButton = contentWrapper.find('button')
        await clearButton.trigger('click')

        expect(wrapper.emitted('filter-change')).toBeTruthy()
        expect(wrapper.emitted('filter-change')[0][0]).toBe(null)
    })

    it('applies the active filter class when a filter is active', async () => {
        const trigger = wrapper.findComponent(DropdownMenuTrigger)
        expect(trigger.classes()).not.toContain('text-primary')

        wrapper.vm.modelValue = {
            field: 'name',
            type: 'text',
            value: 'Alice',
            operator: 'contains'
        }
        await wrapper.vm.$nextTick()
        expect(trigger.classes()).toContain('text-primary')
    })
})
