import { describe, it, expect } from 'vitest'
import {
    detectFilterType,
    generateSelectOptions,
    FILTER_DETECTION_CONFIG
} from '../filterTypeDetection.js'

describe('filterTypeDetection', () => {
    describe('detectFilterType', () => {
        // Sample data for testing
        const numericData = [{ age: 25 }, { age: 30 }, { age: 35 }, { age: 40 }]

        const textData = [{ name: 'Alice Johnson' }, { name: 'Bob Smith' }, { name: 'Carol Davis' }]

        const dateData = [
            { hire_date: '2023-01-15' },
            { hire_date: '2022-03-20' },
            { hire_date: '2021-07-10' },
            { hire_date: '2023-05-01' }
        ]

        const selectData = [
            { status: 'Active' },
            { status: 'Inactive' },
            { status: 'Active' },
            { status: 'Pending' },
            { status: 'Active' },
            { status: 'Inactive' },
            { status: 'Active' },
            { status: 'Active' } // 8 total items, 3 unique = 37.5% cardinality
        ]

        describe('explicit filterType takes precedence', () => {
            it('should use explicit filterType when provided', () => {
                const field = { key: 'test', filterType: 'text' }
                expect(detectFilterType(field, numericData)).toBe('text')
            })

            it('should use explicit filterType over field.type', () => {
                const field = { key: 'age', filterType: 'text', type: 'numeric' }
                expect(detectFilterType(field, numericData)).toBe('text')
            })

            it('should use explicit filterType over filterOptions', () => {
                const field = {
                    key: 'status',
                    filterType: 'text',
                    filterOptions: [{ value: 'test', label: 'Test' }]
                }
                expect(detectFilterType(field, selectData)).toBe('text')
            })
        })

        describe('field.type takes precedence over auto-detection', () => {
            it('should use field.type = "numeric" without auto-detection', () => {
                const field = { key: 'age', type: 'numeric' }
                expect(detectFilterType(field, textData)).toBe('numeric') // Even with text data
            })

            it('should use field.type = "date" without auto-detection', () => {
                const field = { key: 'hire_date', type: 'date' }
                expect(detectFilterType(field, textData)).toBe('date') // Even with text data
            })

            it('should use field.type = "date" over auto-detected select', () => {
                // This is the specific bug we're testing for
                const field = { key: 'hire_date', type: 'date' }
                const limitedDateData = [
                    { hire_date: '2023-01-15' },
                    { hire_date: '2023-01-15' }, // Duplicate
                    { hire_date: '2023-01-15' }, // Duplicate
                    { hire_date: '2022-03-20' } // Only 2 unique values
                ]
                // Without the fix, this might auto-detect as 'select' due to low cardinality
                expect(detectFilterType(field, limitedDateData)).toBe('date')
            })

            it('should use field.type = "date" over auto-detected text', () => {
                const field = { key: 'hire_date', type: 'date' }
                const mixedData = [
                    { hire_date: 'not a date' },
                    { hire_date: 'also not a date' },
                    { hire_date: 'definitely not a date' }
                ]
                // Without the fix, this would auto-detect as 'text'
                expect(detectFilterType(field, mixedData)).toBe('date')
            })
        })

        describe('filterOptions takes precedence over auto-detection', () => {
            it('should use "select" when filterOptions are provided', () => {
                const field = {
                    key: 'status',
                    filterOptions: [
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' }
                    ]
                }
                expect(detectFilterType(field, numericData)).toBe('select')
            })
        })

        describe('auto-detection when FILTER_DETECTION_CONFIG.enabled = false', () => {
            it('should default to text when detection is disabled', () => {
                const originalEnabled = FILTER_DETECTION_CONFIG.enabled
                FILTER_DETECTION_CONFIG.enabled = false

                try {
                    const field = { key: 'age' }
                    expect(detectFilterType(field, numericData)).toBe('text')
                } finally {
                    FILTER_DETECTION_CONFIG.enabled = originalEnabled
                }
            })
        })

        describe('auto-detection logic', () => {
            it('should auto-detect numeric data', () => {
                const field = { key: 'age' }
                expect(detectFilterType(field, numericData)).toBe('numeric')
            })

            it('should auto-detect date data', () => {
                const field = { key: 'hire_date' }
                expect(detectFilterType(field, dateData)).toBe('date')
            })

            it('should auto-detect select data based on cardinality', () => {
                const field = { key: 'status' }
                expect(detectFilterType(field, selectData)).toBe('select')
            })

            it('should default to text for mixed/unclear data', () => {
                const field = { key: 'name' }
                expect(detectFilterType(field, textData)).toBe('text')
            })

            it('should handle empty data gracefully', () => {
                const field = { key: 'test' }
                expect(detectFilterType(field, [])).toBe('text')
            })

            it('should handle null/empty values in data', () => {
                const field = { key: 'test' }
                const dataWithNulls = [
                    { test: null },
                    { test: '' },
                    { test: undefined },
                    { test: 'actual value' }
                ]
                expect(detectFilterType(field, dataWithNulls)).toBe('text')
            })
        })

        describe('Remote pagination scenario (the original bug)', () => {
            it('should consistently return "date" for field with type="date" even with changing data', () => {
                const field = { key: 'date', type: 'date' }

                // Simulate different data states that might occur with remote pagination
                const initialData = [{ date: '2023-01-15' }, { date: '2022-03-20' }]

                const afterFilterData = [
                    { date: '2023-01-15' } // Only one unique value now
                ]

                const emptyData = []

                // All should consistently return 'date' because field.type is explicit
                expect(detectFilterType(field, initialData)).toBe('date')
                expect(detectFilterType(field, afterFilterData)).toBe('date')
                expect(detectFilterType(field, emptyData)).toBe('date')
            })

            it('should consistently return "numeric" for field with type="numeric" even with changing data', () => {
                const field = { key: 'salary', type: 'numeric' }

                const initialData = [{ salary: 50000 }, { salary: 60000 }, { salary: 70000 }]

                const afterFilterData = [{ salary: 50000 }]

                const emptyData = []

                // All should consistently return 'numeric' because field.type is explicit
                expect(detectFilterType(field, initialData)).toBe('numeric')
                expect(detectFilterType(field, afterFilterData)).toBe('numeric')
                expect(detectFilterType(field, emptyData)).toBe('numeric')
            })
        })
    })

    describe('generateSelectOptions', () => {
        const sampleData = [
            { status: 'Active' },
            { status: 'Inactive' },
            { status: 'Pending' },
            { status: 'Active' }
        ]

        it('should use explicit filterOptions when provided', () => {
            const field = {
                key: 'status',
                filterOptions: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                ]
            }

            const options = generateSelectOptions(field, sampleData, 'select')
            expect(options).toEqual([
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ])
        })

        it('should generate options from data when filterType is select', () => {
            const field = { key: 'status' }
            const options = generateSelectOptions(field, sampleData, 'select')

            expect(options).toEqual([
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending', label: 'Pending' }
            ])
        })

        it('should return empty array for non-select filterType', () => {
            const field = { key: 'status' }
            expect(generateSelectOptions(field, sampleData, 'text')).toEqual([])
            expect(generateSelectOptions(field, sampleData, 'numeric')).toEqual([])
            expect(generateSelectOptions(field, sampleData, 'date')).toEqual([])
        })

        it('should handle empty data', () => {
            const field = { key: 'status' }
            expect(generateSelectOptions(field, [], 'select')).toEqual([])
        })

        it('should filter out null/empty values', () => {
            const dataWithNulls = [
                { status: 'Active' },
                { status: null },
                { status: '' },
                { status: 'Inactive' },
                { status: undefined }
            ]

            const field = { key: 'status' }
            const options = generateSelectOptions(field, dataWithNulls, 'select')

            expect(options).toEqual([
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
            ])
        })
    })
})
