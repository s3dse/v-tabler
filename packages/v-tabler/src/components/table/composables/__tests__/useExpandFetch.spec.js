import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useExpandFetch } from '../useExpandFetch'

describe('useExpandFetch', () => {
    let fetchFn

    beforeEach(() => {
        fetchFn = vi.fn(item => Promise.resolve([{ id: 1, name: `detail-${item.id}` }]))
    })

    describe('defaults', () => {
        it('returns all expected properties', () => {
            const result = useExpandFetch({ fetchFn })
            expect(result).toHaveProperty('expandedItems')
            expect(result).toHaveProperty('detailCache')
            expect(result).toHaveProperty('fetchingIds')
            expect(result).toHaveProperty('fetchDetailsForRow')
            expect(result).toHaveProperty('onExpandToggle')
            expect(result).toHaveProperty('rowState')
        })

        it('starts with empty state', () => {
            const { expandedItems, detailCache, fetchingIds } = useExpandFetch({ fetchFn })
            expect(expandedItems.value).toEqual([])
            expect(detailCache.size).toBe(0)
            expect(fetchingIds.size).toBe(0)
        })

        it('works without any options', () => {
            const { rowState } = useExpandFetch()
            expect(rowState('anything')).toEqual({ fetching: false, details: [] })
        })
    })

    describe('fetchDetailsForRow', () => {
        it('fetches and caches details for a row', async () => {
            const { fetchDetailsForRow, detailCache } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            const result = await fetchDetailsForRow(item)

            expect(fetchFn).toHaveBeenCalledWith(item)
            expect(result).toEqual([{ id: 1, name: 'detail-dept-1' }])
            expect(detailCache.get('dept-1')).toEqual(result)
        })

        it('returns cached data on second call', async () => {
            const { fetchDetailsForRow } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await fetchDetailsForRow(item)
            const result = await fetchDetailsForRow(item)

            expect(fetchFn).toHaveBeenCalledTimes(1)
            expect(result).toEqual([{ id: 1, name: 'detail-dept-1' }])
        })

        it('skips cache when cache option is false', async () => {
            const { fetchDetailsForRow } = useExpandFetch({
                fetchFn,
                key: item => item.id,
                cache: false
            })

            const item = { id: 'dept-1' }
            await fetchDetailsForRow(item)
            await fetchDetailsForRow(item)

            expect(fetchFn).toHaveBeenCalledTimes(2)
        })

        it('uses item identity as default key', async () => {
            const item = { id: 'dept-1' }
            const { fetchDetailsForRow, detailCache } = useExpandFetch({ fetchFn })

            await fetchDetailsForRow(item)

            expect(detailCache.has(item)).toBe(true)
        })

        it('clears fetchingIds after fetch completes', async () => {
            const { fetchDetailsForRow, fetchingIds } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await fetchDetailsForRow(item)

            expect(fetchingIds.has('dept-1')).toBe(false)
        })

        it('clears fetchingIds even when fetch fails', async () => {
            const failingFetch = vi.fn(() => Promise.reject(new Error('network error')))
            const { fetchDetailsForRow, fetchingIds } = useExpandFetch({
                fetchFn: failingFetch,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await expect(fetchDetailsForRow(item)).rejects.toThrow('network error')

            expect(fetchingIds.has('dept-1')).toBe(false)
        })

        it('does not cache when fetch fails', async () => {
            const failingFetch = vi.fn(() => Promise.reject(new Error('fail')))
            const { fetchDetailsForRow, detailCache } = useExpandFetch({
                fetchFn: failingFetch,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await expect(fetchDetailsForRow(item)).rejects.toThrow()

            expect(detailCache.has('dept-1')).toBe(false)
        })

        it('prevents duplicate concurrent fetches for the same row', async () => {
            let resolvePromise
            const slowFetch = vi.fn(() => new Promise(resolve => { resolvePromise = resolve }))
            const { fetchDetailsForRow } = useExpandFetch({
                fetchFn: slowFetch,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            const promise1 = fetchDetailsForRow(item)
            const promise2 = fetchDetailsForRow(item)

            resolvePromise([{ name: 'result' }])
            await promise1
            const result2 = await promise2

            expect(slowFetch).toHaveBeenCalledTimes(1)
            expect(result2).toEqual([])
        })
    })

    describe('onExpandToggle', () => {
        it('fetches details when a row is expanded', async () => {
            const { onExpandToggle, detailCache } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await onExpandToggle({ item, expanded: true })

            expect(fetchFn).toHaveBeenCalledWith(item)
            expect(detailCache.get('dept-1')).toBeDefined()
        })

        it('does nothing when a row is collapsed', async () => {
            const { onExpandToggle } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            await onExpandToggle({ item: { id: 'dept-1' }, expanded: false })

            expect(fetchFn).not.toHaveBeenCalled()
        })
    })

    describe('rowState', () => {
        it('returns fetching false and empty details for unknown row', () => {
            const { rowState } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const state = rowState({ id: 'unknown' })
            expect(state).toEqual({ fetching: false, details: [] })
        })

        it('returns cached details after fetch', async () => {
            const { fetchDetailsForRow, rowState } = useExpandFetch({
                fetchFn,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            await fetchDetailsForRow(item)

            const state = rowState(item)
            expect(state.fetching).toBe(false)
            expect(state.details).toEqual([{ id: 1, name: 'detail-dept-1' }])
        })

        it('reports fetching true during active fetch', async () => {
            let resolvePromise
            const slowFetch = vi.fn(() => new Promise(resolve => { resolvePromise = resolve }))
            const { fetchDetailsForRow, rowState } = useExpandFetch({
                fetchFn: slowFetch,
                key: item => item.id
            })

            const item = { id: 'dept-1' }
            const promise = fetchDetailsForRow(item)

            expect(rowState(item).fetching).toBe(true)
            expect(rowState(item).details).toEqual([])

            resolvePromise([])
            await promise

            expect(rowState(item).fetching).toBe(false)
        })
    })
})
