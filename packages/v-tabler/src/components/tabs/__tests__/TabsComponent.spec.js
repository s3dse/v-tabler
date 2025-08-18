import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TabsComponent, TabComponent } from '@/components/tabs'

const tabs = [
    { label: 'Tab 1', name: 'tab1' },
    { label: 'Tab 2', name: 'tab2' },
    { label: 'Tab 3', name: 'tab3' }
]

describe('TabsComponent', () => {
    it('renders all tabs', () => {
        const wrapper = mount(TabsComponent, {
            props: { tabs, modelValue: 'tab1' }
        })
        expect(wrapper.text()).toContain('Tab 1')
        expect(wrapper.text()).toContain('Tab 2')
        expect(wrapper.text()).toContain('Tab 3')
    })

    it('selects the correct tab', async () => {
        const wrapper = mount(TabsComponent, {
            props: { tabs, currentTabIndex: 1 }
        })
        expect(wrapper.find('[data-active=true]').text()).toContain('Tab 2')
    })

    it('emits update:currentTabIndex when tab is clicked', async () => {
        const wrapper = mount(TabsComponent, {
            props: { tabs, currentTabIndex: 0 }
        })
        await wrapper.findAllComponents(TabComponent)[1].trigger('click')
        expect(wrapper.emitted()['update:currentTabIndex'][0][0]).toBe(1)
    })
})

describe('TabComponent', () => {
    it('renders title', () => {
        const wrapper = mount(TabComponent, {
            props: { title: 'My Tab' }
        })
        expect(wrapper.text()).toContain('My Tab')
    })

    it('emits click event', async () => {
        const wrapper = mount(TabComponent, {
            props: { label: 'Clickable', name: 'clickable', active: false }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })
})
