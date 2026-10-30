import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import ChatInput from '../ChatInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.useRealTimers())

describe('ChatInput deferred focus cleanup', () => {
    it.each(['disabled', 'unmounted'])('cancels pending focus when %s', async (action) => {
        vi.useFakeTimers()
        const wrapper = mount(ChatInput, { props: { disabled: true } })
        wrapper.vm.focus()
        await wrapper.setProps({ disabled: false })
        expect(vi.getTimerCount()).toBe(1)
        if (action === 'disabled') await wrapper.setProps({ disabled: true })
        else wrapper.unmount()
        expect(vi.getTimerCount()).toBe(0)
    })
})
