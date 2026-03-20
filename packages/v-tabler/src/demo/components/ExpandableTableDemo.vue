<template>
    <card-component class="my-4">
        <loading-overlay :show="tableStatus.busy">
            <table-component
                :items="items"
                :fields="fields"
                title="Test With Expand (Drilldown)"
                class="w-[100%] bg-surface text-inverted"
                expandable
                v-model:expanded="expandedItems"
            >
                <template #table-top-controls>
                    <button
                        class="btn-transparent-default table-top-control ms-auto"
                        @click="handleDownload"
                    >
                        Download CSV
                    </button>
                </template>
                <template #page-size-label="{ pageSize }">
                    Einträge pro Seite: {{ pageSize }}
                </template>
                <template #pagination-label="{ perPage, currentPage, totalEntries }">
                    Einträge {{ (currentPage - 1) * perPage + 1 }} - {{ currentPage * perPage }} von
                    {{ totalEntries }}
                </template>
                <template #row-expand="{ item }">
                    <table-component
                        :items="getDetailsForDepartment(item.id)"
                        :fields="detailFields"
                        :paginate="false"
                        :enable-search="false"
                        :enable-column-filters="false"
                        :configurable-page-size="false"
                        sticky-header
                        max-body-height="10rem"
                        class="w-full text-sm"
                    />
                </template>
            </table-component>
        </loading-overlay>
    </card-component>
</template>
<script setup>
import { ref } from 'vue'
import { downloadCSVWithSchema } from '@/utils/downloadCSV'
import {
    baseDrilldownItems as baseItems,
    drilldownFields,
    getDetailsForDepartment
} from '../sections/drilldown-data'

const items = ref(baseItems)
const fields = ref(drilldownFields)

const detailFields = [
    {
        key: 'name',
        label: 'Name',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'salary',
        label: 'Salary',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: v => `$${v.toLocaleString()}`
    },
    {
        key: 'tenure',
        label: 'Tenure',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: v => `${v} years`
    }
]

const expandedItems = ref([])

const handleDownload = () => {
    const rows = []
    for (const item of items.value) {
        rows.push(item)
        if (expandedItems.value.includes(item)) {
            rows.push(...getDetailsForDepartment(item.id))
        }
    }
    downloadCSVWithSchema({ filename: 'departments', data: rows, schema: drilldownFields })
}

const tableStatus = ref({ busy: false })
</script>
