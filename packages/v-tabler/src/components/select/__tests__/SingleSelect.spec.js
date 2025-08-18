import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
// import SingleSelect from '../SingleSelect.vue'
import { SingleSelect } from '@/components/select'
import { SelectContent } from 'reka-ui'

function initMocksForVirtualizer() {
    window.HTMLElement.prototype.releasePointerCapture = vi.fn()
    window.HTMLElement.prototype.hasPointerCapture = vi.fn()
    globalThis.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
}

const findTrigger = wrapper => wrapper.find('[role=combobox]')

const clickTrigger = async element => {
    await element.trigger('pointerdown', {
        button: 0,
        ctrlKey: false,
        pointerType: 'mouse'
    })
}

const clickOption = async option => {
    await option.trigger('pointerup')
}

describe('SingleSelect', () => {
    const options = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ]

    const mountSingleSelect = (
        props = { labelKey: 'name', valueKey: 'value' },
        mountOptions = {}
    ) => {
        if (document.body) document.body.innerHTML = ''

        return mount(SingleSelect, {
            attachTo: document.body,
            props: {
                options,
                ...props
            },
            ...mountOptions
        })
    }

    beforeEach(() => {
        document.body.innerHTML = ''
        initMocksForVirtualizer()
    })

    afterEach(() => {
        // Clean up any mounted components
        if (document.body) document.body.innerHTML = ''
    })

    it('renders the trigger button with default placeholder', () => {
        const wrapper = mountSingleSelect()

        const trigger = wrapper.find('[role=combobox]')
        console.log(wrapper.html())
        expect(trigger.exists()).toBe(true)
        expect(trigger.text()).toContain('Select option')
    })

    it('shows the selected option in the trigger', () => {
        const wrapper = mountSingleSelect({ modelValue: options[1] })

        const trigger = findTrigger(wrapper)
        expect(trigger.text()).toContain('Option 2')
    })

    it('shows custom placeholder when provided', () => {
        const wrapper = mountSingleSelect({ placeholder: 'Choose an option' })

        const trigger = wrapper.find('[role=combobox]')
        expect(trigger.text()).toContain('Choose an option')
    })

    it('renders all options when dropdown is opened', async () => {
        const wrapper = mountSingleSelect()

        // Open the dropdown
        const trigger = findTrigger(wrapper)
        await clickTrigger(trigger)
        await nextTick()

        // Check teleported content in document body
        const contentWrapper = wrapper.getComponent(SelectContent)
        expect(contentWrapper.exists()).toBe(true)
        expect(contentWrapper.findAll('[role=option]')).toHaveLength(options.length)

        // Verify each option is rendered with correct text
        const renderedOptions = contentWrapper.findAll('[role=option]')
        options.forEach((option, index) => {
            expect(renderedOptions[index].find('.single-select-item-label').text()).toContain(
                option.name
            )
        })
    })

    it('emits update:modelValue when an option is selected', async () => {
        const wrapper = mountSingleSelect({ modelValue: null })

        // Open the dropdown
        const trigger = findTrigger(wrapper)
        await clickTrigger(trigger)
        await nextTick()
        await nextTick()
        const contentWrapper = wrapper.getComponent(SelectContent)

        console.log(wrapper.html())
        // Click the first option
        const firstOption = contentWrapper.find('[role=option]')
        expect(firstOption).toBeTruthy()

        await firstOption.trigger('click')
        await clickTrigger(firstOption)
        await nextTick()
    })

    it('works with labelKey prop', async () => {
        const customOptions = [
            { value: 'opt1', name: 'Custom Option 1' },
            { value: 'opt2', name: 'Custom Option 2' }
        ]

        const wrapper = mountSingleSelect({
            options: customOptions,
            labelKey: 'name'
        })

        // Open dropdown
        const trigger = findTrigger(wrapper)
        await clickTrigger(trigger)
        await nextTick()

        const contentWrapper = wrapper.getComponent(SelectContent)
        const optionElements = contentWrapper.findAll('[role=option]')
        // Check options are rendered with correct labels
        expect(optionElements[0].text()).toContain('Custom Option 1')
        expect(optionElements[1].text()).toContain('Custom Option 2')

        // Select first option
        await clickOption(optionElements[0])
        // await nextTick()

        // expect(trigger.text()).toContain('Custom Option 1')
    })

    it('shows selected indicator when an option is selected', async () => {
        const wrapper = mountSingleSelect({ modelValue: options[1] })

        // Open dropdown
        const trigger = findTrigger(wrapper)
        await clickTrigger(trigger)
        await nextTick()

        // Check that selected option has indicator
        const selectedOption = document.querySelector('[role=option][aria-selected="true"]')
        expect(selectedOption).toBeTruthy()
        expect(selectedOption.textContent).toContain('Option 2')

        // Check that indicator icon is present
        const indicator = selectedOption.querySelector('.i-tabler-check')
        expect(indicator).toBeTruthy()
    })

    it('closes dropdown when an option is selected', async () => {
        const wrapper = mountSingleSelect({ modelValue: null })

        // Open dropdown
        const trigger = findTrigger(wrapper)
        await clickTrigger(trigger)
        await nextTick()

        // Verify dropdown is open
        let optionElements = document.querySelectorAll('[role=option]')
        expect(optionElements).toHaveLength(options.length)

        // Select an option
        await optionElements[0].click()
        await nextTick()

        // Verify dropdown is closed (no options visible)
        optionElements = document.querySelectorAll('.single-select-option')
        expect(optionElements).toHaveLength(0)
    })

    it('handles keyboard navigation', async () => {
        const wrapper = mountSingleSelect({ modelValue: null })

        const trigger = findTrigger(wrapper)

        // Open with Enter key
        await trigger.trigger('keydown', { key: 'Enter' })
        await nextTick()

        // Check dropdown is open
        const optionElements = document.querySelectorAll('[role=option]')
        expect(optionElements).toHaveLength(options.length)
    })
})
