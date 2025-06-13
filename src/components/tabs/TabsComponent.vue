<template>
    <ul class="flex px-2 border-b border-border w-full">
        <tab-component 
            class="data-[active=true]:bg-surface 
            border border-border
            data-[active=true]:border-b-none 
            dark:data-[active=true]:text-default
            -mb-px py-3 px-4 inline-flex items-center gap-x-2 
            text-sm font-medium text-center 
            data-[active=false]:border-t-transparent
            data-[active=false]:border-l-transparent
            data-[active=false]:border-r-transparent
            hover:data-[active=false]:border-border
            hover:data-[active=false]:text-primary-hover
            text-muted rounded-t 
            hover:border-t-1  hover:border-l-1 hover:border-r-1
            hover:border-t-border  hover:border-l-border hover:border-r-border
            hover:border-t-solid  hover:border-l-solid hover:border-r-solid
            disabled:bg-disabled disabled:pointer-events-none 
            dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-muted transition-colors duration-100 ease-in-out"
            v-for="(tab, index) in tabs" :key="tab" :title="tabLabel(tab)" :help="tab.help" @click="selectTab(index)" :data-active="index===tabIndex"></tab-component>
    </ul>
</template>
<script setup>
import { ref } from 'vue'
import TabComponent from './TabComponent.vue';
const props = defineProps({
    tabs: {
        type: Array,
        default: () => []
    },
    currentTabIndex: {
        type: Number,
        default: 0
    }
})
const tabLabel = tab => tab.label ? tab.label : `tab-${props.tabs.indexOf(tab)}`
const tabIndex = ref(props.currentTabIndex)
const emit = defineEmits(['update:currentTabIndex'])
const selectTab = index => {
    tabIndex.value = index
    emit('update:currentTabIndex', index)
}
</script>