<template>
    <div
        v-click-outside="closeDropdown"
        @keydown.space="!open && toggleOpen()"
        @keydown.arrow-down="!open && toggleOpen()"
        @keydown.arrow-up="!open && toggleOpen()"
        @keydown.esc="closeDropdown"
        @keydown.tab="closeDropdown"
        tabindex="0"
        class="form-inputfield"
    >
        <label class="selectcomponent__label flex items-center" @click.prevent="toggleOpen">
            <input
                :value="modelText"
                readonly
                tabindex="-1"
                class="w-full h-[2.375rem] inline-flex items-center rounded text-muted text-sm bg-inherit outline-none pl-2 hover:cursor-pointer"
                :class="props.inputClasses"
                :id="inputId"
            />
            <div>
                <span
                    class="shrink-0 i-tabler-chevron-down block text-2xl text-muted mr-2 hover:cursor-pointer"
                    ref="dropdownToggle"
                ></span>
            </div>
        </label>
        <div class="relative w-full" ref="dropdown-container">
            <div
                class="p-3 absolute bg-surface rounded min-w-[15.75rem] w-full max-h-50rem overflow-auto with-scrollbar border border-border shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-501"
                v-if="open"
                :class="[
                    dropdownAbove ? 'bottom-full' : 'top-full',
                    dropdownLeft ? 'right-0' : 'left-0'
                ]"
                ref="dropdown"
            >
                <ul
                    ref="listRef"
                    role="listbox"
                    @keydown="onArrowKey"
                    aria-multiselectable="true"
                    :aria-activedescendant="'opion-' + idFunction(options[focusedIndex])"
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
        </div>
    </div>
</template>

<script setup>
import { computed, toRef, toValue, ref, useTemplateRef, useId, nextTick } from 'vue'
import { useSmartMultiSelect } from './useSmartSelect'
import { useListKeyboardNavigation } from './useListKeyboardNavigation'
import { clickOutside } from '@/directives/click-outside'
import { useDropdownPosition } from './use-dropdown-position'

const vClickOutside = clickOutside

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

const inputId = `selectcomponent-input-${useId()}`

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
const open = ref(false)

const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    isDefaultOption: {
        type: Function,
        default: x => x.id === 'DEFAULT'
    },
    labelFunction: {
        type: Function,
        default: x => x.label
    },
    idFunction: {
        type: Function,
        default: x => x.id
    },
    multiple: {
        type: Boolean,
        default: true
    },
    placeholderFunction: {
        type: Function
    }
})

const options = toRef(props, 'options')

const modelText = computed(() => {
    const value = modelValue.value
    if (props.placeholderFunction) return props.placeholderFunction(value)
    return value.length === 1 ? props.labelFunction(value[0]) : `${value.length} selected`
})

const closeDropdown = () => {
    open.value = false
}

const handleEnter = event => {
    if (!open.value) {
        event.preventDefault()
        toggleOpen()
    }
}

const toggleOpen = () => {
    open.value = !open.value
    if (open.value) {
        updateDropdownPosition()
        resetFocus()
    }
}

const { toggleSelect, isSelected } = useSmartMultiSelect({
    modelValue,
    multiple: props.multiple,
    options,
    isDefaultOption: props.isDefaultOption,
    getId: props.idFunction,
    multiple: props.multiple
})

const listTemplateRef = useTemplateRef('listRef')

const { focusedIndex, onArrowKey, resetFocus } = useListKeyboardNavigation({
    itemsRef: options,
    listTemplateRef
})

const containerRef = useTemplateRef('dropdown-container')
const dropdownRef = useTemplateRef('dropdown')

const { dropdownAbove, dropdownLeft, updateDropdownPosition } = useDropdownPosition(
    containerRef,
    dropdownRef
)
</script>
