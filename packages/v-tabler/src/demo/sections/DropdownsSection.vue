<template>
    <div class="p-4">
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
    </div>
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
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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

const logItem = item => {
    console.log(item)
}
</script>
