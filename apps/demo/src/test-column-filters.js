import { createApp } from 'vue'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { TableComponent } from '@s3_dse/v-tabler'

const app = createApp({
    components: {
        TableComponent
    },
    data() {
        return {
            items: [
                { id: 1, name: 'John Doe', age: 30, department: 'Engineering', salary: 80000, startDate: '2022-01-15' },
                { id: 2, name: 'Jane Smith', age: 25, department: 'Design', salary: 70000, startDate: '2023-03-20' },
                { id: 3, name: 'Bob Wilson', age: 35, department: 'Engineering', salary: 90000, startDate: '2021-08-10' },
                { id: 4, name: 'Alice Brown', age: 28, department: 'Marketing', salary: 65000, startDate: '2023-01-05' },
                { id: 5, name: 'Charlie Davis', age: 32, department: 'Engineering', salary: 85000, startDate: '2022-11-12' },
                { id: 6, name: 'Eva Martinez', age: 27, department: 'Design', salary: 72000, startDate: '2023-02-28' },
            ],
            // i18n functions for filter labels
            singleSelectionTextFn: (value) => `Selected: ${value}`,
            multipleSelectionTextFn: (count) => `${count} items chosen`,
            fields: [
                { 
                    key: 'id', 
                    label: 'ID', 
                    type: 'numeric',
                    thClassList: 'table-col-right',
                    tdClassList: 'text-right font-mono'
                },
                { 
                    key: 'name', 
                    label: 'Name',
                    filterType: 'text',
                    thClassList: 'table-col-left',
                    tdClassList: 'text-left'
                },
                { 
                    key: 'age', 
                    label: 'Age',
                    type: 'numeric',
                    thClassList: 'table-col-center',
                    tdClassList: 'text-center'
                },
                { 
                    key: 'department', 
                    label: 'Department',
                    filterType: 'select',
                    filterOptions: [
                        { value: 'Engineering', label: 'Engineering' },
                        { value: 'Design', label: 'Design' },
                        { value: 'Marketing', label: 'Marketing' }
                    ],
                    thClassList: 'table-col-left',
                    tdClassList: 'text-left'
                },
                { 
                    key: 'salary', 
                    label: 'Salary',
                    type: 'numeric',
                    formatter: (value) => '$' + value.toLocaleString(),
                    thClassList: 'table-col-right',
                    tdClassList: 'text-right'
                },
                { 
                    key: 'startDate', 
                    label: 'Start Date',
                    filterType: 'date',
                    thClassList: 'table-col-center',
                    tdClassList: 'text-center'
                }
            ]
        }
    },
    methods: {
        onColumnFilterChange(event) {
            console.log('Column filter changed:', event)
        },
        onAfterColumnFilter(event) {
            console.log('After column filter:', event)
        }
    },
    template: `
        <div class="p-8">
            <h1 class="text-3xl font-bold mb-6">Column Filtering & Alignment Demo</h1>
            <p class="mb-4 text-gray-600">
                This demo shows both column filtering and the new table column alignment shortcuts. 
                Click the filter icons next to column headers to apply filters. 
                When multiple filters are active, use "Clear All Filters" to reset them all at once.
            </p>
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Column Features:</h3>
                <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>ID:</strong> Numeric filters + Right-aligned (<code>table-col-right</code>)</li>
                    <li><strong>Name:</strong> Text search + Left-aligned (<code>table-col-left</code>)</li>
                    <li><strong>Age:</strong> Numeric filters + Center-aligned (<code>table-col-center</code>)</li>
                    <li><strong>Department:</strong> Select from options + Left-aligned (<code>table-col-left</code>)</li>
                    <li><strong>Salary:</strong> Numeric filters with currency formatting + Right-aligned (<code>table-col-right</code>)</li>
                    <li><strong>Start Date:</strong> Date comparison filters + Center-aligned (<code>table-col-center</code>)</li>
                </ul>
            </div>
            
            <TableComponent
                :items="items"
                :fields="fields"
                title="Employee Data with Column Filtering"
                :per-page="10"
                :enable-column-filters="true"
                select-filter-placeholder="Type to search..."
                select-filter-no-selection-text="Choose values..."
                :select-filter-single-selection-text-fn="singleSelectionTextFn"
                :select-filter-multiple-selection-text-fn="multipleSelectionTextFn"
                @column-filter-change="onColumnFilterChange"
                @after-column-filter="onAfterColumnFilter"
            />
        </div>
    `
})

app.mount('#app')
