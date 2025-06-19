<template>
    <div
        ref="multiSelectWrapper"
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
            <Teleport to="body">
                <MultiSelectContent
                    ref="dropdownContent"
                    :disabled="!open"
                    v-on-click-outside="onClickOutsideHandler"
                    v-model="modelValue"
                    :options="props.options"
                    :isDefaultOption="props.isDefaultOption"
                    :open="open"
                    :idFunction="idFunction"
                    :labelFunction="labelFunction"
                    :multiple="props.multiple"
                    :style="dropdownStyles"
                    @keydown.esc.prevent="closeDropdown"
                    @keydown.tab="closeDropdown"
                ></MultiSelectContent>
            </Teleport>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, useId, nextTick } from 'vue'
import { useDropdownPosition } from './use-dropdown-position'
import MultiSelectContent from './MultiSelectContent.vue'
import { vOnClickOutside } from '@vueuse/components'

const inputId = `selectcomponent-input-${useId()}`

const modelValue = defineModel({
    type: Array,
    default: () => [],
    required: true
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
const containerRef = useTemplateRef('dropdown-container')
const dropdownContentRef = useTemplateRef('dropdownContent')

const modelText = computed(() => {
    const value = modelValue.value
    if (props.placeholderFunction) return props.placeholderFunction(value)
    return value.length === 1 ? props.labelFunction(value[0]) : `${value.length} selected`
})

const toggleOpen = () => {
    open.value = !open.value
    if (open.value) {
        nextTick().then(() => {
            updateDropdownPosition(ref(dropdownContentRef?.value?.dropdownRef))
        })
    }
}

const closeDropdown = () => {
    open.value = false
}
const multiSelectWrapperRef = useTemplateRef('multiSelectWrapper')
const onClickOutsideHandler = [closeDropdown, { ignore: [multiSelectWrapperRef] }]

const { updateDropdownPosition, dropdownStyles } = useDropdownPosition(containerRef)
</script>
