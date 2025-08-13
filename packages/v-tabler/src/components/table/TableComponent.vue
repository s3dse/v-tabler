<template>
    <div>
        <table-title :title="title">
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
            :table-data="dataForPagination"
            :top-rows="topRows"
            :fields="fields"
            :enable-column-filters="enableColumnFilters"
            :has-active-filters="hasActiveFilters"
            :show-clear-all-filters-button="showClearAllFiltersButton"
            :clear-all-filters-button-text="clearAllFiltersButtonText"
            @filter-data="handleFilterInternal"
            @clear-all-filters="clearAllColumnFiltersInternal"
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
                    :table-data="dataForPagination"
                    :top-rows="topRows"
                    :underscores-to-spaces="underscoresToSpaces"
                    :get-column-label="getColumnLabel"
                    :get-sort-icon-class="getSortIconClass"
                    :left-pad-first-col="leftPadFirstCol"
                    :right-pad-last-col="index => rightPadLastCol(index, visibleFields.length)"
                    :enable-column-filters="enableColumnFilters"
                    :all-data="[...(props.items || []), ...topRows, ...bottomRows]"
                    :column-filters="columnFilters"
                    @sort-table="handleSortInternal"
                    @column-filter="handleColumnFilterInternal"
                >
                    <template
                        v-for="field in visibleFields"
                        :key="field.key"
                        #[`th(${field.key})`]="slotProps"
                    >
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
                    <template
                        v-for="field in visibleFields"
                        :key="field.key"
                        #[`cell(${field.key})`]="slotProps"
                    >
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
                    <template
                        v-for="field in visibleFields"
                        :key="field.key"
                        #[`cell(${field.key})`]="slotProps"
                    >
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
                    <template
                        v-for="field in visibleFields"
                        :key="field.key"
                        #[`cell(${field.key})`]="slotProps"
                    >
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
            :table-data-length="dataForPagination.length"
            :pagination-previous-label="paginationPreviousLabel"
            :pagination-next-label="paginationNextLabel"
            :fields="fields"
            :table-data="dataForPagination"
            :bottom-rows="bottomRows"
            @page-changed="changePage"
        >
            <template #pagination-label="{ data }">
                <slot
                    name="pagination-label"
                    v-bind="data || { perPage: 0, currentPage: 1, totalEntries: 0 }"
                ></slot>
            </template>
            <template #table-bottom-controls="slotProps">
                <slot name="table-bottom-controls" v-bind="slotProps"></slot>
            </template>
        </table-footer>
    </div>
</template>
<script setup>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

import { computed, useId, useSlots, watch, onMounted } from 'vue'
import { joinLines } from '@/utils/string-join-lines.js'
import { useDebounceFn } from '@vueuse/core'

import {
    useTableData,
    useTableSorting,
    useTablePagination,
    useTableFiltering,
    useTableValidation,
    useTableStyles,
    useColumnFiltering
} from './composables/index.js'

import { TableTitle, TableHeader, TableHead, TableBody, TableFooter } from './components/index.js'

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
    },
    enableColumnFilters: {
        type: Boolean,
        default: true
    },
    showClearAllFiltersButton: {
        type: Boolean,
        default: true
    },
    clearAllFiltersButtonText: {
        type: String,
        default: 'Clear All Filters'
    }
})

const emit = defineEmits([
    'per-page-change',
    'sort-change',
    'page-change',
    'filter-change',
    'filter-change-debounced',
    'column-filter-change',
    'column-filter-change-debounced'
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

const {
    columnFilters,
    setColumnFilter,
    clearAllColumnFilters,
    hasActiveFilters,
    applyColumnFilters
} = useColumnFiltering({ remotePagination: props.remotePagination })

const dataForPagination = computed(() => {
    return hasActiveFilters.value ? applyColumnFilters(tableData.value) : tableData.value
})

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
} = useTablePagination(props, itemsPerPage, dataForPagination)

const { ascending, sortColumnKey, sortState, handleSort, getSortIconClass } = useTableSorting(
    dataForPagination,
    props.remotePagination,
    props.sortNullsFirst
)

const { searchTerm, filterData } = useTableFiltering(props, props.items, tableData, page => {
    changePageInternal(page)
    emit('page-change', createEventPayload('page-change'))
})

const useTableEvents = ({
    searchTerm,
    columnFilters,
    currentPage,
    perPage,
    numberOfPages,
    ascending,
    sortColumnKey
}) => {
    const createEventPayload = eventName => {
        // table-state
        return {
            eventName,
            searchTerm: searchTerm.value,
            columnFilters: Object.fromEntries(columnFilters.value.entries()),
            page: currentPage.value,
            perPage: perPage.value,
            numberOfPages: numberOfPages.value,
            sort: {
                dir: ascending.value ? 'asc' : 'desc',
                key: sortColumnKey.value
            }
        }
    }
    return {
        createEventPayload
    }
}

const { createEventPayload } = useTableEvents({
    searchTerm,
    columnFilters,
    currentPage,
    perPage: itemsPerPage,
    numberOfPages,
    ascending,
    sortColumnKey,
    sortState
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

const debouncedEmitColumnFilterChange = useDebounceFn(
    () => {
        emit('column-filter-change-debounced', createEventPayload('column-filter-change-debounced'))
    },
    props.filterDebounce,
    { maxWait: props.filterMaxWait }
)

const debouncedEmitFilterChange = useDebounceFn(
    () => {
        emit('filter-change-debounced', createEventPayload('filter-change-debounced'))
    },
    props.filterDebounce,
    { maxWait: props.filterMaxWait }
)

const changePage = page => {
    changePageInternal(page)
    emit('page-change', createEventPayload('page-change'))
}

const handleSortInternal = column => {
    handleSort(column, page => changePageInternal(page))
    emit('sort-change', createEventPayload('sort-change'))
}

const handleFilterInternal = event => {
    filterData(event)
    changePageInternal(1)
    emit('filter-change', createEventPayload('filter-change'))
    debouncedEmitFilterChange()
}

const handleColumnFilterInternal = ({ field, filter }) => {
    setColumnFilter(field, filter)
    changePageInternal(1)
    emit('column-filter-change', createEventPayload('column-filter-change'))
    debouncedEmitColumnFilterChange()
}

const clearAllColumnFiltersInternal = () => {
    clearAllColumnFilters()
    emit('column-filter-change', createEventPayload('column-filter-change'))
    debouncedEmitColumnFilterChange()
}

watch(
    () => itemsPerPage.value,
    () => emit('per-page-change', createEventPayload('per-page-change'))
)

watch(
    () => props.perPage,
    newPerPage => {
        if (newPerPage > props.topRows.length) {
            pageSize.value = newPerPage
        } else {
            pageSize.value = props.pageSizes.find(e => e > props.topRows.length)
        }
    }
)

onMounted(() => {
    validateProps(pageSize.value, props.topRows.length, props.remotePagination, props.totalItems)
})
</script>
