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
<SingleSelect v-model="selected" :options="options" :placeholder="'Choose one...'" />
```

### Props

| Prop          | Type   | Default         | Description                             |
| ------------- | ------ | --------------- | --------------------------------------- |
| `modelValue`  | Any    | `undefined`     | The selected option bound via `v-model` |
| `options`     | Array  | `[]`            | List of selectable options              |
| `labelKey`    | String | `null`          | Key to the option label                 |
| `placeholder` | String | `Select option` | Placeholder label                       |

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
<MultiSelect v-model="selected" :options="options" :labelFunction="x => x.name" />
```

### Props

| Prop                  | Type     | Default                   | Description                             |
| --------------------- | -------- | ------------------------- | --------------------------------------- |
| `modelValue`          | Array    | `[]`                      | The selection bound via `v-model`       |
| `options`             | Array    | `[]`                      | List of selectable options              |
| `isDefaultOption`     | Function | `x => x.id === 'DEFAULT'` | Function to identify the default option |
| `labelFunction`       | Function | `x => x.label`            | Function to retrieve the option label   |
| `idFunction`          | Function | `x => x.id`               | Function to retrieve the option id      |
| `placeholderFunction` | Function | `undefined`               | Function to retrieve the placeholder    |

### Events

- `update:modelValue` when the selection changes

---

For advanced selection features, see [ListSelect](./listselect.md).
