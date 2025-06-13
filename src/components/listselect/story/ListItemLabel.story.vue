<template>
    <Story title="ListItemLabel" :layout="{ type: 'grid', width: '75%' }">
        <Variant title="default" :init-state="initState('default')">
            <template #default="{ state }">
                <ListItemLabel
                    class="w-50!"
                    :label="state.label"
                    :isSelected="state.selected"
                    :truncateLabel="state.truncate"
                ></ListItemLabel>
            </template>
        </Variant>
        <Variant title="selected" :init-state="initState('selected')">
            <template #default="{ state }">
                <ListItemLabel
                    class="w-50!"
                    :label="state.label"
                    :isSelected="state.selected"
                    :truncateLabel="state.truncate"
                ></ListItemLabel>
            </template>
        </Variant>
        <Variant title="truncated" :init-state="initState('truncated')">
            <template #default="{ state }">
                <ListItemLabel
                    class="w-50!"
                    :label="state.label"
                    :isSelected="state.selected"
                    :truncateLabel="state.truncate"
                ></ListItemLabel>
            </template>
        </Variant>
        <Variant title="truncated and selected" :init-state="initState('truncatedSelected')">
            <template #default="{ state }">
                <ListItemLabel
                    class="w-50!"
                    :label="state.label"
                    :isSelected="state.selected"
                    :truncateLabel="state.truncate"
                ></ListItemLabel>
            </template>
        </Variant>
    </Story>
</template>
<docs lang="md">
# ListItemLabel

## Props

-   `label` - String: The label to display
-   `selected` - Boolean: Whether the item is selected
-   `truncate` - Boolean: Whether to truncate the label
</docs>
<script setup>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { ListItemLabel } from '..'
function initState(variant) {
    const state = {
        default: {
            label: 'Option 1',
            selected: false,
            truncate: false
        },
        selected: {
            label: 'Option 1',
            selected: true,
            truncate: false
        },
        truncated: {
            label: 'This is a very long option name that should be truncated',
            selected: false,
            truncate: true
        },
        truncatedSelected: {
            label: 'This is a very long option name that should be truncated',
            selected: true,
            truncate: true
        }
    }
    return () => state[variant]
}
</script>