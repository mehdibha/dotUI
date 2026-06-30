# Dev tweaker

A **dev-only** floating panel for live design/layout exploration. While working a PR, an AI agent adds `useTweak()` calls to the feature being explored; the panel (docked bottom-center, Vercel-toolbar style) lets you flip between the options live and pick one. None of it ships — `useTweak` compiles to a no-op in production and the panel + store are dead-code-eliminated.

It is **not** a product feature and **not** a `/create` design-system axis. It's throwaway scaffolding for one exploration. Adding a real axis/variant/token is still a product decision (propose-and-approve — see the root `CLAUDE.md`).

## The loop

1. You're on a feature branch and ask for tweaks/options on a specific feature.
2. The agent adds `useTweak(...)` in the relevant **www** component and branches the JSX/styles on the returned value. Defaults equal the current look.
3. The control auto-appears in the panel. You open it, flip variants, see live re-renders, and pick.
4. You hit **Copy for AI** (or just say the choice). The agent bakes the values into the code and **removes the `useTweak` scaffolding** before finalizing — unless you want to keep iterating.

## API

```tsx
import { useTweak } from '@/dev/tweaker'

function Hero() {
  const layout = useTweak('Layout', {
    type: 'select',
    options: ['centered', 'split', 'fullbleed'],
    default: 'centered',
    group: 'Hero',
  }) // typed: 'centered' | 'split' | 'fullbleed'

  const gap = useTweak('Gap', {
    type: 'number',
    min: 0,
    max: 64,
    step: 4,
    default: 16,
    group: 'Hero',
  })

  return layout === 'split' ? (
    <SplitHero style={{ gap }} />
  ) : (
    <CenteredHero style={{ gap }} />
  )
}
```

`useTweak(label, config)` returns the live value. `label` is the control's name in the panel; `config.group` buckets related controls under a heading (defaults to an ungrouped section).

### Control types

| `type`    | renders as                                   | value      | extra fields            |
| --------- | -------------------------------------------- | ---------- | ----------------------- |
| `select`  | segmented (≤4 short options) or a dropdown   | option str | `options: string[]`     |
| `boolean` | switch                                       | `boolean`  | —                       |
| `number`  | slider (when `min` **and** `max`) or a field | `number`   | `min?`, `max?`, `step?` |
| `color`   | swatch + hex field                           | string     | —                       |
| `text`    | text field                                   | string     | —                       |

Every config needs a `default` — and it **must match the current design** so nothing changes until you actually move a control.

### Structural vs. style tweaks

- **Structural** (the main use): branch JSX on a `select`/`boolean`.
  ```tsx
  const density = useTweak('Density', {
    type: 'select',
    options: ['compact', 'cozy'],
    default: 'cozy',
  })
  return <List density={density} />
  ```
- **Style values**: feed a `number`/`color` straight into `style`, a class, or a CSS variable.
  ```tsx
  const radius = useTweak('Radius', {
    type: 'number',
    min: 0,
    max: 24,
    default: 8,
  })
  return <Card style={{ borderRadius: radius }} />
  ```

## The panel

Docked bottom-center, collapsed to a pill by default (a count badge shows how many controls are registered).

- **Pill** → click to expand.
- **Minimize** (–) → back to the pill.
- **Hide** (×) → dismiss. Press **⌘ .** (or **Ctrl .**) anywhere to bring it back.
- **Reset** (↺) → all controls back to their defaults.
- **Copy for AI** (⧉) → copies a summary of the current selections to paste back to the agent.

State (values, collapsed/hidden, control order) persists in `localStorage` under `dotui:tweaker`, so a choice survives reloads and HMR edits to the feature file.

## How it stays out of production

`useTweak` is `import.meta.env.DEV ? useTweakDev : useTweakNoop` (see `use-tweak.ts`). In a prod build `DEV` is the constant `false`, so the dev arm — and its import of the store — is dead-code-eliminated. The panel is `lazy()`-imported behind the same constant in `__root.tsx`, so its chunk never enters the prod graph. `store.ts` is side-effect-free at module scope so it tree-shakes cleanly.

## Files

- `use-tweak.ts` — the `useTweak` hook (dev/no-op split).
- `store.ts` — framework-free singleton (values vs. controls, persistence, coercion). Unit-tested in `store.test.ts`.
- `controls.tsx` — one control row per type.
- `tweaker.tsx` — the floating panel.
- `types.ts` — `TweakConfig` and friends.
