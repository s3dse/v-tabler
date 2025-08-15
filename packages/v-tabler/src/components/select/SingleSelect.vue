<script setup>
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectPortal,
    SelectRoot,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectTrigger,
    SelectValue,
    SelectViewport
} from 'reka-ui'
import { toRefs, computed } from 'vue'
import { getClass as dispatchClass } from '@/utils/css-class-dispatch.js'

const classMap = {
    trigger: `inline-flex items-center justify-between gap-2 min-w-[10rem] 
        form-inputfield text-sm text-muted 
        h-[2.375rem] px-3`,
    content: `bg-surface rounded min-w-[11.25rem] 
        border border-border
        shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-501`,
    item: `single-select-item 
    leading-none flex items-center pl-8
    outline-none select-none py-1 data-[disabled]:cursor-not-allowed 
    text-default
    highlighted-major
    [&[data-state=checked][data-highlighted]]:selected-hovered-major
    `
}
const props = defineProps({
    classes: {
        type: Object,
        default: null
    },
    options: {
        type: Array,
        required: true
    },
    labelKey: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: 'Select option'
    },
    modelValue: {
        type: [String, Boolean, Number, Object],
        required: false
    }
})
const emit = defineEmits(['update:modelValue'])
const { classes: propsClasses, options, labelKey } = toRefs(props)
const getClass = dispatchClass(propsClasses.value, classMap)

const getOptionValue = option => (labelKey.value ? option[labelKey.value] : option)
const getOption = value =>
    props.labelKey !== null ? props.options.find(o => o[props.labelKey] === value) : value
const selected = computed({
    get: () => (props.labelKey !== null ? props.modelValue[props.labelKey] : props.modelValue),
    set: value => emit('update:modelValue', getOption(value))
})
</script>

<template>
    <SelectRoot v-model="selected">
        <SelectTrigger :class="getClass('trigger')" v-bind="$attrs">
            <SelectValue :placeholder="placeholder">
                <slot name="triggerLabel">
                    <span>{{ selected }}</span>
                </slot>
            </SelectValue>
            <span class="i-tabler-chevron-down font-light text-muted text-2xl block"></span>
        </SelectTrigger>

        <SelectPortal>
            <SelectContent :class="getClass('content')" :side-offset="5">
                <SelectScrollUpButton class="flex items-center justify-center">
                    <span class="i-tabler-chevron-up block text-default"></span>
                </SelectScrollUpButton>
                <SelectViewport class="p-3">
                    <SelectGroup>
                        <SelectItem
                            v-for="(option, index) in options"
                            :key="index"
                            :value="getOptionValue(option)"
                            :class="getClass('item')"
                        >
                            <SelectItemIndicator
                                class="absolute left-[1rem] w-[1rem] inline-flex items-center justify-center"
                            >
                                <span class="i-tabler-check block"></span>
                            </SelectItemIndicator>
                            <SelectItemText>{{ getOptionValue(option) }}</SelectItemText>
                        </SelectItem>
                    </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton class="flex items-center justify-center">
                    <span class="i-tabler-chevron-down block text-default"></span>
                </SelectScrollDownButton>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>
