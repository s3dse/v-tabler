<template>
    <span
        contenteditable="false"
        class="inline-flex max-w-full items-center rounded-full border px-2 py-0.5 align-baseline text-sm font-medium"
        :class="[
            mention.resolved
                ? 'border-primary/30 bg-primary/10 text-default'
                : 'border-warning-border bg-warning-bg text-default',
            { 'cursor-pointer': !mention.resolved && !disabled }
        ]"
        :tabindex="!mention.resolved && !disabled ? 0 : undefined"
        :role="mention.resolved ? undefined : 'button'"
        :aria-disabled="!mention.resolved && disabled ? 'true' : undefined"
        :title="accessibleLabel"
        :aria-label="accessibleLabel"
        @click="activate"
        @keydown.enter.stop.prevent="activate"
        @keydown.space.stop.prevent="activate"
    >
        <span class="truncate">{{ mention.label }}</span>
        <span
            v-if="!mention.resolved"
            aria-hidden="true"
            class="i-tabler-alert-circle ml-1 size-4 text-warning"
        />
    </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

const props = defineProps({
    mention: { type: Object, required: true },
    disabled: Boolean
})

const emit = defineEmits(['activate'])
const { t } = useI18n()

const accessibleLabel = computed(() =>
    props.mention.resolved
        ? `${props.mention.label}, ${props.mention.type}`
        : `${props.mention.label}, ${props.mention.type}, ${t('vTabler.chat.mentions.unresolved')} ${t('vTabler.chat.mentions.resolve')}`
)

const activate = () => {
    if (!props.mention.resolved && !props.disabled) emit('activate')
}
</script>
