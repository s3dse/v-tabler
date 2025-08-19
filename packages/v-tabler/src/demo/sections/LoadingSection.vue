<template>
    <div class="text-default">
        <heading tag="h1">Loading Indicators</heading>
        <p>Examples of loading indicators and overlays.</p>
        <div class="p-4 flex flex-col gap-2">
            <ToggleComponent
                class="flex gap-5"
                left-label="Toggle Loading"
                v-model="isLoading"
            ></ToggleComponent>
            <div v-busy="isLoading" class="p-3 card grid grid-cols-8 gap-4 justify-between">
                <span class="gap-4 col-span-4 grid grid-cols-2">
                    <p class="text-default">Busy Indicator Directive</p>
                    <pre>v-busy</pre>
                </span>
                <span class="flex col-span-4">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, dolore.</p>
                </span>
            </div>
            <loading-overlay
                :show="isLoading"
                class="p-3 card grid grid-cols-8 gap-4 justify-between"
            >
                <span class="gap-4 col-span-4 grid grid-cols-2">
                    <p class="text-default">Busy Indicator Component</p>
                    <pre>LoadingOverlay</pre>
                </span>
                <span class="flex col-span-4">
                    <p class="text-default">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, dolore.
                    </p>
                </span>
            </loading-overlay>
        </div>
    </div>

    <div class="p-4">
        <ToggleComponent
            class="flex gap-5 pb-4"
            left-label="Busy Table"
            v-model="showTableSkeleton"
        ></ToggleComponent>
        <div class="relative">
            <table-component
                v-show="!showTableSkeleton"
                :items="items"
                :fields="fields"
                :top-rows="topRows"
                title="Test"
                class="w-[100%] bg-surface text-inverted"
            >
                <template #table-top-controls>
                    <div class="btn-transparent-default table-top-control ms-auto">
                        some control
                    </div>
                </template>
                <template #page-size-label="{ pageSize }">
                    Einträge pro Seite: {{ pageSize }}
                </template>
                <template #cell(share)="data">
                    <div :title="data.unformatted">
                        {{ data.value }}
                    </div>
                </template>
            </table-component>
            <TableSkeleton
                :rows="5"
                :columns="5"
                :animation="{ type: 'all', speed: 'slow' }"
                :show="showTableSkeleton"
                class="absolute inset-0"
            >
            </TableSkeleton>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import data from '../assets/MOCK_DATA-2.json'

const isLoading = ref(true)
const showTableSkeleton = ref(true)
const items = ref([...data])
const topRows = ref([...data].slice(0, 1))
const fields = ref([
    {
        key: 'id',
        thClassList: 'table-col-right px-1 w-18',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'first_name',
        label: 'the first name',
        thClassList: 'table-col-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'last_name',
        thClassList: 'table-col-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'email',
        thClassList: 'table-col-left px-1',
        tdClassList: 'text-left px-1 w-15',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'share',
        thClassList: 'table-col-right px-1 w-15',
        tdClassList: 'text-right px-1 font-mono w-15',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold',
        formatter: number =>
            number
                ? (parseFloat(number) * 100).toLocaleString(navigator.language, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                  }) + '%'
                : number
    },
    {
        key: 'ip_address',
        thClassList: 'table-col-right px-1 w-45',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    }
])
</script>
