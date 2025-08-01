<template>
    <div class="font-semibold uppercase text-muted text-sm py-2">
        {{ props.selectionTextFn(selectedOptions.length) }}:
    </div>
    <ul class="flex flex-wrap gap-1 max-w-100">
        <li
            v-for="(option, index) in selectedOptions"
            :key="`selected-option-${index}`"
            class="px-2 bg-surface border-1 border-border rounded text-default flex items-center gap-2 w-fit"
        >
            <span>
                {{ props.labelFn(option) }}
            </span>
            <span class="hover:bg-surface rounded cursor-pointer">
                <span
                    class="block i-tabler-x text-muted hover:text-default"
                    :class="`remove-option-${index}`"
                    @click="emit('removeOption', index)"
                ></span>
            </span>
        </li>
    </ul>
</template>
<script setup>
const props = defineProps({
    selectedOptions: Array,
    labelFn: Function,
    selectionTextFn: Function,
});
const emit = defineEmits(['removeOption']);
</script>