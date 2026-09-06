# @platform/shared-ui

The design system: theme tokens, a theming Context, and a small set of
components (`Button`, `Card`, `ThemeToggleButton`). Consumed by
`inventory`, `analytics`, and `shell` in this monorepo — and, in principle,
publishable for `orders` to consume too, since that repo needs the
same visual tokens but can't use the workspace protocol across a repo
boundary.

## What it exports

```ts
export { Button } from "./Button";
export { Card } from "./Card";
export { ThemeProvider, useTheme } from "./ThemeContext";
export { ThemeToggleButton } from "./ThemeToggleButton";
export type { Theme } from "./theme";
```

Plus a CSS entry point, `@platform/shared-ui/theme.css`, imported by every
consumer's own stylesheet.

## The theming architecture, and the two bugs that shaped it

The token system uses a single CSS variable per semantic color — `--color-surface`,
`--color-ink`, `--color-accent`, etc. — set directly by theme selectors, and
mapped into Tailwind via a **non-inline** `@theme` block:

```css
:root {
  --color-surface: #ffffff;
  --color-ink: #1c231f;
  /* ...etc */
}

[data-theme="dark"] {
  --color-surface: #14181a;
  --color-ink: #e7ece8;
  /* ...etc */
}

@theme inline {
  --color-surface: var(--color-surface);
  --color-ink: var(--color-ink);
  /* ...etc */
}
```

This shape is the result of hitting — and needing to avoid — two separate,
sharp edges in Tailwind v4:

1. **Defining a color directly inside `@theme` and then trying to override
   it elsewhere can produce a circular reference**, since `@theme` generates
   a `:root`-level declaration under the same variable name. The original
   fix was a two-layer split (a `--raw-*` variable feeding a separate
   `--color-*` one via `@theme`, not `@theme inline`).
2. **That two-layer split then hit a different bug**: Tailwind v4 registers
   `@theme` colors as typed `@property` declarations (to support opacity
   modifiers like `bg-surface/50`), and a registered property doesn't
   reliably re-resolve a *nested* `var()` reference per element the way a
   plain custom property does. `--raw-surface` updated correctly on every
   theme toggle; `--color-surface` — the one Tailwind's generated classes
   actually reference — didn't reliably follow it.

The fix collapses the two layers into one: theme selectors set `--color-surface`
directly, and `@theme inline` tells Tailwind "reference this name verbatim,"
with no second custom-property hop left to freeze.

## `ThemeProvider` / `useTheme`

```tsx
<ThemeProvider defaultTheme="light">
  <YourApp />
</ThemeProvider>
```

Sets `data-theme` on a wrapper `<div className="contents">` — `display:
contents` specifically so the provider doesn't insert a real layout box
into a parent's flex/grid, while still having a genuine DOM element to
carry the attribute the CSS cascade keys off of.

`useTheme()` throws — loudly, immediately, at the exact point of misuse —
if called outside a `ThemeProvider`, rather than silently returning
`undefined`. Covered directly by `ThemeContext.test.tsx`.

**This Context is safe here specifically because every consumer in *this*
monorepo shares one continuous React tree.** `orders` — a genuinely
separate repo and build — deliberately does *not* use this Context; its
`OrdersDashboard` takes `theme` as an explicit prop instead. Same
underlying concept, two different mechanisms, chosen for the structural
guarantee (or lack of one) at each boundary.

## Why this package ships two builds

```json
"exports": {
  ".": {
    "types": "./dist/esm/index.d.ts",
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  }
}
```

`shell` (Vite) consumes this via the `import` condition. But `inventory`'s
and `analytics`' Jest tests import `ThemeProvider` for real (not mocked),
and `ts-jest` transpiles test files to CommonJS — which resolves packages
via the `require` condition. A package declaring an `exports` field at all
disables Node's `main`/`types` fallback entirely, so without an explicit
`require` entry, `require()` had nothing to match at all. The `dist/cjs`
build exists purely to satisfy that path; `dist/cjs/package.json` (written
by the build script, not committed) overrides the outer package's
`"type": "module"` for just that folder, so Node doesn't misclassify the
CJS output too.

## Scripts

| Script | What it does |
|---|---|
| `yarn build` | Two `tsc` passes (ESM to `dist/esm`, CJS to `dist/cjs`) plus writing `dist/cjs/package.json` |
| `yarn lint` | ESLint |
| `yarn typecheck` | Covers real source and test files, including `jest.setup.ts` |
| `yarn test` | Jest + RTL |
