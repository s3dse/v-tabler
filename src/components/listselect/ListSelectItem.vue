<template>
    <div
        :class="{ 'truncate': props.truncateItems }"
        class="listselectitem 
        w-full h-full ps-2 py-2 hover:cursor-pointer
        text-default
        data-[state=checked]:selected-major
        highlighted-major
        [&[data-state=checked][data-highlighted]]:bg-error
        [&[data-state=checked][data-highlighted]]:text-onprimary
        "
    >
        {{ props.labelFn(option) }}
    </div>
</template>
<script setup>

const props = defineProps({
    option: Object,
    labelFn: Function,
    truncateItems: {type: Boolean, default: false},
});
</script>
