# TableComponent

A comprehensive, feature-rich Vue 3 table component with built-in pagination, sorting, filtering, and customizable styling. The TableComponent is designed to handle both local and remote data with support for custom row types and extensive slot-based customization.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)
- [Field Configuration](#field-configuration)
  - [Required Field Properties](#required-field-properties)
  - [Optional Field Properties](#optional-field-properties)
  - [Column Alignment Shortcuts](#column-alignment-shortcuts)
  - [Field i18n Configuration](#field-i18n-configuration)
  - [Filter Type Auto-Detection](#filter-type-auto-detection)
- [Examples](#examples)
- [Advanced Features](#advanced-features)

## Installation

```javascript
import { TableComponent } from '@/components/table'
```

## DEMO
<script setup>
  import { ref } from 'vue'
import { TableComponent, CardComponent } from '@s3_dse/v-tabler'

const tableData = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
])

const fieldDefinitions = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' }
])
</script>

<iframe data-why width="100%" height="250">
<CardComponent>
  <TableComponent :items="tableData" :fields="fieldDefinitions" />
  </CardComponent>
</iframe>

## Basic Usage

```vue
<template>
  <TableComponent
    :items="tableData"
    :fields="fieldDefinitions"
    title="My Data Table"
    :per-page="10"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TableComponent } from '@/components/table'

const tableData = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
])

const fieldDefinitions = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' }
])
</script>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `Array` | The array of data objects to display in the table |
| `fields` | `Array` | Column definitions array. Each field must have a `key` property |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `String` | `undefined` | Optional title displayed above the table |
| `totalItems` | `Number` | `undefined` | Total number of items (required for remote pagination) |
| `topRows` | `Array` | `[]` | Special rows displayed at the top of the table (e.g., summary rows) |
| `bottomRows` | `Array` | `[]` | Special rows displayed at the bottom of the table (e.g., totals) |
| `perPage` | `Number` | `5` | Number of items to display per page |
| `configurablePageSize` | `Boolean` | `true` | Whether users can change the page size |
| `pageSizes` | `Array` | `[5, 10, 25, 50]` | Available page size options |
| `pageSizeButtonClassList` | `String` | `'btn-transparent-default table-top-control'` | CSS classes for page size buttons |
| `searchInputClassList` | `String` | `'form-inputfield-sm text-default'` | CSS classes for search input field |
| `paginate` | `Boolean` | `true` | Whether to enable pagination |
| `enableSearch` | `Boolean` | `true` | Whether to enable the search functionality |
| `searchPlaceholder` | `String` | `'Search'` | Placeholder text for the search input |
| `paginationPreviousLabel` | `String` | `'Previous'` | Custom label for the previous page button (inherits from PaginationComponent) |
| `paginationNextLabel` | `String` | `'Next'` | Custom label for the next page button (inherits from PaginationComponent) |
| `fixed` | `Boolean` | `false` | Whether to use fixed table layout with word wrapping |
| `remotePagination` | `Boolean` | `false` | Whether pagination is handled remotely |
| `filterDebounce` | `Number` | `250` | Debounce delay in milliseconds for filter operations |
| `filterMaxWait` | `Number` | `2000` | Maximum wait time in milliseconds for filter debouncing |
| `sortNullsFirst` | `Boolean` | `null` | Whether to sort null values first (null = auto-detect based on sort direction) |
| `enableColumnFilters` | `Boolean` | `true` | Whether to show column filter buttons in table headers |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `per-page-change` | `Number` | Emitted when the page size changes |
| `sort-change` | `Object` | Emitted when sorting changes. Payload: `{ column, ascending }` |
| `after-sort` | `Object` | Emitted after sorting is complete |
| `page-change` | `Number` | Emitted when the current page changes |
| `after-page-change` | `Object` | Emitted after page change. Payload: `{ oldPage, newPage }` |
| `filter-change` | `String` | Emitted immediately when filter text changes |
| `filter-change-debounced` | `String` | Emitted after debounced filter change |
| `after-filter` | `Object` | Emitted after filtering is complete. Payload: `{ searchTerm }` |
| `column-filter-change` | `Object` | Emitted when a column filter changes. Payload: `{ field, filter }` |
| `after-column-filter` | `Object` | Emitted after column filtering is complete. Payload: `{ field, filter, activeFilters }` |

## Slots

### Named Slots

| Slot Name | Description | Slot Props |
|-----------|-------------|------------|
| `title` | Custom title content | None |
| `page-size-label` | Custom page size label | `{ pageSize }` |
| `table-top-controls` | Additional controls in the table header | Table state object |
| `table-bottom-controls` | Additional controls in the table footer | Table state object |
| `pagination-label` | Custom pagination label | `{ perPage, currentPage, totalEntries }` |
| `th(${fieldKey})` | Custom header cell content | `{ field, column }` |
| `cell(${fieldKey})` | Custom cell content | `{ value, unformatted, item, field, index }` |

### Dynamic Slots

The component automatically generates slots for each field:
- **Header slots**: `th(${field.key})` - Customize column headers
- **Cell slots**: `cell(${field.key})` - Customize cell content

## Field Configuration

Fields are defined as objects in the `fields` prop array. Each field object supports the following properties:

### Required Field Properties

| Property | Type | Description |
|----------|------|-------------|
| `key` | `String` | The property key in the data object |

### Optional Field Properties

| Property | Type | Description |
|----------|------|-------------|
| `label` | `String` | Display label for the column header (defaults to key) |
| `visible` | `Boolean` | Whether the column is visible (default: `true`) |
| `formatter` | `Function` | Function to format cell values: `(value) => formattedValue` |
| `thClassList` | `String` | CSS classes for the header cell. Use `table-col-left`, `table-col-right`, or `table-col-center` for column alignment |
| `tdClassList` | `String` | CSS classes for regular data cells |
| `tdTopRowClassList` | `String` | CSS classes for top row cells |
| `tdBottomRowClassList` | `String` | CSS classes for bottom row cells |
| `type` | `String` | Data type for filtering and sorting (`'numeric'`, `'date'`, `'text'`) |
| `filterType` | `String` | Override auto-detected filter type (`'numeric'`, `'date'`, `'text'`, `'select'`) |
| `filterOptions` | `Array` | Options for select filter: `[{ value, label }]` |
| `i18n` | `Object` | Internationalization settings for column filters (see [Field i18n Configuration](#field-i18n-configuration)) |

### Column Alignment Shortcuts

The v-tabler theme provides dedicated UnoCSS shortcuts for consistent column alignment:

| Shortcut | CSS Classes | Use Case |
|----------|-------------|----------|
| `table-col-left` | `justify-start text-left` | Left-align content (names, descriptions) |
| `table-col-right` | `justify-end text-right` | Right-align content (numbers, currency, IDs) |
| `table-col-center` | `justify-center text-center` | Center-align content (status, badges) |

These shortcuts should be used in `thClassList` for header alignment and corresponding `text-*` classes in `tdClassList` for body cell alignment.

### Field i18n Configuration

The `i18n` field property allows you to customize internationalization settings for column filters on a per-field basis. This is particularly useful for select filters where you want to customize the placeholder text, selection display text, and other filter-specific labels.

#### i18n Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `String` | `'Search options...'` | Placeholder text for the filter input field |
| `noSelectionText` | `String` | `'Select values...'` | Text displayed when no items are selected |
| `singleSelectionTextFn` | `Function` | `(value) => value` | Function to format the display text for single selections |
| `multipleSelectionTextFn` | `Function` | `(count) => \`${count} selected\`` | Function to format the display text for multiple selections |

#### Example i18n Configuration

```javascript
const fields = [
  {
    key: 'department',
    label: 'Department',
    filterType: 'select',
    filterOptions: [
      { value: 'eng', label: 'Engineering' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' }
    ],
    i18n: {
      placeholder: 'Search departments...',
      noSelectionText: 'Choose departments...',
      singleSelectionTextFn: (value) => `Selected: ${value}`,
      multipleSelectionTextFn: (count) => `${count} departments selected`
    }
  },
  {
    key: 'status',
    label: 'Status',
    filterType: 'select',
    filterOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    i18n: {
      placeholder: 'Filter by status...',
      noSelectionText: 'All statuses',
      singleSelectionTextFn: (value) => `Status: ${value}`,
      multipleSelectionTextFn: (count) => `${count} statuses`
    }
  }
]
```

#### Global i18n Fallbacks

If field-level `i18n` settings are not provided, the component will fall back to built-in default values:

- **placeholder**: `'Search options...'`
- **noSelectionText**: `'Select values...'`
- **singleSelectionTextFn**: `(value) => value`
- **multipleSelectionTextFn**: `(count) => \`${count} selected\``

This provides consistent behavior across all select filters while still allowing field-specific customization when needed.

### Filter Type Auto-Detection

The TableComponent includes an auto-detection for column filter types. When `filterType` is not explicitly specified, the component analyzes the data to determine the most appropriate filter type.

#### Detection Rules

1. **Numeric**: All sampled values are valid numbers
2. **Select**: Limited unique values (≤10 unique in sample, <50% cardinality)
3. **Date**: All values match date patterns and are valid dates
4. **Text**: Default fallback for all other cases

#### Performance Considerations

- Auto-detection only samples the first 10 rows by default
- High cardinality data (>50 unique values) falls back to text filters
- Explicit `filterType` configuration bypasses auto-detection and improves performance

### Example Field Configuration

```javascript
const fields = [
  {
    key: 'id',
    label: 'ID',
    thClassList: 'table-col-right',
    tdClassList: 'text-right font-mono'
  },
  {
    key: 'name',
    label: 'Full Name',
    thClassList: 'table-col-left',
    tdClassList: 'text-left'
  },
  {
    key: 'share',
    label: 'Share %',
    thClassList: 'table-col-right',
    tdClassList: 'text-right',
    formatter: (value) => {
      return value ? (parseFloat(value) * 100).toFixed(2) + '%' : '-'
    }
  }
]
```

## Examples

### Basic Table with Custom Formatting

```vue
<template>
  <TableComponent
    :items="users"
    :fields="userFields"
    title="User Management"
    :per-page="10"
    @sort-change="handleSort"
  >
    <template #cell(status)="{ value }">
      <span 
        :class="{
          'text-green-600': value === 'active',
          'text-red-600': value === 'inactive'
        }"
      >
        {{ value.toUpperCase() }}
      </span>
    </template>
  </TableComponent>
</template>

<script setup>
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
])

const userFields = [
  { key: 'id', label: 'ID', tdClassList: 'font-mono' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
]

const handleSort = ({ column, ascending }) => {
  console.log(`Sorting by ${column.key} ${ascending ? 'ASC' : 'DESC'}`)
}
</script>
```

### Remote Data with Pagination

```vue
<template>
  <TableComponent
    :items="tableData"
    :fields="fields"
    :total-items="totalCount"
    :per-page="pageSize"
    remote-pagination
    @page-change="loadPage"
    @sort-change="handleSort"
    @filter-change-debounced="handleFilter"
  />
</template>

<script setup>
const tableData = ref([])
const totalCount = ref(0)
const pageSize = ref(10)

const loadPage = async (page) => {
  const response = await fetchData({ page, size: pageSize.value })
  tableData.value = response.data
  totalCount.value = response.total
}

const handleSort = async ({ column, ascending }) => {
  const response = await fetchData({ 
    sort: column.key, 
    direction: ascending ? 'asc' : 'desc' 
  })
  tableData.value = response.data
}

const handleFilter = async (searchTerm) => {
  const response = await fetchData({ search: searchTerm })
  tableData.value = response.data
  totalCount.value = response.total
}
</script>
```

### Table with Custom Filter i18n

```vue
<template>
  <TableComponent
    :items="employeeData"
    :fields="employeeFields"
    title="Employee Directory"
    enable-column-filters
  />
</template>

<script setup>
const employeeData = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    department: 'Engineering', 
    status: 'active',
    salary: 75000 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    department: 'Marketing', 
    status: 'active',
    salary: 65000 
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    department: 'Sales', 
    status: 'inactive',
    salary: 55000 
  }
])

const employeeFields = [
  { 
    key: 'id', 
    label: 'ID',
    thClassList: 'table-col-right',
    tdClassList: 'text-right font-mono'
  },
  { 
    key: 'name', 
    label: 'Employee Name',
    thClassList: 'table-col-left',
    tdClassList: 'text-left'
  },
  {
    key: 'department',
    label: 'Department',
    filterType: 'select',
    filterOptions: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' }
    ],
    i18n: {
      placeholder: 'Search departments...',
      noSelectionText: 'All departments',
      singleSelectionTextFn: (value) => `Dept: ${value}`,
      multipleSelectionTextFn: (count) => `${count} departments`
    }
  },
  {
    key: 'status',
    label: 'Status',
    filterType: 'select',
    filterOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    i18n: {
      placeholder: 'Filter status...',
      noSelectionText: 'Any status',
      singleSelectionTextFn: (value) => `Status: ${value.toUpperCase()}`,
      multipleSelectionTextFn: (count) => `${count} selected`
    }
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'numeric',
    thClassList: 'table-col-right',
    tdClassList: 'text-right',
    formatter: (value) => `$${value.toLocaleString()}`
  }
]
</script>
```

### Table with Summary Rows

```vue
<template>
  <TableComponent
    :items="salesData"
    :fields="salesFields"
    :top-rows="summaryRows"
    :bottom-rows="totalRows"
    title="Sales Report"
  >
    <template #cell(amount)="{ value, rowType }">
      <span :class="{ 'font-bold': rowType !== 'regular' }">
        ${{ value.toLocaleString() }}
      </span>
    </template>
  </TableComponent>
</template>

<script setup>
const salesData = ref([
  { product: 'Widget A', amount: 1000, quantity: 10 },
  { product: 'Widget B', amount: 2000, quantity: 20 }
])

const summaryRows = ref([
  { product: 'Average', amount: 1500, quantity: 15 }
])

const totalRows = ref([
  { product: 'Total', amount: 3000, quantity: 30 }
])

const salesFields = [
  { 
    key: 'product', 
    label: 'Product',
    tdTopRowClassList: 'italic text-gray-600',
    tdBottomRowClassList: 'font-bold'
  },
  { 
    key: 'amount', 
    label: 'Amount',
    tdClassList: 'text-right',
    tdTopRowClassList: 'text-right italic text-gray-600',
    tdBottomRowClassList: 'text-right font-bold'
  },
  { 
    key: 'quantity', 
    label: 'Quantity',
    tdClassList: 'text-right',
    tdTopRowClassList: 'text-right italic text-gray-600',
    tdBottomRowClassList: 'text-right font-bold'
  }
]
</script>
```

## Advanced Features

### Custom Controls

Add custom controls to the table header or footer:

```vue
<template>
  <TableComponent :items="data" :fields="fields">
    <template #table-top-controls>
      <button class="btn-primary" @click="exportData">
        Export CSV
      </button>
    </template>
    
    <template #table-bottom-controls>
      <div class="text-sm text-gray-600">
        Last updated: {{ lastUpdated }}
      </div>
    </template>
  </TableComponent>
</template>
```

### Fixed Table Layout

For consistent column widths and better performance with large datasets:

```vue
<template>
  <TableComponent
    :items="data"
    :fields="fields"
    :fixed="true"
  />
</template>
```

### Custom Pagination Labels

```vue
<template>
  <TableComponent :items="data" :fields="fields">
    <template #pagination-label="{ perPage, currentPage, totalEntries }">
      Showing {{ (currentPage - 1) * perPage + 1 }} to 
      {{ Math.min(currentPage * perPage, totalEntries) }} 
      of {{ totalEntries }} entries
    </template>
    
    <template #page-size-label="{ pageSize }">
      Items per page: {{ pageSize }}
    </template>
  </TableComponent>
</template>
```

## Styling and Theming

- Field-specific class lists (`thClassList`, `tdClassList`, etc.)
- Component-level class props (`searchInputClassList`, `pageSizeButtonClassList`)
- CSS custom properties for deeper customization
