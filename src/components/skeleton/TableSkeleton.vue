<template>
    <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        class="border rounded-sm overflow-hidden relative bg-surface border-border"
    >
        <div
            v-if="_animation.type === 'all'"
            class="absolute inset-0 pointer-events-none shimmer-bg z-0 cursor-wait"
            :class="{ [animations[_animation.speed]]: _animation.type === 'all' }"
        ></div>

        <div class="relative cursor-wait pointer-events-none">
            <div class="grid gap-4 p-4 border-b z-10 border-border" :class="gridCols[columns]">
                <div v-for="n in columns" :key="'header-' + n" class="h-6 rounded-sm bg-muted" />
            </div>

            <div class="space-y-3 p-4 z-10">
                <div
                    v-for="row in rows"
                    :key="'row-' + row"
                    class="grid gap-4"
                    :class="gridCols[columns]"
                >
                    <div
                        v-for="col in columns"
                        :key="`cell-${row}-${col}`"
                        class="h-5 rounded-sm bg-muted"
                        :class="{
                            'shimmer-bg': _animation.type === 'per-row',
                            [animations[_animation.speed]]: _animation.type === 'per-row'
                        }"
                    />
                </div>
            </div>
        </div>
        <slot name="message">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                    class="w-fit flex items-center p-4 gap-2 text-nowrap text-default  border border-border bg-surface rounded-sm shadow-lg"
                >
                    <span
                        class="i-tabler-hourglass-high flex text-2xl"
                    ></span>
                    <span class="text-xl">Fetching data. This may take a while.</span>
                </div>
            </div>
        </slot>
    </div>
</template>
<script>
const defaultAnimation = {
    type: 'all',
    speed: 'normal'
}
</script>
<script setup>
import { computed, toValue } from 'vue'
const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12'
}

const animations = {
    normal: 'animate-shimmer!',
    slow: 'animate-shimmer-slow!'
}

const _animation = computed(() => ({
    ...defaultAnimation,
    ...toValue(props.animation)
}))

const props = defineProps({
    rows: {
        type: Number,
        default: 5
    },
    columns: {
        type: Number,
        default: 5
    },
    animation: {
        type: Object,
        default: () => defaultAnimation,
        validator: value => {
            return (
                typeof value === 'object' &&
                ['all', 'per-row'].includes(value.type) &&
                ['normal', 'slow'].includes(value.speed)
            )
        }
    }
})
</script>
