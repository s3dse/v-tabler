import { describe, expect, it } from 'vitest'
import {
    createMentionDraft,
    isMentionDraft,
    normalizeMentionDraft,
    parseSerializedMentions,
    replaceMentionRange,
    serializeMentionRange
} from '../mentions/mentionDraft.js'
import { defaultMentionTriggerProvider } from '../mentions/mentionTriggerProvider.js'

const resolvedBrand = {
    kind: 'mention',
    type: 'brand',
    trigger: 'Marke',
    id: '123',
    label: 'ACME [DE] \\ Retail',
    resolved: true
}

describe('mention drafts', () => {
    it('serializes readable content and portable mention syntax', () => {
        const draft = createMentionDraft([
            { kind: 'text', text: 'Klicks für ' },
            resolvedBrand,
            { kind: 'text', text: '?' }
        ])

        expect(draft.content).toBe('Klicks für ACME [DE] \\ Retail?')
        expect(draft.serializedContent).toBe('Klicks für @Marke[ACME \\[DE\\] \\\\ Retail]?')
    })

    it('parses copied mentions as unresolved and preserves escaped labels', () => {
        const [text, mention] = parseSerializedMentions(
            'Klicks für @Marke[ACME \\[DE\\] \\\\ Retail]',
            defaultMentionTriggerProvider
        )

        expect(text).toEqual({ kind: 'text', text: 'Klicks für ' })
        expect(mention).toEqual({
            ...resolvedBrand,
            id: null,
            resolved: false
        })
    })

    it('leaves unknown portable triggers as ordinary text', () => {
        const value = 'Klicks für @unknown[ACME]'
        expect(normalizeMentionDraft(value, defaultMentionTriggerProvider).parts).toEqual([
            { kind: 'text', text: value }
        ])
    })

    it('leaves empty portable mentions as ordinary text', () => {
        const value = 'Klicks für @brand[]'
        expect(normalizeMentionDraft(value, defaultMentionTriggerProvider).parts).toEqual([
            { kind: 'text', text: value }
        ])
    })

    it('replaces a trigger range with an atomic mention', () => {
        const text = 'Compare @brand adi tomorrow'
        const start = text.indexOf('@')
        const end = text.indexOf(' tomorrow')
        const parts = replaceMentionRange([{ kind: 'text', text }], { start, end }, [
            { ...resolvedBrand, trigger: 'brand', label: 'ADIDAS' }
        ])
        const draft = createMentionDraft(parts)

        expect(draft.content).toBe('Compare ADIDAS tomorrow')
        expect(draft.serializedContent).toBe('Compare @brand[ADIDAS] tomorrow')
    })

    it('serializes any selected mention atomically', () => {
        const parts = [
            { kind: 'text', text: 'A ' },
            { ...resolvedBrand, label: 'ADIDAS' },
            { kind: 'text', text: ' B' }
        ]

        expect(serializeMentionRange(parts, { start: 3, end: 5 })).toBe('@Marke[ADIDAS]')
    })

    it('rejects resolved mentions without a usable id', () => {
        expect(isMentionDraft({ parts: [{ ...resolvedBrand, id: '' }] })).toBe(false)
        expect(isMentionDraft({ parts: [{ ...resolvedBrand, id: null }] })).toBe(false)
    })
})
