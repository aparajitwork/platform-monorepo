# @platform/inventory

The Inventory widget — a plain workspace package, statically bundled into
`shell`. Not a micro-frontend, not federated, no runtime loading involved:
`shell` just does `import { InventoryDashboard } from "@platform/inventory"`,
same as importing any other npm package.

## What it exports

```ts
export { InventoryDashboard } from "./InventoryDashboard";
export type { InventoryItem } from "./api/inventory";
```

## `InventoryDashboard`

```tsx
<InventoryDashboard apiBaseUrl="http://localhost:4001" />
```

Fetches from `@platform/mock-api`'s `/api/inventory/items` endpoint and
renders one of four states via a discriminated union (`LoadState`):
loading (skeleton), error (with Retry), empty, or a populated list. Low-stock
items render with the `text-danger` token — the one color added to
`shared-ui`'s palette specifically because this component needed it,
illustrating how the shared design system is meant to evolve: a real
consumer need drives a token addition, not the reverse.

Reads theme via `useTheme()` from `@platform/shared-ui` — a Context, not a
prop. This is safe here specifically because `inventory` shares one
continuous render tree and one React instance with `shell`; contrast with
`orders`'s `OrdersDashboard`, which takes `theme` as an explicit
prop because it crosses a real repo/build boundary. `InventoryDashboard`
also renders `shared-ui`'s `ThemeToggleButton` directly — proof, exercised
in tests, that the theme is genuinely shared state, not something local to
each widget.

## Why the API client takes a base URL as a parameter

```ts
export async function fetchInventoryItems(apiBaseUrl: string): Promise<InventoryItem[]>
```

Unlike `orders/app`, which reads `import.meta.env.VITE_ORDERS_API_URL`
directly (reasonable there, since it's a full Vite app that owns its own env
convention), this is a plain library with no bundler of its own. Reading
`import.meta.env` here would make the package silently depend on always
being consumed by a Vite-based host. Accepting the URL as a parameter keeps
it portable — the caller decides where that value comes from.

## Why this package ships two builds (ESM + CJS)

Same reason as `@platform/shared-ui`: `shell` consumes the `import`
condition, but this package's own Jest tests (and any future consumer
testing against it under `ts-jest`) need the `require` condition to exist
at all, since declaring `exports` disables Node's `main`/`types` fallback
entirely.

## Scripts

| Script | What it does |
|---|---|
| `yarn build` | ESM build → `dist/esm`, CJS build → `dist/cjs` |
| `yarn lint` | ESLint |
| `yarn typecheck` | Real source + test files |
| `yarn test` | Jest + RTL — covers all four `LoadState` branches, plus a dedicated test proving theme comes from shared context: clicking the embedded `ThemeToggleButton` changes what this component reads via `useTheme()` |
