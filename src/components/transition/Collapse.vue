<template>
    <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
    >
        <div v-show="show" ref="container" class="overflow-hidden">
            <div class="collapse-inner transition-opacity duration-300 ease">
                <slot />
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
})

const container = ref(null)

function beforeEnter(el) {
    el.style.height = '0'
}

function enter(el) {
    el.style.transition = 'height 0.3s ease'
    el.style.height = el.scrollHeight + 'px'

    const content = el.querySelector('.collapse-inner')
    content.style.opacity = '0'
    requestAnimationFrame(() => {
        content.style.transition = 'opacity 0.3s ease'
        content.style.opacity = '1'
    })
}

function afterEnter(el) {
    el.style.height = 'auto'
    el.style.transition = ''
}

function beforeLeave(el) {
    el.style.height = el.scrollHeight + 'px'
    const content = el.querySelector('.collapse-inner')
    content.style.transition = 'opacity 0.3s ease'
    content.style.opacity = '1'
}

function leave(el) {
    el.style.transition = 'height 0.3s ease'
    el.style.height = '0'

    const content = el.querySelector('.collapse-inner')
    content.style.opacity = '0'
}

function afterLeave(el) {
    el.style.transition = ''
}
</script>
