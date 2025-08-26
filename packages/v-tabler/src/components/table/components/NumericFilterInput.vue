<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
            {{ label }}
        </DropdownMenuLabel>
        <div class="space-y-3">
            <div class="flex justify-center">
                <ToggleGroupRoot v-model="operatorValue" type="single" class="flex">
                    <ToggleGroupItem
                        v-for="operatorObj in operators"
                        :key="operatorObj.value"
                        :value="operatorObj.value"
                        class="btn-base-md data-[state=on]:bg-primary data-[state=on]:text-onprimary first:rounded-l last:rounded-r"
                        v-html="operatorObj.symbol"
                    />
                </ToggleGroupRoot>
            </div>
            <input
                :id="inputId"
                type="number"
                class="form-inputfield w-full text-default"
                :placeholder="placeholder"
                v-model="modelValue"
                @keydown.stop
            />
        </div>
    </div>
</template>
<script setup>
import { DropdownMenuLabel, ToggleGroupRoot, ToggleGroupItem } from 'reka-ui'
import { useI18n } from '../../../composables/useI18n.js'

const props = defineProps({
    inputId: String,
    operators: Array,
    placeholder: { type: String, default: 'Value...' },
    label: String
})

const { t } = useI18n()

// Use prop label if provided, otherwise use i18n
const label = props.label || t('vTabler.table.filters.numericLabel', 'Number filter:')

const modelValue = defineModel({ type: [String, Number] })
const operatorValue = defineModel('operator', { type: String, default: '=' })
</script>
