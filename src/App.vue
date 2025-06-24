<script setup>
import data from './assets/MOCK_DATA-2.json'
import { ref } from 'vue'
import TableComponent from './components/table/TableComponent.vue'
import CardComponent from './components/card/CardComponent.vue'
import LoadingOverlay from './components/loading-overlay/LoadingOverlay.vue'
import DropdownComponent from './components/dropdown/DropdownComponent.vue'
import ActionDropdownComponent from './components/dropdown/ActionDropdownComponent.vue'
import DialogComponent from './components/dialog/DialogComponent.vue'
import TabCardComponent from './components/card/TabCardComponent.vue'
import TestOne from './components/card/TestOne.vue'
import TestTwo from './components/card/TestTwo.vue'
import ListSelect from './components/listselect/ListSelect.vue'
import SingleSelect from './components/select/SingleSelect.vue'
import MultiSelect from './components/select/MultiSelect.vue'
import ToggleComponent from './components/toggle/ToggleComponent.vue'
import CollapsibleCard from './components/card/CollapsibleCard.vue'
import CheckboxComponent from './components/checkbox/CheckboxComponent.vue'

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
const fields = ref([
    {
        key: 'id',
        thClassList: 'text-right px-1 w-18',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'first_name',
        label: 'the first name',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'last_name',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'email',
        thClassList: 'text-left px-1',
        tdClassList: 'text-left px-1 w-15',
        tdTopRowClassList: 'text-left px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    },
    {
        key: 'share',
        thClassList: 'text-right px-1 w-15',
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
        thClassList: 'text-right px-1 w-45',
        tdClassList: 'text-right px-1 font-mono',
        tdTopRowClassList: 'text-right px-1 italic',
        tdBottomRowClassList: 'text-right px-1 font-semibold'
    }
])
const tableStatus = ref({ busy: false })

const logItem = item => {
    console.log(item)
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
    name: 'first option is a very long name that should be handled'
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
</script>

<template>
    <CollapsibleCard class="my-4" heading="Buttons">
        <div class="p-4 flex flex-col gap-2">
            <h1 class="header-2 text-default">Basic Buttons</h1>
            <pre class="text-default text-base">btn-base-(sm|md|lg|default)</pre>
            <div class="flex flex-row gap-8 pb-4">
                <button class="btn-base-sm">Base SM</button>
                <button class="btn-base-md">Base MD</button>
                <button class="btn-base-lg">Base LG</button>
                <button class="btn-base-default">Base Default</button>
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
            <h1 class="header-1 pt-2 px-4 text-default">Busy Indicators</h1>
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

    <CollapsibleCard class="my-4">
        <template #header>
            <h1 class="header-1 pt-2 px-4 text-default">Dialogues and Dropdowns</h1>
        </template>
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
                    </template>
                </dialog-component>
            </div>
        </div>
    </CollapsibleCard>

    <CollapsibleCard>
        <template #header>
            <h1 class="header-1 pt-2 px-4 text-default">Typography</h1>
        </template>
        <div class="p-4 w-full">
            <h2 class="header-2 text-default">Semantic Text Color</h2>
            <div class="grid grid-cols-2 gap-4">
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

    <div class="p-3">
        <tab-card-component :tabs="tabs" :current-tab-index="0"></tab-card-component>
    </div>
    <card-component class="mt-5">
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

    <CollapsibleCard class="my-4">
        <template #header>
            <h1 class="header-1 pt-2 px-4 text-default">Selects</h1>
        </template>
        <div class="p-4">
            <h1 class="header-1 text-default">Selections for large option lists (virtualized)</h1>
            <div class="p-2 text-muted">single mode</div>
            <div class="pl-8">
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
            <div class="p-2 text-muted">multiple mode</div>
            <div class="pl-8">
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

            <div class="pl-50">
                <ListSelect
                    class="w-fit"
                    :options="listSelectOptions"
                    :dropdownClasses="`right-0 min-w-50 w-fit`"
                    :multiple="true"
                    :label-fn="e => e.name"
                    v-model="listSelectionSingle"
                    @update:modelValue="e => console.log(e)"
                    :truncate-items="true"
                ></ListSelect>
            </div>

            <h1 class="header-1 text-default">
                Selections for small option lists (un-virtualized)
            </h1>
            <div class="flex flex-row overflow-hidden gap-8">
                <div class="text-muted">
                    <p>single mode</p>
                    <single-select
                        :options="singleSelectOptions"
                        v-model="singleSelectValue"
                        label-key="name"
                        class="w-fit mb-2"
                    ></single-select>
                </div>
                <div class="text-muted">
                    <p>multiple mode</p>

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
        </div>
    </CollapsibleCard>
    <CollapsibleCard class="my-4">
        <template #header>
            <h1 class="header-1 pt-2 px-4 text-default">Checkboxes</h1>
        </template>
        <div class="p-4 flex flex-col gap-y-4">
            <div class="grid grid-cols-2 gap-4 items-center">
                <div>
                    <CheckboxComponent :label="'Single Checkbox'" v-model="singleChecked" />
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
                    <CheckboxComponent
                        v-for="(name, index) in checkableNames"
                        :key="index"
                        :id="name"
                        :label="name"
                        :value="name"
                        v-model="checkedValues"
                    />
                </div>
                <pre class="text-sm">{{ checkedValues }}</pre>
            </div>
        </div>
    </CollapsibleCard>
    <div class="card p-4">
        <CheckboxComponent
            v-for="field in fieldVisibility"
            :key="field.key"
            :id="field.key"
            :label="field.key"
            :value="field.key"
            v-model="field.visible"
        />
        <div>{{ fieldVisibility }}</div>
    </div>
</template>
