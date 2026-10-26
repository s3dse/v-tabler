<template>
  <div
    ref="menuRef"
    v-bind="$attrs"
    :id="menuId"
    role="listbox"
    class="mention-menu z-50 overflow-y-auto rounded border border-border bg-surface p-1 text-default shadow-lg"
  >
    <p v-if="loading" role="status" class="px-3 py-2 text-sm text-muted">
      {{ t('vTabler.chat.mentions.loading') }}
    </p>
    <p v-else-if="error" role="alert" class="px-3 py-2 text-sm text-error">
      {{ t('vTabler.chat.mentions.error') }}
    </p>
    <p v-else-if="options.length === 0" role="status" class="px-3 py-2 text-sm text-muted">
      {{ t('vTabler.chat.mentions.empty') }}
    </p>
    <button
      v-for="(option, index) in options"
      v-else
      :id="optionId(index)"
      :key="option.id"
      type="button"
      role="option"
      tabindex="-1"
      :aria-selected="!plainTextHighlighted && index === highlightedIndex"
      class="block w-full rounded px-3 py-2 text-left text-sm text-default"
      :class="
        !plainTextHighlighted && index === highlightedIndex
          ? 'bg-primary-lt text-default'
          : 'bg-transparent text-default hover:bg-surface-hover'
      "
      @mouseenter="emit('highlight', index)"
      @mousedown.prevent
      @click="emit('select', option)"
    >
      {{ option.label }}
    </button>
    <button
      v-if="allowPlainText"
      :id="`${menuId}-plain-text`"
      type="button"
      role="option"
      tabindex="-1"
      :aria-selected="plainTextHighlighted"
      class="mt-1 block w-full rounded border-t border-border px-3 py-2 text-left text-sm"
      :class="
        plainTextHighlighted
          ? 'bg-primary-lt text-default'
          : 'bg-transparent text-muted hover:bg-surface-hover hover:text-default'
      "
      @mouseenter="emit('highlight-plain-text')"
      @mousedown.prevent
      @click="emit('use-plain-text')"
    >
      {{ t('vTabler.chat.mentions.usePlainText') }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUpdated, ref } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  loading: Boolean,
  error: { default: null },
  options: { type: Array, default: () => [] },
  highlightedIndex: { type: Number, default: 0 },
  menuId: { type: String, required: true },
  allowPlainText: Boolean,
  plainTextHighlighted: Boolean
})

const { t } = useI18n()
const emit = defineEmits(['highlight', 'highlight-plain-text', 'select', 'use-plain-text'])
const menuRef = ref(null)

const optionId = (index) => `${props.menuId}-option-${index}`
const scrollHighlightedOptionIntoView = () =>
  menuRef.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })

onMounted(scrollHighlightedOptionIntoView)
onUpdated(scrollHighlightedOptionIntoView)
</script>

<style scoped>
.mention-menu {
  width: var(--reka-popover-trigger-width);
  max-height: min(15rem, var(--reka-popover-content-available-height));
}
</style>
