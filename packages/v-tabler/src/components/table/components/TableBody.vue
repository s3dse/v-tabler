<template>
    <tbody :class="bodyClass">
        <template v-for="(item, rowIndex) in rows || []" :key="getRowKey(rowIndex)">
            <tr :class="rowClass" :data-top-row="rowType === 'top' ? rowIndex : undefined">
                <td v-if="expandable" class="p-2 ps-6 w-10">
                    <div
                        role="button"
                        class="inline-block w-4 h-4 cursor-pointer transition-transform"
                        :class="[
                            isExpanded(item) ? 'i-tabler-chevron-down' : 'i-tabler-chevron-right'
                        ]"
                        @click="$emit('toggle-expand', item)"
                    ></div>
                </td>
                <td
                    v-for="(column, fieldIndex) in visibleFields || []"
                    :key="getCellKey(fieldIndex)"
                    class="p-2 first:ps-6 last:pe-6"
                    :class="[getCellClassList(column)]"
                >
                    <slot
                        :name="`cell(${column?.key})`"
                        :value="getValue(item, column)"
                        :unformatted="getUnformattedValue(item, column)"
                        :item="item"
                        :field="column"
                    >
                        {{ getValue(item, column) }}
                    </slot>
                </td>
            </tr>
            <tr v-if="expandable && isExpanded(item)" :data-expanded-row-for="getRowKey(rowIndex)">
                <td :colspan="colspan" class="p-0">
                    <div class="ms-10 me-4 my-2 ps-4 border-l-2 border-border">
                        <slot name="row-expand" :item="item"></slot>
                    </div>
                </td>
            </tr>
        </template>
    </tbody>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    rows: {
        type: Array,
        required: true
    },
    visibleFields: {
        type: Array,
        required: true
    },
    rowType: {
        type: String,
        default: 'regular', // 'top', 'regular', 'bottom'
        validator: value => ['top', 'regular', 'bottom'].includes(value)
    },
    bodyClass: {
        type: String,
        default: ''
    },
    rowClass: {
        type: String,
        default: ''
    },
    getValue: {
        type: Function,
        required: true
    },
    getUnformattedValue: {
        type: Function,
        required: true
    },
    getCellClassList: {
        type: Function,
        required: true
    },
    expandable: {
        type: Boolean,
        default: false
    },
    isExpanded: {
        type: Function,
        required: false
    }
})

defineEmits(['toggle-expand'])

const colspan = computed(() => {
    return props.visibleFields.length + (props.expandable ? 1 : 0)
})

const getRowKey = rowIndex => {
    return props.rowType === 'top'
        ? `top_row_${rowIndex}`
        : props.rowType === 'bottom'
          ? `bottom_row_${rowIndex}`
          : `row_${rowIndex}`
}

const getCellKey = fieldIndex => {
    return props.rowType === 'top'
        ? `top_row_column_${fieldIndex}`
        : props.rowType === 'bottom'
          ? `bottom_row_column_${fieldIndex}`
          : `column_${fieldIndex}`
}
</script>
