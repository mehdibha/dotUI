# "Open in &lt;tool&gt;" — integration research & architecture

This folder is the **research + architecture foundation** for dotUI's upcoming **"Open in &lt;tool&gt;"** feature.

## The goal

From the dotUI editor (`/create`), a user clicks **"Open in &lt;tool&gt;"** and lands in that external tool **already showing the component showcase** (the landing-page cards, `www/src/components/marketing/showcase/cards.tsx`) as the **first view**, with the design system **already installed**:

- every component the showcase needs present under the project's `ui/` folder,
- the colors / tokens / theme written into `globals.css`,
- all reflecting the user's **chosen preset** (`?preset=<encoded>`), **not** the default.

In short: open the tool and immediately see *your* themed design system rendering *your* components — ready to build on.

## The core insight

Today dotUI emits **one themed component at a time** (`GET /r/$name?preset=…`) plus a theme init item (`GET /r/init?preset=…`). The feature needs a new shared abstraction:

> **A `preset → full-project bundle` engine** — given a `?preset=`, emit a complete, self-contained file tree (all transitively-needed `ui/*` components + `lib/utils.ts` + a real `globals.css` carrying the theme + the rewritten showcase + an `App` entry + Vite/Tailwind/tsconfig scaffold) so any tool can boot straight onto the themed showcase.

Two **master keys** unblock almost everything:
1. **Ship `/r/registry.json`** (404 today) — required for all shadcn/MCP discovery.
2. **Export an OKLCH → hex/RGB converter** from `@dotui/colors` — design tools and swatches need sRGB; dotUI emits OKLCH only.

Read **[architecture.md](./architecture.md)** for the full engine design, module boundaries, the 12-PR refactor list, and the phased roadmap. It is the keystone document.

## Per-tool reports

Each report dives into the exact technical approach for that tool: how the **preset** propagates, how **components** get installed, how the **theme** lands in `globals.css`, how the **showcase** becomes the first view, what **dotUI must build**, any **`meta.ts` changes**, limitations/fallbacks, and an implementation checklist.

| Tool | Surface | Technically possible? | Button mechanism | Preset | Color | Roadmap | Report |
|---|---|---|---|---|---|---|---|
| **shadcn CLI** | code | ✅ Native substrate | `npx shadcn add` (base/all item) | full | full | P0–P1 | [shadcn-cli.md](./shadcn-cli.md) |
| **StackBlitz** | code | ✅ Viable (best fit) | sandbox-define (SDK / `/run` POST) | full | full | P2 | [stackblitz.md](./stackblitz.md) |
| **CodeSandbox** | code | ✅ Viable | sandbox-define (Define API) | full | full | P2 | [codesandbox.md](./codesandbox.md) |
| **v0** | code | ✅ Possible (workaround) | component-url (`/chat/api/open`) | full | full *(theme as files)* | P3 | [v0.md](./v0.md) |
| **Cursor** | code | ✅ Feasible | mcp-install deeplink + copy-command | full *(base item)* | full | P1 | [cursor.md](./cursor.md) |
| **Claude Code** | code | ✅ Feasible | copy-command (`mcp add-json` / `shadcn add`) | full | full | P1 | [claude-code.md](./claude-code.md) |
| **bolt.new** | code | ✅ Feasible | repo-import (generated repo) | full | full | P4 | [bolt-new.md](./bolt-new.md) |
| **Replit** | code | ✅ Feasible | repo-import (generated repo) | full | full | P4 | [replit.md](./replit.md) |
| **Lovable** | code | ⚠️ Feasible (caveats) | repo-import + GitHub sync | full | partial *(HSL overwrite)* | P4 | [lovable.md](./lovable.md) |
| **Figma** | design | ⚠️ Possible (XL plugin) | custom plugin + token export | full | partial *(OKLCH→sRGB lossy)* | P5–P6 | [figma.md](./figma.md) |
| **Framer** | design | ⚠️ Feasible w/ build | separate code-component lib | partial | partial | P7 | [framer.md](./framer.md) |
| **Webflow** | design | ⚠️ Token-only | copy-command (`<style>` block) | partial | partial *(invisible in Designer)* | P7 | [webflow.md](./webflow.md) |
| **Paper** | design | ⚠️ Indirect (today) | agent-mediated (MCP) | partial | partial | P7 / revisit | [paper.md](./paper.md) |

**Surfaces:** the *code surface* (real React/TS files or a shadcn registry) is unlocked by the bundle engine + `/r/registry.json`. The *design surface* (no React — tokens + generated nodes) is unlocked by the OKLCH→hex/RGB token export plus per-tool generators.

## Roadmap at a glance

| Phase | Deliverable | Effort | Unlocks |
|---|---|---|---|
| **P0** | `/r/registry.json` index + export `toSrgb`/`toHex` from `@dotui/colors` | S | MCP discovery; design-tool color export |
| **P1** | `preset → full-project bundle` engine (`www/src/bundle/*`) + `/r/bundle` + base/"all" item | L | shadcn CLI, Cursor, Claude Code |
| **P2** | StackBlitz SDK + CodeSandbox Define API buttons | M | highest-fidelity sandbox opens |
| **P3** | v0 button + showcase registry item (theme-as-files) | M | v0 |
| **P4** | generated-repo service | L | bolt.new, Replit, Lovable |
| **P5** | token-export endpoints + `figma` `meta.ts` schema | M | design-surface foundation |
| **P6** | Figma plugin (component + Variables generator) | XL | Figma |
| **P7** | Framer / Webflow / Paper generators | XL | remaining design tools |

## How this was researched

Each tool's capabilities were verified against live, current (Jan 2026) documentation, and the per-tool reports are grounded in dotUI's actual internals (the preset codec at `www/src/modules/create/preset/codec.ts`, the publisher at `www/src/publisher/publish.ts`, the theme pipeline, and the showcase's 32-component dependency footprint). External tool capabilities change quickly — treat verdicts as a point-in-time snapshot and re-verify before implementing each phase.
