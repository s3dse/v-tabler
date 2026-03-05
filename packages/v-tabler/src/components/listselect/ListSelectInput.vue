<template>
    <label class="flex items-center">
        <input
            v-model="searchTerm"
            class="w-full h-full bg-inputfield rounded text-sm text-default outline-none pl-2"
            :class="props.inputClasses"
            ref="searchInput"
            v-bind:placeholder="inputPlaceholder"
            :id="id"
            tabindex="0"
        />
        <div
            v-if="searchTerm"
            class="shrink-0 i-tabler-backspace block text-2xl text-muted hover:cursor-pointer"
            ref="clearSearchButton"
            @click.prevent="searchTerm = ''"
        ></div>
        <div>
            <div class="relative overflow-hidden flex items-center gap-0" v-busy="optionsLoading">
                <span
                    class="shrink-0 listselect--clear-selection i-tabler-x block text-xl text-subtle hover:text-muted"
                    :class="[
                        selectionLength && selectionLength > 0
                            ? 'opacity-100 hover:cursor-pointer'
                            : 'opacity-0'
                    ]"
                    @click.prevent="$emit('clear-selection')"
                    ref="clearSelectionButton"
                ></span>
                <span
                    class="shrink-0 listselect--dropdown-toggle i-tabler-chevron-down block text-2xl text-muted mr-2 hover:cursor-pointer"
                    @click.prevent="toggleOpen"
                    ref="dropdownToggle"
                ></span>
            </div>
        </div>
    </label>
</template>
<script setup>
import { useId } from 'vue'
const props = defineProps({
    inputClasses: String,
    optionsLoading: Boolean,
    inputPlaceholder: String,
    toggleOpen: Function,
    selectionLength: Number,
    isMultiple: Boolean
})
defineEmits(['clear-selection'])
const searchTerm = defineModel('searchTerm', { type: String, default: null })

const id = `listselect-input-${useId()}`
</script>
