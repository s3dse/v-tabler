# v-tabler
A component library for Vue 3 using UnoCSS.
## Installation

Install the library via `npm install --save @s3_dse/v-tabler`.

In your `uno.config.js` import and install the preset:

```js
import { defineConfig, presetUno } from 'unocss'
import presetVTail '@s3_dse/v-tabler/preset'

export default defineConfig({
    presets: [presetUno(), presetVTail()]
})

```

Add the following to your entry point (e.g. `main.js`):
```js
import VTail from '@s3_dse/v-tabler'

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(VTail)

app.mount('#app')
```
# Components
## Table Component
A table that supports
* filtering
* pagination
* custom column and cell rendering
* fixed top row(s) (e.g. for comparisons)
* fixed bottom row(s) (e.g. for summaries)

## Usage
We will use the following lines to illustrate the usage of the table component:
```html
<template>
    <table-component
        title="A Table"
        :items="data"
        :top-rows="topRows"
        :bottom-rows="summaryRows"
        :fields="header"
        :paginate="true"
        :configurablePageSize="true"
        :per-page="5"
        @after-sort="afterSort"
        @after-page-change="afterPageChange"
        @after-filter="afterFilter"
        :pagination-previous-label="'<'"
        :pagination-next-label="'>'"
    >
        <template #cell(ip_address)="{ value }">
            <p class="tw-text-primary">{{ value }}</p>
        </template>
        <template #pagination-label="{ perPage, currentPage, totalEntries }">
            I am currently showing entries 
            {{ perPage * currentPage - perPage + 1 }} to
            {{ perPage * currentPage }} of {{ totalEntries }} entries.
        </template>
        <template #page-size-label="data">
            Current Page Size: {{ data.pageSize }}
        </template>
    </table-component>
</template>
<script>
export default {
    name: 'App',
    data() {
        return {
            data: [
                { id: 1, name: 'John Doe', share: 0.51, ip_address: '111.222.47.186', last_login: '2023-01-31' },
                { id: 2, name: 'Jane Doe', share: 0.08, ip_address: '71.190.227.13', last_login: '2023-04-10' }
            ],
            topRows: [
                { id: 3, name: 'Patricia Smith', share: 0.89, ip_address: '25.7.58.72', last_login: '2023-04-10'},
                { id: 4, name: 'Douglas Holland', share: 0.72, ip_address: '105.171.14.146', last_login: '2023-03-24'}
            ],
            bottomRows: [
                {id: 5, name: 'Jordan Winsley', share: 0.81, ip_address: '141.147.221.67', last_login: '2023-04-28'}
            ],
            fields: [
                { key: 'id' }, 
                { key: 'name' },
                { key: 'share',
                  thClassList: 'tw-text-right tw-px-2',
                  tdClassList: 'tw-text-right tw-px-2',
                  tdTopRowClassList: 'tw-text-right tw-px-2 tw-italic',
                  tdBottomRowClassList: 'tw-text-right tw-px-2 tw-font-semibold',
                  formatter: value =>
                          value
                              ? (parseFloat(value) * 100).toLocaleString(navigator.language, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2
                              }) + '%'
                              : ''
                }
                { key: 'ip_address',
                  thClassList: 'tw-text-center tw-px-2',
                  tdClassList: 'tw-text-center tw-px-2',
                  tdTopRowClassList: 'tw-text-center tw-px-2 tw-italic',
                  tdBottomRowClassList: 'tw-text-right tw-px-2 tw-font-semibold'
                }
            ]
        }
    }
}
</script>
<style>
@import '@s3_dse/v-tabler/v-tabler.css';
</style>
```

We pass the table data as an array of objects via the `:items` attribute. The same applies to the optional `:top-rows` and `:bottom-rows`. The entries of all three data arrays need to have the same structure. The `:fields` attribute takes an array of objects with details regarding the rendering of particular fields. Field entries have a `key` to refer to a data entry's property. The remaining field properties are metadata to customize the rendering of the column:
 * `thClassList`: classes for styling the column's `<th>` content (only applied to `:items` records)
 * `tdClassList`: classes for styling the column's `<td>` content (only applied to `:items` records)
 * `tdTopRowClassList`: classes for styling the column's `<td>` content (only applied to `:top-rows` records)
 * `tdBottomRowClassList`: classes for styling the column's `<td>` content (only applied to `:bottom-rows` records)
 * `formatter`: a function defining a formatting logic for the values of that field/column
 * `type`: Either `numeric` or `alphanumeric`, explicitly influences sort behaviour

Only those attributes present in the field array will be displayed in the resulting table.

### Pagination
The page navigation can be enabled/disabled via the `:paginate` attribute. This will toggle pagination in general. The page size configurator can be enabled/disabled via the `:configurable-page-size` attribute. Both these attributes take boolean values and are `true` by default. They are part of the above example only for illustration.

If the pagination is done outside of the component, e.g. server side pagination, you can provide `:remote-pagination="true"` and the number of total records via `:totalItems`. 

### Cell Rendering
The above example shows how to use the `#cell()` slot to customize the rendering of individual cells. The slot is dynamic and takes a field key as argument. It provides an object holding the actual cell `value`, the `item` (or record) of the `:items` array, and the `field` of the `:fields` array.

### Props
| Prop        | Description                                                                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| title       | Table title                                                                             |
| items       | The reccords to display. Required.                                                                                                            |
| fields     | Schema of the records.|
| totalItems  | The number of records across all pages. Only required if `remote-pagination` is`true`. .                                          |
| topRows     | Sticky records at the top. |
| bottomRows     | Sticky records at the bottom. |
| perPage     | The number of records displayed per page. Default is `5`. |
| configurablePageSize     | When `true` a dropdown control allows to select between page sizes. |
| pageSizes     | Array of page sizes to chose from. Default is `[5, 10, 25, 50]` |
| pageSizeButtonClassList    | Configure styling of page size button. String. |
| searchInputClassList    | Configure styling of search input. String. |
| paginate    | Whether pagination is enabled or not. |
| enableSearch    | Whether searching (filtering) within records is enabled or not. |
| searchPlaceholder    | The placeholder for the search input. Default is `'Search'`. |
| paginationPreviousLabel    | The label for the 'previous page' button |
| paginationNextLabel    | The label for the 'next page' button |
| fixed    | Whether the table has fixed layout or not. |
| remotePagination    | Whether the pagination is handeled outside of the component or not. If `true` the prop `totalItems` must be set. |
| filterDebounce    | Debounce interval in ms for the search (filter) input. Default is `250`. |
| filterMaxWait    | Max wait time in ms for the search (filter) input. Default is `2000`.|
| sortNullsFirst    | When `true` will sort `null\|undefined` first, when `false` will sort them last. Default value is `null` and causes a natural sort order, i.e `null\|undefined` will come first when sort direction is descending, `null\|undefined` will come last when sort direction is ascending. |

### Events
| Event | Description |
|-------|-------------|
| per-page-change | Emits the number of displayed items per page when it has changed. |
| page-change | Emits the current page number when it has changed.  |
| sort-change | Emits an object with sorting information, when data is sorted by a column. Example: `{ sortColumn: { key: 'column_a' }, ascending: false }` |
| filter-change | Emits the current search term when it has changed.  |
| filter-change-debounced | Emits the current search term when it was changed and a debounce interval was reached. Can help to avoid request spamming. |


### Credits
The component is heavily inspired by the Bootstrap Vue Table component. Have a look: https://github.com/bootstrap-vue/bootstrap-vue

## Dialog Component (Radix Vue)

A component for displaying modal dialogs. 
### Usage

```html
<script setup>
...
const validateAndSubmit = () => {
    const selection = document.querySelector('.custom-select').selectedOptions[0].innerText
    if (selection === 'a') {
        console.log('Error: Option "a" is not allowed!')
        return false
    } else {
        console.log('success')
        submitLogic()
        return true

    }

}
</script>
<template>
    ...
    <dialog-component title="Testing Dialog" description="A dialog..." @cancel="test" :pre-confirm="validateAndSubmit">
        <template #content>
            <div class="flex gap-4 flex-col text-gray-900 dark:text-gray-100 px-4 pt-3 pb-5">
                <div>Some content</div>
            </div>
            <select class="custom-select"><option>a</option><option>b</option></select>
        </template>
    </dialog-component>
</template>
```

#### Props
| Prop        | Description                                                                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| classes     | Object with styles keyed by component part. Optional. See styles.                                                                             |
| title       | The dialog title. Optional.                                                                                                                   |
| description | The dialog description. Optional.                                                                                                             |
| preConfirm  | The function to call before closing via confirmation (not cancellation). Returns `true` to continue confirmation, `false` to abort. Optional. |

#### Styling
The `classes` prop allows to modify the styling of the
* Dialog-Trigger
* Overlay
* Title
* Description
* Content Container.

E.g.
```js
<dialog-component :classes="{title: 'text-4xl text-green'}">
    ...
</dialog-component>
```

See the [default style map](/src/components/dialog/DialogComponent.vue#L15) for reference.

## Select Component (Radix Vue)
A component wrapping an HTML `select`.
### Usage
```html
<script setup>
import { ref } from 'vue'
import { SelectComponent } from '@/components'

const options = [
    { name: 'Record A', value: 'a' },
    { name: 'Record B', value: 'b' },
    { name: 'Record C', value: 'c' },
    { name: 'Record D', value: 'd' },
    { name: 'Record E', value: 'e' },
    { name: 'Record F', value: 'f' }
]

const selection = ref(options[0])
</script>
<template>
    <select-component
        v-model="selection"
        :options="options"
        label-key="name"
        aria-label="Select option"
    ></select-component>
    <div class="text-gray-900 dark:text-gray-100">{{ selection }}</div>
</template>

```

#### Props
| Prop        | Description                                                                                  |
|-------------|----------------------------------------------------------------------------------------------|
| classes     | Object with styles keyed by component part. Optional. See styles.                            |
| options     | Array of options (complex or primitive). Required.                                           |
| labelKey    | A key (String) to access the label property of an option. Optional.                          |
| placeholder | A placeholder (String) when there is no default selection given. Default: 'Select option'.   |
| modelValue  | The value (String\|Boolean\|Number\|Object) holding the currently selected option. Optional. |

#### Styling
The trigger widget is styled via plain HTML attributes on the component. Additionally, the `classes` prop allows to modify the styling of the
* trigger
* content container
* item.

E.g.

```html
<select-component
        v-model="selection"
        :options="options"
        label-key="name"
        aria-label="Select option"
        class="w-full"
        :classes="{trigger: 'bg-green-400'}"
    ></select-component>
```

## Pagination Component
## Dropdown Component
# Theme Customization
The preset accepts a theme as argument. It allows for configuring/overriding the default theme:
```js
// in your uno.config.js
const myCustomColors = {
    superBlue: {...},
    customYellow: {...},
    moon: {...}
}

export default defineConfig({
    presets: [
        presetUno(), 
        presetVTail({ colors: ...myCustomColors })
    ]
})

```
# License
MIT License

Copyright (c) 2023 Sebastian Doerl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.