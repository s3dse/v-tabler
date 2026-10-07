import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatHeader from '../ChatHeader.vue'
import ChatInput from '../ChatInput.vue'
import ChatMessage from '../ChatMessage.vue'
import TypingIndicator from '../TypingIndicator.vue'

const assistantMessage = {
    role: 'assistant',
    content: 'Assistant response',
    timestamp: new Date('2026-10-07T08:00:00Z')
}

const userMessage = {
    role: 'user',
    content: 'User question',
    timestamp: new Date('2026-10-07T08:01:00Z')
}

describe('embedded chat constituent styling', () => {
    it('should render a neutral embedded header without the status dot', () => {
        const wrapper = mount(ChatHeader, {
            props: {
                chatTitle: 'Assistant',
                variant: 'embedded'
            }
        })

        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(['bg-transparent', 'text-default', 'border-b'])
        )
        expect(wrapper.classes()).not.toContain('bg-primary')
        expect(wrapper.classes()).not.toContain('rounded-t-sm')
        expect(wrapper.find('.animate-pulse').exists()).toBe(false)
        expect(wrapper.find('button').classes()).toContain('bg-transparent')
        expect(wrapper.find('.i-tabler-trash').classes()).toContain('text-muted')
    })

    it('should preserve the existing card header by default', () => {
        const wrapper = mount(ChatHeader, {
            props: { chatTitle: 'Assistant' }
        })

        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(['bg-primary', 'text-onprimary', 'rounded-t-sm'])
        )
        expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('should render the embedded input on a transparent surface', () => {
        const wrapper = mount(ChatInput, {
            props: { variant: 'embedded' }
        })
        const textarea = wrapper.find('textarea')

        expect(wrapper.classes()).toContain('bg-transparent')
        expect(wrapper.classes()).not.toContain('bg-surface')
        expect(wrapper.classes()).toContain('border-t')
        expect(textarea.classes()).toContain('text-default')
    })

    it('should render embedded assistant messages without bubble chrome', () => {
        const wrapper = mount(ChatMessage, {
            props: {
                message: assistantMessage,
                variant: 'embedded'
            }
        })
        const messageContent = wrapper.findAll('div')[1]

        expect(messageContent.classes()).toEqual(
            expect.arrayContaining(['w-full', 'max-w-full', 'text-default'])
        )
        expect(messageContent.classes()).not.toContain('bg-surface')
        expect(messageContent.classes()).not.toContain('border')
        expect(messageContent.classes()).not.toContain('shadow-sm')
    })

    it('should retain the user bubble in embedded mode', () => {
        const wrapper = mount(ChatMessage, {
            props: {
                message: userMessage,
                variant: 'embedded'
            }
        })
        const messageContent = wrapper.findAll('div')[1]

        expect(messageContent.classes()).toEqual(
            expect.arrayContaining([
                'max-w-[80%]',
                'rounded',
                'shadow-sm',
                'bg-primary',
                'text-onprimary'
            ])
        )
    })

    it('should render embedded typing dots without a surrounding bubble', () => {
        const wrapper = mount(TypingIndicator, {
            props: { variant: 'embedded' }
        })
        const indicatorContent = wrapper.findAll('div')[1]

        expect(indicatorContent.classes()).toContain('text-default')
        expect(indicatorContent.classes()).not.toContain('bg-surface')
        expect(indicatorContent.classes()).not.toContain('border')
        expect(indicatorContent.classes()).not.toContain('rounded')
    })
})
