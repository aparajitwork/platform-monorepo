# @platform/shell

The host application. Renders `Inventory` and `Analytics` as ordinary,
statically-bundled React components, and loads `OrdersDashboard` from the
separate `orders` repository at runtime via Module Federation — the
one place in this whole project where both composition strategies, and both
theming mechanisms, meet.

## How the three widgets actually get onto the page

```tsx
import { InventoryDashboard } from "@platform/inventory";   // plain import
import { AnalyticsDashboard } from "@platform/analytics";   // plain import

const OrdersDashboard = lazy(() =>
  import("orders/OrdersDashboard")                          // resolved at runtime
);
```

`Inventory` and `Analytics` are compiled straight into `shell`'s own
JavaScript bundle at build time — same as importing any other npm package.
`orders/OrdersDashboard` isn't a real path on disk from this repo's point of
view; it's a virtual specifier the Module Federation runtime resolves in
the browser, at page-load time, against whatever URL `ORDERS_REMOTE_URL`
points to. TypeScript has no way to know its shape on its own — see
`src/types/remotes.d.ts` for the ambient module declaration that fills that
gap.

## Where theme comes from, and how it reaches each widget differently

`ThemeProvider` (from `@platform/shared-ui`) wraps the whole app once, in
`App.tsx`. From there:

- `InventoryDashboard` and `AnalyticsDashboard` call `useTheme()` directly —
  safe, since they're compiled into the same bundle and share this
  component tree.
- `OrdersDashboard` receives `theme` as an explicit prop, read from that
  same `useTheme()` call in `shell`, then handed across the federation
  boundary. Orders has no access to — and no need for — the Context itself.

One click on the shared `ThemeToggleButton` updates state in exactly one
place; every widget reflects it, through two different mechanisms.

## Environment variables

| Variable | Where it's read | Purpose |
|---|---|---|
| `VITE_MOCK_API_URL` | `src/config.ts`, at runtime in the browser | Base URL for Inventory/Analytics's API calls |
| `ORDERS_REMOTE_URL` | `vite.config.ts`, at **build/config time**, via `loadEnv(mode, cwd, "")` | The deployed `orders/app`'s `remoteEntry.js` URL |

Note `ORDERS_REMOTE_URL` deliberately has no `VITE_` prefix — it's only
ever read by `vite.config.ts` itself, never shipped to the browser, so it's
exempt from Vite's default `VITE_`-only env exposure rule. `VITE_MOCK_API_URL`
*is* shipped to the browser, hence the prefix, and hence why it's isolated
into its own `src/config.ts` module — so it can be mocked in tests without
executing raw `import.meta.env` syntax under Jest's CommonJS transform.

## The Tailwind + workspace packages gotcha, and the fix

`@tailwindcss/vite` only scans this app's own `src/` — never
`node_modules`, which is where Yarn symlinks `@platform/inventory`,
`@platform/analytics`, and `@platform/shared-ui`. Without explicit
`@source` directives, their utility classes (`bg-surface`, `text-ink`,
`bg-accent`, etc.) never get CSS rules generated at all, in *either* theme
— which looks like "it's just not restyling on toggle" but is actually
"the rule never existed."

```css
/* src/index.css */
@import "tailwindcss";
@import "@platform/shared-ui/theme.css";

@source "../../../node_modules/@platform/shared-ui/dist";
@source "../../../node_modules/@platform/inventory/dist";
@source "../../../node_modules/@platform/analytics/dist";
```

**Any new Tailwind-styled component added to a workspace package needs a
matching `@source` line here**, or its classes will silently be missing the
same way. Worth a checklist item, not a one-time fix.

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | Vite dev server |
| `yarn build` | `tsc -b && vite build` |
| `yarn preview` | Serves the production build locally |
| `yarn lint` | ESLint |
| `yarn typecheck` | `tsc -b` (app + node config) plus a separate pass covering test files |
| `yarn test` | Jest + RTL. `orders/OrdersDashboard` is mocked with `{ virtual: true }`, since it has no real resolvable path for Jest to find |

## Testing notes

`App.test.tsx` mocks all three widgets. The Orders mock specifically needs
`__esModule: true` in its factory — without it, TypeScript's CommonJS
interop helper double-wraps the mocked `default` export, and React receives
an object instead of a component function. This is purely a test-environment
quirk of `ts-jest`'s CommonJS compilation target; it doesn't reflect
anything about how the real, browser-loaded federation runtime behaves.

The most important single test in this repo is probably this one:

```tsx
test("toggling theme updates the federated Orders remote's prop", async () => {
  render(<App />);
  await screen.findByText(/Orders mock \(light\)/);
  fireEvent.click(screen.getByRole("button", { name: /Toggle theme/ }));
  expect(await screen.findByText(/Orders mock \(dark\)/)).toBeInTheDocument();
});
```

One assertion, proving both theming mechanisms actually work together.
