<template>
    <label
        class="flex items-center bg-inputfield border border-border rounded"
    >
        <input
            v-model="searchTerm"
            class="w-full h-[2.31rem] bg-inputfield rounded text-sm text-default outline-none pl-2"
            :class="props.inputClasses"
            ref="searchInput"
            v-bind:placeholder="inputPlaceholder"
        />
        <div
            v-if="searchTerm"
            class="shrink-0 i-tabler-backspace block text-2xl text-muted hover:cursor-pointer"
            ref="clearSearchButton"
            @click.prevent="searchTerm = ''"
        ></div>
        <div v-busy="optionsLoading">
            <span
                class="shrink-0 listselect--dropdown-toggle i-tabler-chevron-down block text-2xl text-muted mr-2 hover:cursor-pointer"
                @click.prevent="toggleOpen"
                ref="dropdownToggle"
            ></span>
        </div>
    </label>
</template>
<script setup>
const props = defineProps({
    inputClasses: String,
    optionsLoading: Boolean,
    inputPlaceholder: String,
    toggleOpen: Function
});
const searchTerm = defineModel('searchTerm', { type: String, default: null });
</script>
