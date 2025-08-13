<template>
    <div class="card text-default">
        <TableComponent
            v-busy="busy"
            :title="'Remote Table Demo'"
            :fields="fields"
            :items="items"
            :remote-pagination="true"
            :total-items="totalItems"
            :per-page="perPage"
            @page-change="tableState => fetchRemoteData(tableState)"
            @per-page-change="tableState => fetchRemoteData(tableState)"
            @sort-change="tableState => fetchRemoteData(tableState)"
            @column-filter-change-debounced="tableState => fetchRemoteData(tableState)"
            @filter-change-debounced="tableState => fetchRemoteData(tableState)"
        />
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { fetchPaginatedData as setupMockApi } from '@/components/table/demo/mockApi'
const fetchPaginatedData = setupMockApi()

const busy = ref(false)
const items = ref([])
const totalItems = ref(0)
const perPage = ref(5)
const fields = ref([
    { key: 'id', type: 'numeric' },
    { key: 'name', type: 'text' },
    { key: 'value', type: 'numeric' },
    { key: 'date', type: 'date' },
    {
        key: 'status',
        type: 'text',
        filterType: 'select',
        filterOptions: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' }
        ]
    }
])

const fetchRemoteData = tableState => {
    console.log('Fetching remote data with state:', tableState)

    busy.value = true
    return fetchPaginatedData({
        ...tableState
    }).then(data => {
        items.value = data.items
        totalItems.value = data.totalItems
        busy.value = false
    })
}

onMounted(async () => {
    if (perPage.value) {
        await fetchRemoteData({
            page: 1,
            perPage: perPage.value,
            sort: {},
            columnFilters: new Map(),
            globalSearch: ''
        })
    }
})
</script>
