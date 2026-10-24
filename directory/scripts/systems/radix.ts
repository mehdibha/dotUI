// Radix Themes pipeline config — components axis only (no colors extractor yet).
//
// Inventory source: `utils/themesRoutes.ts` in the radix-ui/website repo at a
// pinned SHA — the docs site's own navigation table, i.e. Radix's machine-
// readable list of every documented Themes page, with the titles the docs
// render. Snapshot vendors that one file; extract parses ONLY the vendored copy.
//
// Every page whose route lives under `themes/docs/components/` is a component
// entry (this includes the layout primitives, typography components and
// utilities Radix documents alongside the interactive ones — they are shipped
// components of the system, and the taxonomy mapping records which of them have
// no cross-system equivalent). Names and docsUrls are derived from the route
// table; the canonical taxonomy mapping is the one editorial table here
// (CANONICAL below).
import fs from "node:fs"
import path from "node:path"

import type {
  ComponentDemo,
  ComponentsFile,
  SystemComponent,
} from "../../src/data/schema"
import type { SystemConfig } from "../lib/system"

const SITE = "https://www.radix-ui.com"
const REPO = "https://github.com/radix-ui/themes"
const WEBSITE_REPO = "https://github.com/radix-ui/website"
/** Pinned commit of radix-ui/website the route table is vendored from. */
const REF = "bb424082fd33fadc244a6dd276d3ced55caa6234"
const ROUTES_PATH = "utils/themesRoutes.ts"
const ROUTES_FILE = "themes-routes.ts"

/** Published package version the demo documents pin. */
const DEMO_VERSION = "3.3.0"
const REACT_VERSION = "18.3.1"

const SOURCE: SystemConfig["source"] = {
  kind: "repo",
  repo: WEBSITE_REPO,
  ref: REF,
  files: [{ upstreamPath: ROUTES_PATH, as: ROUTES_FILE }],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// docs slug → canonical slug in data/components.json, or null where the Radix
// Themes component is system-specific (layout primitives, typography, render
// utilities) or has no cross-system equivalent in the taxonomy yet.
const CANONICAL: Record<string, string | null> = {
  "accessible-icon": null,
  "alert-dialog": "dialog",
  "aspect-ratio": null,
  avatar: "avatar",
  badge: "badge",
  blockquote: null,
  box: null,
  button: "button",
  callout: "alert",
  card: "card",
  checkbox: "checkbox",
  "checkbox-cards": "checkbox",
  "checkbox-group": "checkbox",
  code: null,
  container: null,
  "context-menu": "dropdown-menu",
  "data-list": "list",
  dialog: "dialog",
  "dropdown-menu": "dropdown-menu",
  em: null,
  flex: null,
  grid: null,
  heading: null,
  "hover-card": "popover",
  "icon-button": "button",
  inset: null,
  kbd: "kbd",
  link: "link",
  popover: "popover",
  portal: null,
  progress: "progress-bar",
  quote: null,
  radio: "radio",
  "radio-cards": "radio",
  "radio-group": "radio",
  reset: null,
  "scroll-area": null,
  section: null,
  "segmented-control": "segmented-control",
  select: "select",
  separator: "divider",
  skeleton: "skeleton",
  slider: "slider",
  slot: null,
  spinner: "loading",
  strong: null,
  switch: "switch",
  "tab-nav": "tabs",
  table: "table",
  tabs: "tabs",
  text: null,
  "text-area": "textarea",
  "text-field": "text-input",
  theme: null,
  tooltip: "tooltip",
  "visually-hidden": null,
}

// ── route table parsing ──────────────────────────────────────────────────────
interface RoutePage {
  /** Docs slug, e.g. `text-field`. */
  slug: string
  /** Title as the docs nav renders it, e.g. `Text Field`. */
  title: string
  /** Nav section label the page sits under, e.g. `Components`. */
  section: string
}

/** Read every `themes/docs/components/<slug>` page out of the vendored route
    table, keeping the docs title and the nav section it belongs to. The file is
    a plain exported literal (Prettier-formatted, so entries may wrap across
    lines), which a scoped regex pass reads without evaluating TS. */
function parseRoutes(src: string): RoutePage[] {
  const start = src.indexOf("export const themesRoutes")
  if (start === -1) {
    throw new Error(`${ROUTES_FILE}: \`export const themesRoutes\` not found`)
  }
  const end = src.indexOf("\nexport ", start + 1)
  const block = src.slice(start, end === -1 ? undefined : end)

  const labels: { label: string; index: number }[] = []
  for (const m of block.matchAll(/label:\s*"([^"]+)"/g)) {
    labels.push({ label: m[1]!, index: m.index! })
  }
  const sectionAt = (index: number): string => {
    let current: string | null = null
    for (const l of labels) {
      if (l.index < index) current = l.label
      else break
    }
    if (!current) {
      throw new Error(`${ROUTES_FILE}: page at ${index} has no section label`)
    }
    return current
  }

  const pages: RoutePage[] = []
  const seen = new Set<string>()
  for (const m of block.matchAll(
    /title:\s*"([^"]+)",\s*slug:\s*"themes\/docs\/components\/([a-z0-9-]+)"/g,
  )) {
    const title = m[1]!
    const slug = m[2]!
    if (seen.has(slug)) {
      throw new Error(`${ROUTES_FILE}: duplicate component route "${slug}"`)
    }
    seen.add(slug)
    pages.push({ slug, title, section: sectionAt(m.index!) })
  }
  if (pages.length === 0) {
    throw new Error(
      `${ROUTES_FILE}: no themes/docs/components routes found — source reshaped?`,
    )
  }
  return pages
}

/** Sections whose pages are documented components but not interactive UI —
    recorded as a note so the inventory stays honest about what they are. */
const SECTION_NOTES: Record<string, string> = {
  Layout: "Layout primitive.",
  Typography: "Typography component.",
  Utilities: "Utility component — renders no UI of its own.",
}

// ── demos ────────────────────────────────────────────────────────────────────
/** A complete standalone document loading only Radix Themes' own published
    assets at a pinned version: the prebuilt stylesheet from jsDelivr and the
    published ESM build from esm.sh. White page, one centered horizontal row.

    Dark mode uses Radix Themes' own documented mechanism: the class `dark` on
    the root element. In the pinned styles.css that class is what carries the
    dark scales (`.dark, .dark-theme { --gray-1: #111111; … }`) and what flips
    the semantic canvas token (`:is(.dark, .dark-theme) { --color-background:
    var(--gray-1) }`), so the page background is the system's own token rather
    than an invented hex. `<Theme>` is given the matching `appearance` so its
    own element carries the class too (that is what sets `color-scheme: dark`
    via `.radix-themes:where(.dark, .dark-theme)`).

    Mode resolution is an inline `<head>` IIFE running before first paint. It
    exposes an idempotent `applyMode(dark)` that both adds and removes the
    class and re-renders the React root through the `__radixDemoRender` hook
    the module body registers, so the `<Theme appearance>` follows. If a
    `?mode=` parameter is present it is applied once and nothing is observed
    (standalone testing override). Otherwise the demo mirrors its embedding
    parent: it reads `window.parent.document.documentElement` (guarded — a
    cross-origin parent or a top-level load throws or yields no root, and the
    page then simply renders light), applies dark iff that element carries the
    `dark` class, and keeps a MutationObserver on its `class` attribute for the
    page lifetime so parent theme toggles restyle the demo in place, both
    directions, with no reload. */
function demoDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<script>
  (function () {
    function applyMode(dark) {
      var el = document.documentElement;
      if (dark) el.classList.add("dark");
      else el.classList.remove("dark");
      window.__radixDemoDark = dark;
      if (window.__radixDemoRender) window.__radixDemoRender(dark);
    }
    window.__radixDemoApplyMode = applyMode;

    var mode = new URLSearchParams(window.location.search).get("mode");
    if (mode !== null) {
      applyMode(mode === "dark");
      return;
    }

    var root = null;
    try {
      if (window.parent !== window) {
        root = window.parent.document.documentElement;
      }
    } catch (e) {
      root = null;
    }
    if (!root) {
      applyMode(false);
      return;
    }

    applyMode(root.classList.contains("dark"));
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    window.__radixDemoObserver = observer;
  })();
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@radix-ui/themes@${DEMO_VERSION}/styles.css" />
<style>
  html, body { margin: 0; padding: 0; height: 100%; background: #fff; }
  body { padding: 16px; box-sizing: border-box; }
  #root { height: 100%; }
  .rt-Theme-fill {
    min-height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    background: #fff;
  }
  /* The demo's <Theme grayColor="slate"> re-points --gray-1 at --slate-1, but
     only inside .radix-themes; mirror that on the root so the padding around
     the theme resolves to the very same canvas token, not the default gray. */
  html.dark { --gray-1: var(--slate-1); }
  html.dark, html.dark body, html.dark .rt-Theme-fill {
    background: var(--color-background);
  }
</style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@${REACT_VERSION}",
    "react/jsx-runtime": "https://esm.sh/react@${REACT_VERSION}/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@${REACT_VERSION}",
    "react-dom/client": "https://esm.sh/react-dom@${REACT_VERSION}/client",
    "@radix-ui/themes": "https://esm.sh/@radix-ui/themes@${DEMO_VERSION}?external=react,react-dom&deps=react@${REACT_VERSION},react-dom@${REACT_VERSION}"
  }
}
</script>
</head>
<body>
<div id="root"></div>
<script type="module">
${body}
</script>
</body>
</html>
`
}

/** Demo bodies, keyed by docs slug. Scope for this pass: Button only. */
const DEMO_BODIES: Record<string, { body: string; height: number }> = {
  button: {
    height: 130,
    body: `  import React from "react";
  import { createRoot } from "react-dom/client";
  import { Theme, Button } from "@radix-ui/themes";

  const h = React.createElement;

  const root = createRoot(document.getElementById("root"));

  function render(dark) {
    root.render(
      h(
        Theme,
        {
          appearance: dark ? "dark" : "light",
          accentColor: "indigo",
          grayColor: "slate",
          radius: "medium",
          scaling: "100%",
          hasBackground: false,
          className: "rt-Theme-fill",
        },
        h(Button, { variant: "solid", size: "2" }, "Primary"),
        h(Button, { variant: "soft", size: "2" }, "Secondary"),
        h(Button, { variant: "solid", size: "2", disabled: true }, "Disabled")
      )
    );
  }

  window.__radixDemoRender = render;
  render(window.__radixDemoDark === true);`,
  },
}

function demoFor(slug: string, name: string): ComponentDemo | null {
  const entry = DEMO_BODIES[slug]
  if (!entry) return null
  return {
    html: demoDocument(`Radix Themes ${name}`, entry.body),
    height: entry.height,
  }
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const src = fs.readFileSync(path.join(sourcesDir, ROUTES_FILE), "utf8")
  const pages = parseRoutes(src)

  const unmapped = pages.filter((p) => !(p.slug in CANONICAL))
  if (unmapped.length > 0) {
    console.error(
      `[radix] ${unmapped.length} docs page(s) with no canonical mapping entry (emitted as null): ${unmapped
        .map((p) => p.slug)
        .join(", ")}`,
    )
  }

  const components: SystemComponent[] = pages.map((page) => ({
    component: CANONICAL[page.slug] ?? null,
    name: page.title,
    docsUrl: `${SITE}/themes/docs/components/${page.slug}`,
    demo: demoFor(page.slug, page.title),
    note: SECTION_NOTES[page.section] ?? null,
  }))

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  const mapped = components.filter((c) => c.component !== null).length
  console.error(
    `[radix] ${components.length} components; ${mapped} mapped to the taxonomy; ${
      components.filter((c) => c.demo).length
    } demo(s)`,
  )

  return {
    components,
    sources: [
      SITE,
      "https://www.radix-ui.com/themes/docs/overview/getting-started",
      REPO,
      WEBSITE_REPO,
    ],
    provenance: {
      method: "script",
      extractor: "scripts/systems/radix.ts",
      sources: [
        {
          kind: "repo",
          url: `${WEBSITE_REPO}/blob/${REF}/${ROUTES_PATH}`,
          ref: REF,
          retrievedAt: null,
          snapshot: "sources/radix",
        },
      ],
      notes: `Inventory is every \`themes/docs/components/<slug>\` route in ${ROUTES_PATH} from radix-ui/website at pinned SHA ${REF} — the docs site's own navigation table, so names (the docs titles) and docsUrls are derived, never typed. Radix documents its layout primitives, typography components and render utilities in the same component section; they are emitted as entries with a note saying what they are, and most map to null in the taxonomy. The canonical-taxonomy mapping is an editorial table in the extractor, not extracted. Demo documents load only Radix's published assets at pinned versions — @radix-ui/themes@${DEMO_VERSION} styles.css from jsDelivr and the @radix-ui/themes@${DEMO_VERSION} / react@${REACT_VERSION} ESM builds from esm.sh, and follow dark mode using Radix Themes' own mechanism — the \`dark\` class on the root element (plus the matching \`<Theme appearance>\`), which the pinned styles.css uses to carry the dark scales and to set \`--color-background\`, the token the demo paints the page with. A \`?mode=\` query parameter, when present, applies that mode once for standalone testing; otherwise the demo observes its embedding parent's \`<html class>\` with a MutationObserver and restyles itself in place, both directions, whenever the parent toggles dark (no reload; a cross-origin or top-level parent falls back to light). Demo coverage in this pass is Button only; every other entry is inventory (name + docsUrl + mapping) with demo null.`,
    },
  }
}

const config: SystemConfig = {
  slug: "radix",
  source: SOURCE,
  extractComponents,
}

export default config
