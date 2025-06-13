<template>
    <Story title="Table" :layout="{ type: 'grid', width: '75%', height: '100%' }">
        <Variant title="default" :meta="{ wrapper: true }">
            <Remote-Wrapper>
                <TableComponent
                    :items="state.items"
                    :totalItems="state.totalItems"
                    :fields="state.fields"
                    :top-rows="topRows"
                    title="Test"
                    class="w-[100%] dark:bg-moon-800"
                    remote-pagination
                    :per-page="state.pagination.perPage"
                    @per-page-change="onPerPageChange"
                    @page-change="onPageChange"
                    @sort-change="onSortChange"
                    @filter-change="onFilterChange"
                >
                    <template #table-top-controls>
                        <div
                            class="border dark:border-moon-700 dark:text-gray-100 px-4 ms-auto"
                        >
                            some control
                        </div>
                    </template>
                    <template #page-size-label="{ pageSize }">
                        Einträge pro Seite: {{ pageSize }}
                    </template>
                    <template #cell(share)="data">
                        <div :title="data.unformatted">
                            {{ data.value }}
                        </div>
                    </template>
                </TableComponent>
            </Remote-Wrapper>
        </Variant>
    </Story>
</template>
<script setup>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { TableComponent } from '..'
import { reactive } from 'vue'
import data from '../../../assets/MOCK_DATA-2.json'

function numSort(a, b, ascending) {
    return ascending ? a - b : b - a
}

function alnumSort(a, b, ascending) {
    const direction = ascending ? 1 : -1
    const comparison = a.localeCompare(b, undefined, {
        sensitivity: 'base'
    })
    return comparison * direction
}
const fields = [
    {
        key: 'id',
        thClassList: 'text-right px-1 w-18',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'first_name',
        label: 'the first name',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'last_name',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'email',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1 w-15',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'share',
        thClassList: 'text-right px-1 w-15',
        tdClassList: 'text-right px-1 font-mono w-15',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold',
        formatter: number =>
            number
                ? (parseFloat(number) * 100).toLocaleString(navigator.language, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                  }) + '%'
                : number
    },
    {
        key: 'ip_address',
        thClassList: 'text-right px-1 w-45',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    }
]

const state = reactive({
    fields,
    items: [],
    totalItems: getTotalItems(),
    pagination: {
        page: 1,
        perPage: 5,
        sortColumn: null,
        ascending: true,
        filter: null
    }
})

function toSearchableRow(row) {
    const normalized = Object.values(row).join('') + ' ' + Object.values(row).join(' ')
    return {
        row,
        normalized
    }
}
function textMatch(needle, haystack) {
    const lowerCasedNeedle = needle.toLowerCase()
    return haystack.toLowerCase().indexOf(lowerCasedNeedle) !== -1
}

const findItems = filter =>searchableRow => {
    if (!filter) {
        return true
    }
    return textMatch(filter, searchableRow.normalized)
}

function fetchItemsMocked(state) {
    const records = data.slice()
    const searchableData = records.map(toSearchableRow)
    const filteredData = searchableData.filter(findItems(state.pagination.filter)).map(e => (e ? e.row : []))
    if (state.pagination.sortColumn !== null) {
        filteredData.sort((a, b) => {
            const aVal = a[state.pagination.sortColumn.key]
            const bVal = b[state.pagination.sortColumn.key]
            if (Number.isNaN(+aVal) && Number.isNaN(+bVal)) {
                return alnumSort(aVal, bVal, state.pagination.ascending)
            } else if ([aVal, bVal].every(n => !Number.isNaN(+n))) {
                return numSort(aVal, bVal, state.pagination.ascending)
            } else {
                return 0
            }
        })
    }
    const result = filteredData.slice(
        (state.pagination.page - 1) * state.pagination.perPage,
        state.pagination.page * state.pagination.perPage
    )
    return result
}

state.items = fetchItemsMocked(state)

function updatePagination(newProps) {
    state.pagination = { ...state.pagination, ...newProps }
}

function getTotalItems() {
    return data.length
}
const onPageChange = page => {
    updatePagination({ page })
    state.items = fetchItemsMocked(state)
}

const onPerPageChange = perPage => {
    updatePagination({ perPage })
    state.items = fetchItemsMocked(state)
}

const onSortChange = sort => {
    updatePagination({ sortColumn: sort.column, ascending: sort.ascending })
    state.items = fetchItemsMocked(state)
}

const onFilterChange = (filter)  => {
    updatePagination({ filter})
    state.items = fetchItemsMocked(state)
}
</script>
