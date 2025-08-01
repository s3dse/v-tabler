<template>
    <div class="vt-table-footer flex flex-wrap gap-2 mx-4 my-2 pb-1">
        <pagination-component
            v-if="paginate"
            :per-page="itemsPerPage || 0"
            :current-page="currentPage || 1"
            :total-pages="numberOfPages || 0"
            :total-entries="remotePagination ? (totalItems || 0) : (tableDataLength || 0)"
            :previous-label="paginationPreviousLabel"
            :next-label="paginationNextLabel"
            @page-changed="changePage"
            class="text-default"
        >
            <template #pagination-label="{ data }">
                <slot name="pagination-label" v-bind="data || {}"></slot>
            </template>
        </pagination-component>
        <slot
            name="table-bottom-controls"
            :fields="fields || []"
            :data="tableData || []"
            :summary-rows="bottomRows || []"
        ></slot>
    </div>
</template>

<script setup>
import PaginationComponent from '@/components/pagination/PaginationComponent.vue'

defineProps({
    paginate: {
        type: Boolean,
        default: true
    },
    itemsPerPage: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    },
    numberOfPages: {
        type: Number,
        required: true
    },
    remotePagination: {
        type: Boolean,
        default: false
    },
    totalItems: {
        type: Number,
        required: false
    },
    tableDataLength: {
        type: Number,
        required: true
    },
    paginationPreviousLabel: {
        type: String,
        required: false
    },
    paginationNextLabel: {
        type: String,
        required: false
    },
    fields: {
        type: Array,
        required: true
    },
    tableData: {
        type: Array,
        required: true
    },
    bottomRows: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['page-changed'])

const changePage = (page) => {
    emit('page-changed', page)
}
</script>
