<template>
    <div v-busy="show">
        <slot />
    </div>
</template>
<script>
export default {
    name: 'loading-overlay',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    }
}
</script>
