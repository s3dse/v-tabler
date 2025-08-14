# Select Components

V-Tabler provides several select components for different use cases:

- `SingleSelect`: For selecting a single value from a list.
- `MultiSelect`: For selecting multiple values from a list.
- `ListSelect`: For advanced list-based selection (see [ListSelect documentation](./listselect.md)).

---

## SingleSelect

The `SingleSelect` component allows users to choose one option from a dropdown list.

### Option Structure

Options should be an array of objects, each with at least an `id` and `label` property:

```js
const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' }
]
```

### Usage Example

```vue
<SingleSelect v-model="selected" :options="options" :inputPlaceholder="'Choose one...'" />
```

### Props

| Prop               | Type     | Default        | Description                  |
| ------------------ | -------- | -------------- | ---------------------------- |
| `options`          | Array    | `[]`           | List of selectable options   |
| `trackBy`          | String   | `'id'`         | Key to track options         |
| `inputPlaceholder` | String   |                | Input placeholder text       |
| `labelFn`          | Function | `o => o.label` | Function to get option label |
| `dropdownClasses`  | String   | `''`           | Custom classes for dropdown  |
| `optionSize`       | Number   | `40`           | Option height (px)           |
| `portal`           | Boolean  | `true`         | Use portal for dropdown      |

### Events

- `update:modelValue` when the selection changes

---

## MultiSelect

The `MultiSelect` component allows users to select multiple options from a dropdown list.

### Option Structure

Options should be an array of objects, each with at least an `id` and `label` property:

```js
const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' }
]
```

### Usage Example

```vue
<MultiSelect
    v-model="selected"
    :options="options"
    :maxSelectionLength="3"
    :inputPlaceholder="'Select multiple...'"
/>
```

### Props

| Prop                 | Type     | Default        | Description                  |
| -------------------- | -------- | -------------- | ---------------------------- |
| `options`            | Array    | `[]`           | List of selectable options   |
| `trackBy`            | String   | `'id'`         | Key to track options         |
| `inputPlaceholder`   | String   |                | Input placeholder text       |
| `labelFn`            | Function | `o => o.label` | Function to get option label |
| `dropdownClasses`    | String   | `''`           | Custom classes for dropdown  |
| `optionSize`         | Number   | `40`           | Option height (px)           |
| `maxSelectionLength` | Number   | `10`           | Maximum number of selections |
| `portal`             | Boolean  | `true`         | Use portal for dropdown      |

### Events

- `update:modelValue` when the selection changes

---

For advanced selection features, see [ListSelect](./listselect.md).
