<template>
    <div
        class="p-3 absolute bg-surface rounded min-w-[15.75rem] w-fit max-h-50rem overflow-auto with-scrollbar border border-border shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-501"
        v-if="open"
        ref="dropdown"
    >
        <ul
            ref="listRef"
            role="listbox"
            @keydown="onArrowKey"
            aria-multiselectable="true"
            :aria-activedescendant="'option-' + idFunction(options[focusedIndex])"
            @keydown.esc.prevent="closeDropdown"
        >
            <li
                v-for="(option, i) in options"
                class="multi-select-item leading-none flex items-center pl-8 outline-none select-none py-1 data-[disabled]:cursor-not-allowed text-default highlighted-major [&[data-state=checked][data-highlighted]]:selected-hovered-major"
                :class="[focusedIndex === i ? 'bg-primary text-onprimary' : '']"
                :id="'option-' + idFunction(option)"
                :key="idFunction(option)"
                role="option"
                @mouseenter="focusedIndex = i"
                @focus="focusedIndex = i"
                :data-highlighted="focusedIndex === i || null"
                :tabindex="i === focusedIndex ? 0 : -1"
                @keydown.enter.prevent="toggleSelect(option)"
                @click="toggleSelect(option)"
                :aria-selected="isSelected(option)"
                :data-state="isSelected(option) ? 'checked' : 'unchecked'"
            >
                <div class="relative inline-flex items-center justify-center">
                    <span
                        :data-selected="isSelected(option)"
                        class="data-[selected=true]:block data-[selected=true]:i-tabler-check absolute left-[-1.75rem]"
                    ></span>
                    {{ labelFunction(option) }}
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { watch, useTemplateRef, toValue, toRef } from 'vue'
import { useSmartMultiSelect } from './useSmartSelect'
import { useListKeyboardNavigation } from './useListKeyboardNavigation'

const preserveArray = (value, multiple) => {
    if (!Array.isArray(value)) {
        return value ? [value] : []
    } else {
        if (multiple) {
            return value
        } else {
            return value.slice(-1)
        }
    }
}

const modelValue = defineModel({
    type: Array,
    default: () => [],
    required: true,
    get(value) {
        const val = toValue(value)
        return preserveArray(val, props.multiple)
    },
    set(newValue) {
        return preserveArray(newValue, props.multiple)
    }
})

const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    isDefaultOption: {
        type: Function,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    idFunction: {
        type: Function,
        required: true
    },
    labelFunction: {
        type: Function,
        required: true
    },
    multiple: {
        type: Boolean,
        required: true
    }
})

const options = toRef(props, 'options')

const { toggleSelect, isSelected } = useSmartMultiSelect({
    modelValue,
    multiple: props.multiple,
    options,
    isDefaultOption: props.isDefaultOption,
    getId: props.idFunction
})

const listTemplateRef = useTemplateRef('listRef')
const dropdownRef = useTemplateRef('dropdown')

defineExpose({ dropdownRef })

const { focusedIndex, onArrowKey, resetFocus } = useListKeyboardNavigation({
    itemsRef: options,
    listTemplateRef
})

watch(
    () => props.open,
    newVal => {
        if (newVal) {
            resetFocus()
        }
    }
)
</script>
