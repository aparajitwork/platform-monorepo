# @platform/analytics

The Analytics widget — same architectural pattern as `@platform/inventory`
(plain workspace package, statically bundled into `shell`, theme via shared
Context, dual ESM/CJS build), applied to a different data shape. See that
package's README for the shared reasoning; this one covers what's actually
different.

## What it exports

```ts
export { AnalyticsDashboard } from "./AnalyticsDashboard";
export type { AnalyticsData } from "./api/analytics";
```

## What's different from `Inventory`

**Two endpoints combined into one load state.** `fetchAnalyticsData`
fetches `/api/analytics/overview` and `/api/analytics/timeseries` via
`Promise.all`, so the component still only needs one `LoadState` union
rather than tracking two independent fetches:

```ts
export async function fetchAnalyticsData(apiBaseUrl: string): Promise<AnalyticsData> {
  const [overview, recentPoints] = await Promise.all([
    fetchOverview(apiBaseUrl),
    fetchTimeseries(apiBaseUrl, 7),
  ]);
  return { overview, recentPoints };
}
```

**No empty state.** Unlike Inventory, "zero analytics data" isn't a
meaningful real-world case the way "zero items in stock" is — so
`AnalyticsDashboard`'s `LoadState` only has loading/error/success branches,
not a fourth empty one. Worth noting as a deliberate omission, not a gap:
not every component needs the same state shape just for consistency's sake.

**Error messages compose two failures into one.** Since a single load
involves two network calls, `fetchAnalyticsData`'s catch block narrows
whichever error actually occurred (`instanceof Error` check) and prefixes
it once — avoiding the doubled-message bug this exact pattern hit early on
(`"Failed to load analytics: Failed to load analytics: 500"`), by keeping
the inner throws unprefixed and adding the human-facing prefix only once,
at the outer catch.

## Scripts

Identical shape to `@platform/inventory` — `build` (dual ESM/CJS),
`lint`, `typecheck`, `test`.
