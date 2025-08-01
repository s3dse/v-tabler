<script setup>
import { ref } from 'vue'
import { SelectComponent } from '@/components'

const options = [
    { name: 'Record A', value: 'a' },
    { name: 'Record B', value: 'b' },
    { name: 'Record C', value: 'c' },
    { name: 'Record D', value: 'd' },
    { name: 'Record E', value: 'e' },
    { name: 'Record F', value: 'f' }
]

const selection = ref(options[0])
</script>
<template>
    <select-component
        v-model="selection"
        :options="options"
        label-key="name"
        aria-label="Select option"
    ></select-component>
    <div class="text-gray-900 dark:text-gray-100">{{ selection }}</div>
</template>
