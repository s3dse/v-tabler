import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { LoadingOverlay } from '@/components/loading-overlay'
import { busy } from '@/directives/busy/busy'

describe('LoadingOverlay', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(LoadingOverlay, {
            props: {
                show: true
            },
            slots: {
                default: '<div class="content">Content</div>'
            },
            directives: {
                busy
            },
            attachTo: document.body
        })
    })

    it('renders the slot content', () => {
        const content = wrapper.find('.content')
        expect(content.exists()).toBe(true)
        expect(content.text()).toBe('Content')
    })

    it('applies the busy directive when show is true', () => {
        expect(wrapper.attributes('data-busy')).toBe('true')
    })

    it('does not apply the busy directive when show is false', async () => {
        await wrapper.setProps({ show: false })
        expect(wrapper.attributes('data-busy')).toBe('false')
    })
})
