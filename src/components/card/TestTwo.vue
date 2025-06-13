<script setup>
defineProps({
    message: {
        type: String
    }
})
</script>
<template><div class="card-title">{{ message }}</div></template>