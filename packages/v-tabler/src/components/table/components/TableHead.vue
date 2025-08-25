<template>
    <thead class="bg-thead-background font-semibold text-[0.625rem] text-thead-text">
        <th
            v-for="(col, index) in visibleFields || []"
            :key="index"
            :class="[col?.thClassList, leftPadFirstCol(index), rightPadLastCol(index)]"
            class="p-2 first:ps-6 last:pe-6 uppercase"
        >
            <slot :name="`th(${col?.key})`" :field="col">
                <div :class="getHeaderFlexClasses(col)">
                    <div class="hover:cursor-pointer flex items-center" @click="sortTable(col)">
                        {{ underscoresToSpaces(getColumnLabel(col)) }}
                        <div class="flex items-center">
                            <span
                                class="inline-block w-4 h-4 ml-1"
                                :class="getSortIconClass(col?.key)"
                            ></span>
                        </div>
                    </div>

                    <column-filter
                        v-if="enableColumnFilters && col?.filterable !== false"
                        :field="col"
                        :data="allData"
                        :model-value="columnFilters.get(col.key)"
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

const sortTable = col => {
    emit('sort-table', col)
}

const handleColumnFilter = (fieldKey, filter) => {
    emit('column-filter', { field: fieldKey, filter })
}

// Extract column alignment classes for the header flex container
const getHeaderFlexClasses = col => {
    const baseClasses = ['flex', 'items-center']
    const thClasses = col?.thClassList || ''

    // Check if the column has one of our table alignment shortcuts
    if (thClasses.includes('table-col-left')) {
        baseClasses.push('justify-start')
    } else if (thClasses.includes('table-col-right')) {
        baseClasses.push('justify-end')
    } else if (thClasses.includes('table-col-center')) {
        baseClasses.push('justify-center')
    }

    return baseClasses
}
</script>
