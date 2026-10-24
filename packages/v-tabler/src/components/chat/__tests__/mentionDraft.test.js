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

const promptParts = [
    { kind: 'text', text: 'A ' },
    { ...resolvedBrand, label: 'ADIDAS' },
    { kind: 'text', text: ' B' }
]

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
        expect(serializeMentionRange(promptParts, { start: 3, end: 5 })).toBe('@Marke[ADIDAS]')
    })

    it.each([
        [0, 'XA ADIDAS B'],
        [2, 'A XADIDAS B'],
        [8, 'A ADIDASX B'],
        [10, 'A ADIDAS BX']
    ])('inserts text at collapsed boundary %i', (offset, expectedContent) => {
        const parts = replaceMentionRange(promptParts, { start: offset, end: offset }, [
            { kind: 'text', text: 'X' }
        ])

        expect(createMentionDraft(parts).content).toBe(expectedContent)
        expect(serializeMentionRange(promptParts, { start: offset, end: offset })).toBe('')
    })

    it('treats a mention atomically when a range crosses its boundary', () => {
        expect(serializeMentionRange(promptParts, { start: 1, end: 4 })).toBe(
            ' @Marke[ADIDAS]'
        )
        expect(
            createMentionDraft(replaceMentionRange(promptParts, { start: 1, end: 4 }, [])).content
        ).toBe('A B')
    })

    it('rejects resolved mentions without a usable id', () => {
        expect(isMentionDraft({ parts: [{ ...resolvedBrand, id: '' }] })).toBe(false)
        expect(isMentionDraft({ parts: [{ ...resolvedBrand, id: null }] })).toBe(false)
    })
})
