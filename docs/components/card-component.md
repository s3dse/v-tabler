# Card Component

The `CardComponent` is a versatile container component that allows you to create cards with customizable headers, footers, and content. It supports slots for maximum flexibility.

## Props

| Prop Name      | Type    | Default | Description                                        |
| -------------- | ------- | ------- | -------------------------------------------------- |
| `classes`      | String  | `''`    | Additional classes to apply to the card container. |
| `headerBorder` | Boolean | `true`  | Whether to display a border below the header slot. |
| `footerBorder` | Boolean | `false` | Whether to display a border above the footer slot. |

## Slots

| Slot Name       | Description                                       |
| --------------- | ------------------------------------------------- |
| `default`       | The main content of the card.                     |
| `header`        | Slot for the card header.                         |
| `header-border` | Slot for customizing the border below the header. |
| `footer`        | Slot for the card footer.                         |
| `footer-border` | Slot for customizing the border above the footer. |

## Usage

### Basic Card

```html
<CardComponent>
    <p>This is a simple card component.</p>
</CardComponent>
```

### Customized Card

```html
<CardComponent class="border-4 border-primary rounded-2xl">
    <template #header>
        <h2 class="text-center">Custom Header</h2>
    </template>
    <template #header-border>
        <div class="border-b-4 border-primary border-dashed"></div>
    </template>
    <div class="p-4">
        <p>This is a simple card component.</p>
    </div>
    <template #footer-border>
        <div class="border-t-4 border-primary border-double"></div>
    </template>
    <template #footer>
        <div class="bg-red-400/15 text-default px-4 py-2">
            <p>Some footer content...</p>
        </div>
    </template>
</CardComponent>
```

## Slots visualised

<script setup>
  import { ref } from 'vue'
import { CardComponent } from '@s3_dse/v-tabler'
import 'virtual:uno.css'
</script>
<iframe data-why width="100%" height="800">

<CardComponent class="h-fit" headerBorder>
<template #header>
    <div class="bg-amber-500/75 text-gray-900 px-4 py-2">title slot</div>
</template>
<template #header-border>
    <div class="border-b border-border border-solid px-4">header-border slot</div>
</template>

<div class="bg-green/75 text-gray-900 px-4 py-4">
    <p>default slot</p>
</div>

<template #footer-border>

<div class="border-t border-border border-solid px-4">footer-border slot</div>
</template>
<template #footer>
<div class="bg-light-blue-500/75 text-gray-900 px-4 py-2">
<p>footer slot</p>
</div>
</template>

</CardComponent>

</iframe>
