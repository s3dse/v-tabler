# Heading Component

The `Heading` component provides a flexible way to render headings (`h1`–`h6`) with consistent styling and semantic tags. It is useful for maintaining a unified look and accessibility across your application.

## Features

- Renders any heading level (`h1`–`h6`) via the `tag` prop
- Applies consistent styles for headings
- Supports custom classes
- Slot for custom content

## Props

| Prop  | Type   | Default | Description                 |
| ----- | ------ | ------- | --------------------------- |
| `tag` | String | `'h2'`  | HTML tag to use (`h1`–`h6`) |

## Usage Example

```vue
<Heading tag="h1">Main Title</Heading>
<Heading tag="h3" class="text-primary">Section Title</Heading>
```

## Slots

| Name    | Props | Description        |
| ------- | ----- | ------------------ |
| default | none  | Content of heading |

---

For advanced usage, see the source code in `packages/v-tabler/src/components/typography/Heading.vue`.
