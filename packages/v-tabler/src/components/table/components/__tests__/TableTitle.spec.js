import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableTitle from '../TableTitle.vue'

describe('TableTitle', () => {
    it('should render title prop when provided', () => {
        const wrapper = mount(TableTitle, {
            props: {
                title: 'Test Title'
            }
        })

        expect(wrapper.text()).toBe('Test Title')
        expect(wrapper.find('.vt-title').exists()).toBe(true)
    })

    it('should render slot content when slot is provided', () => {
        const wrapper = mount(TableTitle, {
            slots: {
                title: '<h1>Custom Title</h1>'
            }
        })

        expect(wrapper.html()).toContain('<h1>Custom Title</h1>')
        expect(wrapper.find('.vt-title').exists()).toBe(false) // Should not show default title style
    })

    it('should not render anything when neither title nor slot is provided', () => {
        const wrapper = mount(TableTitle, {
            props: {}
        })

        expect(wrapper.find('.vt-title-border').exists()).toBe(false)
    })

    it('should prefer slot over title prop when both are provided', () => {
        const wrapper = mount(TableTitle, {
            props: {
                title: 'Prop Title'
            },
            slots: {
                title: '<h1>Slot Title</h1>'
            }
        })

        expect(wrapper.html()).toContain('<h1>Slot Title</h1>')
        expect(wrapper.text()).not.toContain('Prop Title')
    })
})
