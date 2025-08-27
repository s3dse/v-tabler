<template>
    <DropdownMenuRoot v-model:open="isDropdownOpen" :modal="false">
        <!-- Filter Toggle Button -->
        <DropdownMenuTrigger
            :class="[
                'ml-1 p-1 rounded bg-thead-background hover:bg-surface transition-colors',
                { 'text-primary': hasActiveFilter }
            ]"
            :title="`Filter ${field.label || field.key}`"
        >
            <div
                class="w-4 h-4"
                :class="hasActiveFilter ? 'i-tabler-filter text-primary' : 'i-tabler-filter'"
            ></div>
        </DropdownMenuTrigger>

        <!-- Filter Dropdown -->
        <DropdownMenuPortal>
            <DropdownMenuContent
                class="bg-surface border border-solid border-border rounded-sm shadow-lg min-w-[200px] z-50"
                :side="'bottom'"
                :align="'end'"
                :side-offset="4"
                @click.stop
            >
                <slot name="filter-content" v-bind="{ field, data, filterProps }">
                    <div class="p-3">
                        <component
                            :is="filterComponent"
                            v-bind="filterProps"
                            @update:modelValue="onFilterValueUpdate"
                            @update:operator="onOperatorUpdate"
                        />
                        <DropdownMenuSeparator class="my-2 h-px bg-border" />
                        <button
                            class="w-full btn-transparent-default text-xs text-default hover:text-primary hover:bg-surface-hover px-2 py-1 rounded cursor-pointer"
                            @click="clearFilter"
                        >
                            {{ i18nSettings.clearFilterLabel }}
                        </button>
                    </div>
                </slot>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuSeparator
} from 'reka-ui'
import { FILTER_OPERATORS, getFilterI18n } from '../utils/column-filtering.js'
import { detectFilterType, generateSelectOptions } from '../utils/filterTypeDetection.js'
import TextFilterInput from './TextFilterInput.vue'
import NumericFilterInput from './NumericFilterInput.vue'
import DateFilterInput from './DateFilterInput.vue'
import SelectFilterInput from './SelectFilterInput.vue'

const props = defineProps({
    field: {
        type: Object,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})

const modelValue = defineModel({
    type: Object,
    default: undefined
})

const emit = defineEmits(['filter-change'])

const isDropdownOpen = ref(false)

const filterState = ref({
    value: null,
    operator: '='
})

function getInitialValueForFilterType(type) {
    switch (type) {
        case 'select':
            return []
        case 'text':
        case 'numeric':
        case 'date':
            return ''
        default:
            return null
    }
}

// Get i18n settings using the new getFilterI18n utility
const i18nSettings = computed(() => {
    return getFilterI18n(props.field.i18n, props.field.label || props.field.key)
})

const filterComponent = computed(() => {
    const componentMap = {
        text: TextFilterInput,
        numeric: NumericFilterInput,
        date: DateFilterInput,
        select: SelectFilterInput
    }
    return componentMap[filterType.value] || TextFilterInput
})

const resetIfNecessary = (filterType, filterValue) => {
    if (filterType === 'select' && !Array.isArray(filterValue.value)) {
        filterValue.value = []
    } else if (
        ['text', 'date', 'numeric'].includes(filterType) &&
        (filterValue.value === null || filterValue.value === undefined)
    ) {
        filterValue.value = ''
    }
}

const filterProps = computed(() => {
    const modelValue = filterState.value

    resetIfNecessary(filterType.value, modelValue)

    const baseProps = {
        modelValue: modelValue.value
    }

    if (filterType.value === 'text') {
        return {
            ...baseProps,
            label: i18nSettings.value.textLabel,
            placeholder: i18nSettings.value.textPlaceholder
        }
    }

    if (filterType.value === 'numeric') {
        return {
            ...baseProps,
            label: i18nSettings.value.numericLabel,
            operator: filterState.value.operator,
            operators: FILTER_OPERATORS.numeric,
            placeholder: i18nSettings.value.numericPlaceholder
        }
    }

    if (filterType.value === 'date') {
        return {
            ...baseProps,
            label: i18nSettings.value.dateLabel,
            operator: filterState.value.operator,
            operators: FILTER_OPERATORS.date,
            placeholder: i18nSettings.value.datePlaceholder
        }
    }

    if (filterType.value === 'select') {
        return {
            ...baseProps,
            options: filteredSelectOptions.value,
            placeholder: i18nSettings.value.placeholder,
            label: i18nSettings.value.selectLabel
        }
    }

    return baseProps
})

function onFilterValueUpdate(value) {
    filterState.value.value = value
    applyFilter()
}

function onOperatorUpdate(operator) {
    filterState.value.operator = operator
    applyFilter()
}

const filterType = computed(() => {
    return detectFilterType(props.field, props.data)
})

const selectOptions = computed(() => {
    return generateSelectOptions(props.field, props.data, filterType.value)
})

const filteredSelectOptions = computed(() => {
    return selectOptions.value
})

const hasActiveFilter = computed(() => {
    const value = filterState.value.value

    if (filterType.value === 'text') {
        return typeof value === 'string' && value.trim() !== ''
    }
    if (filterType.value === 'numeric') {
        return value != null && value !== '' && !isNaN(Number(value))
    }
    if (filterType.value === 'date') {
        return value != null && value !== ''
    }
    if (filterType.value === 'select') {
        return Array.isArray(value) && value.length > 0
    }
    return false
})

const currentFilter = computed(() => {
    if (!hasActiveFilter.value) return null

    const value = filterState.value.value
    const operator = filterState.value.operator

    const operatorMap = {
        text: 'contains',
        numeric: operator,
        date: operator,
        select: 'in'
    }

    return {
        field: props.field.key,
        type: filterType.value,
        value: filterType.value === 'numeric' ? Number(value) : value,
        operator: operatorMap[filterType.value]
    }
})

const applyFilter = () => {
    const filter = currentFilter.value
    modelValue.value = filter
    emit('filter-change', filter)
}

const clearFilter = () => {
    filterState.value = { value: getInitialValueForFilterType(filterType.value), operator: '=' }
    isDropdownOpen.value = false
    modelValue.value = undefined
    emit('filter-change', null)
}

watch(
    modelValue,
    (newFilter, oldFilter) => {
        // Only reset if externally cleared (oldFilter was not null/undefined, newFilter is null/undefined)
        if (oldFilter && !newFilter) {
            filterState.value = {
                value: getInitialValueForFilterType(filterType.value),
                operator: '='
            }
            return
        } else if (newFilter !== undefined && newFilter !== null) {
            filterState.value = {
                value: newFilter.value,
                operator: newFilter.operator || '='
            }
        }
    },
    { immediate: true }
)

watch(
    filterType,
    newType => {
        // Only reset if the current value is incompatible with the new type
        resetIfNecessary(newType, filterState.value)
    },
    { immediate: true }
)
</script>
