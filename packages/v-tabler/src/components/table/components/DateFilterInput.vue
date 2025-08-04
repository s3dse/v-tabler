<template>
    <div>
        <DropdownMenuLabel class="block text-xs font-medium text-muted mb-2">
            Date filter:
        </DropdownMenuLabel>
        <div class="space-y-3">
            <div class="flex justify-center">
                <ToggleGroupRoot
                    v-model="operatorValue"
                    type="single"
                    class="flex"
                    @update:model-value="onOperatorChange"
                >
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
                :value="value"
                type="date"
                class="form-inputfield w-full text-default"
                :placeholder="'Select date...'"
                @input="onInput"
                @keydown.stop
            />
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { DropdownMenuLabel, ToggleGroupRoot, ToggleGroupItem } from 'reka-ui'
const props = defineProps({
    modelValue: String,
    operator: String,
    operators: Array,
    inputId: String
})
const emit = defineEmits(['update:modelValue', 'update:operator'])
const value = ref(props.modelValue || '')
const operatorValue = ref(props.operator || '=')
watch(
    () => props.modelValue,
    v => {
        value.value = v
    }
)
function onInput(e) {
    value.value = e.target.value
    emit('update:modelValue', value.value)
}
function onOperatorChange(val) {
    operatorValue.value = val
    emit('update:operator', operatorValue.value)
}
</script>
