# ToggleComponent

The `ToggleComponent` is a flexible switch/toggle for boolean values, supporting custom labels, sizes, and disabled states.

## Features

- Boolean value toggle (on/off)
- Customizable labels for on/off states
- Size variants (small, medium, large)
- Disabled state support
- Slot for custom content

## Props

| Prop         | Type    | Default     | Description                        |
| ------------ | ------- | ----------- | ---------------------------------- |
| `modelValue` | Boolean | `false`     | The current value (v-model)        |
| `leftLabel`  | String  | `undefined` | Label shown to the left of toggle  |
| `rightLabel` | String  | `undefined` | Label shown to the right of toggle |

## Usage Examples

### Basic Toggle

```vue
<script setup>
import { ref } from 'vue'
const enabled = ref(false)
</script>
<ToggleComponent v-model="enabled" labelOn="Enabled" labelOff="Disabled" />
```

## Events

- `update:modelValue` when the value changes

## Slots

| name        | props           | description                                         |
| ----------- | --------------- | --------------------------------------------------- |
| leftLabel   | `{ isChecked }` | Slot for a custom label on the left side            |
| rightLabel  | `{ isChecked }` | Slot for a custom label on the right side           |
| toggle-icon | `{ isChecked }` | Slot for a custom toggle icon on the toggle trigger |

- Default slot for custom content inside the toggle

---

For advanced usage, see the source code in `packages/v-tabler/src/components/toggle/ToggleComponent.vue`.
