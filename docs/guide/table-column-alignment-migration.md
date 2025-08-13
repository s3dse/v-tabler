# Table Column Alignment Migration Guide

## Breaking Change: Column Header Alignment

In the latest version, we've improved the table header layout to better group column controls (name, sort, and filter buttons) while introducing new UnoCSS shortcuts for consistent column alignment.

### What Changed

**Before:**

- Column headers used `justify-between` layout that spread controls to opposite ends
- Text alignment classes like `text-left`, `text-right` applied to `thClassList` would align header content

**After:**

- Column headers now group all controls together (name + sort + filter)
- New UnoCSS shortcuts provide both header and body alignment
- Old text alignment classes in `thClassList` no longer affect header layout

### Migration Required

If you were using text alignment classes in your field definitions, you need to migrate to the new table column shortcuts:

#### Before (no longer works):

```javascript
const fields = [
    {
        key: 'price',
        label: 'Price',
        thClassList: 'text-right', // ❌ No longer affects header
        tdClassList: 'text-right' // ✅ Still works for body cells
    }
]
```

#### After (new approach):

```javascript
const fields = [
    {
        key: 'price',
        label: 'Price',
        thClassList: 'table-col-right', // ✅ New shortcut for header alignment
        tdClassList: 'text-right' // ✅ Still works for body cells
    }
]
```

### New UnoCSS Shortcuts

We've added three new shortcuts to the v-tabler theme:

| Shortcut           | Effect                       | Use Case                                                |
| ------------------ | ---------------------------- | ------------------------------------------------------- |
| `table-col-left`   | `justify-start text-left`    | Left-align header and body content                      |
| `table-col-right`  | `justify-end text-right`     | Right-align header and body content (numbers, currency) |
| `table-col-center` | `justify-center text-center` | Center-align header and body content                    |

### Migration Examples

#### Numeric columns (IDs, prices, quantities):

```javascript
// Before
{ key: 'id', thClassList: 'text-right', tdClassList: 'text-right' }

// After
{ key: 'id', thClassList: 'table-col-right', tdClassList: 'text-right' }
```

#### Text columns (names, descriptions):

```javascript
// Before
{ key: 'name', thClassList: 'text-left', tdClassList: 'text-left' }

// After
{ key: 'name', thClassList: 'table-col-left', tdClassList: 'text-left' }
```

#### Centered columns (status, badges):

```javascript
// Before
{ key: 'status', thClassList: 'text-center', tdClassList: 'text-center' }

// After
{ key: 'status', thClassList: 'table-col-center', tdClassList: 'text-center' }
```

### Benefits of the New Approach

1. **Better UX**: Column controls (name, sort, filter) are visually grouped together
2. **Consistent alignment**: Headers and body cells align consistently
3. **Clear semantics**: Purpose-built shortcuts for table column alignment
4. **No conflicts**: Avoids confusion with Bootstrap/Tailwind `col-*` classes

### Easy Migration Path

The migration is straightforward - just replace text alignment classes in `thClassList`:

- `text-left` → `table-col-left`
- `text-right` → `table-col-right`
- `text-center` → `table-col-center`

Keep all other classes and `tdClassList` unchanged.
