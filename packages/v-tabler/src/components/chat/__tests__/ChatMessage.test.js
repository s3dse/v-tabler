import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ChatMessage from '../ChatMessage.vue'

const clipboard = vi.hoisted(() => ({
    copy: vi.fn(),
    copied: null,
    isSupported: null
}))

vi.mock('@vueuse/core', async () => {
    const { ref } = await vi.importActual('vue')
    clipboard.copied = ref(false)
    clipboard.isSupported = ref(true)
    return {
        useClipboard: () => clipboard
    }
})

const createMessage = (overrides = {}) => ({
    role: 'user',
    content: 'Sales for DYSON',
    timestamp: new Date('2026-10-24T08:00:00Z'),
    ...overrides
})

describe('ChatMessage copy action', () => {
    beforeEach(() => {
        clipboard.copied.value = false
        clipboard.isSupported.value = true
        clipboard.copy.mockReset()
        clipboard.copy.mockImplementation(() => {
            clipboard.copied.value = true
            return Promise.resolve(true)
        })
    })

    it('copies the portable mention syntax and shows success feedback', async () => {
        const wrapper = mount(ChatMessage, {
            props: {
                message: createMessage({
                    serializedContent: 'Sales for @partner[DYSON]'
                })
            }
        })

        const copyButton = wrapper.get('button[aria-label="Copy message"]')
        expect(copyButton.classes()).toEqual(
            expect.arrayContaining(['bg-primary-hover', 'text-onprimary'])
        )
        expect(copyButton.classes()).not.toContain('opacity-70')

        await copyButton.trigger('click')
        await nextTick()

        expect(clipboard.copy).toHaveBeenCalledWith('Sales for @partner[DYSON]')
        expect(wrapper.get('button').attributes('aria-label')).toBe('Message copied')
        expect(wrapper.find('.i-tabler-check').exists()).toBe(true)
    })

    it('copies the visible content when serialized content is absent', async () => {
        const wrapper = mount(ChatMessage, {
            props: { message: createMessage() }
        })

        await wrapper.get('button').trigger('click')

        expect(clipboard.copy).toHaveBeenCalledWith('Sales for DYSON')
    })

    it('does not render the action for assistant messages', () => {
        const wrapper = mount(ChatMessage, {
            props: { message: createMessage({ role: 'assistant' }) }
        })

        expect(wrapper.find('button').exists()).toBe(false)
    })

    it('does not render the action when clipboard access is unavailable', () => {
        clipboard.isSupported.value = false
        const wrapper = mount(ChatMessage, {
            props: { message: createMessage() }
        })

        expect(wrapper.find('button').exists()).toBe(false)
    })
})
