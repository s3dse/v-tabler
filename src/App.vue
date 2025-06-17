<script setup>
import data from './assets/MOCK_DATA-2.json'
import { computed, ref } from 'vue'
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
import { joinLines } from './utils/string-join-lines'
import SingleSelect from './components/select/SingleSelect.vue'
import MultiSelect from './components/select/MultiSelect.vue'
import ToggleComponent from './components/toggle/ToggleComponent.vue'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
// const items = await delay(2000).tehn(() => ref([...data]))
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
const stopped = () => console.log('stopped')
const opened = () => console.log('opened')
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
const panelClassList = joinLines(`w-full 
                            max-w-md 
                            overflow-hidden 
                            bg-white 
                            rounded-lg
                            text-left 
                            align-middle 
                            shadow-xl`)

const selectOptions = [
    { name: 'Record A', value: 'a' },
    { name: 'Record B', value: 'b' },
    { name: 'Record C', value: 'c' },
    { name: 'Record D', value: 'd' },
    { name: 'Record E', value: 'e' },
    { name: 'Record F', value: 'f' }
]
const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const selected = ref(selectOptions[0])
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
const filterText = ref('')
const listSelectOptionsFiltered = computed(() =>
    filterText.value
        ? listSelectOptions.filter(item =>
              item.label.toLowerCase().includes(filterText.value.toLowerCase())
          )
        : listSelectOptions
)

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

const isToggleChecked = ref(false)

const dropdownModel = ref(null)
</script>

<template>
    <div class="p-4 flex flex-col gap-2">
        <h3 class="text-xl text-default">Basic Buttons</h3>
        <pre class="text-default text-base">btn-base-(sm|md|lg|default)</pre>
        <div class="flex flex-row gap-8">
            <button class="btn-base-sm">Base SM</button>
            <button class="btn-base-md">Base MD</button>
            <button class="btn-base-lg">Base LG</button>
            <button class="btn-base-default">Base Default</button>
        </div>
        <h3 class="text-xl text-default">Primary Buttons</h3>
        <pre class="text-default text-base">btn-primary-(sm|md|lg|default)</pre>
        <div class="flex flex-row gap-8">
            <button class="btn-primary-sm">Primary SM</button>
            <button class="btn-primary-md">Primary MD</button>
            <button class="btn-primary-lg">Primary LG</button>
            <button class="btn-primary-default">Primary Default</button>
        </div>
    </div>
    <button class="btn-base-lg rounded-md" @click="isLoading = !isLoading">
        Loading {{ isLoading }}
    </button>
    <div v-busy="isLoading" class="py-3 border rounded border-border border-solid">
        <p class="text-default">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, dolore.
        </p>
    </div>
    <loading-overlay :show="isLoading" class="py-3 border rounded border-solid border-border">
        <p class="text-default">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, dolore.
        </p>
    </loading-overlay>
    <div class="flex px-50">
        <action-dropdown-component
            :options="['a', 'b']"
            up-icon=""
            down-icon=""
            @on-select="logItem"
            class="px-10 ms-auto me-2 h-full rounded-sm hover:cursor-pointer"
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
    </div>
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

    <div class="p-4 mt-4 card w-80">
        <h3 class="text-xl pb-4">Typograhpy</h3>
        <div class="grid grid-cols-2 gap-4">
            <div class="py-1 text-default">Default...</div>
            <pre class="text-default">text-default</pre>
            <div class="text-muted">Muted...</div>
            <pre class="text-muted">text-muted</pre>
            <div class="text-subtle">Subtle...</div>
            <pre class="text-subtle">text-subtle</pre>
            <div class="text-disabled">Disabled...</div>
            <pre class="text-disabled">text-disabled</pre>
        </div>
    </div>

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
                    <div class="border border-border text-default px-4 ms-auto">some control</div>
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
    <div class="p-2 text-default">Multiple.</div>
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
    <div class="p-2 text-default">Single.</div>
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
    <div class="p-2 text-default">Some text below.</div>

    <div class="text-muted">Small options selects:</div>
    <div class="text-muted">single</div>
    <single-select
        :options="singleSelectOptions"
        v-model="singleSelectValue"
        label-key="name"
        class="w-fit mb-2"
    ></single-select>

    <div class="text-muted">multiple</div>
    <multi-select
        :options="multiSelectOptions"
        v-model="multiSelectValue"
        :id-function="x => x.value"
        :label-function="x => x.name"
        :is-default-option="x => x.value === 'all'"
        :placeholder-function="v => (v.length === 1 ? v[0].name : v.length + ' are selected')"
        class="w-[200px] mb-2"
    ></multi-select>

    <div class="p-4">
        <ToggleComponent
            class="justify-around w-80"
            left-label="Left"
            right-label="Right"
            v-model="isToggleChecked"
        ></ToggleComponent>
    </div>
</template>
