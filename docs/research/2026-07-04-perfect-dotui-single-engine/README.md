# The Perfect dotUI (single-engine) — end-state architecture study

**Status:** point-in-time architecture study (2026-07-04). This folder documents, in present tense, an idealized end-state dotUI in which every rewrite has already happened **and StyleX is not a target** — the project targets exactly one style engine, idiomatic Tailwind CSS v4. It is an opinion about where the architecture should land, not a description of the current codebase and not a migration plan.

It is the **single-engine sibling** of the two-engine study in `docs/research/2026-07-04-perfect-dotui/`, and the owner-preferred direction: StyleX has been ruled out for the foreseeable future, which removes the forcing function behind that study's engine-neutral IR. Every decision that existed *only* to guarantee cross-engine parity is re-opened here; the token graph, dsdoc/manifest, isomorphic compiler, axes, and distribution — none of which were engine-driven — carry over intact. Contested forks are decided in the [decision log](00-decision-log.md), which adds three single-engine forks (**N1–N3**) to the ledger.

## The shape in one paragraph

A design system is a **dsdoc** — one versioned JSON document pinned to an immutable **Registry Manifest** snapshot. Two pure functions do everything: `resolve(manifest, dsdoc) → ResolvedSystem` and `compile(resolved, target)`, running byte-identically in a browser worker (the builder's live preview) and on the server (every export endpoint) — so preview equals export by construction. Component styles are authored as Tailwind `tv()` strings in `styles.ts` and **resolved** — named-style params, density, scalar vars, declared CSS-var writes — into the shipped `tv()` file: **there is no engine-neutral IR, styles are Tailwind**, with the full utility surface (`:has()`, `**:[svg]`, `peer-*`, arbitrary values). Every value flows through the **Dimensional Token Graph** — three layers, stable readable ids, mode dimensions × cells, pluggable per-cell producers — which serializes to CSS variables and DTCG. The builder is a generated UI over **Axis** declarations; every edit is a **Command** classified into value / structural / global tiers, and the value tier is pure CSS-variable writes (60 fps hue drags over a full showcase). Distribution is one resolved system, many packagings: shadcn CLI, v0/Bolt/Lovable bundles, zip, DTCG/Figma, MCP/agents — with `dotui.lock.json` and `npx dotui update` closing the lifecycle.

## Chapters

| # | Chapter | What it covers |
|---|---|---|
| 00 | [Decision log](00-decision-log.md) | Every fork, the ratified choice, the rejected alternatives with reasons, the honest costs — including the single-engine forks N1–N3 |
| 01 | [System overview](01-system-overview.md) | All artifacts and the two pure functions; three end-to-end data-flow narratives; core invariants |
| 02 | [Monorepo & packages](02-monorepo.md) | The seven packages + apps/web, dependency DAG, boundary enforcement, build pipeline |
| 03 | [The registry](03-registry.md) | Item anatomy, item kinds, sync groups, icon axis, manifest building, ten authoring rules |
| 04 | [Styles](04-styles.md) | Tailwind authoring with the full utility surface, style resolution, params, declared var-writes, the `tv()` emitter, Button worked end to end |
| 05 | [Tokens](05-tokens.md) | The Dimensional Token Graph: layers, dimensions × cells, five producers, verification, two emission backends (CSS vars, DTCG) |
| 06 | [Axes](06-axes.md) | AxisDecl schema, scopes and precedence, sync groups + detach, fan-out grouped tweaks, the full axis catalog |
| 07 | [Reconstructions](07-reconstructions.md) | Material 3, Geist, Linear, enterprise, shadcn rebuilt as golden dsdocs; coverage matrix; reconstruction as CI |
| 08 | [Density & sizing](08-density-sizing.md) | Three tiers as a dimension, `sizes()` geometry tables, why not a scale factor, baked vs runtime export |
| 09 | [The dsdoc](09-dsdoc.md) | The document schema, three version numbers, pinned manifest semantics, migrations, reconcile, storage, the Geist worked doc |
| 10 | [The builder](10-builder.md) | /create end to end: generated panel, command store, live preview, DesignScope, tiers, journeys, AI assist |
| 11 | [The compiler](11-compiler.md) | `resolve()` stage by stage, `compile()` targets, the single `tv()` output path, codeStyle AST transforms, isomorphism, caching, errors |
| 12 | [Distribution](12-distribution.md) | Every endpoint and export target, target profiles, the CLI + lockfile + update flow, Figma, MCP/agents |
| 13 | [Testing & invariants](13-testing.md) | The eight invariants as concrete suites across the gates; fixtures; perf regression |
| 14 | [Contributing](14-contributing.md) | Recipes: new component / style / axis / token / producer / target / mode; governance policies |

## How this study was produced

Derived by transforming the two-engine end-state study for a single-engine world. The owner ruled StyleX out of scope, which removes the forcing function behind the engine-neutral IR — so the two-engine study's most expensive and most constraining subsystem (lift/normalize, the owned-slot Style Contract, the closed authoring whitelist, the dual-bound state model, and the cross-engine parity apparatus) is deleted rather than rebuilt. Each parity-driven decision was re-opened against a single-engine constitution; every non-engine subsystem carries over. Chapters were authored in parallel from that constitution and swept for coherence.

## Reading order

Start with [01 — System overview](01-system-overview.md), then [00 — Decision log](00-decision-log.md) for why the architecture is shaped this way (read **N1** first — the "no engine-neutral IR" fork is the spine of everything that differs from the two-engine study). The deep-dive pairs are [04 Styles](04-styles.md) + [05 Tokens](05-tokens.md) (styles and the token graph), [09 dsdoc](09-dsdoc.md) + [06 Axes](06-axes.md) (the document and its knobs), and [10 Builder](10-builder.md) + [11 Compiler](11-compiler.md) (the two execution sites of the same pipeline). [07 Reconstructions](07-reconstructions.md) is the proof the flexibility requirement is met.
