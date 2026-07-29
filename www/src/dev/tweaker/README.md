# Dev tweaker

A **dev-only** floating panel (also enabled on Vercel previews) for live design/layout exploration. While working a PR, an AI agent adds `useTweak()` calls to the feature being explored; the panel (docked bottom-center, Vercel-toolbar style) lets you flip between the options live and pick one. None of it ships — `useTweak` compiles to a no-op in production and the panel + store are dead-code-eliminated.

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

### Linked controls

`setTweak(label, value, group?)` writes a control's value from code — for two controls that are two views of one value (a size in px and the same size in grid units, say), so moving either updates the other. Mirror in an effect and keep the last pair in a ref, or the two writes chase each other:

```tsx
const last = useRef({ px, units })
useEffect(() => {
  if (px !== last.current.px) {
    const next = toUnits(px)
    last.current = { px, units: next }
    setTweak('Size (units)', next, group)
  } else if (units !== last.current.units) {
    const next = toPx(units)
    last.current = { px: next, units }
    setTweak('Size', next, group)
  }
}, [px, units])
```

Give the linked pair defaults that already agree, so **Reset** lands on a consistent state.

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

A small **trigger** is always docked to a screen edge (default: centre-right; a count badge shows how many controls are registered). Drag it to reposition — it follows the cursor and **snaps to the nearest edge** (left/right) when you let go, keeping the height you dropped it at.

- **Click the trigger** → opens the panel as a popover beside it (the trigger stays put).
- **Close** (×) or press **Escape** → closes the popover. Clicking the page does NOT close it — the page stays interactive while you tweak.
- **Works inside overlays.** Tweaking a feature that lives in a popover, drawer or modal means clicking the panel while that overlay is open. The trigger and panel carry `data-react-aria-top-layer` (react-aria's own escape hatch, the one their toast region uses), so `useInteractOutside` skips them — nothing dismisses — `FocusScope` treats them as inside the scope, so a modal won't yank focus back, and `ariaHideOutside` leaves them visible to assistive tech. Every registry overlay dismisses through `useInteractOutside`, the base-ui Drawer included, so **overlays need no opt-in of their own**.
- **Minimize** (⌄⌃) → collapses the panel to its header bar; expand the same way.
- **⌘ .** (or **Ctrl .**) → toggles the popover from anywhere.
- **Reset** (↺) → all controls back to their defaults.
- **Copy for AI** (⧉) → copies a summary of the current selections to paste back to the agent.

State (open, side, vertical position, control values + order) persists in `localStorage` under `dotui:tweaker`, so it survives reloads and HMR edits to the feature file.

## How it stays out of production

`useTweak` is gated on `import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview'` (see `use-tweak.ts`) — both build-time constants (`VERCEL_ENV` is inlined via Vite `define`). In a real production build the condition is constant `false`, so the dev arm — and its import of the store — is dead-code-eliminated. The panel is `lazy()`-imported behind the same condition (plus a `!SSR` guard, so prerendering never evaluates the chunk) in `__root.tsx`. `store.ts` is side-effect-free at module scope so it tree-shakes cleanly.

## Files

- `use-tweak.ts` — the `useTweak` hook (dev/no-op split).
- `store.ts` — framework-free singleton (values vs. controls, persistence, coercion). Unit-tested in `store.test.ts`.
- `controls.tsx` — one control row per type.
- `tweaker.tsx` — the floating panel.
- `types.ts` — `TweakConfig` and friends.
