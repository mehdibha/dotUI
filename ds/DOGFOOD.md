# Dogfood friction log

Running log of issues found installing dotUI into this app via the shadcn CLI,
exactly as an end user would (2026-07-03, shadcn 4.x against dotui.org and a
local registry build). Every entry is a product bug or paper cut, not a ds/
problem.

## Fixed in this branch (registry/publisher side changes)

1. **`/r/init` misses the `tailwindcss-with` npm dependency** — the init css
   emits `@plugin 'tailwindcss-with'` but `DEFAULT_DEPENDENCIES` in
   `www/src/publisher/emit-theme.ts` didn't include the package, so a fresh
   consumer's very first Tailwind build fails. Severity: blocker for every new
   install. Fixed: added to `DEFAULT_DEPENDENCIES`.
2. **Items whose only registry dep is bundled (`focus-styles`) shipped it
   anyway** — `rewriteDeps()` in `www/src/publisher/publish.ts` returned
   `undefined` when every dep was dropped and the caller fell back to the
   original list, so `shadcn add @dotui/link` (also tabs, input, kbd-adjacent
   items…) 404'd against `ui.shadcn.com/r/styles/default/focus-styles.json` and
   aborted the whole install. Severity: blocker for link/tabs and any
   single-dep item. Fixed: `rewriteDeps` now distinguishes "all dropped" from
   "nothing to rewrite".
3. **Shipped code with `const xVariants = xVariants;` self-assignment (runtime
   TDZ crash)** — base files that named the `useStyles()` local after the
   styles export (`const linkStyles = useStyles()`) collided with the
   publisher's `…Styles`→`…Variants` rename. Affected: accordion, badge,
   command, link, separator. Severity: blocker — component crashes on first
   render in the consumer app. Fixed by canonicalizing the local to
   `const styles = useStyles()` (button's style) in the five base files.
4. **`tabs` imports `@/lib/context` but nothing installs it** — lib items
   (`context`, `textarea-caret`) have metas but no publishables and no
   `/r/<name>` endpoint, so the shipped import is unresolvable. Severity:
   blocker for tabs. Stopgap fix: tabs now ships `lib/context.tsx` as a
   secondary file. See "Open" below for the real fix.
5. **Items never declare the npm packages their shipped files import** —
   loader/checkbox/table (and every icon-using item) import `lucide-react`,
   tabs' bundled context lib imports `react-aria`, table imports
   `react-stately` subpaths; none appeared in item `dependencies`, so `shadcn
add` never installs them and the consumer build fails on unresolved
   imports. Severity: blocker. Fixed: `publish()` now derives
   `dependencies` from the emitted file imports (lucide-react / react-aria /
   react-stately) and merges them with the meta's list. Note for later: when
   the publisher's icon-library swap becomes preset-driven, the detected icon
   package must follow the preset.

## Open (needs maintainer decision / follow-up PR)

6. **avatar, sidebar, toggle-button still ship broken `@/lib/context` imports,
   mention ships `@/lib/textarea-caret`** — same root cause as (4). Decide: make
   `registry:lib` items publishable (proper), or ship the lib file with each
   consuming item (the tabs stopgap). Severity: blocker for those 4 components.
7. **The field family ships broken code — `table` had to be dropped from this
   app's kit.** Shipped `field.tsx` keeps an unrewritten
   `export { fieldVariants } from "./styles";`, its resolved tv config is
   missing the `fieldset`/`legend` slots, and text-field, select, color-field,
   date-field, date-picker, time-field, search-field emit
   `const fieldStyles = useStyles();` with no `useStyles` in scope (the
   publisher logs `[publisher/extract] unsupported expression kind
CallExpression … "fieldStyles().field()"` during `build:registry`).
   Table → checkbox → field made the whole chain uninstallable, so ds/ ships
   without table/checkbox/field rather than hand-patching them. Severity:
   blocker for every field-family component; needs publisher work (known
   rewrite area).
8. **Shipped files fail strict consumer typechecks** — kbd, popover, tabs (and
   table) ship an unused `type VariantProps` import; any consumer with
   `noUnusedLocals` fails `tsc` right after install. ds/ removed the dead
   imports locally. The publisher should strip imports its transforms orphan.
   Severity: medium.
9. **Installation docs are stale** — `www/content/docs/(root)/installation.mdx`
   documents `"registries": { "@dotui": "https://dotui.org/r/{style}/{name}" }`
   and `add @dotui/base`, but the live endpoints are `/r/init` +
   `/r/{name}?preset=` and there is no `base` item. `shadcn init
https://dotui.org/r/init` is what actually works. Severity: high — a new
   user following the docs cannot install.
10. **`--font-sans: var(--font-geist-sans)` dangles in the init theme** — the
    init css references `--font-geist-sans`/`--font-geist-mono`, which nothing
    defines in a fresh app and no doc mentions; consumers silently fall back to
    the browser default font. Severity: medium (silent wrong rendering). ds/
    works around it by defining its own `--font-sans` stack.
11. **`shadcn init` leaves a duplicate `@custom-variant dark`** — the CLI writes
    its default `(&:is(.dark *))` variant, then appends the registry's
    `(&:is(.dark *, [data-mode='dark'] *)…)` later in the same file. Last one
    wins so behavior is right, but the dead directive confuses. Severity: low.
12. **Components land in `src/ui/`, ignoring the `ui` alias in
    `components.json`** — item `target: "ui/button.tsx"` overrides the
    consumer's `"ui": "@/components/ui"` alias. Deliberate shadcn semantics,
    but surprising; decide whether dotUI targets should be alias-relative.
    Severity: low (cosmetic/layout).
13. **Version drift between registry-installed deps and www's own pins** — the
    CLI installed `tailwind-merge ^3.4.0`, `tailwind-variants ^3.2.2`,
    `tw-animate-css ^1.4.0` (www pins ^3.0.2 / ^3.1.1 / ^1.3.5). Not a bug for
    consumers, but the dogfooded app now runs slightly newer versions than the
    app that authored the styles. Severity: info.

## Notes

- Production (`dotui.org`) still serves bugs 2–5 until www redeploys; the ds
  kit was installed from a local registry build (`localhost` www dev server)
  running the fixes, via the same `shadcn add <url>` flow.
