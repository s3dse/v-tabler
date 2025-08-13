---
layout: home

hero:
    name: 'V-Tabler'
    text: 'Vue 3 Component Library'
    tagline: 'Comprehensive table functionality and beautiful UI components'
    actions:
        - theme: brand
          text: Get Started
          link: /guide/quick-start
        - theme: alt
          text: View Components
          link: /components/

features:
    - title: Advanced Tables
      details: Feature-rich table component with filtering, sorting, pagination, and custom styling
    - title: Modern UI
      details: Beautiful, responsive components built with Vue 3 and modern CSS
    - title: Developer Friendly
      details: Simple API, comprehensive documentation, and TypeScript support
---

Get started with V-Tabler in minutes:

```bash
npm install @s3-dse/v-tabler
```

```javascript
import { createApp } from 'vue'
import VTabler from '@s3-dse/v-tabler'
import '@s3-dse/v-tabler/style.css'

const app = createApp(App)
app.use(VTabler)
```

## ✨ Features

- **Advanced Table Component** - Sorting, filtering, pagination, and customization
- **Modern UI Components** - Cards, dialogs, forms, and navigation
- **TypeScript Support** - Full type definitions included
- **UnoCSS Integration** - Atomic CSS utilities for rapid styling
- **Vue 3 Composition API** - Built with modern Vue patterns
- **Accessibility First** - WCAG compliant components
- **Dark Mode** - Built-in theme switching

## 📋 Components

### Data Display

- [TableComponent](/components/table-component) - Feature-rich data tables
- [CardComponent](/components/card) - Flexible content containers
- [PaginationComponent](/components/pagination) - Navigate large datasets

### Forms & Input

- [CheckboxComponent](/components/checkbox) - Styled checkboxes
- [SelectComponents](/components/select) - Single and multi-select dropdowns
- [ToggleComponent](/components/toggle) - Switch controls

### Feedback & Overlay

- [DialogComponent](/components/dialog) - Modal dialogs and confirmations
- [LoadingOverlay](/components/loading-overlay) - Loading states and spinners

### Navigation

- [TabsComponent](/components/tabs) - Tabbed interfaces
- [DropdownComponent](/components/dropdown) - Context menus and actions

## 🎨 Theming

V-Tabler uses UnoCSS for styling, providing atomic CSS utilities and easy customization:

```javascript
// uno.config.js
export default {
    theme: {
        colors: {
            primary: '#646cff'
            // ... your custom colors
        }
    }
}
```

## 🔗 Links

- [GitHub Repository](https://github.com/s3dse/v-tabler)
- [Component Documentation](/components/)
- [Getting Started Guide](/guide/getting-started)
- [Live Demo](http://localhost:8081) (Development)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/s3dse/v-tabler/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](https://github.com/s3dse/v-tabler/blob/main/LICENSE) file for details.
