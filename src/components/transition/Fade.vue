<template>
    <Transition name="fade" mode="out-in">
        <div v-if="show">
            <slot />
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        required: true
    }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
