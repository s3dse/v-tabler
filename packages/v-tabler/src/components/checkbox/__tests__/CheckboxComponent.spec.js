import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import CheckboxComponent from '../CheckboxComponent.vue'

describe('CheckboxComponent', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(CheckboxComponent, {
            props: {
                label: 'Test Checkbox',
                id: 'test-checkbox',
                name: 'tested-checkbox',
                indeterminate: false,
                disabled: false,
                modelValue: false
            }
        })
    })

    it('renders the checkbox with the correct label', () => {
        const label = wrapper.find('label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toBe('Test Checkbox')
    })

    it('binds the id and name props correctly', () => {
        const input = wrapper.find('input')
        expect(input.attributes('id')).toBe('test-checkbox')
        expect(input.attributes('name')).toBe('tested-checkbox')
    })

    it('updates the modelValue when clicked', async () => {
        const input = wrapper.find('input')
        await input.setValue(true)
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    })

    it('handles the indeterminate state correctly', async () => {
        await wrapper.setProps({ indeterminate: true })
        const input = wrapper.find('input')
        expect(input.element.indeterminate).toBe(true)

        await wrapper.setProps({ indeterminate: false })
        expect(input.element.indeterminate).toBe(false)
    })

    it('disables the checkbox when the disabled prop is true', async () => {
        await wrapper.setProps({ disabled: true })
        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
    })

    it('sets the correct aria-checked attribute', async () => {
        const input = wrapper.find('input')
        expect(input.attributes('aria-checked')).toBe('false')

        await input.setValue(true)
        expect(input.attributes('aria-checked')).toBe('true')

        await wrapper.setProps({ indeterminate: true })
        expect(input.attributes('aria-checked')).toBe('mixed')
    })
})
