# design-sync notes — dotUI

Repo-specific gotchas for syncing dotUI to claude.ai/design. Read before re-syncing.

## Shape: off-script `package` (no npm dist, no Storybook)

dotUI is a design-system *builder*; components live as registry source under
`www/src/registry/ui/<c>/` (`base.tsx` = shipped component, `index.tsx` = www wrapper).
There is no compiled component `dist/` and no Storybook, so the default converter path
doesn't apply. We drive the `package` shape off-script with a custom entry + config.

- **PKG_DIR must resolve to `www`**, not the monorepo root. The converter walks up from
  `cfg.entry` to the nearest named `package.json`. The entry therefore lives at
  `www/.ds-sync-build/bundle-entry.tsx` (inside www). `pkg: "www"`, `globalName: "dotUI"`
  → `window.DotUI.*` (the app PascalCases the namespace).
- **Custom bundle entry** (`.design-sync/gen-bundle-inputs.mjs` → `www/.ds-sync-build/bundle-entry.tsx`):
  the default synth-entry would `export *` from both `base.tsx` and `index.tsx`; index
  re-exports base, so esbuild drops the ambiguous duplicate exports and `window.DotUI.*`
  comes up empty. The generator instead emits explicit, deduped named re-exports of every
  public component, sourced from `base.tsx` (the clean shipped surface — no www router
  imports), falling back to `index.tsx` for the 9 dirs without a `base.tsx`. Also exports
  `DesignSystemProvider` (not a card; just available in the namespace).
- **Component set = the 61 `meta.ts`-registered registry items** (from
  `registry-items.ts`), PascalCased, NOT all 71 dirs. Groups come from each `meta.ts`
  `group:` → mapped to DS-pane labels via `cfg.docsMap` stubs in `.design-sync/groups/`
  (the converter has no per-component group override; a `category:` frontmatter stub is
  the sanctioned way to set group).

### Groups via docsMap + source-kit fork

Groups come from `cfg.docsMap` `category:` stubs in `.design-sync/groups/` (generated from
each `meta.ts` `group:`). The converter's group precedence lets the docs `category` win
ONLY when the path-derived group collapses to `general`; the stock own-dir filter compares
the kebab dir (`color-area`) to the PascalCase name (`ColorArea`) and they don't match, so
multi-word components kept their dir name as group and ignored `category`. The
`source-kit.mjs` fork normalizes that comparison (strip hyphens), so `category` wins for all.
If groups regress to per-component kebab dirs, this fork was lost.

## Props (`.d.ts`)

dotUI ships **no `.d.ts` tree** — prop contracts live in `types.ts` (plain `.ts`). The
stock `lib/dts.mjs` only loads `*.d.ts`, so it would emit empty prop bodies. We fork it
(`.design-sync/overrides/dts.mjs`, declared in `cfg.libOverrides`) to also load
`www/src/registry/**` + `www/src/lib/**` `.ts/.tsx` into the ts-morph project, so
`propsBodyFor` finds and resolves each `<Name>Props` (React.ComponentProps<…> etc.) via
the checker. The fork needs `.design-sync/node_modules` → `../.ds-sync/node_modules`
(symlink, recreate on fresh clone).

## CSS (the crux)

Component look = Tailwind v4 utility classes (tailwind-variants) + OKLCH semantic tokens.
Rendered designs get only `styles.css`'s `@import` closure + the JS bundle — and since
`DesignSystemContext` has a **default value** (`density: 'default'`, `params: {}`,
`color: undefined`), components render correctly with NO provider at runtime, off a static
compiled stylesheet.

- `.design-sync/gen-css.mjs` mirrors the app's real Tailwind entry `www/src/styles.css`
  (minus `@fontsource` imports + marketing Josefin) → `www/.ds-sync-build/compile.css`.
  `@tailwindcss/cli` (in `.ds-sync`) compiles it → `www/.ds-sync-build/bundle.css`
  (`cfg.cssEntry`). The `tailwindcss-autocontrast` plugin runs at compile time (its
  `cssfile: './src/styles.css'` resolves with **cwd=www**) and bakes the `--on-*` contrast
  foregrounds — the committed `base/colors.css` does NOT contain them.
- **Run the CLI with cwd=www** so the autocontrast cssfile + the `@plugin`/`@source`
  resolution all hit `www/node_modules`.
- Compiled CSS is the **default color preset** (committed `base/colors.css` ramps). A
  re-sync after `pnpm build:registry` regenerates those ramps; rebuild the CSS too.

## Fonts

Geist Variable + Geist Mono ship via `cfg.extraFonts` (the `@fontsource*` index/weight
css), NOT inlined into the compiled CSS (their `url()`s are node_modules-relative). The
converter copies the woff2 + rewrites paths. Josefin Sans (marketing only) is dropped.

## Build / re-sync commands

```sh
# 1. regenerate inputs (entry + group stubs + componentSrcMap/docsMap)
NODE_PATH=.ds-sync/node_modules node .design-sync/gen-bundle-inputs.mjs
node .design-sync/gen-css.mjs
# 2. compile CSS (cwd=www!)
( cd www && node ../.ds-sync/node_modules/@tailwindcss/cli/dist/index.mjs \
    -i .ds-sync-build/compile.css -o .ds-sync-build/bundle.css )
# 3. converter
node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules www/node_modules --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

## Scope / status

- **Phase 1** (done): all 62 components importable on floor cards; uploaded.
- **Phase 2** (done 2026-06-19): authored a rendered preview card for ALL 62 components
  (`.design-sync/previews/<Name>.tsx`), graded good, 62/62 render cleanly. Replaces the
  floor cards.

## Authoring conventions (Phase 2 — for future previews / re-syncs)

- One `.design-sync/previews/<Name>.tsx` per component; each **named export = one card cell**
  (`?story=<Export>`). Budget 2–5 cells: canonical + main variant axis + key states.
- **Import components from `'www'`** (the package specifier shims to `window.DotUI`). Icons
  from `'lucide-react'`. `@internationalized/date` for date/time values. NEVER `@/…`,
  `@/modules/*`, relative-demo, or the `@/registry/__generated__/icons` barrel.
- **Inline `style={{}}` for layout wrappers**, never Tailwind className utilities — the
  shipped CSS only contains classes already used by registry components (component styling
  itself is fine; only wrapper layout needs inline styles). The previews dir IS scanned by
  `@source` (gen-css) so utilities *can* compile, but inline styles avoid a CSS recompile.
- Port from each component's `examples.tsx` + `demos/*.tsx` (strip the www-only
  `@/modules/create/preview/*` wrappers). Realistic content, never foo/bar.
- **Overlays render the OPEN state** via `defaultOpen` on the root wrapper (Menu/Dialog/
  Tooltip/Select/DatePicker/ColorPicker/Modal/Drawer-via-Dialog). They + Sidebar/Command/
  Toaster get `cfg.overrides.<Name> = {cardMode:"single", viewport, primaryStory}` so the
  open layer/large layout renders in a dedicated card. **Combobox** opens on focus only —
  static open isn't possible; its card is the styled closed input (acceptable).
- **Toaster**: the bundle exports only `Toaster` + `ToastProvider` (not `toastManager`/
  `ToastPrimitive`). The preview imports `@base-ui/react/toast` directly, makes a manager
  with `createToastManager()`, passes it to `ToastProvider toastManager=`, and pushes toasts
  in a mount `useEffect`. Toasts portal to fixed bottom-right → single card mode.
- **Loader**: the shipped spinner ignores `size`/`stroke`/`speed` runtime props (those only
  drive the `ring` variant; the spinner-vs-ring `style` axis is a builder-time param not
  surfaced in the bundle). Sweep contexts, not those props.
- **Table** exports `TableContainer/TableHeader/TableColumn/TableBody/TableRow/TableCell/
  TableFooter` (not the Column/Row/Cell shorthand).
- **Aliased re-exports** (`ListBoxItem as SelectItem`, `SelectSection`, …): `gen-bundle-inputs.mjs`
  reads exported names via `getExportSymbols()` (NOT `getExportedDeclarations`, which keys
  aliases under the original name and drops them). If `SelectItem`/`SelectSection` etc. go
  missing from the bundle, that regressed.

## Render-check findings (Phase 1 build)

Validate exits 0; CSS/bundle/fonts verified working (Calendar, ColorEditor, ColorArea,
Switch, NumberField, SearchField, DropZone, Avatar all render fully styled). Known items:

- **8 "blank" + Loader "thin"** (Button, Link, Input, Checkbox, ToggleButton, ColorSwatch,
  ProgressBar, ListBox, Loader): NOT broken — the floor render is a real component with no
  content/at small size (empty Button, lone checkbox, spinner), so PNG < 5KB trips the
  heuristic. Fix = author a 1-line preview with realistic content/children (Phase 2). These
  are the highest-value first previews to author.
- **Overlay scrim on floor cards** (Drawer, Modal, Overlay): render their OPEN state by
  default → a dark/gray full-card scrim. Fix later with `cfg.overrides.<Name>.cardMode:
  "single"` + an authored closed/trigger preview, or skip.
- **[TOKENS_MISSING]** (12 vars): mostly runtime-injected (`--toast-*` set by Toaster at
  runtime, `--toc-*` are docs-only) or component param-default vars (`--alert-bg`,
  `--color-swatch-radius`, `--color-shine`) normally written by DesignSystemProvider's param
  registry. Non-blocking — floor cards render fine without them; revisit if an authored
  preview looks off.

### Known render warns (triaged legitimate)
- `[RENDER_THIN]` Loader — a spinner really is tiny; legitimate.
- `[RENDER_THIN]` Toaster "variants render identically" — toasts portal to a fixed
  bottom-right position, so in a multi-cell grid render the cells read empty/identical.
  Resolved with single card mode (`primaryStory: "Success"`); benign.
- Headless Chrome cosmetics (NOT defects): glass/backdrop-blur scrims render flat gray
  (Dialog/Modal/Drawer), and remote images break (Card "WithImage" Unsplash, Sidebar avatar).
  The component layout/content is correct; the real product (with GPU/network) renders these.

### Incident 2026-06-19 — work auto-stashed by a background rebase
While authoring Phase 2, a background PR-rebase routine checked out another branch
(`claude/charming-nightingale-7ad20b`) + `git clean`-ed, wiping the uncommitted `.design-sync/`
working tree (62 previews + config edits). Recovered from `git stash` (the routine
auto-stashed with a descriptive message before switching). Lesson: **commit `.design-sync/`
sources frequently** — untracked files are the first casualty. See the user-memory note.

## Re-sync risks

- Compiled CSS is a snapshot of the DEFAULT preset; if dotUI's default ramps/tokens change
  (`pnpm build:registry`), the shipped look goes stale until the CSS is recompiled.
- The custom entry's component set is pinned to `registry-items.ts` at generation time;
  new/removed registry items need `gen-bundle-inputs.mjs` re-run.
- `dts.mjs` fork is pinned to the registry source layout (`src/registry/**`, `src/lib/**`);
  a layout move breaks prop resolution. Diff the fork against `lib/dts.mjs` on re-sync.
- Tailwind CLI version in `.ds-sync` (`@tailwindcss/cli@^4.3.0`) must stay compatible with
  www's plugins; bump together.
