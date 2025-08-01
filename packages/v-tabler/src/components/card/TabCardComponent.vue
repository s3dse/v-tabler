<template>
    <div class="card">
        <div class="pt-3 bg-surface">
            <tabs-component @update:current-tab-index="selectTab" :tabs="tabs">
            </tabs-component>
        </div>

        <keep-alive v-if="keepAlive">
            <component :is="component" v-bind="componentProps" v-on="componentEvents"></component>
        </keep-alive>
        <component v-else :is="component" v-bind="componentProps" v-on="componentEvents"></component>

    </div>
</template>
<script setup>
import TabsComponent from '../tabs/TabsComponent.vue'
import { ref, computed } from 'vue'
const props = defineProps({
    currentTabIndex: {
        type: Number,
        default: 0
    },
    tabs: {
        type: Array,
        default: () => []
    },
    keepAlive: {
        type: Boolean,
        default: false
    }
})
const component = computed(() => props.tabs[tabIndex.value].component)
const componentProps = computed(() => props.tabs[tabIndex.value].props)
const componentEvents = computed(() => props.tabs[tabIndex.value].events || {})
const tabIndex = ref(props.currentTabIndex)
const selectTab = index => {
    tabIndex.value = index
}
</script>
