<template>
    <div class="flex items-center" :class="[$attrs.disabled ? 'pointer-events-none cursor-default' : '']">
        <slot name="leftLabel" v-bind="{ isChecked }">
            <span v-if="leftLabel" class="text-default">{{ leftLabel }}</span>
        </slot>
        <label
            class="relative inline-flex items-center cursor-pointer outline-none"
            tabindex="0"
            @keydown.space.prevent="isChecked = !isChecked"
            @keydown.left.prevent="isChecked = false"
            @keydown.right.prevent="isChecked = true"
            @focus="isFocused = true"
            @blur="isFocused = false"
        >
            <input type="checkbox" class="sr-only" v-model="isChecked" />
            <div
                class="w-10 h-6 data-[checked=true]:bg-primary data-[checked=false]:bg-inputfield border border-border rounded-full shadow-inner transition duration-150 ease-in-out"
                :class="[$attrs.disabled ? 'bg-disabled!' : '']"
                :data-checked="isChecked"

            ></div>
            <div
                class="absolute left-0.5 w-5 h-5 bg-surface border border-2 border-border text-default  rounded-full shadow transform transition-transform duration-150 ease-in-out"
                :class="{ 'translate-x-4.05 bg-surface': isChecked, 'border-primary-hover': isFocused }"
            >
                <slot name="toggle-icon" v-bind="{ isChecked }">
                    <span :data-checked="isChecked" class="flex mx-auto mt-0.5"></span>
                </slot>
            </div>
        </label>
        <slot name="rightLabel" v-bind="{ isChecked }">
            <span v-if="rightLabel" class="text-default">{{ rightLabel }}</span>
        </slot>
    </div>
</template>
<script setup>
import { ref, useAttrs } from 'vue'
const $attrs = useAttrs()

const isChecked = defineModel({
    type: Boolean,
    default: false
})

const isFocused = ref(false)
const props = defineProps({
    leftLabel: {
        type: String,
        required: false
    },
    rightLabel: {
        type: String,
        required: false
    }
})
</script>
