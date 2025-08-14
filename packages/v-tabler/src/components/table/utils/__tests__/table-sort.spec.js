import { describe, it, expect } from 'vitest'
import { sortTable, guessSortType } from '../table-sort'

describe('TableSort', () => {
    describe('should guess sort type', () => {
        it('numeric', () => {
            const tableData = [{ a: null }, { a: undefined }, { a: 1 }, { a: 2 }, { a: 3 }]
            const col = { key: 'a' }
            const type = guessSortType(tableData, col)
            expect(type).toBe('numeric')
        })
        it('alphanumeric', () => {
            const tableData = [{ a: null }, { a: undefined }, { a: 'a' }, { a: 'b' }, { a: 'c' }]
            const col = { key: 'a' }
            const type = guessSortType(tableData, col)
            expect(type).toBe('alphanumeric')
        })
        it('alphanumeric with mixed data types', () => {
            const tableData = [{ a: null }, { a: undefined }, { a: 'a' }, { a: 'b' }, { a: 3 }]
            const col = { key: 'a' }
            const type = guessSortType(tableData, col)
            expect(type).toBe('alphanumeric')
        })
    })
    describe('should sort numbers', () => {
        it('ascending & nulls last per default', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 0 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col)
            expect(tableData).toEqual([{ a: 0 }, { a: 5 }, { a: 10 }, { a: 12 }, { a: null }])
        })
        it('descending & nulls first when nullsFirst is not provided', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false })
            expect(tableData).toEqual([{ a: null }, { a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }])
        })
        it('ascending', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 10 }, { a: 12 }])
        })
        it('descending', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }])
        })
        it('ascending with nullsFirst', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 1 }, { a: 5 }, { a: 10 }, { a: 12 }])
        })
        it('descending with nullsFirst', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }])
        })
        it('ascending with nullsLast', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 10 }, { a: 12 }, { a: null }])
        })
        it('descending with nullsLast', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([{ a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }, { a: null }])
        })
        it('ascending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: undefined }, { a: 1 }, { a: 5 }, { a: 10 }, { a: 12 }])
        })
        it('descending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: undefined }, { a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }])
        })
        it('ascending with nullsLast and invalid values', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 10 }, { a: 12 }, { a: undefined }])
        })
        it('descending with nullsLast and invalid values', () => {
            const tableData = [{ a: 10 }, { a: 12 }, { a: 1 }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'numeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([{ a: 12 }, { a: 10 }, { a: 5 }, { a: 1 }, { a: undefined }])
        })
    })

    describe('should sort strings', () => {
        it('ascending & nulls last per default', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col)
            expect(tableData).toEqual([{ a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }, { a: null }])
        })
        it('descending & nulls first when nullsFirst is not provided', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false })
            expect(tableData).toEqual([{ a: null }, { a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }])
        })
        it('ascending', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }])
        })
        it('descending', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }])
        })
        it('ascending with nullsFirst', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }])
        })
        it('descending with nullsFirst', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }])
        })
        it('ascending with nullsLast', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([{ a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }, { a: null }])
        })
        it('descending with nullsLast', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([{ a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }, { a: null }])
        })
        it('ascending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([
                { a: undefined },
                { a: 'a' },
                { a: 'b' },
                { a: 'c' },
                { a: 'd' }
            ])
        })
        it('descending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([
                { a: undefined },
                { a: 'd' },
                { a: 'c' },
                { a: 'b' },
                { a: 'a' }
            ])
        })
        it('ascending with nullsLast and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([
                { a: 'a' },
                { a: 'b' },
                { a: 'c' },
                { a: 'd' },
                { a: undefined }
            ])
        })
        it('descending with nullsLast and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([
                { a: 'd' },
                { a: 'c' },
                { a: 'b' },
                { a: 'a' },
                { a: undefined }
            ])
        })
        it('ascending with nullsFirst and empty strings', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: '' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: '' }, { a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }])
        })
        it('descending with nullsFirst and empty strings', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: '' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: '' }, { a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }])
        })
        it('ascending with nullsLast and empty strings', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: '' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([{ a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'd' }, { a: '' }])
        })
        it('descending with nullsLast and empty strings', () => {
            const tableData = [{ a: 'c' }, { a: 'a' }, { a: 'b' }, { a: 'd' }, { a: '' }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([{ a: 'd' }, { a: 'c' }, { a: 'b' }, { a: 'a' }, { a: '' }])
        })
    })

    describe('should sort mixed data', () => {
        it('ascending & nulls last per default', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col)
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 'b' }, { a: 'c' }, { a: null }])
        })
        it('descending & nulls first when nullsFirst is not provided', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false })
            expect(tableData).toEqual([{ a: null }, { a: 'c' }, { a: 'b' }, { a: 5 }, { a: 1 }])
        })
        it('ascending', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 'b' }, { a: 'c' }])
        })
        it('descending', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: 'c' }, { a: 'b' }, { a: 5 }, { a: 1 }])
        })
        it('ascending with nullsFirst', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 1 }, { a: 5 }, { a: 'b' }, { a: 'c' }])
        })
        it('descending with nullsFirst', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([{ a: null }, { a: 'c' }, { a: 'b' }, { a: 5 }, { a: 1 }])
        })
        it('ascending with nullsLast', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 'b' }, { a: 'c' }, { a: null }])
        })
        it('descending with nullsLast', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([{ a: 'c' }, { a: 'b' }, { a: 5 }, { a: 1 }, { a: null }])
        })
        it('ascending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: true })
            expect(tableData).toEqual([
                { a: undefined },
                { a: 1 },
                { a: 5 },
                { a: 'b' },
                { a: 'c' }
            ])
        })
        it('descending with nullsFirst and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: true })
            expect(tableData).toEqual([
                { a: undefined },
                { a: 'c' },
                { a: 'b' },
                { a: 5 },
                { a: 1 }
            ])
        })
        it('ascending with nullsLast and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: true, nullsFirst: false })
            expect(tableData).toEqual([
                { a: 1 },
                { a: 5 },
                { a: 'b' },
                { a: 'c' },
                { a: undefined }
            ])
        })
        it('descending with nullsLast and invalid values', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: undefined }]
            const col = { key: 'a', type: 'alphanumeric' }
            sortTable(tableData, col, { ascending: false, nullsFirst: false })
            expect(tableData).toEqual([
                { a: 'c' },
                { a: 'b' },
                { a: 5 },
                { a: 1 },
                { a: undefined }
            ])
        })
    })
    describe('should sort data with unspecified type alphanumeric', () => {
        it('ascending & nulls last per default', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a' }
            sortTable(tableData, col)
            expect(tableData).toEqual([{ a: 1 }, { a: 5 }, { a: 'b' }, { a: 'c' }, { a: null }])
        })
        it('descending & nulls first when nullsFirst is not provided', () => {
            const tableData = [{ a: 'c' }, { a: 1 }, { a: 'b' }, { a: 5 }, { a: null }]
            const col = { key: 'a' }
            sortTable(tableData, col, { ascending: false })
            expect(tableData).toEqual([{ a: null }, { a: 'c' }, { a: 'b' }, { a: 5 }, { a: 1 }])
        })
    })
})
