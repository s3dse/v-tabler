<script setup>
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed, useId } from 'vue'
const props = defineProps({
    values: { type: Array, required: true },
    prefix: {
        type: String,
        required: false,
        default: ''
    },
    ariaLabel: {
        type: String,
        required: false,
        default: null
    },
    labelKey: {
        type: String,
        required: false,
        default: 'label'
    },
    valueKey: {
        type: String,
        required: false,
        default: 'value'
    },
    disabled: { type: Boolean, default: false }
})
const selected = defineModel({ default: null, required: false, type: [String, Object] })
const id = useId()
const groupId = computed(() => (props.prefix ? props.prefix : id))
</script>

<template>
    <RadioGroupRoot
        v-model="selected"
        class="flex justify-between gap-x-2"
        default-value="default"
        :aria-label="ariaLabel"
        :disabled="disabled"
    >
        <div v-for="(item, index) in values" :key="item[valueKey]" class="flex items-center">
            <RadioGroupItem
                :id="`${groupId}-r${index}`"
                :data-disabled="disabled"
                class="w-[18px] aspect-ratio-square outline-none cursor-pointer rounded-full"
                :class="[item.icon ? `${item.icon} radio-group-item-icon` : 'radio-group-item']"
                :value="item"
            >
                <RadioGroupIndicator
                    v-if="item.icon"
                    class="flex items-center justify-center w-full h-full relative"
                >
                </RadioGroupIndicator>
                <RadioGroupIndicator
                    :disabled="disabled"
                    v-else
                    class="flex items-center justify-center w-full h-full relative"
                >
                    <span
                        :data-disabled="disabled"
                        class="rounded-full w-[11px] h-[11px] data-[disabled=false]:bg-primary data-[disabled=true]:bg-subtle"
                    ></span>
                </RadioGroupIndicator>
            </RadioGroupItem>
            <label
                class="p-2 text-sm text-default text-nowrap"
                :class="disabled ? 'cursor-default' : 'cursor-pointer'"
                :for="`${groupId}-r${index}`"
            >
                {{ item[labelKey] }}
            </label>
        </div>
    </RadioGroupRoot>
</template>
<style scoped>
.radio-group-item-icon {
    --at-apply: 'bg-gray-900 dark:bg-gray-200 data-[disabled=false]:hover:bg-primary';
}
.radio-group-item {
    --at-apply: 'bg-surface';
    --at-apply: 'data-[disabled=false]:hover:bg-primary-lt';
    --at-apply: 'ring-1 ring-subtle';
}
</style>
