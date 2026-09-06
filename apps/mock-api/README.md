# @platform/mock-api

Mock backend for **both** Inventory and Analytics, in one Express service.
Deliberately one service, not two — since both domains live in this
monorepo as statically-bundled packages (not independent deployables the
way Orders is), there's no architectural reason to give them separate
backends here.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/api/inventory/items` | Optional filters: `category`, `warehouse`, `lowStock=true` |
| GET | `/api/inventory/items/:id` | 404 if not found |
| GET | `/api/analytics/overview` | Single summary object — revenue, orders, conversion rate |
| GET | `/api/analytics/timeseries?days=N` | `days` capped at 90, defaults to 30 |

Every endpoint has a randomized 200–700ms delay (`src/utils/delay.ts`), for
the same reason as `orders/server`: real loading states need
something real to react to.

## Structure

```
src/
  index.ts             # Express app, CORS, route mounting
  routes/
    inventory.ts         # filtering + 404 handling
    inventory.test.ts     # supertest coverage
    analytics.ts            # overview + timeseries generation
    analytics.test.ts        # supertest coverage
  data/
    inventory.ts               # in-memory dataset
    analytics.ts                 # dataset + generateTimeseries()
  utils/
    delay.ts                       # randomDelay()
```

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | `tsx watch` |
| `yarn build` | `tsc -p tsconfig.json` → `dist/` |
| `yarn start` | Runs compiled output |
| `yarn lint` | ESLint |
| `yarn typecheck` | `tsc --noEmit -p tsconfig.test.json` — covers real source *and* test files in one pass |
| `yarn test` | Jest + `supertest`, mounting just the router under test (not the full app) per test file |

## Why this package needs only *one* `tsconfig`, unlike the React packages

`shared-ui`, `inventory`, and `analytics` each need separate configs for
building vs. testing, because of a real conflict: `ts-jest` needs
`module: "CommonJS"`, but their code uses `import.meta.env` (Vite-only,
ESM-only syntax). This package has neither Vite nor JSX — plain
`module: "CommonJS"` works correctly for building, testing, and
type-checking all at once, so one `tsconfig.json` (plus a lightweight
`tsconfig.test.json` just to widen `include` to test files) is enough.

## Configuration

Runs on port `4001` by default; override with `PORT`.
