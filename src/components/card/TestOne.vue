<script setup>
defineProps({
    message: {
        type: String
    }
})
</script>
<template><div class="p-4">{{ message }}</div></template>