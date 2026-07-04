# The Perfect dotUI — end-state architecture study

**Status:** point-in-time architecture study (2026-07-04). This folder documents, in present tense, an idealized end-state dotUI in which every rewrite has already happened — it is an opinion about where the architecture should land, not a description of the current codebase and not a migration plan. Formed independently from the product goals and the code; contested forks were decided through competing design panels and are defended, with rejected alternatives, in the [decision log](00-decision-log.md).

## The shape in one paragraph

A design system is a **dsdoc** — one versioned JSON document pinned to an immutable **Registry Manifest** snapshot. Two pure functions do everything: `resolve(manifest, dsdoc) → ResolvedSystem` and `compile(resolved, target)`, running byte-identically in a browser worker (the builder's live preview) and on the server (every export endpoint) — so preview equals export by construction. Component styles are authored as Tailwind utility strings, lifted into an engine-neutral **Style Contract** (owned-slot invariant), from which two pure emitters produce idiomatic Tailwind (`tv()`) and idiomatic StyleX (`stylex.create`). Every value flows through the **Dimensional Token Graph** — three layers, stable readable ids, mode dimensions × cells, pluggable per-cell producers — which serializes to CSS variables, StyleX `defineVars`/`createTheme`, and DTCG. The builder is a generated UI over **Axis** declarations; every edit is a **Command** classified into value / structural / global tiers, and the value tier is pure CSS-variable writes (60 fps hue drags over a full showcase). Distribution is one resolved system, many packagings: shadcn CLI, v0/Bolt/Lovable bundles, zip, DTCG/Figma, MCP/agents — with `dotui.lock.json` and `npx dotui update` closing the lifecycle.

## Chapters

| # | Chapter | What it covers |
|---|---|---|
| 00 | [Decision log](00-decision-log.md) | Every fork, the ratified choice, the rejected alternatives with reasons, the honest costs |
| 01 | [System overview](01-system-overview.md) | All artifacts and the two pure functions; three end-to-end data-flow narratives; core invariants |
| 02 | [Monorepo & packages](02-monorepo.md) | The seven packages + apps/web, dependency DAG, boundary enforcement, build pipeline |
| 03 | [The registry](03-registry.md) | Item anatomy, item kinds, sync groups, icon axis, manifest building, ten authoring rules |
| 04 | [Styles](04-styles.md) | Authoring whitelist, lift/normalize, the Style Contract, state model, both emitters, Button worked end-to-end in both engines |
| 05 | [Tokens](05-tokens.md) | The Dimensional Token Graph: layers, dimensions × cells, five producers, verification, three emission backends |
| 06 | [Axes](06-axes.md) | AxisDecl schema, scopes and precedence, sync groups + detach, fan-out grouped tweaks, the full axis catalog |
| 07 | [Reconstructions](07-reconstructions.md) | Material 3, Geist, Linear, enterprise, shadcn rebuilt as golden dsdocs; coverage matrix; reconstruction as CI |
| 08 | [Density & sizing](08-density-sizing.md) | Three tiers as a Contract dimension, sizes() geometry tables, why not a scale factor, baked vs runtime export |
| 09 | [The dsdoc](09-dsdoc.md) | The document schema, three version numbers, pinned manifest semantics, migrations, reconcile, storage, the Geist worked doc |
| 10 | [The builder](10-builder.md) | /create end to end: generated panel, command store, Style Worker, DesignScope, tiers, journeys, AI assist |
| 11 | [The compiler](11-compiler.md) | resolve() stage by stage, compile() targets, EngineEmitter, codeStyle AST transforms, isomorphism, caching, errors |
| 12 | [Distribution](12-distribution.md) | Every endpoint and export target, target profiles, the CLI + lockfile + update flow, Figma, MCP/agents |
| 13 | [Testing & invariants](13-testing.md) | The eleven invariants as concrete suites across five gates; fixtures; perf regression |
| 14 | [Contributing](14-contributing.md) | Nine recipes: new component / style / axis / token / producer / engine / target / mode; governance policies |

## How this study was produced

Five explorers mapped the current subsystems (registry, publisher, builder, color engine, distribution). Four design panels — style IR, tokens, config/axes, preview/builder — each ran three independent competing proposals through a judge; an arbiter resolved the cross-panel conflicts into a canonical constitution (names, schemas, rulings), which every chapter follows. Chapters were then authored in parallel and swept for coherence. The decision log records both the panel verdicts and the arbiter rulings.

## Reading order

Start with [01 — System overview](01-system-overview.md), then [00 — Decision log](00-decision-log.md) for why the architecture is shaped this way. The deep-dive pairs are [04 Styles](04-styles.md) + [05 Tokens](05-tokens.md) (the two IRs), [09 dsdoc](09-dsdoc.md) + [06 Axes](06-axes.md) (the document and its knobs), and [10 Builder](10-builder.md) + [11 Compiler](11-compiler.md) (the two execution sites of the same pipeline). [07 Reconstructions](07-reconstructions.md) is the proof the flexibility requirement is met.
