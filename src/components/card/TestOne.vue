<script setup>
defineProps({
    message: {
        type: String
    }
})
</script>
<template><div class="card-title p-4">{{ message }}</div></template>