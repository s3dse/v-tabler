# PaginationComponent

The `PaginationComponent` provides a flexible and accessible pagination control for navigating through paged data sets. It supports custom labels, page size selection, and integration with table or list components.

## Features

- Page navigation (next, previous, first, last)
- Customizable labels and icons
- Page size selection (dropdown)
- Emits events for page and size changes
- Accessible keyboard navigation

## Props

| Prop                | Type          | Default    | Description                                      |
| ------------------- | ------------- | ---------- | ------------------------------------------------ |
| `maxVisibleButtons` | Number        | `5`        | The maximum number of visible pagination buttons |
| `totalPages`        | Number        | required   | The total number of pages                        |
| `totalEntries`      | Number        | required   | The total number of items                        |
| `perPage`           | Number        | required   | The number of items per page                     |
| `currentPage`       | Number        | required   | The currently visible page                       |
| `firstLabel`        | String/Number | `1`        | The label for the 'first' button                 |
| `lastLabel`         | String/Number | `''`       | The label for the 'last' button                  |
| `previousLabel`     | String`       | `Previous` | The label for the 'previous' button              |
| `nextLabel`         | String`       | `Next`     | The label for the 'next' button                  |

## Usage Example

```vue
<script setup>
import { ref } from 'vue'
const page = ref(1)
const pageSize = ref(10)
</script>
<PaginationComponent
    :totalPages="20"
    :totalEntries="200"
    :perPage="10"
    :previousLabel="<"
    :nextLabel=">"
    :fistLabel="|<"
    :lastLabel=">|"
    @page-changed="page => console.log('Showing page', page)"
></PaginationComponent>
```

## Events

- `page-changed`: Emitted when the page changes

## Accessibility

- Keyboard navigation for all controls

---

For advanced usage, see the source code in `packages/v-tabler/src/components/pagination/PaginationComponent.vue`.
