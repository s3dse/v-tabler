<template>
    <div class="text-default">
        <heading tag="h1">Tables</heading>
        <p>Examples of table components and their features.</p>
        <card-component class="my-4">
            <loading-overlay :show="tableStatus.busy">
                <table-component
                    :items="items"
                    :fields="fields"
                    title="Test With Expand (Drilldown)"
                    class="w-[100%] bg-surface text-inverted"
                    expandable
                >
                    <template #table-top-controls>
                        <div class="btn-transparent-default table-top-control ms-auto">
                            some control
                        </div>
                    </template>
                    <template #page-size-label="{ pageSize }">
                        Einträge pro Seite: {{ pageSize }}
                    </template>
                    <template #pagination-label="{ perPage, currentPage, totalEntries }">
                        Einträge {{ (currentPage - 1) * perPage + 1 }} -
                        {{ currentPage * perPage }} von {{ totalEntries }}
                    </template>
                    <template #row-expand="{ item }">
                        <table-component
                            :items="getDetailsForDepartment(item.id)"
                            :fields="detailFields"
                            :paginate="false"
                            :enable-search="false"
                            :enable-column-filters="false"
                            :configurable-page-size="false"
                            class="w-full text-sm"
                        />
                    </template>
                </table-component>
            </loading-overlay>
        </card-component>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import {
    baseDrilldownItems as baseItems,
    drilldownFields,
    getDetailsForDepartment
} from './drilldown-data'

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

const tableStatus = ref({ busy: false })
</script>
