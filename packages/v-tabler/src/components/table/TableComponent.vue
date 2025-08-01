<template>
    <div>
        <table-title 
            :title="title"
        >
            <template v-if="slots.title" #title>
                <slot name="title" />
            </template>
        </table-title>

        <table-header
            :enable-search="enableSearch"
            :search-placeholder="searchPlaceholder"
            :filter-input-id="filterInputId"
            v-model:search-term="searchTerm"
            :search-input-class-list="searchInputClassList"
            :configurable-page-size="configurablePageSize"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
            :top-rows-length="topRows.length"
            :page-size-button-class-list="pageSizeButtonClassList"
            :table-data="tableData"
            :top-rows="topRows"
            :fields="fields"
            @filter-data="handleFilterInternal"
        >
            <template #page-size-label="{ pageSize: currentPageSize }">
                <slot name="page-size-label" v-bind="{ pageSize: currentPageSize }"></slot>
            </template>
            <template #table-top-controls="slotProps">
                <slot name="table-top-controls" v-bind="slotProps"></slot>
            </template>
        </table-header>

        <div class="mt-2 pb-2 border-t border-border overflow-x-auto with-scrollbar">
            <table
                class="w-full text-default"
                :class="{ 'table-fixed whitespace-normal break-words': fixed }"
            >
                <table-head
                    :visible-fields="visibleFields"
                    :table-data="tableData"
                    :top-rows="topRows"
                    :underscores-to-spaces="underscoresToSpaces"
                    :get-column-label="getColumnLabel"
                    :get-sort-icon-class="getSortIconClass"
                    :left-pad-first-col="leftPadFirstCol"
                    :right-pad-last-col="(index) => rightPadLastCol(index, visibleFields.length)"
                    @sort-table="handleSortInternal"
                >
                    <template v-for="field in visibleFields" :key="field.key" #[`th(${field.key})`]="slotProps">
                        <slot :name="`th(${field.key})`" v-bind="slotProps"></slot>
                    </template>
                </table-head>

                <table-body
                    v-if="topRows.length"
                    :rows="getRows(topRows, false)"
                    :visible-fields="visibleFields"
                    row-type="top"
                    :get-value="getValue"
                    :get-unformatted-value="getUnformattedValue"
                    :get-cell-class-list="getTopRowClassList"
                >
                    <template v-for="field in visibleFields" :key="field.key" #[`cell(${field.key})`]="slotProps">
                        <slot :name="`cell(${field.key})`" v-bind="slotProps"></slot>
                    </template>
                </table-body>

                <table-body
                    :rows="getRows()"
                    :visible-fields="visibleFields"
                    row-type="regular"
                    row-class="border-y border-border"
                    :get-value="getValue"
                    :get-unformatted-value="getUnformattedValue"
                    :get-cell-class-list="getClassList"
                >
                    <template v-for="field in visibleFields" :key="field.key" #[`cell(${field.key})`]="slotProps">
                        <slot :name="`cell(${field.key})`" v-bind="slotProps"></slot>
                    </template>
                </table-body>

                <table-body
                    v-if="bottomRows.length"
                    :rows="getRows(bottomRows, false)"
                    :visible-fields="visibleFields"
                    row-type="bottom"
                    row-class="border-t border-border"
                    :get-value="getValue"
                    :get-unformatted-value="getUnformattedValue"
                    :get-cell-class-list="getBottomRowClassList"
                >
                    <template v-for="field in visibleFields" :key="field.key" #[`cell(${field.key})`]="slotProps">
                        <slot :name="`cell(${field.key})`" v-bind="slotProps"></slot>
                    </template>
                </table-body>
            </table>
        </div>

        <table-footer
            :paginate="paginate"
            :items-per-page="itemsPerPage"
            :current-page="currentPage"
            :number-of-pages="numberOfPages"
            :remote-pagination="remotePagination"
            :total-items="totalItems"
            :table-data-length="tableData.length"
            :pagination-previous-label="paginationPreviousLabel"
            :pagination-next-label="paginationNextLabel"
            :fields="fields"
            :table-data="tableData"
            :bottom-rows="bottomRows"
            @page-changed="changePage"
        >
            <template #pagination-label="{ data }">
                <slot name="pagination-label" v-bind="data || { perPage: 0, currentPage: 1, totalEntries: 0 }"></slot>
            </template>
            <template #table-bottom-controls="slotProps">
                <slot name="table-bottom-controls" v-bind="slotProps || {}"></slot>
            </template>
        </table-footer>
    </div>
</template>
<script setup>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { computed, useId, useSlots, watch, onMounted } from 'vue'
import { joinLines } from '@/utils/string-join-lines.js'

import {
    useTableData,
    useTableSorting,
    useTablePagination,
    useTableFiltering,
    useTableValidation,
    useTableStyles
} from './composables/index.js'

import {
    TableTitle,
    TableHeader,
    TableHead,
    TableBody,
    TableFooter
} from './components/index.js'

const props = defineProps({
    title: {
        type: String,
        required: false
    },
    items: {
        type: Array,
        required: true
    },
    totalItems: {
        type: Number,
        required: false
    },
    topRows: {
        type: Array,
        default: () => []
    },
    bottomRows: {
        type: Array,
        default: () => []
    },
    fields: {
        type: Array,
        default: () => [],
        validator: v => v.every(e => e.key)
    },
    perPage: {
        type: Number,
        default: 5
    },
    configurablePageSize: {
        type: Boolean,
        default: true
    },
    pageSizes: {
        type: Array,
        default: () => [5, 10, 25, 50]
    },
    pageSizeButtonClassList: {
        type: String,
        default: joinLines(`btn-transparent-default 
                            table-top-control`)
    },
    searchInputClassList: {
        type: String,
        default: joinLines(`form-inputfield-sm text-default`)
    },
    paginate: {
        type: Boolean,
        default: true
    },
    enableSearch: {
        type: Boolean,
        default: true
    },
    searchPlaceholder: {
        type: String,
        default: 'Search'
    },
    paginationPreviousLabel: {
        type: String,
        required: false
    },
    paginationNextLabel: {
        type: String,
        required: false
    },
    fixed: {
        type: Boolean,
        default: false
    },
    remotePagination: {
        type: Boolean,
        default: false
    },
    filterDebounce: {
        type: Number,
        default: 250
    },
    filterMaxWait: {
        type: Number,
        default: 2000
    },
    sortNullsFirst: {
        type: Boolean,
        default: null
    }
})

const emit = defineEmits([
    'per-page-change',
    'sort-change',
    'after-sort',
    'page-change',
    'after-page-change',
    'filter-change',
    'filter-change-debounced',
    'after-filter'
])

const id = useId()
const slots = useSlots()

const { 
    tableData, 
    visibleFields, 
    getValue, 
    getUnformattedValue, 
    getColumnLabel, 
    underscoresToSpaces 
} = useTableData(props)

const itemsPerPage = computed(() => {
    const safePageSize = pageSize.value || 5
    const safeTopRowsLength = props.topRows?.length || 0
    return Math.max(1, safePageSize - safeTopRowsLength)
})
const { 
    currentPage, 
    pageSize, 
    numberOfPages, 
    changePage: changePageInternal, 
    getRows 
} = useTablePagination(props, itemsPerPage, tableData)

const { 
    handleSort, 
    getSortIconClass 
} = useTableSorting(tableData, props.remotePagination, props.sortNullsFirst)

const { 
    searchTerm, 
    filterData,
    setupDebouncedEmission
} = useTableFiltering(props, props.items, tableData, (page) => {
    const result = changePageInternal(page)
    if (result?.shouldEmitPageChange) {
        emit('page-change', result.eventData.page)
    }
    if (result?.shouldEmitAfterPageChange) {
        emit('after-page-change', { 
            oldPage: result.eventData.oldPage, 
            newPage: result.eventData.newPage 
        })
    }
})

const { validateProps } = useTableValidation()

const { 
    getClassList, 
    getTopRowClassList, 
    getBottomRowClassList, 
    leftPadFirstCol, 
    rightPadLastCol 
} = useTableStyles()

const filterInputId = computed(() => `filter_input_${id}`)

const changePage = (page) => {
    const result = changePageInternal(page)
    if (result?.shouldEmitPageChange) {
        emit('page-change', result.eventData.page)
    }
    if (result?.shouldEmitAfterPageChange) {
        emit('after-page-change', { 
            oldPage: result.eventData.oldPage, 
            newPage: result.eventData.newPage 
        })
    }
    return result
}

const handleSortInternal = (column) => {
    const result = handleSort(column, (page) => {
        const pageResult = changePageInternal(page)
        if (pageResult?.shouldEmitPageChange) {
            emit('page-change', pageResult.eventData.page)
        }
        if (pageResult?.shouldEmitAfterPageChange) {
            emit('after-page-change', { 
                oldPage: pageResult.eventData.oldPage, 
                newPage: pageResult.eventData.newPage 
            })
        }
    })
    
    if (result?.shouldEmitSortChange) {
        emit('sort-change', result.eventData)
    }
    if (result?.shouldEmitAfterSort) {
        emit('after-sort', result.eventData)
    }
}

const handleFilterInternal = (event) => {
    const result = filterData(event)
    if (result?.shouldEmitFilterChange) {
        emit('filter-change', result.eventData.searchValue)
    }
    if (result?.shouldEmitAfterFilter) {
        emit('after-filter', { searchTerm: result.eventData.searchTerm })
    }
}

setupDebouncedEmission((result) => {
    if (result?.shouldEmitFilterChangeDebounced) {
        emit('filter-change-debounced', result.eventData.searchTerm)
    }
})

watch(() => itemsPerPage.value, (newItemsPerPage) => {
    emit('per-page-change', newItemsPerPage)
})

watch(() => props.perPage, (newPerPage) => {
    if (newPerPage > props.topRows.length) {
        pageSize.value = newPerPage
    } else {
        pageSize.value = props.pageSizes.find(e => e > props.topRows.length)
    }
})

onMounted(() => {
    validateProps(
        pageSize.value, 
        props.topRows.length, 
        props.remotePagination, 
        props.totalItems
    )
})
</script>
