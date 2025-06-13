<template>
    <Story title="ListSelect" :layout="{ type: 'grid', width: '75%' }">
        <Variant title="default" :init-state="initState('default')" :meta="{ wrapper: true }">
            <template #default="{ state }">
                <form>
                    <div class="h-600px w-600px">
                        <ListSelect
                            class="w-fit"
                            :options="state.options"
                            :dropdownClasses="state.dropdownClasses"
                            :multiple="state.multiple"
                            :label-fn="state.labelFn"
                            :truncate-items="state.truncateItems"
                            v-model="selectionMulti"
                            @update:modelValue="e => console.log(e)"
                        ></ListSelect>
                    </div>
                </form>
            </template>
        </Variant>
        <Variant title="default" :init-state="initState('default')" :meta="{ wrapper: true }">
            <template #default="{ state }">
                <form>
                    <div class="h-600px w-600px">
                        <ListSelect
                            class="w-fit"
                            :options="state.options"
                            :dropdownClasses="state.dropdownClasses"
                            :multiple="false"
                            :label-fn="state.labelFn"
                            :truncate-items="state.truncateItems"
                            v-model="selectionSingle"
                            @update:modelValue="e => console.log(e)"
                        ></ListSelect>
                    </div>
                </form>
            </template>
        </Variant>
    </Story>
</template>
<docs lang="md">
# ListItemLabel

## Props

-   `label` - String: The label to display
-   `selected` - Boolean: Whether the item is selected
-   `truncate` - Boolean: Whether to truncate the label
</docs>
<script setup>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { ListSelect } from '..'
import { ref } from 'vue'

const vBusy = {
  mounted: (el, { value }) => {
    el.setAttribute('title', value)
  },
}

function initState(variant) {
    const state = {
        default: {
            options: [...new Array(90).keys()].map(k => ({ id: k + 1, name: `option ${k + 1}` })),
            dropdownClasses: 'right-0 min-w-50 w-fit',
            multiple: true,
            labelFn: option => option.name,
            truncateItems: false
        }
    }
    return () => state[variant]
}

const selectionMulti = ref([])
const selectionSingle = ref([])
</script>