<template>
    <div ref="listExcess" class="absolute left-0 right-0 ml-auto mr-auto min-w-10 w-fit z-999999">
        <div class="bg-background rounded">
            <div
                v-if="listLengthExceeded"
                class="flex gap-3 items-center bg-error-bg dark:bg-error-bg border border-error-border rounded p-2 text-sm text-onerror color-transition"
            >
            <div class="i-tabler-alert-circle text-base block text-error"></div>
                {{ props.maxSelectionLengthTextFn(props.maxSelectionLength) }}
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    listLengthExceeded: Boolean,
    maxSelectionLength: Number,
    maxSelectionLengthTextFn: Function
})
</script>
