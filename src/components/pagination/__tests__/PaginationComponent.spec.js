import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import PaginationComponent from '@/components/pagination/PaginationComponent.vue'

describe('PaginationComponent', () => {
    it('renders properly', () => {
        const wrapper = shallowMount(PaginationComponent, {
            props: {
                totalPages: 1,
                totalEntries: 2,
                perPage: 10,
                currentPage: 1
            }
        })
        expect(wrapper.find('div[data-pagination-component]').toBeDefined)
        wrapper.unmount()
    })
    it('renders correctly on 1000 entries over 200 pages', () => {
        const wrapper = shallowMount(PaginationComponent, {
            props: {
                totalPages: 200,
                totalEntries: 1000,
                perPage: 5,
                currentPage: 1
            }
        })
        const paginationLabels = wrapper.findAll('ul.pagination li').map(w => w.text()).filter(e => e)
        const expectedPaginationLabels = ['Previous', '1', '2', '3', '200', 'Next']
        expectedPaginationLabels.every(label => expect(paginationLabels).toContain(label))
        wrapper.unmount()
    })
    it('renders correctly on 5 entries over 1 page', () => {
        const wrapper = shallowMount(PaginationComponent, {
            props: {
                totalPages: 1,
                totalEntries: 5,
                perPage: 5,
                currentPage: 1
            }
        })
        const paginationLabels = wrapper.findAll('ul.pagination li').map(w => w.text()).filter(e => e)
        const expectedPaginationLabels = ['Previous', '1', 'Next']
        expectedPaginationLabels.every(label => expect(paginationLabels).toContain(label))
        wrapper.unmount()
    })
    it('changes pagination forwards correctly', async () => {
        const wrapper = shallowMount(PaginationComponent, {
            props: {
                totalPages: 200,
                totalEntries: 1000,
                perPage: 5,
                currentPage: 1
            }
        })
        await wrapper.find('ul.pagination li:nth-last-child(3) button').trigger('click')
        const pageChangedEvents = wrapper.emitted()['page-changed']
        expect(pageChangedEvents).toBeDefined
        expect(Array.isArray(pageChangedEvents)).toBe(true)
        expect(pageChangedEvents.length).toBe(1)
        expect(pageChangedEvents[0][0]).toBe(3)

        await wrapper.setProps({ currentPage: 3})
        expect(wrapper.find('ul.pagination li:nth-last-child(3)').text()).toBe('4')
        wrapper.unmount()
    })
    it('changes pagination backwards correctly', async () => {
        const wrapper = shallowMount(PaginationComponent, {
            props: {
                totalPages: 200,
                totalEntries: 1000,
                perPage: 5,
                currentPage: 200
            }
        })

        await wrapper.find('ul.pagination li:first-child button').trigger('click')
        const pageChangedEvents = wrapper.emitted()['page-changed']
        expect(pageChangedEvents).toBeDefined
        expect(Array.isArray(pageChangedEvents)).toBe(true)
        expect(pageChangedEvents.length).toBe(1)
        expect(pageChangedEvents[0][0]).toBe(199)

        await wrapper.setProps({ currentPage: 199 })
        expect(wrapper.find('ul.pagination li:nth-last-child(3)').text()).toBe('199')
        await wrapper.find('ul.pagination li:first-child button').trigger('click')
        expect(wrapper.emitted()['page-changed'].slice(-1)[0][0]).toBe(198)

        await wrapper.setProps({ currentPage: 197 })
        expect(wrapper.find('ul.pagination li:nth-last-child(3)').text()).toBe('198')
    })
})