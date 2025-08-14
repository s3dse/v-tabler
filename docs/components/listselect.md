# ListSelect Component

The `ListSelect` component is a flexible multi-select dropdown. It supports both single and multiple selection modes, search/filtering, custom rendering, and selection limits.

## Features

- **Single & Multiple Selection**: Use the `multiple` prop to toggle between modes.
- **Searchable**: Built-in search/filtering of options.
- **Customizable Labels**: Use `labelFn` to control how options are displayed.
- **Selection Limit**: Restrict the number of selections with `maxSelectionLength`.
- **Custom Texts**: Override placeholder, selection, and limit texts via props.
- **Virtualized List**: Efficient rendering for large option sets.
- **Loading State**: Show loading indicator while fetching options.
- **Custom Footer & Excess Indicator**: Slots for preview and selection limit info.

## Props

| Prop                       | Type     | Default                                         | Description                   |
| -------------------------- | -------- | ----------------------------------------------- | ----------------------------- |
| `options`                  | Array    | `[]`                                            | List of selectable options    |
| `multiple`                 | Boolean  | `true`                                          | Enable multiple selection     |
| `trackBy`                  | String   | `'id'`                                          | Key to track options          |
| `inputPlaceholder`         | String   |                                                 | Input placeholder text        |
| `labelFn`                  | Function | `o => o.label`                                  | Function to get option label  |
| `maxSelectionLength`       | Number   | `10`                                            | Maximum number of selections  |
| `selectionTextFn`          | Function | `count => "${count} items selected"`            | Text for selection preview    |
| `maxSelectionLengthTextFn` | Function | `limit => "You can only select ${limit} items"` | Text when limit exceeded      |
| `optionsLoading`           | Boolean  | `false`                                         | Show loading indicator        |
| `searchFn`                 | Function |                                                 | Custom search/filter function |
| `dropDownZIndex`           | Number   | `9999`                                          | Z-index for dropdown          |
| `dropDownWidth`            | String   | `'30rem'`                                       | Dropdown width                |
| `truncateItems`            | Boolean  | `false`                                         | Truncate long item labels     |
| `portal`                   | Boolean  | `true`                                          | Use portal for dropdown       |

## Usage Example

```vue
<ListSelect
    v-model="selected"
    :options="myOptions"
    :multiple="true"
    :maxSelectionLength="5"
    :inputPlaceholder="'Select items...'"
/>
```

## Option Structure

Options must be provided as an array of objects. By default, each option should have at least an `id` and a `label` property:

```js
const myOptions = [
    { id: 1, label: 'Option One' },
    { id: 2, label: 'Option Two' },
    { id: 3, label: 'Option Three' }
]
```

- The `trackBy` prop (default: `'id'`) determines which property is used to uniquely identify options.
- The `labelFn` prop (default: `o => o.label`) determines how the label is displayed. You can pass a custom function if your option objects use a different property for display:

```js
const myOptions = [
  { key: 'a', name: 'Alpha' },
  { key: 'b', name: 'Beta' }
]
// Use custom keys:
<ListSelect :options="myOptions" trackBy="key" :labelFn="o => o.name" />
```

- You may include additional properties in your option objects for custom rendering or logic.
- For advanced filtering, you can provide a custom `searchFn` prop.

## Slots

| name          | props                                     | description                              |
| ------------- | ----------------------------------------- | ---------------------------------------- |
| `list-excess` | -                                         | Shown when selection limit is exceeded   |
| `footer`      | `selection` object with `selectedOptions` | Custom preview/footer for selected items |

## Events

- `update:modelValue` when the selection changes

## Customization

You can customize the appearance and behavior using props, slots, and custom functions for labels and search.

---

For more advanced usage, see the source code in `packages/v-tabler/src/components/listselect/ListSelect.vue`.
