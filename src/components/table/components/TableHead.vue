<template>
    <thead
        class="bg-thead-background font-semibold text-[0.625rem] text-thead-text"
        v-if="(tableData || []).length || (topRows || []).length"
    >
        <th
            v-for="(col, index) in (visibleFields || [])"
            :key="index"
            @click="sortTable(col)"
            :class="[col?.thClassList, leftPadFirstCol(index), rightPadLastCol(index)]"
            class="hover:cursor-pointer p-2 first:ps-6 last:pe-6 uppercase"
        >
            <slot :name="`th(${col?.key})`" :field="col">
                <div class="">
                    {{ underscoresToSpaces(getColumnLabel(col)) }}
                    <div
                        class="inline-block"
                        :class="getSortIconClass(col?.key)"
                    ></div>
                </div>
            </slot>
        </th>
    </thead>
</template>

<script setup>
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
    }
})

const emit = defineEmits(['sort-table'])

const sortTable = (col) => {
    emit('sort-table', col)
}
</script>
