import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { TableSkeleton } from '@/components/skeleton'

describe('TableSkeleton', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(TableSkeleton, {
            props: {
                rows: 3,
                columns: 4,
                animation: { type: 'all', speed: 'normal' },
                show: true
            }
        })
    })

    it('renders the correct number of rows and columns', () => {
        const rows = wrapper.findAll('.grid')
        expect(rows.length).toBe(4) // 1 header row + 3 data rows

        const columns = rows[1].findAll('.h-5')
        expect(columns.length).toBe(4)
    })

    it('applies the correct animation classes', () => {
        const shimmerBg = wrapper.find('.shimmer-bg')
        expect(shimmerBg.exists()).toBe(true)
        expect(shimmerBg.classes()).toContain('animate-shimmer!')
    })

    it('renders the default message slot when no custom message is provided', () => {
        const message = wrapper.find('.text-xl')
        expect(message.exists()).toBe(true)
        expect(message.text()).toBe('Fetching data. This may take a while.')
    })

    it('renders a custom message when provided in the slot', () => {
        wrapper = mount(TableSkeleton, {
            props: {
                rows: 3,
                columns: 4,
                show: true
            },
            slots: {
                message: '<div class="custom-message">Custom Loading Message</div>'
            }
        })

        const customMessage = wrapper.find('.custom-message')
        expect(customMessage.exists()).toBe(true)
        expect(customMessage.text()).toBe('Custom Loading Message')
    })

    it('does not render when show is false', async () => {
        expect(wrapper.isVisible()).toBe(true)

        await wrapper.setProps({ show: false })
        expect(wrapper.isVisible()).toBe(false)
    })

    it('validates the animation prop correctly', async () => {
        await wrapper.setProps({ animation: { type: 'per-row', speed: 'slow' } })
        const rows = wrapper.findAll('.grid')
        const animatedRow = rows[1].find('.shimmer-bg')
        expect(animatedRow.exists()).toBe(true)
        expect(animatedRow.classes()).toContain('animate-shimmer-slow!')
    })
})
