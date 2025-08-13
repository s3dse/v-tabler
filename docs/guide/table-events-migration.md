# Table Events Migration Guide

## Breaking Change: Unified Event Payload

Before version `1.11.0` all events had event-specific payloads, like `searchTerm` for `@filter-change`, or `page` for `@page-change`. This is no longer the case: instead, each event now exposes a unified payload with all currently active modifications on every event.

```ts
export interface TableState {
    searchTerm: string
    columnFilters: Record<string, any>
    currentPage: number
    pageSize: number
    numberOfPages: number
    sort: {
        dir: 'asc' | 'desc' | null
        key: string | null
    }
}
```

To migrate to the new version, you need to adapt all your table event handlers to accept the unified payload.

## Breaking Change: Removed Events

The table will no longer emit the following events:

- `after-page-change`
- `after-sort`
- `after-filter`
- `after-column-filter`

The semantics of these events were never really clear, and they are now obsolete.
