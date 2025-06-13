import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { ref } from 'vue'
import ListSelect from '@/components/listselect/ListSelect.vue'
import { busy } from '@/directives/busy/busy'

function initMocksForVirtualizer() {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        value: 800
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        value: 800
    })
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
}

enableAutoUnmount(afterEach)

describe('ListSelect', () => {
    beforeEach(() => {
        initMocksForVirtualizer()
    })

    const mountListSelect = (props, options = { attachToBody: true }) => {
        if (document.body) document.body.innerHTML = ''
        const modelValue = ref([])
        const wrapper = mount(ListSelect, {
            global: {
                directives: {
                    busy
                }
            },
            props: {
                options: [
                    { id: '1', label: 'option1' },
                    { id: '2', label: 'option2' },
                    { id: '3', label: 'option3' }
                ],
                multiple: true,
                modelValue,
                'onUpdate:modelValue': e => {
                    modelValue.value = e
                },
                ...props
            },
            // when testing keyboard navigation, we need to attach to the body
            ...(options.attachToBody ? { attachTo: document.body } : {})
        })
        return { wrapper, modelValue }
    }

    it('renders properly', () => {
        const { wrapper } = mountListSelect()
        expect(wrapper.exists()).toBe(true)
    })

    it('opens dropdown on arrow up and down keys', async () => {
        const { wrapper } = mountListSelect()
        const input = wrapper.find('input')
        await input.trigger('keydown', { key: 'ArrowDown' })
        expect(wrapper.find('.listselect__option').exists()).toBe(true)

        await wrapper.find('.listselect--dropdown-toggle').trigger('click')
        expect(wrapper.find('.listselect__option').exists()).toBe(false)

        await input.trigger('keydown', { key: 'ArrowUp' })
        expect(wrapper.find('.listselect__option').exists()).toBe(true)
    })

    it('renders the correct number of options', async () => {
        const { wrapper } = mountListSelect()
        const toggle = wrapper.find('.listselect--dropdown-toggle')
        await toggle.trigger('click')
        const options = wrapper.findAll('.listselect__option')
        expect(options.length).toBe(3)
    })

    it('filters options based on search input', async () => {
        const { wrapper } = mountListSelect()
        await wrapper.find('.listselect--dropdown-toggle').trigger('click')
        const input = wrapper.find('input')

        await input.setValue('option2')
        const options = wrapper.findAll('.listselect__option')
        expect(options.length).toBe(1)
        expect(options.at(0).text()).toBe('option2')
    })

    it('closes dropdown when clicking outside', async () => {
        // when testing click outside, we cannot attach to the body
        const { wrapper } = mountListSelect({}, { attachToBody: false })
        await wrapper.find('.listselect--dropdown-toggle').trigger('click')
        expect(wrapper.find('.listselect__option').exists()).toBe(true)

        await document.body.click()
        expect(wrapper.find('.listselect__option').exists()).toBe(false)
    })

    it('renders a placeholder when provided', () => {
        const wrapper = mountListSelect({ inputPlaceholder: 'Select an option' }).wrapper
        const input = wrapper.find('input')
        expect(input.exists()).toBe(true)
        expect(input.element.placeholder).toBe('Select an option')
    })

    it('renders no options when options prop is empty', () => {
        const { wrapper } = mountListSelect({ options: [] })
        const options = wrapper.findAll('option')
        expect(options.length).toBe(0)
    })

    it('allows selection using keyboard navigation', async () => {
        const { wrapper, modelValue } = mountListSelect()

        const input = wrapper.find('input')
        await wrapper.find('.listselect--dropdown-toggle').trigger('click')
        const content = wrapper.find('[role=listbox]')
        await content.trigger('focus')
        await input.trigger('keydown', { key: 'ArrowDown' })
        await content.trigger('keydown', { key: 'Enter' })
        expect(modelValue.value).toStrictEqual([{ id: '2', label: 'option2' }])
    })

    it('allows deselection using keyboard navigation', async () => {
        const { wrapper, modelValue } = mountListSelect()

        const input = wrapper.find('input')
        await wrapper.find('.listselect--dropdown-toggle').trigger('click')
        const content = wrapper.find('[role=listbox]')
        await content.trigger('focus')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await input.trigger('keydown', { key: 'ArrowDown' })
        await content.trigger('keydown', { key: 'Enter' })

        expect(modelValue.value).toStrictEqual([{ id: '3', label: 'option3' }])
        await content.trigger('keydown', { key: 'Enter' })
        expect(modelValue.value).toStrictEqual([])
    })

    describe('clears the input when options list is closed', () => {
        it('via click outside', async () => {
            // when testing click outside, we cannot attach to the body
            const { wrapper } = mountListSelect({}, { attachToBody: false })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            const input = wrapper.find('input')
            await input.setValue('option2')
            expect(input.element.value).toBe('option2')

            await document.body.click()
            expect(input.element.value).toBe('')
        })
        it('via escape key', async () => {
            const { wrapper } = mountListSelect()
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            const input = wrapper.find('input')
            await input.setValue('option2')
            expect(input.element.value).toBe('option2')

            await input.trigger('keydown', { key: 'Escape' })
            expect(input.element.value).toBe('')
        })
        it('via button click', async () => {
            const { wrapper } = mountListSelect()
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            const input = wrapper.find('input')
            await input.setValue('option2')
            expect(input.element.value).toBe('option2')

            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            expect(input.element.value).toBe('')
        })
    })

    describe('in single mode', () => {
        it('updates modelValue when an option is selected', async () => {
            const { wrapper, modelValue } = mountListSelect({ multiple: false })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            const option = wrapper.findAll('.listselect__option').at(1)
            await option.trigger('click')
            expect(modelValue.value).toStrictEqual([{ id: '2', label: 'option2' }])
        })

        it('emits an update event when the value changes', async () => {
            const { wrapper, modelValue } = mountListSelect({ multiple: false })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            expect(wrapper.emitted('update:modelValue')).toBeTruthy()
            expect(wrapper.emitted('update:modelValue')[0]).toEqual([
                [{ id: '2', label: 'option2' }]
            ])
            expect(modelValue.value).toStrictEqual([{ id: '2', label: 'option2' }])

            await wrapper.findAll('.listselect__option').at(2).trigger('click')
            expect(wrapper.emitted('update:modelValue').length).toBe(2)
            expect(wrapper.emitted('update:modelValue')[1]).toEqual([
                [{ id: '3', label: 'option3' }]
            ])
            expect(modelValue.value).toStrictEqual([{ id: '3', label: 'option3' }])
        })
    })

    describe('in multiple mode', () => {
        it('supports multiple selection when multiple is true', async () => {
            const { wrapper, modelValue } = mountListSelect({ multiple: true })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            await wrapper.findAll('.listselect__option').at(2).trigger('click')

            expect(modelValue.value).toStrictEqual([
                { id: '2', label: 'option2' },
                { id: '3', label: 'option3' }
            ])
        })

        it('supports deselect when multiple is true', async () => {
            const { wrapper, modelValue } = mountListSelect({ multiple: true })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            expect(modelValue.value).toStrictEqual([{ id: '2', label: 'option2' }])
            await wrapper.findAll('.listselect__option').at(2).trigger('click')
            expect(modelValue.value).toStrictEqual([
                { id: '2', label: 'option2' },
                { id: '3', label: 'option3' }
            ])
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            expect(modelValue.value).toStrictEqual([{ id: '3', label: 'option3' }])
        })

        it('handles list length excess', async () => {
            const { wrapper, modelValue } = mountListSelect({
                multiple: true,
                maxSelectionLength: 2
            })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            await wrapper.findAll('.listselect__option').at(2).trigger('click')
            await wrapper.findAll('.listselect__option').at(0).trigger('click')

            expect(modelValue.value).toStrictEqual([
                { id: '2', label: 'option2' },
                { id: '3', label: 'option3' }
            ])
        })

        it('can remove an option via taglist remove buttons', async () => {
            const { wrapper, modelValue } = mountListSelect({
                multiple: true,
                maxSelectionLength: 2
            })
            await wrapper.find('.listselect--dropdown-toggle').trigger('click')
            await wrapper.findAll('.listselect__option').at(1).trigger('click')
            await wrapper.findAll('.listselect__option').at(2).trigger('click')
            expect(modelValue.value).toStrictEqual([
                { id: '2', label: 'option2' },
                { id: '3', label: 'option3' }
            ])

            await wrapper.find('.remove-option-0').trigger('click')
            expect(modelValue.value).toStrictEqual([{ id: '3', label: 'option3' }])
        })
    })
})
