---
layout: home

hero:
  name: "V-Tabler"
  text: "Vue 3 Component Library"
  tagline: "Advanced table functionality with comprehensive UI components"
  image:
    src: /logo.svg
    alt: V-Tabler
  actions:
    - theme: brand
      text: Get Started
      link: /guide/installation
    - theme: alt
      text: View Components
      link: /components/

features:
  - title: 🚀 Advanced Table Component
    details: Comprehensive table with filtering, sorting, pagination, and column-level controls
  - title: 🎨 UnoCSS Integration
    details: Atomic CSS with custom shortcuts and consistent design system
  - title: ⚡ Vue 3 Composition API
    details: Built with modern Vue 3 features and TypeScript support
  - title: 🔧 Highly Customizable
    details: Extensive slot system and prop configuration for maximum flexibility
  - title: 📱 Responsive Design
    details: Mobile-first design with responsive layouts and touch-friendly interactions
  - title: 🌙 Dark Mode Support
    details: Built-in dark mode with consistent theming across all components
---

## Quick Example

```vue
<template>
  <TableComponent
    :items="data"
    :fields="fields"
    enable-search
    enable-column-filters
    :per-page="10"
  />
</template>

<script setup>
import { TableComponent } from '@s3_dse/v-tabler'

const fields = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', type: 'select' }
]

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
]
</script>
```

## What's New

- ✅ **Column-level filtering** - Advanced filters with operators and type detection
- ✅ **UnoCSS shortcuts** - `table-col-left`, `table-col-center`, `table-col-right`
- ✅ **Ghost button variants** - Subtle button styling with `btn-ghost-*`
- ✅ **Unified operators** - Centralized comparison operators for numeric and date filters
- ✅ **Embedded demo** - True hot reload development experience
