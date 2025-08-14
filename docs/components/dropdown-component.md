# DropdownComponent

The `DropdownComponent` provides a simple dropdown menu for selecting options or triggering actions. It supports custom triggers, option lists, and slot-based customization for advanced use cases.

## Features

- Customizable trigger (button, icon, etc.)
- List of selectable options
- Emits selection events
- Supports custom option rendering via slots
- Positioning and styling options

## Props

| Prop            | Type   | Default | Description                |
| --------------- | ------ | ------- | -------------------------- |
| `options`       | Array  | `[]`    | List of options to display |
| `modelValue`    | Any    |         | Selected value (v-model)   |
| `trigger`       | String |         | Custom trigger element     |
| `class`         | String |         | Additional CSS classes     |
| `dropdownClass` | String |         | Classes for dropdown menu  |

## Usage Example

```vue
<script setup>
import { ref } from 'vue'
const selected = ref(null)
const options = [
    { label: 'Option 1', value: 'a' },
    { label: 'Option 2', value: 'b' }
]
</script>
<DropdownComponent v-model="selected" :options="options">
  <template #toggle-label>
    <span>Open Menu</span>
  </template>
  <template #option="{ option }">
    <span>{{ option.label }}</span>
  </template>
  <template #itemlabel="{ option }">
    <span>{{ option.label }}</span>
  </template>
</DropdownComponent>
```

## Slots

| Name           | Props        | Description                            |
| -------------- | ------------ | -------------------------------------- |
| `toggle-label` | none         | Custom label for the trigger           |
| `itemlabel`    | `{ option }` | Custom label rendering for each option |

## Events

- `update:modelValue`: Emitted when an option is selected

---

For advanced usage, see the source code in `packages/v-tabler/src/components/dropdown/DropdownComponent.vue`.
