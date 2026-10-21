---
name: preset
description: Create, review or fix a dotUI built-in preset against the real design system it recreates, from reference measurements to specimen comparison, preset values, review page and PR. Use for any work on www/src/modules/presets/<id>.ts or a preset's fidelity.
---

# Preset

Read [`www/src/modules/presets/README.md`](../../../www/src/modules/presets/README.md) first: the fidelity bar, the decision order, what to do when no axis fits, and the definition of done. Commands are in [`www/src/modules/preset-lab/README.md`](../../../www/src/modules/preset-lab/README.md).

Three modes, same loop: **create** a preset for a new system, **review** an existing one end to end, **fix** one reported problem (skip to step 3 with the report as the finding, then steps 4–6).

## 1. Set up

- Start a dev server as a background task: `pnpm dev:www --port <free port>` from the repo root (in Claude Code, Bash with `run_in_background`; a `nohup … &` server dies between turns).
- In a cloud container, install with `PUPPETEER_SKIP_DOWNLOAD=1 pnpm install` and `export PUPPETEER_EXECUTABLE_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)`.
- Write the axis catalog to a scratch file and read it: `pnpm --filter www presets:catalog --preset <id>` (no `--preset` when creating). It lists every key, its options and the systems each comes from, and where the preset's value comes from today.

## 2. Build the reference pack

`www/src/modules/preset-lab/refs/<id>/`: `sources.md`, `targets.json`, `tokens.json` (formats in the lab README). On review, start from the existing pack and re-measure with its `targets.json`.

- **Official tokens first.** If the system publishes tokens as code, read values from there and cite it in `sources.md`.
- **Measure the product, not its marketing.** App screens and controls at their default size; docs showcases are second best; landing pages run larger.
- **Public pages:** list them in `targets.json` (each page's `mode` if it doesn't follow `prefers-color-scheme`, and per part the `focus` or `before` steps that open a menu or hover a tooltip), then `pnpm --filter www presets:measure --pack <id>` measures them all and merges the results into `tokens.json`. On a docs site, point `page` at a demo container, not the docs chrome, which has its own font. A cloud network policy may block the host; then use the user's Chrome.
- **Signed-in or blocked pages, through the user's Chrome.** Locally with Claude in Chrome, do it directly. In a Claude project thread, start a Remote Control session in the user's local dotUI checkout (`list_devices` lists it); that session has Claude in Chrome. It starts only from a message the user wrote in your thread, and its safety checks also want the user's own words before it opens a signed-in workspace or changes a setting such as the theme: ask once, naming all three (start the session, open <app> signed in, switch its theme and back). Mark those pages `signedIn` in `targets.json`. Give the session each URL with its probe, from `pnpm --filter www presets:measure --snippet --pack <id> --url <url>`, and ask it to: open each URL in a new tab, wait for the page to settle, tab to each `focus` part and open each `before` state before probing it, run the probe with its JavaScript tool in each mode the product offers, close only its own tabs, and report the JSON. Save each page's JSON and merge it with `presets:measure --pack <id> --url <url> --merge <file> --mode <mode>`. The window may keep its own size: record the real viewport in `sources.md`. Stop the session when done.
- **Privacy.** Signed-in apps open the user's real workspace. Probe UI chrome only (controls, menus, surfaces); never read, store or screenshot workspace content such as names, titles or messages. Prefer a demo workspace.
- Name parts as `SPECIMEN_TARGETS` in `probe.ts` does. Commit `targets.json` so the next review re-measures in one pass. Leave out a property the two sides put in different places (where padding sits, say) with the part's `skip`, so a re-measure doesn't bring it back. Tokens published as code go into `tokens.json` by hand, cited in `sources.md`. A part the product shows but the specimens don't is listed apart by `presets:measure`: add it to `SPECIMEN_TARGETS` (and to its sheet) instead of leaving it unmeasured.
- **Reference images** for the review page: public screens via headless capture; signed-in screens saved by the Remote Control session into the checkout's `www/.scratch-refs/`, then brought over with `connect_device` and `device_stage_files` (or ask the user to drop screenshots in the thread). They go to the project's shared files under `presets/<id>/<date>/refs/`, named `<component>-<mode>.png`, never to git.

## 3. Author or fix the preset

- Work in the decision order (Style, color, type, shape and density, surfaces and states, components), one group at a time.
- After each group, run `pnpm build:registry` (the preset catalog in `presets/__generated__/catalog.ts` is generated, and CI fails on a stale one), then `pnpm --filter www presets:measure --preset <id> --port <port>`, and re-capture the sheets you touched: `presets:capture --preset <id> --sheet <name> --port <port>`.
- Sort every property that is off into one of five buckets:
  1. **Preset value:** fix it, with the measured value in a comment.
  2. **Stand-in:** the closest value, with a `// Stand-in: …` comment.
  3. **Missing axis:** a comment on the [preset gap ledger](https://github.com/mehdibha/dotUI/issues/1020), one look per comment (`Look | Systems that need it | Stand-in today`, with measured values), or naming an existing row to add your system to it. Never edit the issue body: other preset threads write at the same time.
  4. **Component bug:** its own issue.
  5. **Color engine:** a ledger row marked "color engine"; the engine is queued for a rewrite, so don't work around it.
- Never add a token, axis, variant or override in this work, and don't touch other presets or component styles.

## 4. Compare

- `pnpm --filter www presets:capture --preset <id> --mode both --sheet all --port <port>`, then `presets:compare --preset <id> --refs <reference image dir>`. Read every `compare-*.png`, and the full sheet when a detail matters.
- Score each sheet 0–2 on silhouette, surface, color, typography, states and spacing. A sheet passes at 9/12 with no zero.
- A sheet the product never shows has no reference: score it for coherence with the rest of the preset and mark it inferred on the review page.

## 5. Publish the review

In a Claude project:

- Publish or update the "<Name> fidelity" artifact. For each sheet, show the reference next to the specimen in light and dark, then the measured diff with off rows first, the score, and open gaps linking ledger rows. Images go in the artifact's asset store; a batch upload takes only files inside the working directory, so copy them to `www/.scratch-*/` first.
- Update the preset's row in the project's preset tracker: status, sheets passing, properties off with the `probe` version `presets:measure` prints, gaps, date, links. Write only that row; the tracker's link and update steps are in project memory.

Outside a project, put the compare images and the diff summary in the PR description instead.

## 6. Open the PR

- One preset per PR. Title `fix(presets): <name> fidelity pass` or `feat(presets): add <name>`.
- Run `pnpm test`, `pnpm typecheck` and `pnpm check`. If the preset is Origin or Spotify, also run `pnpm smoke:examples` and commit `examples/`.
- The PR body covers:
  - the changes by group, with their evidence;
  - the measure summary, before → after;
  - ledger comments posted;
  - the review artifact link.
- Cover and examples outputs can conflict between preset PRs: rebase and regenerate, never hand-merge them.
