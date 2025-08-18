<script setup>
import data from './assets/MOCK_DATA-2.json'
import TestOne from './components/TestOne.vue'
import TestTwo from './components/TestTwo.vue'
import { ref } from 'vue'
import RemoteTableDemo from './components/RemoteTableDemo.vue'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
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

const logItem = item => {
    console.log(item)
}

// Column filter event handlers
const handleColumnFilterChange = event => {
    console.log('Column filter changed:', event)
}

const handleAfterColumnFilter = event => {
    console.log('Active column filters:', event.activeFilters)
    console.log('Total active filters:', Object.keys(event.activeFilters).length)
}
const test = () => console.log('test')
const validateAndSubmit = () => {
    const selection = document.querySelector('.custom-select').selectedOptions[0].innerText
    if (selection === 'a') {
        console.log('error')
        return false
    } else {
        console.log('success')
        return true
    }
}

const isLoading = ref(true)

const tab1 = {
    id: 'a',
    label: 'First Tab',
    help: '<p>This is a test!!! And it should work!<p>',
    component: TestOne,
    props: { message: 'testOne' }
}
const tab2 = { id: 'b', label: 'Second Tab', component: TestTwo, props: { message: 'testTwo' } }
const tabs = [tab1, tab2]

const listSelectOptions = [...new Array(99999).keys()].map(k => ({
    id: k + 1,
    name: `option ${k + 1}`
}))
listSelectOptions.unshift({
    id: 0,
    name: 'first option is a very long name that should be displayed'
})

const listSelectionMultiple = ref([])
const listSelectionSingle = ref([])

const singleSelectOptions = [
    { name: 'Record A', value: 'a' },
    { name: 'Record B', value: 'b' },
    { name: 'Record C', value: 'c' },
    { name: 'Record D', value: 'd' },
    { name: 'Record E', value: 'e' },
    { name: 'Record F', value: 'f' }
]
const singleSelectValue = ref(singleSelectOptions[0])

const multiSelectOptions = [
    { name: 'Record A', value: 'a' },
    { name: 'Record B', value: 'b' },
    { name: 'Record C', value: 'c' },
    { name: 'Record D', value: 'd' },
    { name: 'Record E', value: 'e' },
    { name: 'Record F', value: 'f' },
    { name: 'All Records', value: 'all' }
]
const multiSelectValue = ref([multiSelectOptions[0], multiSelectOptions[1]])

const dropdownModel = ref(null)

const singleChecked = ref(false)
const checkableNames = ['Checkbox 1', 'Checkbox 2', 'Checkbox 3']
const checkedValues = ref([])

const fieldVisibility = ref([
    {
        key: 'id',
        visible: true
    },
    { key: 'first_name', visible: true },
    { key: 'last_name', visible: true }
])

const showTableSkeleton = ref(true)
</script>

<template>
    <PageTitle tag="h1">Theme & Components</PageTitle>
    <CollapsibleCard class="my-4" heading="Buttons">
        <div class="p-4 flex flex-col gap-2">
            <h1 class="header-2 text-default">Basic Buttons</h1>
            <pre class="text-default text-base">btn-base-(sm|md|lg|default)</pre>
            <div class="flex flex-row gap-8">
                <button class="btn-base-sm">Base SM</button>
                <button class="btn-base-md">Base MD</button>
                <button class="btn-base-lg">Base LG</button>
                <button class="btn-base-default">Base Default</button>
            </div>
            <div class="flex flex-row gap-8 pb-4">
                <button disabled class="btn-base-sm">Base SM</button>
                <button disabled class="btn-base-md">Base MD</button>
                <button disabled class="btn-base-lg">Base LG</button>
                <button disabled class="btn-base-default">Base Default</button>
            </div>
            <h3 class="header-2 text-default">Primary Buttons</h3>
            <pre class="text-default text-base">btn-primary-(sm|md|lg|default)</pre>
            <div class="flex flex-row gap-8">
                <button class="btn-primary-sm">Primary SM</button>
                <button class="btn-primary-md">Primary MD</button>
                <button class="btn-primary-lg">Primary LG</button>
                <button class="btn-primary-default">Primary Default</button>
            </div>
            <button class="btn-primary-formfield rounded">Primary FormField</button>
            <div class="flex flex-row gap-8">
                <button class="btn-primary-sm" disabled>Primary SM</button>
                <button class="btn-primary-md" disabled>Primary MD</button>
                <button class="btn-primary-lg" disabled>Primary LG</button>
                <button class="btn-primary-default" disabled>Primary Default</button>
            </div>
            <button class="btn-primary-formfield rounded" disabled>Primary FormField</button>
        </div>
    </CollapsibleCard>

    <CollapsibleCard class="my-4">
        <template #header>
            <Heading tag="h2">Busy Indicators</Heading>
        </template>
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
    </CollapsibleCard>

    <CollapsibleCard class="my-4" heading="Dialogs and Dropdowns">
        <div class="p-4">
            <div class="flex flex-row gap-4">
                <action-dropdown-component
                    :options="['a', 'b']"
                    up-icon=""
                    down-icon=""
                    @on-select="logItem"
                    class="w-15 h-full rounded-sm hover:cursor-pointer"
                >
                    <template #toggle-label>
                        <div class="i-tabler-menu-2"></div>
                    </template>
                </action-dropdown-component>

                <dropdown-component :options="['a', 'b']" v-model="dropdownModel" class="w-fit">
                    <template #toggle-label>
                        <div>select</div>
                    </template>
                </dropdown-component>

                <dialog-component
                    title="Testing Dialog"
                    description="A dialog..."
                    @cancel="test"
                    :pre-confirm="validateAndSubmit"
                    :confirm-disabled="true"
                >
                    <template #content>
                        <div class="flex gap-4 flex-col text-default px-4 pt-3 pb-5">
                            <span>test</span>
                            <span>another test</span>
                            <span>and another test</span>
                        </div>
                        <select class="custom-select">
                            <option>a</option>
                            <option>b</option>
                        </select>
                        <list-select
                            class="w-fit"
                            :options="listSelectOptions"
                            :dropdownClasses="`right-0 min-w-50 w-fit`"
                            :multiple="false"
                            :label-fn="e => e.name"
                            v-model="listSelectionSingle"
                            @update:modelValue="e => console.log(e)"
                            :truncate-items="true"
                            :portal="false"
                        ></list-select>
                    </template>
                </dialog-component>
            </div>
        </div>
    </CollapsibleCard>
    <CollapsibleCard heading="Spacing" class="my-4 text-sm">
        <div class="grid grid-cols-12 gap-y-5 gap-x-1 p-4">
            <div class="col-span-2 flex flex-col">
                <p>4px</p>
                <pre>p-1 m-1 gap-1</pre>
            </div>
            <div class="col-span-10 w-1 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>8px</p>
                <pre>p-2 m-2 gap-2</pre>
            </div>
            <div class="col-span-10 w-2 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>12px</p>
                <pre>p-3 m-3 gap-3</pre>
            </div>
            <div class="col-span-10 w-3 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>16px</p>
                <pre>p-4 m-4 gap-4</pre>
            </div>
            <div class="col-span-10 w-4 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>24px</p>
                <pre>p-5 m-5 gap-5</pre>
            </div>
            <div class="col-span-10 w-6 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>32px</p>
                <pre>p-6 m-6 gap-6</pre>
            </div>
            <div class="col-span-10 w-8 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>48px</p>
                <pre>p-7 m-7 gap-7</pre>
            </div>
            <div class="col-span-10 w-12 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>64px</p>
                <pre>p-8 m-8 gap-8</pre>
            </div>
            <div class="col-span-10 w-16 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>96px</p>
                <pre>p-9 m-9 gap-9</pre>
            </div>
            <div class="col-span-10 w-24 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>128px</p>
                <pre>p-10 m-10 gap-10</pre>
            </div>
            <div class="col-span-10 w-32 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>192px</p>
                <pre>p-11 m-11 gap-11</pre>
            </div>
            <div class="col-span-10 w-48 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>256px</p>
                <pre>p-12 m-12 gap-12</pre>
            </div>
            <div class="col-span-10 w-64 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>384px</p>
                <pre>p-13 m-13 gap-13</pre>
            </div>
            <div class="col-span-10 w-96 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>512px</p>
                <pre>p-14 m-14 gap-14</pre>
            </div>
            <div class="col-span-10 w-128 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>640px</p>
                <pre>p-15 m-15 gap-15</pre>
            </div>
            <div class="col-span-10 w-160 bg-red-400"></div>
            <div class="flex flex-col col-span-2">
                <p>768px</p>
                <pre>p-16 m-16 gap-16</pre>
            </div>
            <div class="col-span-10 w-192 bg-red-400"></div>
        </div>
    </CollapsibleCard>

    <CollapsibleCard heading="Typography">
        <div class="p-4 w-full">
            <h2 class="header-2 text-default">Semantic Text Color</h2>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="header-4">on surface</h4>
                    <div class="grid grid-cols-2 gap-4 card p-3">
                        <div class="text-default">Default...</div>
                        <pre class="text-default">text-default</pre>
                        <div class="text-muted">Muted...</div>
                        <pre class="text-muted">text-muted</pre>
                        <div class="text-subtle">Subtle...</div>
                        <pre class="text-subtle">text-subtle</pre>
                        <div class="text-disabled">Disabled...</div>
                        <pre class="text-disabled">text-disabled</pre>
                    </div>
                </div>
                <div>
                    <h4 class="header-4">on background</h4>
                    <div class="grid grid-cols-2 gap-4 p-3 card bg-background">
                        <div class="text-default">Default...</div>
                        <pre class="text-default">text-default</pre>
                        <div class="text-muted">Muted...</div>
                        <pre class="text-muted">text-muted</pre>
                        <div class="text-subtle">Subtle...</div>
                        <pre class="text-subtle">text-subtle</pre>
                        <div class="text-disabled">Disabled...</div>
                        <pre class="text-disabled">text-disabled</pre>
                    </div>
                </div>
                <h2 class="header-2 text-default">Tinted Text Color</h2>
                <div class="flex flex-col gap-y-4 col-span-2">
                    <pre class="text-mix:txt-DEFAULT@80:green-500">
text-mix:txt-DEFAULT@80:green-500
</pre
                    >
                    <pre class="text-mix:txt-DEFAULT@70:amber-500">
text-mix:txt-DEFAULT@70:amber-500
</pre
                    >
                    <pre class="text-mix:txt-DEFAULT@50:red-500">
text-mix:txt-DEFAULT@50:red-500</pre
                    >
                    <pre class="text-mix:txt-DEFAULT@50:primary-DEFAULT">
text-mix:txt-DEFAULT@50:primary-DEFAULT</pre
                    >
                </div>
            </div>
            <div class="p-4"></div>
            <div class="flex flex-col gap-2 m-0 p-0 text-default">
                <div class="border border-border rounded-sm p-4">
                    <h1 class="header-1">
                        Heading 1: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod
                    </h1>
                    <p class="leading-7">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet.
                    </p>
                </div>
                <div class="border border-border rounded-sm p-4">
                    <h2 class="header-2">
                        Heading 2: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod
                    </h2>
                    <p class="leading-7">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet.
                    </p>
                </div>
                <div class="border border-border rounded-sm p-4">
                    <h3 class="header-3">
                        Heading 3: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod
                    </h3>
                    <p class="leading-7">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                        amet.
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h4 class="header-4 px-1 py-2">on surface</h4>
                        <div class="card p-4">
                            <h1 class="header-1">Heading 1</h1>
                            <h2 class="header-2">Heading 2</h2>
                            <h3 class="header-3">Heading 3</h3>
                            <h4 class="header-4">Heading 4</h4>
                            <h5 class="header-5">Heading 5</h5>
                            <h6 class="header-6">Heading 6</h6>
                        </div>
                    </div>
                    <div>
                        <h4 class="header-4 px-1 py-2">on background</h4>
                        <div class="p-4 card bg-background">
                            <h1 class="header-1">Heading 1</h1>
                            <h2 class="header-2">Heading 2</h2>
                            <h3 class="header-3">Heading 3</h3>
                            <h4 class="header-4">Heading 4</h4>
                            <h5 class="header-5">Heading 5</h5>
                            <h6 class="header-6">Heading 6</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </CollapsibleCard>

    <div class="my-4">
        <tab-card-component :tabs="tabs" :current-tab-index="0"></tab-card-component>
    </div>
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
    <RemoteTableDemo />

    <CollapsibleCard class="my-4">
        <template #header>
            <Heading tag="h2">Selects</Heading>
        </template>
        <div class="p-4 grid grid-cols-2 gap-4">
            <h2 class="header-2 text-default col-span-2">
                Selections for large option lists (virtualized)
            </h2>
            <div>
                <h3 class="header-3 text-muted">single mode</h3>
                <list-select
                    class="w-fit"
                    :options="listSelectOptions"
                    :dropdownClasses="`right-0 min-w-50 w-fit`"
                    :multiple="false"
                    :label-fn="e => e.name"
                    v-model="listSelectionSingle"
                    @update:modelValue="e => console.log(e)"
                    :truncate-items="true"
                ></list-select>
            </div>
            <div>
                <h3 class="header-3 text-muted">multiple mode</h3>
                <list-select
                    class="w-fit"
                    :options="listSelectOptions"
                    :dropdownClasses="`right-0 min-w-50 w-fit`"
                    :multiple="true"
                    :label-fn="e => e.name"
                    v-model="listSelectionMultiple"
                    @update:modelValue="e => console.log(e)"
                    :truncate-items="true"
                ></list-select>
            </div>
            <h2 class="header-2 text-default col-span-2">
                Selections for small option lists (un-virtualized)
            </h2>
            <div class="text-muted">
                <h3 class="header-3">single mode</h3>
                <single-select
                    :options="singleSelectOptions"
                    v-model="singleSelectValue"
                    placeholder="Select an option"
                    label-key="name"
                    class="w-fit mb-2"
                ></single-select>
            </div>
            <div class="text-muted">
                <h3 class="header-3">multiple mode</h3>

                <multi-select
                    :options="multiSelectOptions"
                    v-model="multiSelectValue"
                    :id-function="x => x.value"
                    :label-function="x => x.name"
                    :is-default-option="x => x.value === 'all'"
                    :placeholder-function="
                        v => (v.length === 1 ? v[0].name : v.length + ' are selected')
                    "
                    class="w-[200px] mb-2"
                ></multi-select>
            </div>
        </div>
    </CollapsibleCard>
    <CollapsibleCard class="my-4" heading="Checkboxes">
        <div class="p-4 flex flex-col gap-y-8">
            <div class="grid grid-cols-2 gap-4 items-center">
                <div>
                    <h3 class="header-3">Bind to single value</h3>
                    <CheckboxComponent
                        indeterminate
                        :label="'Single Checkbox'"
                        v-model="singleChecked"
                    />
                    <CheckboxComponent
                        :disabled="true"
                        :label="'Single Checkbox disabled'"
                        v-model="singleChecked"
                    />
                </div>
                <pre class="text-sm">{{ singleChecked }}</pre>
            </div>
            <div class="grid grid-cols-2 gap-4 items-baseline">
                <div>
                    <h3 class="header-3">Bind to list</h3>
                    <CheckboxComponent
                        v-for="(name, index) in checkableNames"
                        :key="index"
                        :id="name"
                        :label="name"
                        v-model="checkedValues"
                    />
                </div>
                <pre class="text-sm">{{ checkedValues }}</pre>
            </div>
            <div class="grid grid-cols-2 gap-4 items-baseline">
                <div>
                    <h3 class="header-3">Bind to object property in list</h3>
                    <CheckboxComponent
                        v-for="field in fieldVisibility"
                        :key="field.key"
                        :id="field.key"
                        :label="field.key"
                        v-model="field.visible"
                    />
                </div>

                <div>{{ fieldVisibility }}</div>
            </div>
        </div>
    </CollapsibleCard>

    <CollapsibleCard class="my-4" heading="Skeletons">
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
    </CollapsibleCard>
</template>
