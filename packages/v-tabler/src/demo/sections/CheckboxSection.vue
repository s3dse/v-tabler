<template>
    <div class="text-default">
        <h2 class="header-2 text-default">Checkboxes</h2>
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
    </div>
    <div class="card w-20rem mb-8">
        <RadioGroup
            :values="radioValues"
            v-model="selectedRadio"
            prefix="example1"
            aria-label="Example Radio Group"
        />
    </div>
    <div class="w-20rem">
        <RadioGroup
            :values="radioValues"
            v-model="selectedRadio"
            prefix="example2"
            :disabled="true"
            aria-label="Example Radio Group"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import RadioGroup from '../../components/radio-group/RadioGroup.vue'
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

const radioValues = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
]

const selectedRadio = ref(null)
</script>
