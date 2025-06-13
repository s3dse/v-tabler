<template>
    <Popper arrow open-delay="100" close-delay="100">
        <template #content="props">
            <slot name="content" v-bind="props"/>
        </template>
        <span class="form-help">?</span>
    </Popper>
</template>

<script>
import { defineComponent } from 'vue'
import Popper from 'vue3-popper'

export default defineComponent({
    components: {
        Popper
    }
})
</script>
<style scoped>
:deep(.popper) {
    --at-apply: "p-4!";
    --at-apply: "bg-surface!";
    --at-apply: "border! border-solid! rounded!";
    --at-apply: "border-border!";
    --at-apply: "text-default!";
    --at-apply: "transition-none!";
}
:deep(.popper[data-popper-placement^='bottom'] [data-popper-arrow]::before) {
    --at-apply: "border-t! border-l! border-r-none! border-b-none!";
    --at-apply: "border-t-solid!";
    --at-apply: "border-l-solid! bg-surface!";
    --at-apply: "border-border!"
    --at-apply: "transition-none!";
}

:deep(.popper[data-popper-placement^='top'] [data-popper-arrow]::before) {
    --at-apply: "border-b! border-r! border-l-none! border-t-none!";
    --at-apply: "border-b-solid!";
    --at-apply: "border-r-solid! bg-surface!";
    --at-apply: "border-border";
    --at-apply: "transition-none!";
}

</style>
