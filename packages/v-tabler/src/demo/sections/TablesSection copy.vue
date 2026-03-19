<template>
    <div class="text-default">
        <heading tag="h1">Tables</heading>
        <p>Examples of table components and their features.</p>
        <card-component class="my-4">
            <loading-overlay :show="tableStatus.busy">
                <table-component
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
                    <template #pagination-label="{ perPage, currentPage, totalEntries }">
                        Einträge {{ (currentPage - 1) * perPage + 1 }} -
                        {{ currentPage * perPage }} von {{ totalEntries }}
                    </template>
                </table-component>
            </loading-overlay>
        </card-component>
        <card-component class="my-4">
            <loading-overlay :show="tableStatus.busy">
                <table-component
                    :items="[]"
                    :fields="fields"
                    :top-rows="[]"
                    title="Empty Table"
                    class="w-[100%] bg-surface text-inverted"
                >
                    <template #title><div class="card-title text-default!">XYZ</div></template>
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
            </loading-overlay>
        </card-component>

        <!-- Column Filtering Demo -->
        <card-component class="my-4">
            <loading-overlay :show="tableStatus.busy">
                <table-component
                    :items="columnFilterDemoData"
                    :fields="columnFilterDemoFields"
                    title="Column Filtering Demo"
                    class="w-[100%] bg-surface text-inverted"
                    :enable-column-filters="true"
                    @column-filter-change="handleColumnFilterChange"
                    @after-column-filter="handleAfterColumnFilter"
                >
                    <template #cell(status)="{ value }">
                        <span
                            :class="{
                                'text-green-500 dark:text-green-400': value === 'Active',
                                'text-red-600 dark:text-red-400': value === 'Inactive'
                            }"
                        >
                            {{ value }}
                        </span>
                    </template>
                </table-component>
            </loading-overlay>
        </card-component>
        <!-- Column Filtering Demo With Customized Fields -->
        <card-component class="my-4">
            <loading-overlay :show="tableStatus.busy">
                <table-component
                    :items="columnFilterDemoData"
                    :fields="columnFilterDemoFieldsCustomized"
                    title="Column Filtering Demo With Customized Field-I18N"
                    class="w-[100%] bg-surface text-inverted"
                    :enable-column-filters="true"
                    @column-filter-change="handleColumnFilterChange"
                    @after-column-filter="handleAfterColumnFilter"
                >
                    <template #cell(status)="{ value }">
                        <span
                            :class="{
                                'text-green-500 dark:text-green-400': value === 'Active',
                                'text-red-600 dark:text-red-400': value === 'Inactive'
                            }"
                        >
                            {{ value }}
                        </span>
                    </template>
                </table-component>
            </loading-overlay>
        </card-component>
        <RemoteTableDemo />
    </div>
</template>
<script setup>
import { ref } from 'vue'
import RemoteTableDemo from '../components/RemoteTableDemo.vue'
import data from '../assets/MOCK_DATA-2.json'

const nullRecord = {
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    share: null,
    ip_address: null
}
const items = ref([...data, nullRecord])
const topRows = ref([...data].slice(0, 1))

// Sample data for column filtering demo
const columnFilterDemoData = ref([
    {
        id: 1,
        name: 'Alice Johnson',
        department: 'Engineering',
        salary: 75000,
        hire_date: '2023-01-15',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Bob Smith',
        department: 'Marketing',
        salary: 65000,
        hire_date: '2022-03-20',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Carol Davis',
        department: 'Engineering',
        salary: 85000,
        hire_date: '2021-07-10',
        status: 'Active'
    },
    {
        id: 4,
        name: 'David Wilson',
        department: 'Sales',
        salary: 55000,
        hire_date: '2023-05-01',
        status: 'Inactive'
    },
    {
        id: 5,
        name: 'Eva Brown',
        department: 'HR',
        salary: 70000,
        hire_date: '2020-11-25',
        status: 'Active'
    },
    {
        id: 6,
        name: 'Frank Miller',
        department: 'Engineering',
        salary: 95000,
        hire_date: '2019-02-14',
        status: 'Active'
    },
    {
        id: 7,
        name: 'Grace Lee',
        department: 'Marketing',
        salary: 60000,
        hire_date: '2023-08-30',
        status: 'Active'
    },
    {
        id: 8,
        name: 'Henry Taylor',
        department: 'Sales',
        salary: 52000,
        hire_date: '2022-12-05',
        status: 'Inactive'
    },
    {
        id: 9,
        name: 'Ivy Chen',
        department: 'Engineering',
        salary: 80000,
        hire_date: '2021-04-18',
        status: 'Active'
    },
    {
        id: 10,
        name: 'Jack Robinson',
        department: 'HR',
        salary: 65000,
        hire_date: '2020-09-12',
        status: 'Active'
    }
])

const columnFilterDemoFields = ref([
    {
        key: 'id',
        label: 'ID',
        type: 'numeric',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2 font-mono',
        filterable: false
    },
    {
        key: 'name',
        label: 'Employee Name',
        filterType: 'text',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'department',
        label: 'Department',
        filterType: 'select',
        filterOptions: [
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Sales', label: 'Sales' },
            { value: 'HR', label: 'Human Resources' }
        ],
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'salary',
        label: 'Salary',
        type: 'numeric',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: value => (value ? `$${value.toLocaleString()}` : '-')
    },
    {
        key: 'hire_date',
        label: 'Hire Date',
        filterType: 'date',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'status',
        label: 'Status',
        filterType: 'select',
        filterOptions: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }
        ],
        thClassList: 'table-col-center px-2',
        tdClassList: 'text-center px-2'
    }
])
const columnFilterDemoFieldsCustomized = ref([
    {
        key: 'id',
        label: 'ID',
        type: 'numeric',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2 font-mono',
        filterable: false
    },
    {
        key: 'name',
        label: 'Employee Name',
        filterType: 'text',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'department',
        label: 'Department',
        filterType: 'select',
        filterOptions: [
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Sales', label: 'Sales' },
            { value: 'HR', label: 'Human Resources' }
        ],
        i18n: {
            placeholder: 'Search departments...',
            noSelectionText: 'Choose departments...',
            singleSelectionTextFn: value => `Selected: ${value}`,
            multipleSelectionTextFn: count =>
                `${count} department${count !== 1 ? 's' : ''} selected`
        },
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'salary',
        label: 'Salary',
        type: 'numeric',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: value => (value ? `$${value.toLocaleString()}` : '-')
    },
    {
        key: 'hire_date',
        label: 'Hire Date',
        filterType: 'date',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'status',
        label: 'Status',
        filterType: 'select',
        filterOptions: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }
        ],
        i18n: {
            placeholder: 'Filter by status...',
            noSelectionText: 'All statuses',
            singleSelectionTextFn: value => value,
            multipleSelectionTextFn: count => `${count} status${count !== 1 ? 'es' : ''}`
        },
        thClassList: 'table-col-center px-2',
        tdClassList: 'text-center px-2'
    }
])
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
const tableStatus = ref({ busy: false })

const handleColumnFilterChange = event => {
    console.log('Column filter changed:', event)
}

const handleAfterColumnFilter = event => {
    console.log('Active column filters:', event.activeFilters)
    console.log('Total active filters:', Object.keys(event.activeFilters).length)
}
</script>
