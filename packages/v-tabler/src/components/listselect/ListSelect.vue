<script setup>
import {
    ComboboxContent,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxItem,
    ComboboxPortal,
    ComboboxRoot,
    ComboboxViewport,
    ComboboxVirtualizer
} from 'reka-ui'
import { computed, ref, toValue, useTemplateRef, watch } from 'vue'
import ListSelectInput from './ListSelectInput.vue'
import ListSelectItem from './ListSelectItem.vue'
import ListSelectExcessIndicator from './ListSelectExcessIndicator.vue'
import ListSelectPreview from './ListSelectPreview.vue'
import delay from '@/utils/delay.js'
import { preserveArray } from '@/utils/preserve-array.js'

const props = defineProps({
    options: { type: Array, default: () => [] },
    inputPlaceholder: { type: String },
    labelFn: { type: Function, default: o => o.label },
    trackBy: { type: String, default: 'id' },
    multiple: { type: Boolean, default: true },
    optionsLoading: { type: Boolean, default: false },
    inputClasses: { type: String, default: 'focus:placeholder-transparent' },
    dropdownClasses: { type: String, default: '' },
    optionSize: { type: Number, default: 40 },
    selectionTextFn: { type: Function, default: count => `${count} items selected` },
    maxSelectionLength: { type: Number, default: 10 },
    maxSelectionLengthTextFn: {
        type: Function,
        default: limit => `You can only select ${limit} items`
    },
    selectionExceededInfoDuration: { type: Number, default: 1300 },
    searchOptionsTextFn: { type: Function, default: () => 'Search items...' },
    itemNameTextFn: { type: Function, default: count => (count !== 1 ? 'items' : 'item') },
    searchFn: { type: Function, required: false },
    dropDownZIndex: { type: Number, default: 9999 },
    dropDownWidth: { type: String, default: '30rem' },
    truncateItems: { type: Boolean, default: false },
    portal: { type: Boolean, default: true }
})

const listLengthExceeded = ref(false)

const handleListLengthExceeded = value => {
    listLengthExceeded.value = true
    delay(props.selectionExceededInfoDuration).then(() => {
        listLengthExceeded.value = false
    })
    return [...value].splice(0, props.maxSelectionLength)
}

const equals = (a, b) => {
    return a[props.trackBy] === b[props.trackBy]
}

const isSingleModeDeselect = newValue => {
    const isSingleMode = !props.multiple
    const currentModelValue = toValue(props.modelValue)
    const oldValueNotEmpty = Array.isArray(currentModelValue) && currentModelValue.length > 0
    const oldValueIsSelectedAgain = oldValueNotEmpty && equals(currentModelValue[0], newValue)
    return isSingleMode && oldValueIsSelectedAgain
}

const selectedOptions = defineModel({
    type: [Object, Array],
    get(value) {
        const val = toValue(value)
        return preserveArray(val, props.multiple)
    },
    set(newValue) {
        if (isSingleModeDeselect(newValue)) {
            return []
        }
        const value = preserveArray(newValue, props.multiple)
        if (props.multiple && value.length > props.maxSelectionLength) {
            return handleListLengthExceeded(value)
        } else {
            return value
        }
    }
})

const removeFromSelection = index => {
    if (props.multiple) {
        selectedOptions.value = selectedOptions.value.filter((_, idx) => idx !== index)
    } else {
        selectedOptions.value = null
    }
}

const open = ref(false)
const searchTerm = ref('')

const toggleOpen = () => {
    open.value = !open.value
}

watch(searchTerm, newVal => {
    if (newVal.length > 0 && !open.value) {
        open.value = true
    }
})

const listselectRootRef = useTemplateRef('listselectRoot')
watch(open, newVal => {
    if (!newVal) {
        searchTerm.value = ''
    } else {
        listselectRootRef.value?.highlightSelected()
    }
})

const close = () => {
    open.value = false
}

const filteredOptions = computed(() =>
    searchTerm.value === ''
        ? props.options
        : props.options.filter(option => {
              return props.labelFn(option).toLowerCase().includes(searchTerm.value.toLowerCase())
          })
)

const getSingleSelectPlaceholder = () => {
    if (selectedOptions.value && selectedOptions.value.length === 1) {
        return props.labelFn(selectedOptions.value[0])
    } else {
        return props.searchOptionsTextFn()
    }
}
const getMultipleSelectPlaceholder = () => {
    if (selectedOptions.value?.length === 1) {
        return props.labelFn(selectedOptions.value[0])
    } else if (selectedOptions.value?.length === 0) {
        return props.searchOptionsTextFn()
    } else {
        return `${selectedOptions.value.length} ${props.itemNameTextFn(
            selectedOptions.value.length
        )}`
    }
}

const $inputPlaceholder = computed(() => {
    if (props.inputPlaceholder) {
        return props.inputPlaceholder
    } else if (!props.multiple) {
        return getSingleSelectPlaceholder()
    } else {
        return getMultipleSelectPlaceholder()
    }
})

const showFooter = computed(() => props.multiple && open.value && selectedOptions.value?.length)
</script>
<template>
    <ComboboxRoot
        class="flex flex-col text-nowrap relative"
        v-model="selectedOptions"
        :multiple
        as="div"
        :by="props.trackBy"
        v-model:open="open"
        @keydown.esc="close"
        :resetSearchTermOnBlur="true"
        ref="listselectRoot"
    >
        <ComboboxAnchor asChild>
            <ComboboxInput v-model:searchTerm="searchTerm" asChild>
                <ListSelectInput
                    :inputClasses="props.inputClasses"
                    :optionsLoading="props.optionsLoading"
                    :inputPlaceholder="$inputPlaceholder"
                    :toggleOpen="toggleOpen"
                    @keydown.arrow-down="open = true"
                    @keydown.arrow-up="open = true"
                    class="form-inputfield-within"
                    ref="listselectInput"
                />
            </ComboboxInput>
        </ComboboxAnchor>
        <ComboboxPortal :disabled="!props.portal">
            <ComboboxContent
                class="min-w-20 fixed left-0 w-fit h-100 bg-surface shadow-lg rounded border border-border"
                :class="props.dropdownClasses"
                :style="{ width: props.dropDownWidth, zIndex: props.dropDownZIndex }"
                position-strategy="fixed"
                position="popper"
                align="start"
                @keydown.esc="close"
            >
                <slot name="list-excess" v-if="listLengthExceeded">
                    <ListSelectExcessIndicator
                        :listLengthExceeded="listLengthExceeded"
                        :maxSelectionLength="props.maxSelectionLength"
                        :maxSelectionLengthTextFn="props.maxSelectionLengthTextFn"
                    />
                </slot>
                <ComboboxViewport>
                    <ComboboxVirtualizer
                        v-slot="{ option }"
                        :options="filteredOptions"
                        :text-content="props.labelFn"
                        :estimate-size="props.optionSize"
                    >
                        <ComboboxItem
                            :value="option"
                            asChild
                            class="listselect__option flex items-center justify-start w-full min-h-[38px] max-h-[38px] p-0"
                        >
                            <ListSelectItem
                                :option="option"
                                :labelFn="props.labelFn"
                                :truncateItems="props.truncateItems"
                            />
                        </ComboboxItem>
                    </ComboboxVirtualizer>
                </ComboboxViewport>
                <slot name="footer" v-if="showFooter" :selection="{ selectedOptions }">
                    <ListSelectPreview
                        :selectedOptions="selectedOptions"
                        :labelFn="props.labelFn"
                        :selectionTextFn="props.selectionTextFn"
                        @remove-option="removeFromSelection"
                    ></ListSelectPreview>
                </slot>
            </ComboboxContent>
        </ComboboxPortal>
    </ComboboxRoot>
</template>
