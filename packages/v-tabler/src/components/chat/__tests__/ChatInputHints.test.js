import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import ChatInput from '../ChatInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

describe('ChatInput additional hints', () => {
    it.each([
        ['card', 'en-US', 'Press', 'AI can make mistakes. Please verify the responses.'],
        ['embedded', 'en-US', 'Press', 'AI can make mistakes. Please verify the responses.'],
        ['card', 'de-DE', 'Drücken Sie', 'AI kann Fehler machen. Bitte überprüfe die Antworten.'],
        ['embedded', 'de-DE', 'Drücken Sie', 'AI kann Fehler machen. Bitte überprüfe die Antworten.']
    ])('inserts guidance between keyboard help and the disclaimer for %s in %s', (variant, language, keyboardLabel, disclaimer) => {
        vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(language)
        const wrapper = mount(ChatInput, {
            props: { variant },
            slots: { 'additional-hints': '<p>Custom input guidance</p>' }
        })
        const paragraphs = wrapper.findAll('p').map(paragraph => paragraph.text())

        expect(paragraphs).toHaveLength(3)
        expect(paragraphs[0]).toContain(keyboardLabel)
        expect(paragraphs[0]).toContain('Shift+Enter')
        expect(paragraphs[1]).toBe('Custom input guidance')
        expect(paragraphs[2]).toBe(disclaimer)
    })

    it.each(['card', 'embedded'])('retains only the built-in hints without slot content in %s', variant => {
        const wrapper = mount(ChatInput, { props: { variant } })
        const paragraphs = wrapper.findAll('p').map(paragraph => paragraph.text())

        expect(paragraphs).toHaveLength(2)
        expect(paragraphs[0]).toContain('Shift+Enter')
        expect(paragraphs[1]).toContain('AI ')
    })

    it.each(['card', 'embedded'])('hides all hints when showHint is false in %s', variant => {
        const wrapper = mount(ChatInput, {
            props: { variant, showHint: false },
            slots: { 'additional-hints': '<p>Custom input guidance</p>' }
        })

        expect(wrapper.find('p').exists()).toBe(false)
        expect(wrapper.text()).not.toContain('Custom input guidance')
    })
})
