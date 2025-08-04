<template>
    <tbody :class="bodyClass">
        <tr
            v-for="(item, rowIndex) in rows || []"
            :key="getRowKey(rowIndex)"
            :class="rowClass"
            :data-top-row="rowType === 'top' ? rowIndex : undefined"
        >
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
    </tbody>
</template>

<script setup>
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
    }
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
