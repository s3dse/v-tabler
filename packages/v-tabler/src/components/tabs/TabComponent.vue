<template>
    <li v-if="help">
        <div class="flex gap-2">
        <span>{{ title }}</span>
        <help-component>
            <template #content><p class="text-sm font-light normal-case" v-html="help"></p></template>
        </help-component>
        </div>
    </li>
    <li v-else class="">
        {{ title }}
    </li>
</template>
<script setup>
import HelpComponent from '../help/HelpComponent.vue';
defineProps({
    title: {
        type: String
    },
    help: {
        type: String
    }
})
</script>
