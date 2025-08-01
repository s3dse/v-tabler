<template>
    <div class="vt-table-header flex flex-wrap mx-4 my-3 gap-2 justify-start">
        <input
            v-if="enableSearch"
            name="search"
            :placeholder="searchPlaceholder"
            :id="filterInputId"
            @input="handleInput"
            :value="searchTerm"
            :class="searchInputClassList"
        />
        <dropdown-component
            v-if="configurablePageSize"
            class="flex"
            :model-value="pageSize"
            @update:model-value="updatePageSize"
            :options="(pageSizes || []).filter(e => e > (topRowsLength || 0))"
            :default-item="5"
            :button-class-list="pageSizeButtonClassList"
        >
            <template #toggle-label="{ currentItem }">
                <slot name="page-size-label" v-bind="{ pageSize: currentItem }"></slot>
            </template>
        </dropdown-component>
        <slot
            name="table-top-controls"
            :data="tableData || []"
            :top-rows="topRows || []"
            :fields="fields || []"
        ></slot>
    </div>
</template>

<script setup>
import DropdownComponent from '@/components/dropdown/DropdownComponent.vue'

defineProps({
    enableSearch: {
        type: Boolean,
        default: true
    },
    searchPlaceholder: {
        type: String,
        default: 'Search'
    },
    filterInputId: {
        type: String,
        required: true
    },
    searchTerm: {
        type: String,
        default: null
    },
    searchInputClassList: {
        type: String,
        required: true
    },
    configurablePageSize: {
        type: Boolean,
        default: true
    },
    pageSize: {
        required: true
    },
    pageSizes: {
        type: Array,
        required: true
    },
    topRowsLength: {
        type: Number,
        required: true
    },
    pageSizeButtonClassList: {
        type: String,
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
    fields: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:searchTerm', 'update:pageSize', 'filter-data'])

const handleInput = (event) => {
    emit('update:searchTerm', event.target.value)
    emit('filter-data', event)
}

const updatePageSize = (value) => {
    emit('update:pageSize', value)
}
</script>
