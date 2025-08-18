import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DialogComponent } from '@/components/dialog'
import { DialogContent, DialogDescription, DialogTitle } from 'reka-ui'

describe('DialogComponent', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(DialogComponent, {
            props: {
                title: 'Test Dialog',
                description: 'This is a test dialog.',
                confirmDisabled: false,
                preConfirm: vi.fn(() => true)
            },
            slots: {
                trigger: '<button>Open Dialog</button>',
                content: '<p>Dialog Content</p>',
                cancelLabel: '<span>Cancel</span>',
                confirmLabel: '<span>OK</span>'
            }
        })
    })

    it('renders the trigger button', () => {
        const trigger = wrapper.find('button')
        expect(trigger.exists()).toBe(true)
        expect(trigger.text()).toBe('Open Dialog')
    })

    it('opens the dialog when the trigger is clicked', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        const contentWrapper = wrapper.getComponent(DialogContent)

        expect(contentWrapper.exists()).toBe(true)
    })

    it('renders the title and description', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        const titleWrapper = wrapper.getComponent(DialogTitle)
        expect(titleWrapper.exists()).toBe(true)
        expect(titleWrapper.text()).toBe('Test Dialog')

        const descriptionWrapper = wrapper.getComponent(DialogDescription)
        expect(descriptionWrapper.exists()).toBe(true)
        expect(descriptionWrapper.text()).toBe('This is a test dialog.')
    })

    it('emits confirm when the confirm button is clicked', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        const contentWrapper = wrapper.getComponent(DialogContent)
        const confirmButton = contentWrapper.find('.dialog-confirm-button')
        await confirmButton.trigger('click')

        expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('emits cancel when the cancel button is clicked', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        const contentWrapper = wrapper.getComponent(DialogContent)
        const cancelButton = contentWrapper.find('.dialog-cancel-button')
        await cancelButton.trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('disables the confirm button when confirmDisabled is true', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        await wrapper.setProps({ confirmDisabled: true })

        const contentWrapper = wrapper.getComponent(DialogContent)
        const confirmButton = contentWrapper.find('.dialog-confirm-button')
        expect(confirmButton.attributes('disabled')).toBeDefined()
    })

    it('calls preConfirm before emitting confirm', async () => {
        const trigger = wrapper.find('button')
        await trigger.trigger('click')

        const contentWrapper = wrapper.getComponent(DialogContent)
        const confirmButton = contentWrapper.find('.dialog-confirm-button')
        await confirmButton.trigger('click')

        expect(wrapper.props('preConfirm')).toHaveBeenCalled()
    })
})
