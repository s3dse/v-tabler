import { describe, expect, it } from 'vitest'
import {
    createMentionTriggerProvider,
    defaultMentionTriggerProvider
} from '../mentions/mentionTriggerProvider.js'

const matchAtEnd = (text) => defaultMentionTriggerProvider({ text, cursorIndex: text.length })

describe('mention trigger providers', () => {
    it.each([
        ['Wieviele Klicks hatte die @Marke adi', 'brand', 'Marke', 'adi'],
        ['Wieviele Klicks hatte die @brand adi', 'brand', 'brand', 'adi'],
        ['Sales for @Partner Media Markt', 'partner', 'Partner', 'Media Markt']
    ])('matches locale-independent triggers in %s', (text, type, trigger, query) => {
        expect(matchAtEnd(text)).toEqual({
            type,
            trigger,
            query,
            replaceRange: {
                start: text.indexOf('@'),
                end: text.length
            }
        })
    })

    it('matches at the supplied cursor instead of requiring the end of the message', () => {
        const text = 'Compare @brand adi with last week'
        const cursorIndex = text.indexOf(' with')

        expect(defaultMentionTriggerProvider({ text, cursorIndex })).toEqual(
            expect.objectContaining({
                type: 'brand',
                query: 'adi',
                replaceRange: { start: text.indexOf('@'), end: cursorIndex }
            })
        )
    })

    it('does not treat email addresses as mentions', () => {
        expect(matchAtEnd('mail user@brand')).toBeNull()
    })

    it('supports custom aliases', () => {
        const provider = createMentionTriggerProvider({ product: ['product', 'Artikel'] })

        expect(provider({ text: '@Artikel 123', cursorIndex: 12 })).toEqual(
            expect.objectContaining({ type: 'product', query: '123' })
        )
    })

    it('rejects aliases assigned to multiple types', () => {
        expect(() =>
            createMentionTriggerProvider({ brand: ['Brand'], partner: ['brand'] })
        ).toThrow('assigned to both')
    })

    it('rejects empty or non-portable trigger definitions', () => {
        expect(() => createMentionTriggerProvider({})).toThrow('at least one mention type')
        expect(() => createMentionTriggerProvider({ brand: ['brand name'] })).toThrow(
            'invalid trigger'
        )
    })
})
