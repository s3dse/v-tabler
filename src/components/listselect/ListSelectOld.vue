<script setup>
import { computed, toValue, ref, watch, useTemplateRef } from 'vue'
import {
    ListboxContent,
    ListboxFilter,
    ListboxItem,
    ListboxRoot,
    ListboxVirtualizer,
    ScrollAreaCorner,
    ScrollAreaRoot,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport
} from 'reka-ui'
import { vOnClickOutside } from '@vueuse/components'
import ListSelectItem from './ListSelectItem.vue'
import ListSelectPreview from './ListSelectPreview.vue'
import ListSelectExcessIndicator from './ListSelectExcessIndicator.vue'
import ListSelectInput from './ListSelectInput.vue'
import delay from '@/utils/delay.js'

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
    truncateItems: { type: Boolean, default: false }
})

const listLengthExceeded = ref(false)

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

const handleListLengthExceeded = value => {
    listLengthExceeded.value = true
    delay(props.selectionExceededInfoDuration).then(() => {
        listLengthExceeded.value = false
    })
    return [...value].splice(0, props.maxSelectionLength)
}

const selectedOptions = defineModel({
    type: [Object, Array],
    get(value) {
        const val = toValue(value)
        return preserveArray(val, props.multiple)
    },
    set(newValue) {
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
const toggleOpen = () => {
    open.value = !open.value
}

const searchTerm = ref('')
watch(searchTerm, newVal => {
    if (newVal.length > 0 && !open.value) {
        open.value = true
    }
})


const listboxRootRef = useTemplateRef('listboxRoot')
watch(open, newVal => {
    if (!newVal) {
        searchTerm.value = ''
    } else {
        listboxRootRef.value?.highlightSelected()
    }
})

const searchInput = ref(null)
const clearSearchButton = ref(null)
const dropdownToggle = ref(null)

const close = () => {
    open.value = false
}

const onClickOutsideHandler = [close, { ignore: [dropdownToggle, searchInput, clearSearchButton] }]

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
    <ListboxRoot
        class="flex flex-col text-nowrap relative"
        v-model="selectedOptions"
        :multiple="props.multiple"
        as="div"
        :by="props.trackBy"
        v-on-click-outside="onClickOutsideHandler"
        @keydown.enter.prevent="() => {}"
        ref="listboxRoot"
    >
        <ListboxFilter v-model:searchTerm="searchTerm" @keydown.esc="close" asChild>
            <ListSelectInput
                :inputClasses="props.inputClasses"
                :optionsLoading="props.optionsLoading"
                :inputPlaceholder="$inputPlaceholder"
                :toggleOpen="toggleOpen"
                @keydown.arrow-down="open = true"
                @keydown.arrow-up="open = true"
                class="form-inputfield-within"
            />
        </ListboxFilter>
        <div
            v-if="open"
            class="min-w-fit absolute z-10 top-[39px] left-0 bg-surface shadow-lg rounded"
            :class="props.dropdownClasses"
            :style="{ 'z-index': props.dropDownZIndex, width: props.dropDownWidth }"
        >
            <ScrollAreaRoot :scrollHideDelay="50" class="h-100 overflow-hidden">
                <slot name="list-excess" v-if="listLengthExceeded">
                    <ListSelectExcessIndicator
                        :listLengthExceeded="listLengthExceeded"
                        :maxSelectionLength="props.maxSelectionLength"
                        :maxSelectionLengthTextFn="props.maxSelectionLengthTextFn"
                    />
                </slot>
                <ScrollAreaViewport
                    @keydown.esc="close"
                    class="w-full border-t border-l border-r border-border rounded-t h-full"
                    :class="{ 'border-b rounded-b': !showFooter }"
                    asChild
                >
                    <ListboxContent asChild>
                        <ListboxVirtualizer
                            v-slot="{ option }"
                            :options="filteredOptions"
                            :textContent="props.labelFn"
                            :estimateSize="props.optionSize"
                            class=""
                        >
                            <ListboxItem
                                :value="option"
                                class="listselect__option flex items-center justify-start w-full min-h-[38px] max-h-[38px] p-0"
                                asChild
                            >
                                <slot name="option" :option="option">
                                    <ListSelectItem
                                        :option="option"
                                        :labelFn="props.labelFn"
                                        :truncateItems="props.truncateItems"
                                    />
                                </slot>
                            </ListboxItem>
                        </ListboxVirtualizer>
                    </ListboxContent>
                </ScrollAreaViewport>
                <ScrollAreaScrollbar
                    class="flex select-none touch-none p-0.5 bg-inherit hover:bg-inherit data-[orientation=vertical]:w-3 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-3"
                    orientation="vertical"
                >
                    <ScrollAreaThumb
                        class="flex-1 w-full bg-scrollbar-thumb hover:bg-scrollbar-thumb-hover rounded-sm relative before:content-[''] before:absolute before:top-1/2 before:left-1/2"
                    />
                </ScrollAreaScrollbar>
                <ScrollAreaCorner />
            </ScrollAreaRoot>
            <div
                class="border border-border rounded-b min-h-25 max-h-fit p-2"
                v-if="showFooter"
            >
                <slot name="footer" :selection="{ selectedOptions }">
                    <ListSelectPreview
                        :selectedOptions="selectedOptions"
                        :labelFn="props.labelFn"
                        :selectionTextFn="props.selectionTextFn"
                        @remove-option="removeFromSelection"
                    ></ListSelectPreview>
                </slot>
            </div>
        </div>
    </ListboxRoot>
</template>
