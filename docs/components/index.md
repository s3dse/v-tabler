# Components

V-Tabler provides a comprehensive set of Vue 3 components designed for modern web applications.

## Core Components

### [TableComponent](/components/table-component)

Advanced data table with sorting, filtering, pagination, and column-level controls.

**Key Features:**

- Column-level filtering with type detection
- Advanced search and pagination
- Customizable sorting and formatting
- Responsive design with horizontal scrolling
- Extensive slot system for customization

### [CardComponent](/components/card-component)

Flexible container component with header, content, and action areas.

**Key Features:**

- Title and subtitle support
- Action slot for buttons and controls
- Elevation and border variants
- Collapsible functionality

### [DialogComponent](/components/dialog-component)

Modal dialog component with customizable content and actions.

**Key Features:**

- Backdrop click to close
- ESC key handling
- Focus management
- Custom header and footer slots

## Form Components

### [ListSelect](/components/listselect.md)

Flexible select component with single & multi mode, search, virtualisation, and custom rendering.

### [Select Components](/components/select-components)

Lightweight select component variants for different use cases.

**Variants:**

- `SingleSelect` - Single value selection
- `MultiSelect` - Multiple value selection

### [ToggleComponent](/components/toggle-component)

Switch/toggle component for boolean values.

**Features:**

- Customizable labels
- Size variants
- Disabled state support

## UI Components

### [DropdownComponent](/components/dropdown-component)

Flexible dropdown menu component.

**Features:**

- Multiple trigger types
- Positioning options
- Nested menu support

### [Typography](/components/typography)

Text and heading components with consistent styling.

**Components:**

- `Heading` - Styled headings with size variants
- `PageTitle` - Page-level title component

## Layout Components

### LoadingOverlay

Full-screen or container-specific loading indicator.

### Pagination

Standalone pagination component used by TableComponent.

### Skeleton

Loading skeleton components for better perceived performance.

## Transition Components

### Fade

Smooth fade in/out transitions.

### Collapse

Expand/collapse animations for content areas.

## Getting Started

Each component is designed to work independently or as part of a larger system. Most components support:

- **UnoCSS Integration** - Custom shortcuts and atomic CSS
- **Dark Mode** - Automatic dark mode support
- **TypeScript** - Full type definitions included
- **Accessibility** - ARIA labels and keyboard navigation
- **Customization** - Extensive prop and slot system

## Example Usage

```vue
<template>
    <div class="space-y-6">
        <!-- Data Table -->
        <CardComponent title="User Management">
            <TableComponent
                :items="users"
                :fields="userFields"
                enable-search
                enable-column-filters
            />
        </CardComponent>

        <!-- Form Controls -->
        <CardComponent title="Settings">
            <div class="space-y-4">
                <SingleSelect v-model="selectedRole" :options="roleOptions" label="Default Role" />

                <ToggleComponent v-model="notificationsEnabled" label="Enable Notifications" />
            </div>
        </CardComponent>
    </div>
</template>
```

## Next Steps

- Explore individual component documentation
- Check out the [Quick Start Guide](/guide/quick-start)
- Learn about [Configuration](/guide/configuration)
