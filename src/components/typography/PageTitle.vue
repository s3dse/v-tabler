<script setup lang="ts">
import Heading from './Heading.vue'
</script>

<template>
    <Heading tag="h1" v-bind="$attrs">
        <slot />
    </Heading>
</template>
