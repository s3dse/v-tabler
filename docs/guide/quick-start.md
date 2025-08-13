# Quick Start

## Basic Table Example

Here's a simple example to get you started with the TableComponent:

```vue
<template>
    <div>
        <h1>My Data Table</h1>
        <TableComponent
            :items="users"
            :fields="fields"
            title="User Management"
            :per-page="5"
            enable-search
            enable-column-filters
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { TableComponent } from '@s3_dse/v-tabler'

const users = ref([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', salary: 75000 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', salary: 65000 },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Manager', salary: 85000 },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'User', salary: 55000 }
])

const fields = ref([
    {
        key: 'name',
        label: 'Full Name',
        sortable: true,
        thClassList: 'table-col-left'
    },
    {
        key: 'email',
        label: 'Email Address',
        sortable: true
    },
    {
        key: 'role',
        label: 'Role',
        type: 'select',
        sortable: true
    },
    {
        key: 'salary',
        label: 'Salary',
        type: 'number',
        sortable: true,
        thClassList: 'table-col-right',
        formatter: value => `$${value.toLocaleString()}`
    }
])
</script>
```

## Key Features Demonstrated

### 1. **Column Filtering**

- Set `enable-column-filters` to enable advanced filtering
- Supports text, select, and numeric filters
- Automatic filter type detection based on field type

### 2. **Column Alignment**

- Use UnoCSS shortcuts: `table-col-left`, `table-col-center`, `table-col-right`
- Applied via `thClassList` property on field configuration

### 3. **Data Formatting**

- Use the `formatter` function to customize value display
- Maintains original data for sorting and filtering

### 4. **Responsive Design**

- Tables automatically handle overflow with horizontal scrolling
- Mobile-friendly pagination controls

## Card Component Example

```vue
<template>
    <CardComponent title="Dashboard Stats" subtitle="Last 30 days">
        <template #actions>
            <button class="btn-primary-sm">Refresh</button>
        </template>

        <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
                <div class="text-2xl font-bold">1,234</div>
                <div class="text-sm text-gray-600">Total Users</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold">5,678</div>
                <div class="text-sm text-gray-600">Total Orders</div>
            </div>
        </div>
    </CardComponent>
</template>

<script setup>
import { CardComponent } from '@s3_dse/v-tabler'
</script>
```

## Next Steps

- [Learn about all available components](/components/)
- [Configure your project](/guide/configuration)
- [Explore advanced table features](/components/table-component)
