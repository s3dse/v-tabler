import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ToggleComponent } from '@/components/toggle'

describe('ToggleComponent', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ToggleComponent, {
            props: {
                leftLabel: 'Off',
                rightLabel: 'On',
                modelValue: false
            }
        })
    })

    it('renders the left and right labels correctly', () => {
        const leftLabel = wrapper.find('span.text-default')
        expect(leftLabel.exists()).toBe(true)
        expect(leftLabel.text()).toBe('Off')

        const rightLabel = wrapper.findAll('span.text-default')[1]
        expect(rightLabel.exists()).toBe(true)
        expect(rightLabel.text()).toBe('On')
    })

    it('toggles the value when clicked', async () => {
        const input = wrapper.find('input[type="checkbox"]')
        expect(input.element.checked).toBe(false)

        await input.setValue(true)
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])

        await input.setValue(false)
        expect(wrapper.emitted('update:modelValue')[1]).toEqual([false])
    })

    it('handles keyboard navigation correctly', async () => {
        const label = wrapper.find('label')

        await label.trigger('keydown', { key: 'Space' })
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])

        await label.trigger('keydown', { key: 'ArrowLeft' })
        expect(wrapper.emitted('update:modelValue')[1]).toEqual([false])

        await label.trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')[2]).toEqual([true])
    })

    it('disables interactions when disabled', async () => {
        await wrapper.setProps({ disabled: true })
        const label = wrapper.find('label')

        await label.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeFalsy()

        await label.trigger('keydown', { key: 'Space' })
        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('applies the correct classes when focused', async () => {
        const label = wrapper.find('label')

        await label.trigger('focus')
        const toggle = wrapper.find('.vtabler-checkbox-box-content')
        expect(toggle.classes()).toContain('border-primary-hover')

        await label.trigger('blur')
        expect(toggle.classes()).not.toContain('border-primary-hover')
    })
})
