<template>
    <div>
        <div
            v-if="title && !hasTitleSlot"
            class="vt-title-border border-b border-border bg-surface my-3"
        >
            <div class="vt-title card-title mx-4 my-3">
                {{ title }}
            </div>
        </div>
        <div
            v-if="!title && hasTitleSlot"
            class="vt-title-border border-b border-border my-3"
        >
            <slot name="title" />
        </div>
        <div class="vt-table-header flex flex-wrap mx-4 my-3 gap-2 justify-start">
            <input
                v-if="enableSearch"
                name="search"
                :placeholder="searchPlaceholder"
                :id="filterInputId"
                @input="filterData"
                v-model="searchTerm"
                :class="searchInputClassList"
            />
            <dropdown-component
                class="flex"
                v-model="pageSize"
                :options="pageSizes.filter(e => e > topRows.length)"
                :default-item="5"
                :button-class-list="pageSizeButtonClassList"
            >
                <template #toggle-label="{ currentItem }">
                    <slot name="page-size-label" v-bind="{ pageSize: currentItem }"></slot>
                </template>
            </dropdown-component>
            <slot
                name="table-top-controls"
                :data="tableData"
                :top-rows="topRows"
                :fields="fields"
            ></slot>
        </div>
        <div
            class="mt-2 pb-2 border-t border-border overflow-x-auto with-scrollbar"
        >
            <table
                class="w-full text-default"
                :class="{ 'table-fixed whitespace-normal break-words': fixed }"
            >
                <thead
                    class="bg-thead-background font-semibold text-[0.625rem] text-thead-text"
                    v-if="tableData.length || topRows.length"
                >
                    <th
                        v-for="(col, index) in visibleFields"
                        :key="index"
                        @click="sortTable(col)"
                        :class="[col.thClassList, leftPadFirstCol(index), rightPadLastCol(index)]"
                        class="hover:cursor-pointer p-2 first:ps-6 last:pe-6 uppercase"
                    >
                        <slot :name="`th(${col.key})`" :field="col">
                            <div class="">
                                {{ underscoresToSpaces(getColumnLabel(col)) }}
                                <div
                                    class="inline-block"
                                    :class="{
                                        'i-tabler-arrows-sort': col.key !== sortColumnKey,
                                        'i-tabler-sort-ascending':
                                            col.key === sortColumnKey && ascending,
                                        'i-tabler-sort-descending':
                                            col.key === sortColumnKey && !ascending
                                    }"
                                ></div>
                            </div>
                        </slot>
                    </th>
                </thead>
                <tbody v-if="topRows.length">
                    <tr
                        :data-top-row="rowIndex"
                        v-for="(item, rowIndex) in getRows(topRows, false)"
                        :key="`top_row_${rowIndex}`"
                        class=""
                    >
                        <td
                            v-for="(column, fieldIndex) in visibleFields"
                            :key="`top_row_column_${fieldIndex}`"
                            class="p-2 first:ps-6 last:pe-6"
                            :class="[getTopRowClassList(column)]"
                        >
                            <slot
                                :name="`cell(${column.key})`"
                                :value="getValue(item, column)"
                                :unformatted="getUnformattedValue(item, column)"
                                :item="item"
                                :field="column"
                            >
                                {{ getValue(item, column) }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr
                        v-for="(item, rowIndex) in getRows()"
                        :key="rowIndex"
                        class="border-y border-border"
                    >
                        <td
                            v-for="(column, fieldIndex) in visibleFields"
                            :key="fieldIndex"
                            class="p-2 first:ps-6 last:pe-6"
                            :class="[getClassList(column)]"
                        >
                            <slot
                                :name="`cell(${column.key})`"
                                :value="getValue(item, column)"
                                :unformatted="getUnformattedValue(item, column)"
                                :item="item"
                                :field="column"
                            >
                                {{ getValue(item, column) }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="bottomRows.length" class="">
                    <tr
                        v-for="(item, rowIndex) in getRows(bottomRows, false)"
                        :key="rowIndex"
                        class="border-t border-border"
                    >
                        <td
                            v-for="(column, fieldIndex) in visibleFields"
                            :key="fieldIndex"
                            class="p-2 first:ps-6 last:pe-6"
                            :class="[getBottomRowClassList(column)]"
                        >
                            <slot
                                :name="`cell(${column.key})`"
                                :value="getValue(item, column)"
                                :unformatted="getUnformattedValue(item, column)"
                                :item="item"
                                :field="column"
                            >
                                {{ getValue(item, column) }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="vt-table-footer flex flex-wrap gap-2 mx-4 my-2 pb-1">
            <pagination-component
                v-if="paginate"
                :per-page="itemsPerPage"
                :current-page="currentPage"
                :total-pages="numberOfPages"
                :total-entries="remotePagination ? totalItems : tableData.length"
                :previous-label="paginationPreviousLabel"
                :next-label="paginationNextLabel"
                @page-changed="changePage"
                class="text-default bg-surface"
            >
                <template #pagination-label="{ data }">
                    <slot name="pagination-label" v-bind="data"></slot>
                </template>
            </pagination-component>
            <slot
                name="table-bottom-controls"
                :fields="fields"
                :data="tableData"
                :summary-rows="bottomRows"
            ></slot>
        </div>
    </div>
</template>
<script>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { ref, useId } from 'vue'
import PaginationComponent from '@/components/pagination/PaginationComponent.vue'
import DropdownComponent from '@/components/dropdown/DropdownComponent.vue'
import { joinLines } from '@/utils/string-join-lines.js'
import { useDebounceFn } from '@vueuse/core'
import { sortTable } from './table-sort'

function textMatch(needle, haystack) {
    const lowerCasedNeedle = needle.toLowerCase()
    return haystack.toLowerCase().indexOf(lowerCasedNeedle) !== -1
}

function toSearchableRow(row) {
    const normalized = Object.values(row).join('') + ' ' + Object.values(row).join(' ')
    return {
        row,
        normalized
    }
}
export default {
    name: 'table-component',
    components: {
        PaginationComponent,
        DropdownComponent
    },
    setup(props, context) {
        const id = useId()
        const searchTerm = ref(null)
        const emitFilterDebounced = useDebounceFn(
            () => {
                context.emit('filter-change-debounced', searchTerm.value)
            },
            props.filterDebounce,
            { maxWait: props.filterMaxWait }
        )
        return {
            id,
            searchTerm,
            emitFilterDebounced
        }
    },
    props: {
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
            default: joinLines(`border
                                border-border
                                bg-transparent
                                hover:bg-subtle
                                text-default
                                hover:cursor-pointer
                                rounded-sm
                                text-sm
                                px-4
                                h-[100%]
                                inline-flex
                                items-center`)
        },
        searchInputClassList: {
            type: String,
            default: joinLines(`border
                                autofill:!bg-green 
                                border-border
                                bg-inputfield
                                text-muted
                                rounded-sm
                                focus:ring-primary
                                px-2
                                text-sm
                                flex
                                h-auto`)
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
    },
    data() {
        return {
            ascending: false,
            sortColumnKey: '',
            tableData: [...this.items],
            currentPage: 1,
            filterInputId: `filter_input_${this.id}`,
            filterInputSelector: `#filter_input_${this.id}`,
            thePageSize:
                this.perPage > this.topRows.length
                    ? this.perPage
                    : this.pageSizes.find(e => e > this.topRows.length),
            componentValidation: false
        }
    },
    computed: {
        visibleFields: {
            get() {
                return this.fields.map(f => ({ visible: true, ...f })).filter(e => e.visible)
            },
            set(value) {
                return value
            }
        },
        pageSize: {
            get() {
                return this.thePageSize > this.topRows.length
                    ? this.thePageSize
                    : this.pageSizes.find(e => e > this.topRows.length)
            },
            set(v) {
                const alternative =
                    v > this.topRows.length ? v : this.pageSizes.find(e => e > this.topRows.length)
                this.thePageSize = alternative
                return this.thePageSize
            }
        },
        itemsPerPage() {
            return this.pageSize - this.topRows.length
        },
        numberOfPages() {
            if (this.remotePagination) {
                return Math.ceil(this.totalItems / this.itemsPerPage)
            } else {
                return Math.ceil(this.tableData.length / this.itemsPerPage)
            }
        },
        underscoresToSpaces() {
            return v => (v ? v.replaceAll('_', ' ') : v)
        },
        hasTitleSlot() {
            return !!this.$slots.title
        }
    },
    watch: {
        items: function (newItems) {
            this.tableData = newItems
        },
        itemsPerPage: function (newItemsPerPage) {
            this.$emit('per-page-change', newItemsPerPage)
        },
        perPage: function (newPerPage) {
            if (newPerPage > this.topRows.length) {
                this.pageSize = newPerPage
            } else {
                this.pageSize = this.pageSizes.find(e => e > this.topRows.length)
            }
        },
        searchTerm: function (newSearchTerm) {
            this.emitFilterDebounced()
        }
    },
    emits: [
        'per-page-change',
        'sort-change',
        'after-sort',
        'page-change',
        'after-page-change',
        'filter-change',
        'filter-change-debounced',
        'after-filter'
    ],
    methods: {
        validateProps() {
            if (this.pageSize <= this.topRows.length) {
                this.componentValidation = false
                console.error("'pageSize' must be higher than length of 'topRows'.")
                return false
            }
            if (this.remotePagination && (this.totalItems === undefined || this.totalItems === null) ) {
                this.componentValidation = false
                console.error("'remotePagination === true' requires a 'totalItems' (int) prop")
                return false
            } else {
                this.componentValidation = true
                return true
            }
        },
        getValue(record, column) {
            if (!record) return ''
            const value = record[column.key]
            if (column.formatter) {
                return column.formatter(value)
            } else {
                return value
            }
        },
        getUnformattedValue(record, column) {
            if (!record) return ''
            return record[column.key]
        },
        sortTable(col) {
            if (this.sortColumnKey === col.key) {
                this.ascending = !this.ascending
            } else {
                this.ascending = true
                this.sortColumnKey = col.key
            }

            this.$emit('sort-change', { column: col, ascending: this.ascending })
            if (!this.remotePagination) {
                sortTable(this.tableData, col, { ascending: this.ascending, nullsFirst: this.sortNullsFirst })
                if (this.paginate) {
                    this.changePage(1)
                }
                this.$emit('after-sort', { column: col, ascending: this.ascending })
            }
        },
        changePage(page) {
            if (page === this.currentPage) return
            const oldPage = this.currentPage

            this.$emit('page-change', page)
            this.currentPage = page

            this.$emit('after-page-change', { oldPage, newPage: this.currentPage })
        },
        getRows(data = this.tableData, paginate = this.paginate) {
            if (paginate && !this.remotePagination) {
                const start = (this.currentPage - 1) * this.itemsPerPage
                const end = start + this.itemsPerPage
                return data.slice(start, end)
            } else {
                return data
            }
        },
        findItems(searchableRow) {
            const needle = this.$el.querySelector(this.filterInputSelector).value
            return textMatch(needle, searchableRow.normalized)
        },
        filterData(event) {
            this.$emit('filter-change', event.target.value)
            if (!this.remotePagination) {
                if (this.paginate) this.changePage(1)
                const searchableData = this.items.map(toSearchableRow)
                const filteredData = searchableData.filter(this.findItems)
                this.tableData = filteredData.map(e => (e ? e.row : []))
                this.$emit('after-filter', { searchTerm: event.target.value })
            }
        },
        getClassList(column) {
            return column.tdClassList || ''
        },
        getTopRowClassList(column) {
            return column.tdTopRowClassList || this.getClassList(column)
        },
        getBottomRowClassList(column) {
            return column.tdBottomRowClassList || this.getClassList(column)
        },
        setPageSize(size) {
            this.pageSize = size
        },
        leftPadFirstCol(index) {
            return index === 0 ? 'pe-6' : ''
        },
        rightPadLastCol(index) {
            return index === this.visibleFields.length - 1 ? 'pe-6' : ''
        },
        getColumnLabel(column) {
            return column.label ? column.label : column.key
        }
    },
    mounted() {
        this.validateProps()
    }
}
</script>
