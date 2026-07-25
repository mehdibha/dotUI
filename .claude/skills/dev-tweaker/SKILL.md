---
name: dev-tweaker
description: Add throwaway useTweak() controls to a www feature component so the user can flip design/layout options live in the dev-only tweaker panel and pick one, then bake the choice in and remove the scaffolding. Use only when they explicitly ask for tweaks or options on a specific feature during PR/feature-branch work.
---

# Dev tweaker (design exploration)

`www/src/dev/tweaker` is a floating panel for exploring designs/layouts live: you add `useTweak()` calls to a feature component, the user flips the options in the panel and picks one. It runs in dev and on Vercel previews, and is dead-code-eliminated from production builds. Full API + workflow: [`www/src/dev/tweaker/README.md`](../../../www/src/dev/tweaker/README.md).

- **When (strict):** only during active PR/feature-branch work, and only when the user explicitly asks for tweaks/options on a specific feature. Never unprompted, never on `main`, never as a way to add real config.
- **How:** add `useTweak('Label', { type, default, group? })` in the relevant **www** feature component and branch the JSX/styles on the returned value. Keep each `default` equal to the current look (nothing changes until a control moves); offer a small set (≤~5) of meaningful named variants per axis; `group` related controls. Types: `select`, `boolean`, `number`, `color`, `text`.
- **Boundaries:** never author `useTweak` in `www/src/registry/` — the product source stays clean (the panel reuses registry UI, but the calls live only in site/feature/module code). It's throwaway scaffolding, **not** a `/create` axis: adding a real axis/variant/token is still a product decision (propose-and-approve — see `CLAUDE.md`).
- **Cleanup:** once the user picks (their "Copy for AI" output or a verbal choice), bake the values into the code and **remove the `useTweak` scaffolding** before finalizing the PR — unless they want to keep iterating. Don't merge `useTweak` calls into feature code.
