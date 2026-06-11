# Open in Claude Code

> Feasible with copy-paste commands · button type **copy-command** · preset fidelity **full** · color fidelity **full**

Claude Code has no deeplink protocol that installs dependencies, no MCP auto-install URL, and no
sandbox import API. Everything is driven by commands the user pastes into a terminal. The two
practical delivery paths are:

1. **Copy-command flow** — a "Copy for Claude Code" button on dotUI's customizer that emits two
   shell commands: one to wire the registry MCP, one to install the full themed base.
2. **Showcase-preinstalled repo flow** — generate a ready-to-run Next.js / Vite project with every
   needed component already in `ui/`, globals.css already written, and the showcase page as
   `app/page.tsx`; the user clones it and types `claude`.

Both flows achieve full preset fidelity and full color fidelity because they feed the user's
`?preset=<encoded>` token directly into the shadcn CLI and into the `@dotui` registry entry
baked into `components.json`.

---

## 1. User experience

### Copy-command flow

The customizer panel already renders an `<InstallCommand>` button
(`www/src/modules/create/install-command.tsx:30-72`) that outputs:

```
npx shadcn add https://dotui.com/r/init?preset=<encoded>
```

For the Claude Code variant, a sibling "Open in Claude Code" button (or a copy-variant toggle)
emits two commands to the clipboard:

```
# 1. Wire the dotUI registry MCP (once per project / workspace)
claude mcp add-json dotui '{"command":"npx","args":["-y","shadcn@latest","registry:mcp"],"env":{"REGISTRY_URL":"https://dotui.com/r/registry.json"}}'

# 2. Install the full themed base with your chosen preset
npx shadcn add https://dotui.com/r/init?preset=<encoded>
```

The user pastes both commands into their terminal, then types `claude` in the project directory.
After that, inside a Claude Code session they can ask it to install individual components via
MCP-browse ("add the modal component") without leaving the editor.

### Showcase-preinstalled flow

A "Download / Clone Showcase" action generates a repo (see §7) and puts a `README` with:

```
git clone <generated-repo-url>
cd <repo>
pnpm install
claude
```

The user lands in Claude Code with every ui component already under `src/components/ui/`, the
preset theme in `src/app/globals.css`, and `src/app/page.tsx` rendering `<Cards />`. No install
step is needed.

---

## 2. Technical mechanism

### 2a. No deeplink exists

`claude-cli://open?cwd=&repo=&q=` opens a terminal session in a directory with a prefilled
prompt. It does **not** execute commands. It cannot trigger `npm install`, `shadcn add`, or any
other side-effect.

### 2b. MCP registry wire-up

The shadcn registry MCP server is bootstrapped with:

```
claude mcp add-json dotui \
  '{"command":"npx","args":["-y","shadcn@latest","registry:mcp"],"env":{"REGISTRY_URL":"https://dotui.com/r/registry.json"}}'
```

This tells Claude Code: "when the user asks to add a component, use the shadcn MCP server pointed
at dotUI's registry index." After this, inside any Claude Code session, the model can call MCP
tools to browse the registry and run `shadcn add @dotui/<name>`.

**Prerequisite**: `/r/registry.json` must exist and return the shadcn `Registry` shape (see §7).
Today that route does not exist; it is the single blocking build item.

### 2c. Per-preset install via shadcn CLI

```
npx shadcn add https://dotui.com/r/init?preset=<encoded>
```

This invokes `GET /r/init?preset=<encoded>` (`www/src/routes/r/init.tsx`), which calls
`emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })`
(`www/src/publisher/emit-theme.ts:71-128`). The response is a `registry:base` JSON item that:

- carries the full OKLCH primitive ramps in `css[":root"]` and `css[".dark"]` (preset-specific
  when `preset.color` is set, static defaults otherwise),
- carries the complete `@theme inline` semantic token layer in `cssVars.theme` (constant across
  presets — only the primitives it points to change),
- bakes `config.registries["@dotui"] = "https://dotui.com/r/{name}?preset=<encoded>"`
  (`emit-theme.ts:130-132`) so every subsequent `shadcn add @dotui/<name>` hits the preset-aware
  endpoint.

`shadcn add` merges all of this into the project's `globals.css` (or `src/app/globals.css` for
Next.js app-dir), installing fonts, plugins, OKLCH ramps, and the `cn()` util in one shot.

### 2d. How transitive deps carry the preset

When Claude Code (via MCP) runs `shadcn add @dotui/button`, the server at
`/r/button?preset=<encoded>` calls `setDotuiDepResolver(origin, "?preset="+encodedPreset)`
(`www/src/routes/r/$name.tsx:50-52`) before calling `publish()`. Inside
`publisher/publish.ts:79-105 rewriteDeps()`, every `registryDependency` that is a known dotUI
name gets rewritten to `https://dotui.com/r/<dep>?preset=<encoded>`. So `loader`, `field`, and
any other transitive dep arrive with the same preset baked in — the user never has to pass the
preset flag manually for each component.

---

## 3. Preset propagation

The `?preset=<encoded>` value is a URL-safe base64 string of pako raw-DEFLATE of a compact JSON
object (`DesignSystemState`, `www/src/modules/create/preset/types.ts:14-19`):

```ts
{ p?: Record<string, Record<string, string>>,  // per-component param choices (diffed vs defaults)
  t?: Record<string, string>,                   // global tokens (not yet wired to publisher)
  d?: "default" | "comfortable",               // density only if != "compact"
  c?: ColorConfig                               // full color recipe only if != DEFAULT_COLOR_CONFIG
}
```

`encodePreset(ds: DesignSystem): string | undefined` in
`www/src/modules/create/preset/codec.ts:75-94` produces this string; it returns `undefined` if
nothing differs from defaults (no `?preset=` param needed). The `InstallCommand` component
(`install-command.tsx:39-48`) already calls this and builds the `npx shadcn add` URL.

For the Claude Code button, reuse the same call:

```ts
import { encodePreset } from "@/modules/create/preset/codec";
import { useDesignSystem } from "@/modules/create/preset";

function claudeCodeCommands(host: string, designSystem: DesignSystem): string {
  const encoded = encodePreset(designSystem);
  const initUrl = encoded ? `${host}/r/init?preset=${encoded}` : `${host}/r/init`;
  const mcpConfig = JSON.stringify({
    command: "npx",
    args: ["-y", "shadcn@latest", "registry:mcp"],
    env: { REGISTRY_URL: `${host}/r/registry.json` },
  });
  return [
    `claude mcp add-json dotui '${mcpConfig}'`,
    `npx shadcn add ${initUrl}`,
  ].join("\n");
}
```

### What the preset controls end-to-end

| Preset field | Where it takes effect | How |
|---|---|---|
| `color` (ColorConfig) | `globals.css` `:root`/`.dark` primitive ramps | `resolveColorConfig(preset.color)` + `rampsToVars()` in `emitInitItem` (`emit-theme.ts:155-159`) |
| `density` | per-component class strings | `flatten` merges `base ← density[d] ← params` at publish time (`publisher/flatten.ts:148-170`); `--dotui-density` written to `:root` only when non-compact (`emit-theme.ts:53-68`) |
| `componentParams` | per-component class strings and scalar CSS vars | `resolveClasses` rewrites tailwind suffixes (`publisher/resolve-classes.ts:30-56`); enum variants fold via `flatten` |
| `tokens` (t) | **NOT YET wired** | Survives the URL round-trip but `PublishPreset` (`publisher/types.ts:79-85`) does not carry `tokens`; `emit-theme.ts:62-68` documents this as a TODO |

---

## 4. Components installed

After running `npx shadcn add https://dotui.com/r/init?preset=<encoded>`, the project has:

- `src/lib/utils.ts` — the `cn()` helper (shipped inline by the init item, `emit-theme.ts:41-47`)
- `components.json` updated with `config.registries["@dotui"]` pointing to the preset-baked
  endpoint

To install individual components:

```
npx shadcn add @dotui/button
npx shadcn add @dotui/card
# etc.
```

Or, to install every component that the showcase needs (see §6), in one command:

```
npx shadcn add @dotui/accordion @dotui/avatar @dotui/badge @dotui/button @dotui/calendar \
  @dotui/card @dotui/checkbox @dotui/checkbox-group @dotui/color-area @dotui/color-editor \
  @dotui/color-field @dotui/color-slider @dotui/color-thumb @dotui/combobox @dotui/disclosure \
  @dotui/drop-zone @dotui/field @dotui/file-trigger @dotui/group @dotui/input @dotui/kbd \
  @dotui/link @dotui/list-box @dotui/loader @dotui/otp-field @dotui/popover \
  @dotui/progress-bar @dotui/radio-group @dotui/select @dotui/separator @dotui/slider \
  @dotui/switch @dotui/table @dotui/tabs @dotui/tag-group @dotui/text @dotui/text-field \
  @dotui/time-field @dotui/toast @dotui/toggle-button @dotui/toggle-button-group @dotui/tooltip
```

Each component's `registryDependencies` are followed transitively by the CLI; `focus-styles`,
`theme`, and `utils` are intentionally dropped (bundled into init, `publisher/publish.ts:52-59`).
The components land at `src/components/ui/<name>.tsx` (the `target` from each item's
`meta.ts`; e.g. `"ui/button.tsx"` → resolved to `src/components/ui/button.tsx` via the
`aliases.ui` entry in `components.json`).

---

## 5. Theme in globals.css

After `npx shadcn add https://dotui.com/r/init?preset=<encoded>`, the project's `globals.css`
contains exactly the following sections (merged by shadcn):

```css
/* At-rules from baseRegistryCss (base/base.css) */
@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "<auto-detected>"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));
@utility focus-ring { … }
@utility focus-reset { … }
@utility focus-input { … }
@utility no-highlight { … }
@layer base {
  * { @apply border-border; }
  body { @apply bg-bg font-sans text-fg; }
  html { @apply font-sans; }
}
::selection { background-color: var(--accent-800); color: var(--on-accent-800); }

/* @theme inline (cssVars.theme) — constant across presets */
@theme inline {
  --radius-md: calc(0.375rem * var(--radius-factor));
  /* ... all radius-* tokens ... */
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  /* ... all ~80 semantic color tokens ... */
}

/* Primitive OKLCH ramps — PRESET-SPECIFIC */
:root {
  --radius-factor: 1;
  /* 6 palettes × 11 steps = 66 vars, generated from preset.color */
  --neutral-50: oklch(0.985 0 0);
  /* ... */
  --accent-500: oklch(0.60 0.14 237.32);
  /* ... --success-*, --warning-*, --danger-*, --info-* ... */
}
.dark {
  /* same 66 vars with lightness reversed (--neutral-50 takes --neutral-950's value) */
  --neutral-50: oklch(0.13 0 0);
  /* ... */
}
```

Key facts:
- The `@theme inline` block is **identical** for all presets. Only `:root`/`.dark` change.
- `--on-*` foregrounds (e.g. `--on-accent-500`) are **not in the init item**. They are injected
  at Tailwind build time by the `tailwindcss-autocontrast` plugin from `packages/tailwindcss-autocontrast`
  by scanning `:root`/`.dark` for `--<name>-<step>` vars (`index.js:407-501`).
- The `autocontrast` plugin's `cssfile` option must point at the consumer's Tailwind entry CSS.
  shadcn auto-detects this; if auto-detection fails, the user sets it manually in `globals.css`.

---

## 6. The showcase as first view

### What the showcase is

`www/src/components/marketing/showcase/cards.tsx` renders a CSS masonry grid (`columns-1
sm:columns-2 lg:columns-3 xl:columns-4`) of 17 self-contained widget cards. Every card is a
plain React component with no server functions, no loaders, and no routing dependency. All
interactive state is local (`useState`). The 17 files live under
`www/src/components/marketing/showcase/*.tsx`.

### Components consumed by the showcase (the `ui/` surface needed)

The showcase uses 41 of the 60 registered ui items:

accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group, color-area,
color-editor, color-field, color-slider, color-thumb, disclosure, drop-zone, field, file-trigger,
group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar, radio-group, select,
separator, slider, switch, table, tabs, tag-group, text, text-field, time-field, toggle-button,
toggle-button-group, tooltip (and toast is imported by some cards but not by `<Cards />` directly).

The full install command for these is in §4.

### App.tsx / page.tsx for the showcase as first view

```tsx
// src/app/page.tsx (Next.js app dir) or src/App.tsx (Vite)
import { Cards } from "@/components/marketing/showcase/cards";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg py-12 font-sans text-fg antialiased">
      <div className="container">
        <Cards />
      </div>
    </main>
  );
}
```

The `bg-bg`, `text-fg`, `font-sans` classes resolve via the `@theme inline` semantic tokens
installed by the init item.

### Files to copy from the dotUI source

```
www/src/components/marketing/showcase/          # all 18 files (cards.tsx + 17 widget files)
www/src/registry/lib/utils/index.ts             # cn() — also installed by shadcn init
www/src/registry/lib/context/index.tsx          # createContext, createVariantsContext
www/src/registry/hooks/use-image-loading-status.ts
www/src/modules/core/styles.tsx                 # DesignSystemProvider + createStyles
www/src/registry/__generated__/icons.tsx        # ExternalLinkIcon (or replace with lucide-react)
```

### Dark mode

The showcase expects `class="dark"` toggled on `<html>` for dark mode. Replace
`packages/starter-themes`'s `ThemeProvider` (which depends on TanStack Router's `ScriptOnce`)
with any class-based dark-mode provider (`next-themes` for Next.js, or a minimal inline script).

### Remote avatar images

Several cards fetch GitHub CDN avatars at runtime (e.g. `https://github.com/mehdibha.png`).
All use `AvatarFallback`, so the showcase renders correctly offline. No bundled image assets
are required.

---

## 7. What dotUI must build

### 7a. `/r/registry.json` index route (blocking for MCP path)

A new TanStack Start server route at `www/src/routes/r/registry[.]json.tsx` (filename uses
`[.]` to produce the literal dot) that returns the shadcn `Registry` shape:

```ts
// www/src/routes/r/registry[.]json.tsx
import { registryUi, registryLib } from "@/registry/__generated__/registry-items";
import { registryBase } from "@/registry/base/registry";
import { registryHooks } from "@/registry/hooks/registry";
import { createServerFn } from "@tanstack/start";

export const Route = createFileRoute("/r/registry.json")({
  component: () => null,
});

export const registryJsonHandler = createServerFn({ method: "GET" })
  .handler(async () => {
    const items = [
      registryBase,
      ...registryLib,
      ...registryHooks,
      ...registryUi.map(({ group, params, ...rest }) => rest),  // strip dotUI-only fields
    ];
    return Response.json(
      { name: "dotui", homepage: "https://dotui.com", items },
      { headers: { "cache-control": "public, max-age=3600" } }
    );
  });
```

The `items` array must include at least `name` and `type` per entry. `registryUi` is imported
from `www/src/registry/__generated__/registry-items.ts` (the committed generated file);
`PUBLISHABLE_NAMES` is git-ignored so do not use it here. Do not include `files[].content` (no
source code inline — the MCP fetches each item separately via `/r/<name>`).

### 7b. "Copy for Claude Code" button on the customizer

A new variant of `InstallCommand` (`www/src/modules/create/install-command.tsx`) that puts both
commands on the clipboard:

```tsx
// Alongside the existing InstallCommand in install-command.tsx

export function ClaudeCodeCommand() {
  const { designSystem } = useDesignSystem();
  const [host, setHost] = useState(DEFAULT_REGISTRY_HOST);

  useEffect(() => { setHost(getRegistryHost()); }, []);

  const commands = useMemo(() => {
    const encoded = encodePreset(designSystem);
    const initUrl = encoded ? `${host}/r/init?preset=${encoded}` : `${host}/r/init`;
    const mcpConfig = JSON.stringify({
      command: "npx",
      args: ["-y", "shadcn@latest", "registry:mcp"],
      env: { REGISTRY_URL: `${host}/r/registry.json` },
    });
    return [
      `claude mcp add-json dotui '${mcpConfig}'`,
      `npx shadcn add ${initUrl}`,
    ].join("\n");
  }, [designSystem, host]);

  // render a copy button like InstallCommand
}
```

This component is wired into the customizer panel alongside or below the existing `InstallCommand`.

### 7c. Showcase-preinstalled repo generator

A server action or build script that, given an encoded preset:

1. Runs `emitInitItem(...)` to produce the themed globals.css content.
2. For each of the 41 showcase components, calls the `publish()` pipeline
   (`www/src/publisher/publish.ts:119`) with the decoded preset to produce each component's
   source file with preset-baked class strings.
3. Assembles a Next.js or Vite + React project skeleton:
   - `src/app/globals.css` — the init item's CSS merged in.
   - `src/components/ui/<name>.tsx` — each published component file.
   - `src/lib/utils.ts` — the `cn()` helper.
   - `src/lib/context.tsx`, `src/hooks/use-image-loading-status.ts` — supporting files.
   - `src/modules/core/styles.tsx` — `DesignSystemProvider` + `createStyles`.
   - `src/components/marketing/showcase/*.tsx` — the 17 widget files + `cards.tsx`.
   - `src/app/page.tsx` — renders `<Cards />`.
   - `package.json` with all required deps (see §6 of the showcase map).
4. Creates a GitHub repo (or zip) and returns the clone URL.

The `selectPublishable` helper (`www/src/routes/r/$name.tsx:89-107`) handles the `loader`
enum-with-files swap and must be extracted from the route file to be reusable here.

---

## 8. Schema / meta.ts changes

No `meta.ts` changes are required for the copy-command flow. The MCP path needs the
`/r/registry.json` index, but that is a new route, not a meta field change.

If dotUI later wants Claude Code to surface per-component documentation, add an optional `docs`
field to `RegistryItem` in `www/src/registry/types.ts:69-78`:

```ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  docs?: string;   // URL to component docs page, e.g. "https://dotui.com/docs/components/button"
};
```

This is safe (the build's `metaForRuntime` spreads all fields, `build-publishables.ts:334`;
the publisher's `publish()` drops `group`/`params` but an explicit allowlist would also need
to drop `docs` from emitted shadcn JSON if it should stay internal). No build change is
required to author the field.

---

## 9. Limitations, risks, fallbacks

### No deeplink that auto-runs commands

`claude-cli://open` opens a session and can pre-fill a prompt, but it does not execute any
command. The user must paste and run the two commands manually. The button UX should make this
feel like a two-click flow: copy → paste into terminal.

### `/r/registry.json` does not exist today

The MCP path is blocked until this route is shipped (§7a). Without it, the `claude mcp add-json`
command registers a server that will fail to start (the MCP server calls `REGISTRY_URL` to
enumerate items). The fallback: omit the MCP step entirely and document only
`npx shadcn add @dotui/<name>` for individual component installs.

### `shadcn@latest registry:mcp` version uncertainty

The `registry:mcp` subcommand may require shadcn canary. Pin the npx call to
`shadcn@canary` if `shadcn@latest` does not recognise the subcommand, and update once it
ships in a stable release.

### `tokens` field not yet wired

The `t` / `tokens` slice of the preset (global CSS vars like `--radius-factor`) round-trips in
the URL but `PublishPreset` (`publisher/types.ts:79-85`) does not carry it and
`emitInitItem` does not write it to `:root` (documented TODO at `emit-theme.ts:62-68`). A user
who sets `--radius-factor` in the customizer will see it in the preview but not in the installed
output. Workaround: document that users must manually add `--radius-factor: <value>` to their
`:root` block after install, until the TODO is resolved.

### `autocontrast` cssfile option

The `@plugin "tailwindcss-autocontrast" { cssfile: "..." }` line in globals.css must point at
the consumer's Tailwind entry CSS for `--on-*` foregrounds to be generated. shadcn auto-detects
the project's CSS entry point, but if it guesses wrong the plugin emits no `--on-*` vars and
all `fg-on-*` tokens render transparent. The fallback: instruct the user to verify the `cssfile`
path matches their actual entry CSS after running `shadcn add`.

### Class-based dark mode dependency

The showcase (and all dotUI components) use `@custom-variant dark (&:is(.dark *))` — a class
on `<html>`, not `prefers-color-scheme`. The generated project must include a dark-mode provider
that writes `class="dark"` to `<html>`. `next-themes` with `attribute="class"` is the standard
choice for Next.js.

### Showcase avatar images require network

Several cards load avatars from GitHub CDN. In an air-gapped or restricted environment the
avatars won't load, but `AvatarFallback` renders initials, so the showcase is functional.

---

## 10. Step-by-step implementation checklist

### Phase 1: unblock the MCP path

- [ ] Add route `www/src/routes/r/registry[.]json.tsx` that imports `registryUi`, `registryLib`,
      `registryBase`, `registryHooks` from their respective registry files and returns the shadcn
      `Registry` shape (`{ name, homepage, items }`) with dotUI-only fields (`group`, `params`)
      stripped from each item. Apply the same `public, max-age=3600, s-maxage=86400` cache headers
      used by `$name.tsx:27-30`.
- [ ] Smoke-test: `curl https://dotui.com/r/registry.json | jq '.items | length'` should return 64
      (60 ui + 2 lib + 1 hook + 1 base).
- [ ] Verify `shadcn@latest registry:mcp` resolves successfully against the live endpoint. If it
      requires canary, document the `shadcn@canary` pin.

### Phase 2: Claude Code copy button on the customizer

- [ ] Export `ClaudeCodeCommand` from `www/src/modules/create/install-command.tsx` (or a new
      sibling file). Reuse `getRegistryHost()`, `useDesignSystem()`, `encodePreset()` already in
      scope. The button copies two lines: the `claude mcp add-json dotui ...` invocation (with
      the host-relative `REGISTRY_URL`) and the `npx shadcn add .../r/init?preset=<encoded>` line.
- [ ] Wire `ClaudeCodeCommand` into the customizer panel
      (`www/src/routes/_app/create.tsx` or the panel component it renders). Place it below or
      alongside the existing `InstallCommand`.
- [ ] Add a Claude Code logo or "Claude Code" label to distinguish it from the plain shadcn button.

### Phase 3: per-component install documentation

- [ ] Update the docs page for each component to show
      `npx shadcn add @dotui/<name>` (the `@dotui` scope resolves via the `config.registries`
      entry that `shadcn add .../r/init` writes into `components.json`).
- [ ] Add a "MCP" tab on the docs page with the Claude Code in-session prompt:
      "Add the button component from the dotUI registry."

### Phase 4: showcase-preinstalled project generator (optional but high-value)

- [ ] Extract `selectPublishable` from `www/src/routes/r/$name.tsx:89-107` into a shared util
      (e.g. `www/src/publisher/select-publishable.ts`) so the generator can import it without
      hitting the route module.
- [ ] Build a server action or standalone script that loops `PUBLISHABLE_NAMES`, calls
      `publish({ publishable, preset })` for each of the 41 showcase components, copies the 18
      showcase widget files, assembles `globals.css` from `emitInitItem`, writes `page.tsx`
      importing `<Cards />`, and packages everything as a Next.js starter or Vite starter.
- [ ] Wire a "Download Starter" button on the customizer that triggers this action and returns a
      GitHub repo URL or a zip download.
- [ ] Include a `README.md` in the generated project: `git clone <url> && cd <name> && pnpm install && claude`.

### Phase 5: wire `tokens` into the publisher (existing TODO)

- [ ] Resolve the TODO at `www/src/publisher/emit-theme.ts:62-68`: thread `tokens` from
      `DesignSystem` through `PublishPreset` (`publisher/types.ts:79-85`) and write each key-value
      to `css[":root"]` inside `emitPresetLightVars` (`emit-theme.ts:58-69`). This makes
      `--radius-factor` and any other global token survive into the installed `globals.css`.

---

## Sources

- `www/src/modules/create/install-command.tsx` — live `InstallCommand` component; `encodePreset`
  call and URL construction at lines 39-48.
- `www/src/publisher/emit-theme.ts` — `emitInitItem`, `mergePresetCssFields`, color ramp
  injection, `config.registries` baking; lines 31-170.
- `www/src/routes/r/init.tsx` — `/r/init` server handler; preset decode and `PublishPreset`
  assembly at lines 43-59.
- `www/src/routes/r/$name.tsx` — `/r/<name>` server handler; `setDotuiDepResolver`, dep rewrite,
  `selectPublishable`; lines 50-121.
- `www/src/publisher/publish.ts` — `publish()`, `rewriteDeps()`, `BUNDLED_INTO_INIT`; lines
  52-161.
- `www/src/modules/create/preset/codec.ts` — `encodePreset`, `decodePreset`, pako + base64url
  wire format; lines 75-126.
- `www/src/modules/create/preset/types.ts` — `DesignSystemState` compact shape (lines 14-19),
  `DesignSystem` readable shape (lines 24-32).
- `www/src/publisher/types.ts` — `PublishPreset` (lines 79-85); note absence of `tokens`.
- `www/src/registry/__generated__/registry-items.ts` — committed source of `registryUi` (60
  items) and `registryLib`; the basis for a future `/r/registry.json`.
- `www/src/registry/types.ts` — `RegistryItem` intersection type (lines 69-78);
  `ComponentGroup`, `ParamDef`, `Density`.
- `www/src/registry/theme/primitives.ts` — `resolveColorConfig`, `reverseRamp`, lightness
  stretch, `emitPrimitivesCss`; lines 28-174.
- `www/src/components/marketing/showcase/cards.tsx` — the 17-card masonry grid component.
- shadcn registry MCP docs: https://ui.shadcn.com/docs/registry/mcp
- `packages/tailwindcss-autocontrast/src/index.js` — `getContrastCssVars`, `addBase` injection of
  `--on-*` vars; lines 407-501.
