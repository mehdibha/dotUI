---
name: preset
description: Create, review or fix a dotUI built-in preset against the real design system it recreates, from reference measurements to specimen comparison, preset values, review page and PR. Use for any work on www/src/modules/presets/<id>.ts or a preset's fidelity.
---

# Preset

Read [`www/src/modules/presets/README.md`](../../../www/src/modules/presets/README.md) first: the fidelity bar, the decision order, what to do when no axis fits, and the definition of done. Commands are in [`www/src/modules/preset-lab/README.md`](../../../www/src/modules/preset-lab/README.md).

Three modes, same loop: **create** a preset for a new system, **review** an existing one end to end, **fix** one reported problem (skip to step 3 with the report as the finding, then steps 4–6).

## 1. Set up

- Start a dev server in the background: `pnpm dev:www --port <free port>` from the repo root.
- In a cloud container, install with `PUPPETEER_SKIP_DOWNLOAD=1 pnpm install` and `export PUPPETEER_EXECUTABLE_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)`.
- Write the axis catalog to a scratch file and read it: `pnpm --filter www presets:catalog --preset <id>` (no `--preset` when creating). It lists every key, its options and the systems each comes from, and where the preset's value comes from today.

## 2. Build the reference pack

`www/src/modules/preset-lab/refs/<id>/`: `sources.md`, `targets.json`, `tokens.json` (formats in the lab README). On review, start from the existing pack and re-measure with its `targets.json`.

- **Official tokens first.** If the system publishes tokens as code, read values from there and cite it in `sources.md`.
- **Measure the product, not its marketing.** App screens and controls at their default size; docs showcases are second best; landing pages run larger.
- **Public pages:** `pnpm --filter www presets:measure --url <url> --targets <file> --mode light|dark`. A cloud network policy may block the host; then use the user's Chrome.
- **Signed-in or blocked pages, through the user's Chrome.** Locally with Claude in Chrome, do it directly. In a Claude project thread, start a Remote Control session in the user's local dotUI checkout (`list_devices` lists it); that session has Claude in Chrome. Give it the URLs and the probe from `pnpm --filter www presets:measure --snippet --targets <file>`, and ask it to: open each URL in a new tab, wait for the page to settle, run the probe with its JavaScript tool in each mode the product offers, close only its own tabs, and report the JSON. Stop the session when done.
- **Privacy.** Signed-in apps open the user's real workspace. Probe UI chrome only (controls, menus, surfaces); never read, store or screenshot workspace content such as names, titles or messages. Prefer a demo workspace.
- Merge the results into `tokens.json` by mode and part, using the part names from `SPECIMEN_TARGETS` in `probe.ts`. Commit `targets.json` so the next review re-measures in one pass.
- **Reference images** for the review page: public screens via headless capture; signed-in screens as the Remote Control session can save them (or ask the user to drop screenshots in the thread). They go to the project's shared files under `presets/<id>/<date>/refs/`, named `<component>-<mode>.png`, never to git.

## 3. Author or fix the preset

- Work in the decision order (Style, color, type, shape and density, surfaces and states, components), one group at a time.
- After each group, run `pnpm --filter www presets:measure --preset <id> --port <port>` and re-capture the sheets you touched: `presets:capture --preset <id> --sheet <name> --port <port>`.
- Sort every property that is off into one of five buckets:
  1. **Preset value:** fix it, with the measured value in a comment.
  2. **Stand-in:** the closest value, with a `// Stand-in: …` comment.
  3. **Missing axis:** a row, or a system added to a row, in the [preset gap ledger](https://github.com/mehdibha/dotUI/issues/1020).
  4. **Component bug:** its own issue.
  5. **Color engine:** a ledger row marked "color engine"; the engine is queued for a rewrite, so don't work around it.
- Never add a token, axis, variant or override in this work, and don't touch other presets or component styles.

## 4. Compare

- `pnpm --filter www presets:capture --preset <id> --mode both --sheet all --port <port>`, then `presets:compare --preset <id> --refs <reference image dir>`. Read every `compare-*.png`, and the full sheet when a detail matters.
- Score each sheet 0–2 on silhouette, surface, color, typography, states and spacing. A sheet passes at 9/12 with no zero.

## 5. Publish the review

In a Claude project:

- Publish or update the "<Name> fidelity" artifact. For each sheet, show the reference next to the specimen in light and dark, then the measured diff with off rows first, the score, and open gaps linking ledger rows. Images go in the artifact's asset store.
- Update the preset's row in the project's preset tracker: status, sheets passing, properties off, gaps, date, links. Write only that row; the tracker's link and update steps are in project memory.

Outside a project, put the compare images and the diff summary in the PR description instead.

## 6. Open the PR

- One preset per PR. Title `fix(presets): <name> fidelity pass` or `feat(presets): add <name>`.
- Run `pnpm test`, `pnpm typecheck` and `pnpm check`. If the preset is Origin or Spotify, also run `pnpm smoke:examples` and commit `examples/`.
- The PR body covers:
  - the changes by group, with their evidence;
  - the measure summary, before → after;
  - ledger rows added;
  - the review artifact link.
- Cover and examples outputs can conflict between preset PRs: rebase and regenerate, never hand-merge them.
