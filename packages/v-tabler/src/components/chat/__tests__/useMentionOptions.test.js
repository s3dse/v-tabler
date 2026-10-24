import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { MENTION_SEARCH_DEBOUNCE_MS, useMentionOptions } from '../mentions/useMentionOptions.js'

const mountOptions = (provider) => {
    let optionsApi
    const wrapper = mount(
        defineComponent({
            setup() {
                optionsApi = useMentionOptions(provider)
                return () => h('div')
            }
        })
    )
    return { optionsApi, wrapper }
}

describe('useMentionOptions', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('debounces option requests', async () => {
        const provider = vi.fn().mockResolvedValue([])
        const { optionsApi, wrapper } = mountOptions(provider)

        optionsApi.search({ type: 'brand', query: 'adi' })
        await vi.advanceTimersByTimeAsync(MENTION_SEARCH_DEBOUNCE_MS - 1)
        expect(provider).not.toHaveBeenCalled()

        await vi.advanceTimersByTimeAsync(1)
        expect(provider).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'brand',
                query: 'adi',
                signal: expect.any(AbortSignal)
            })
        )
        wrapper.unmount()
    })

    it.each(['search', 'searchImmediately'])(
        '%s clears previous suggestions and highlighting before loading new results',
        async (searchMethod) => {
            const brandOptions = [
                { id: 'brand-adidas', label: 'ADIDAS' },
                { id: 'brand-dyson', label: 'DYSON' }
            ]
            const partnerOptions = [{ id: 'partner-otto', label: 'OTTO' }]
            const pendingRequests = []
            const provider = vi.fn()
                .mockResolvedValueOnce(brandOptions)
                .mockImplementationOnce(
                    () => new Promise((resolve) => pendingRequests.push({ resolve }))
                )
            const { optionsApi, wrapper } = mountOptions(provider)

            await optionsApi.searchImmediately({ type: 'brand', query: '' })
            optionsApi.highlight(brandOptions.length - 1)

            optionsApi[searchMethod]({ type: 'partner', query: 'otto' })

            expect(optionsApi.options.value).toEqual([])
            expect(optionsApi.highlightedIndex.value).toBe(0)
            expect(optionsApi.open.value).toBe(true)
            expect(optionsApi.loading.value).toBe(true)

            await vi.advanceTimersByTimeAsync(MENTION_SEARCH_DEBOUNCE_MS)
            pendingRequests[0].resolve(partnerOptions)
            await vi.advanceTimersByTimeAsync(0)

            expect(optionsApi.options.value).toEqual(partnerOptions)
            expect(optionsApi.loading.value).toBe(false)
            wrapper.unmount()
        }
    )

    it('aborts stale requests and ignores their results', async () => {
        const requests = []
        const provider = vi.fn(
            ({ query, signal }) =>
                new Promise((resolve) => requests.push({ query, signal, resolve }))
        )
        const { optionsApi, wrapper } = mountOptions(provider)

        optionsApi.search({ type: 'brand', query: 'a' })
        await vi.advanceTimersByTimeAsync(MENTION_SEARCH_DEBOUNCE_MS)
        optionsApi.search({ type: 'brand', query: 'ad' })
        await vi.advanceTimersByTimeAsync(MENTION_SEARCH_DEBOUNCE_MS)

        expect(requests[0].signal.aborted).toBe(true)
        requests[0].resolve([{ id: 'old', label: 'OLD' }])
        requests[1].resolve([{ id: 'new', label: 'NEW' }])
        await Promise.resolve()
        await Promise.resolve()

        expect(optionsApi.options.value).toEqual([{ id: 'new', label: 'NEW' }])
        wrapper.unmount()
    })

    it('reports invalid provider responses', async () => {
        const provider = vi.fn().mockResolvedValue([{ id: '', label: 'Missing id' }])
        const { optionsApi, wrapper } = mountOptions(provider)

        await optionsApi.searchImmediately({ type: 'brand', query: 'adi' })

        expect(optionsApi.error.value).toBeInstanceOf(TypeError)
        expect(optionsApi.options.value).toEqual([])
        wrapper.unmount()
    })
})
