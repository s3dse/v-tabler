<template>
    <thead
        class="bg-thead-background font-semibold text-[0.625rem] text-thead-text"
    >
        <th
            v-for="(col, index) in (visibleFields || [])"
            :key="index"
            :class="[col?.thClassList, leftPadFirstCol(index), rightPadLastCol(index)]"
            class="p-2 first:ps-6 last:pe-6 uppercase"
        >
            <slot :name="`th(${col?.key})`" :field="col">
                <div class="flex items-center justify-between">
                    <div 
                        class="hover:cursor-pointer flex items-center"
                        @click="sortTable(col)"
                    >
                        {{ underscoresToSpaces(getColumnLabel(col)) }}
                        <div
                            class="inline-block ml-1"
                            :class="getSortIconClass(col?.key)"
                        ></div>
                    </div>
                    
                    <!-- Column Filter -->
                    <column-filter
                        v-if="enableColumnFilters"
                        :field="col"
                        :data="allData"
                        :model-value="columnFilters[col.key]"
                        @filter-change="handleColumnFilter(col.key, $event)"
                    />
                </div>
            </slot>
        </th>
    </thead>
</template>

<script setup>
import ColumnFilter from './ColumnFilter.vue'

defineProps({
    visibleFields: {
        type: Array,
        required: true
    },
    tableData: {
        type: Array,
        required: true
    },
    topRows: {
        type: Array,
        required: true
    },
    underscoresToSpaces: {
        type: Function,
        required: true
    },
    getColumnLabel: {
        type: Function,
        required: true
    },
    getSortIconClass: {
        type: Function,
        required: true
    },
    leftPadFirstCol: {
        type: Function,
        required: true
    },
    rightPadLastCol: {
        type: Function,
        required: true
    },
    enableColumnFilters: {
        type: Boolean,
        default: true
    },
    allData: {
        type: Array,
        default: () => []
    },
    columnFilters: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['sort-table', 'column-filter'])

const sortTable = (col) => {
    emit('sort-table', col)
}

const handleColumnFilter = (fieldKey, filter) => {
    emit('column-filter', { field: fieldKey, filter })
}
</script>
