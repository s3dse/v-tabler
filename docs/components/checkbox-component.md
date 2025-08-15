# CheckboxComponent

The `CheckboxComponent` provides a flexible and accessible checkbox for forms and lists. It supports single and multiple selection, custom labels, disabled and indeterminate states, and array binding for advanced use cases.

## Features

- Single or multiple selection
- Bind to boolean or array
- Custom label and value
- Disabled state support via prop
- Indeterminate state support via prop
- Accessibility: `aria-checked`, `aria-disabled`, label association
- Emits model updates

## Props

| Prop            | Type          | Default | Description           |
| --------------- | ------------- | ------- | --------------------- |
| `modelValue`    | Boolean/Array |         | Bound value (v-model) |
| `label`         | String        |         | Label text            |
| `disabled`      | Boolean       | `false` | Disable the checkbox  |
| `id`            | String        |         | HTML id attribute     |
| `name`          | String        |         | HTML name attribute   |
| `indeterminate` | Boolean       | `false` | Indeterminate state   |

## Usage Examples

### Single Checkbox

```vue
<script setup>
import { ref } from 'vue'
const checked = ref(false)
</script>
<CheckboxComponent v-model="checked" label="Accept Terms" />
```

### Multiple Checkboxes (Array Binding)

```vue
<script setup>
import { ref } from 'vue'
const checkedValues = ref([])
const options = ['Option A', 'Option B', 'Option C']
</script>
<div>
  <CheckboxComponent
    v-for="opt in options"
    :key="opt"
    :label="opt"
    v-model="checkedValues"
  />
  <pre>{{ checkedValues }}</pre>
</div>
```

### Indeterminate State

```vue
<script setup>
import { ref } from 'vue'
const checked = ref(false)
</script>
<CheckboxComponent v-model="checked" label="Partially Selected" :indeterminate="true" />
```

## Accessibility

- Uses `aria-checked` to reflect checked, unchecked, and indeterminate states
- Uses `aria-disabled` for disabled state
- Label is associated with input via `for` and `id`

## Events

- `update:modelValue`: Emitted when the value changes

---

For advanced usage, see the source code in `packages/v-tabler/src/components/checkbox/CheckboxComponent.vue`.
