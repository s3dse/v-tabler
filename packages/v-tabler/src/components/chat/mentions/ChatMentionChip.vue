<template>
    <span
        contenteditable="false"
        class="inline-flex max-w-full items-center rounded-full border px-2 py-0.5 align-baseline text-sm font-medium"
        :class="
            mention.resolved
                ? 'border-primary/30 bg-primary/10 text-default'
                : 'cursor-pointer border-warning/50 bg-warning/10 text-default'
        "
        :tabindex="mention.resolved ? undefined : 0"
        :role="mention.resolved ? undefined : 'button'"
        :title="accessibleLabel"
        :aria-label="accessibleLabel"
        @click.stop="activate"
        @keydown.enter.prevent="activate"
        @keydown.space.prevent="activate"
    >
        <span class="truncate">{{ mention.label }}</span>
        <span
            v-if="!mention.resolved"
            aria-hidden="true"
            class="i-tabler-alert-circle ml-1 size-4"
        />
    </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

const props = defineProps({
    mention: { type: Object, required: true }
})

const emit = defineEmits(['activate'])
const { t } = useI18n()

const accessibleLabel = computed(() =>
    props.mention.resolved
        ? `${props.mention.label}, ${props.mention.type}`
        : `${props.mention.label}, ${props.mention.type}, ${t('vTabler.chat.mentions.unresolved')} ${t('vTabler.chat.mentions.resolve')}`
)

const activate = () => {
    if (!props.mention.resolved) emit('activate')
}
</script>
