<template>
    <div class="card-component" :class="[classes ? classes : 'card']">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        classes: {
            type: String,
            default: ''
        }
    },
    name: 'card-component'
}
</script>
