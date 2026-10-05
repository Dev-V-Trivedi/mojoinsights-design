# MojoInsights

Marketing operations and real-time conversion intelligence platform — 16 screens on one
unified application shell, built with Next.js 15 (App Router), TypeScript and Tailwind.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## The shell

Every screen renders inside one layout (`src/app/layout.tsx` → `src/components/AppFrame.tsx`),
so the navigation never shifts between pages.

- **Sidebar** (`src/components/Sidebar.tsx`) — all 16 destinations, grouped into
  Analyze / Activate / Operate / Workspace. Collapses to a 76px icon rail (the choice is
  remembered in `localStorage`), becomes an overlay drawer under 1024px. The active item is
  derived from `usePathname()` and rendered as a dark pill with a gold glyph plus
  `aria-current="page"`.
- **Topbar** (`src/components/Topbar.tsx`) — breadcrumb, global search (⌘K, searches every
  route and navigates on select), messages, notifications with unread count, account menu.
- **Nav model** (`src/lib/nav.ts`) — the single source of truth for routes, icons, badges and
  descriptions. Add an entry here and it appears in the sidebar, the search and the breadcrumb.

## Design system

Tokens come from the original `DESIGN.md`: warm `#F5F4EF` canvas, deep ink `#111013`,
gold `#F0BC00`, 20px card radius, pill controls, Plus Jakarta Sans / Inter / JetBrains Mono.
They live in `tailwind.config.ts` and the component classes in `src/app/globals.css`
(`.card`, `.btn-primary`, `.field`, `.chip`, `.th`, `.td`, `.badge-*`).

Shared UI is in `src/components/ui.tsx`: `PageHeader`, `KpiCard`, `Card`, `Tabs`, `Segmented`,
`TableShell`/`SortHeader`/`Pagination`, `Modal`, `Toggle`, `Checkbox`, `Select`, `SearchField`,
`EmptyState`, toasts, and dependency-free SVG charts (`AreaChart`, `Sparkline`, `Donut`,
`Gauge`, `BarMeter`, `ProgressBar`).

## Data

Typed mock modules in `src/data/`. The UI reads them through `useTable` and `useSelection`
(`src/lib/hooks.ts`), which provide search, filtering, sorting, pagination and row selection
in memory. To go live, replace a data module with a fetch — the components are unchanged.

One thing is genuinely real rather than mocked: the SHA-256 sandbox on **Audit Trail** hashes
via WebCrypto in the browser, applying the same normalization rules (trim, lowercase, E.164)
the platform documents.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Executive dashboard |
| `/conversions` | Conversions hub — signals, activity log, channels, retry queue |
| `/attribution` | Attribution & signals, multi-touch models |
| `/leads` | Leads explorer with lead inspector |
| `/reports` | Report builder & PDF exporter |
| `/audiences` | Audiences & customer match sync |
| `/campaigns` | Campaign & ad set signal mapping, UTM resolver |
| `/offline-import` | Offline conversion ingestion & batch importer |
| `/integrations` | Integrations catalog |
| `/alerts` | Alerts, incidents & dead-letter queue |
| `/schedules` | Schedules & sync automation |
| `/audit` | Audit trail & hasher utility |
| `/clients` | Client & brand portfolio |
| `/team` | Team management & RBAC |
| `/settings` | Settings & API credentials |
| `/profile` | Profile & account settings |
