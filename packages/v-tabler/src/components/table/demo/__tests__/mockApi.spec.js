import { describe, it, expect } from 'vitest'
import { fetchPaginatedData as setupMockApi } from '../mockApi.js'

const fetchPaginatedData = setupMockApi(0)

describe('mockApi', () => {
    describe('fetchPaginatedData', () => {
        it('should filter dates correctly with >= operator', async () => {
            // Test with a date that should match some records
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    date: {
                        type: 'date',
                        operator: '>=',
                        value: '2024-01-01' // Use a date that should match recent items
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)
            expect(result.totalItems).toBeGreaterThan(0)

            // Verify that all returned items have dates >= the filter date
            const filterDate = new Date('2024-01-01')
            result.items.forEach(item => {
                const itemDate = new Date(item.date)
                expect(itemDate >= filterDate).toBe(true)
            })
        })

        it('should filter dates correctly with = operator', async () => {
            // First, get some data to find an actual date
            const allData = await fetchPaginatedData({
                page: 1,
                perPage: 10
            })

            const testDate = allData.items[0].date

            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    date: {
                        type: 'date',
                        operator: '=',
                        value: testDate
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)
            result.items.forEach(item => {
                expect(item.date).toBe(testDate)
            })
        })

        it('should filter dates correctly with < operator', async () => {
            // Use a future date to ensure we get results
            const futureDate = new Date()
            futureDate.setDate(futureDate.getDate() + 30)
            const futureDateStr = futureDate.toISOString().slice(0, 10)

            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    date: {
                        type: 'date',
                        operator: '<',
                        value: futureDateStr
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)

            // Verify that all returned items have dates < the filter date
            result.items.forEach(item => {
                const itemDate = new Date(item.date)
                const filterDate = new Date(futureDateStr)
                expect(itemDate < filterDate).toBe(true)
            })
        })

        it('should return empty results for impossible date conditions', async () => {
            // Use a date far in the past that should match nothing
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    date: {
                        type: 'date',
                        operator: '>',
                        value: '2030-12-31' // Future date - no items should match
                    }
                }
            })

            expect(result.items.length).toBe(0)
            expect(result.totalItems).toBe(0)
        })

        it('should handle numeric filters correctly', async () => {
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    value: {
                        type: 'numeric',
                        operator: '>=',
                        value: '500'
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)
            result.items.forEach(item => {
                expect(item.value).toBeGreaterThanOrEqual(500)
            })
        })

        it('should handle text filters correctly', async () => {
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    name: {
                        type: 'text',
                        value: '1'
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)
            result.items.forEach(item => {
                expect(item.name.toLowerCase()).toContain('1')
            })
        })

        it('should handle select filters correctly', async () => {
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                columnFilters: {
                    status: {
                        type: 'select',
                        value: ['active', 'pending']
                    }
                }
            })

            expect(result.items.length).toBeGreaterThan(0)
            result.items.forEach(item => {
                expect(['active', 'pending']).toContain(item.status)
            })
        })

        it('should handle global search correctly', async () => {
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 50,
                searchTerm: 'Item 1'
            })

            expect(result.items.length).toBeGreaterThan(0)
            result.items.forEach(item => {
                const itemValues = Object.values(item).join(' ').toLowerCase()
                expect(itemValues).toContain('item 1')
            })
        })

        it('should handle sorting correctly', async () => {
            const result = await fetchPaginatedData({
                page: 1,
                perPage: 10,
                sort: {
                    key: 'value',
                    dir: 'desc'
                }
            })

            expect(result.items.length).toBe(10)

            // Verify descending sort
            for (let i = 1; i < result.items.length; i++) {
                expect(result.items[i - 1].value).toBeGreaterThanOrEqual(result.items[i].value)
            }
        })

        it('should handle pagination correctly', async () => {
            const page1 = await fetchPaginatedData({
                page: 1,
                perPage: 5
            })

            const page2 = await fetchPaginatedData({
                page: 2,
                perPage: 5
            })

            expect(page1.items.length).toBe(5)
            expect(page2.items.length).toBe(5)
            expect(page1.totalItems).toBe(123)
            expect(page2.totalItems).toBe(123)

            // Verify different items on different pages
            const page1Ids = page1.items.map(item => item.id)
            const page2Ids = page2.items.map(item => item.id)
            expect(page1Ids).not.toEqual(page2Ids)
        })
    })
})
