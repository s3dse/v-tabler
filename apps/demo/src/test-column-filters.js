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
            fields: [
                { 
                    key: 'id', 
                    label: 'ID', 
                    type: 'numeric',
                    thClassList: 'text-right',
                    tdClassList: 'text-right font-mono'
                },
                { 
                    key: 'name', 
                    label: 'Name',
                    filterType: 'text'
                },
                { 
                    key: 'age', 
                    label: 'Age',
                    type: 'numeric'
                },
                { 
                    key: 'department', 
                    label: 'Department',
                    filterType: 'select',
                    filterOptions: [
                        { value: 'Engineering', label: 'Engineering' },
                        { value: 'Design', label: 'Design' },
                        { value: 'Marketing', label: 'Marketing' }
                    ]
                },
                { 
                    key: 'salary', 
                    label: 'Salary',
                    type: 'numeric',
                    formatter: (value) => '$' + value.toLocaleString()
                },
                { 
                    key: 'startDate', 
                    label: 'Start Date',
                    filterType: 'date'
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
            <h1 class="text-3xl font-bold mb-6">Column Filtering Demo</h1>
            <p class="mb-4 text-gray-600">
                Click the filter icons next to column headers to apply filters:
            </p>
            <ul class="mb-6 text-sm text-gray-600 list-disc list-inside">
                <li><strong>ID & Age:</strong> Numeric filters (=, !=, >, >=, <, <=)</li>
                <li><strong>Name:</strong> Text search (contains)</li>
                <li><strong>Department:</strong> Select from predefined options</li>
                <li><strong>Salary:</strong> Numeric filters with currency formatting</li>
                <li><strong>Start Date:</strong> Date comparison filters</li>
            </ul>
            
            <TableComponent
                :items="items"
                :fields="fields"
                title="Employee Data with Column Filtering"
                :per-page="10"
                :enable-column-filters="true"
                @column-filter-change="onColumnFilterChange"
                @after-column-filter="onAfterColumnFilter"
            />
        </div>
    `
})

app.mount('#app')
