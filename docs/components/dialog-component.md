# DialogComponent

The `DialogComponent` provides a modal dialog for user interactions, confirmations, and custom content. It supports custom headers, footers, slots, and accessibility features.

## Features

- Modal dialog with backdrop
- Customizable title and description
- Multiple slots for custom content and actions
- Confirm and cancel actions
- ESC key and backdrop click to close
- Focus management for accessibility
- Optional pre-confirm logic
- Disabled confirm button support

## Props

| Prop              | Type     | Default | Description                       |
| ----------------- | -------- | ------- | --------------------------------- |
| `title`           | String   |         | Dialog title                      |
| `description`     | String   |         | Dialog description                |
| `confirmDisabled` | Boolean  | `false` | Disable the confirm button        |
| `preConfirm`      | Function |         | Function to run before confirming |

## Usage Example

```vue
<script setup>
import { ref } from 'vue'
const showDialog = ref(false)
const handleConfirm = () => {
    // custom logic
    showDialog.value = false
}
</script>
<DialogComponent
    v-model="showDialog"
    title="Confirm Action"
    description="Are you sure you want to proceed?"
    @confirm="handleConfirm"
    @cancel="() => (showDialog = false)"
>
  <template #trigger>
    <button>Open Dialog</button>
  </template>
  <template #content>
    <div>Custom dialog content here</div>
  </template>
  <template #cancelLabel>
    <span>Abort</span>
  </template>
  <template #confirmLabel>
    <span>Proceed</span>
  </template>
</DialogComponent>
```

## Slots

| Name             | Props      | Description                               |
| ---------------- | ---------- | ----------------------------------------- |
| `trigger`        | none       | Custom trigger element for opening dialog |
| `content`        | `{ open }` | Main dialog content area                  |
| `cancelTrigger`  | none       | Custom cancel button element              |
| `cancelLabel`    | none       | Custom label for cancel button            |
| `confirmTrigger` | none       | Custom confirm button element             |
| `confirmLabel`   | none       | Custom label for confirm button           |

## Events

- `confirm`: Emitted when the confirm button is clicked
- `cancel`: Emitted when the cancel button or backdrop is clicked

---

For advanced usage, see the source code in `packages/v-tabler/src/components/dialog/DialogComponent.vue`.
