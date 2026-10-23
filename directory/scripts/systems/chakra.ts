// Chakra UI v3 pipeline config — components axis only (no colours yet).
//
// Chakra's docs sidebar is a single checked-in TypeScript literal
// (apps/www/docs.config.ts). It is the system's own machine-readable statement
// of what it documents as a component, with the display name and the docs slug
// side by side — so one vendored file at a pinned SHA is the whole inventory
// source. The snapshot pins bytes by commit SHA; extraction parses ONLY that
// file.
//
// The live demo loads Chakra's real published package from pinned esm.sh URLs
// (@chakra-ui/react 3.30.0 + its React/Emotion peers) — no hand-written CSS.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "chakra"
const REPO = "https://github.com/chakra-ui/chakra-ui"
const REF = "7aca83e44de50f501d8274a55c331cb8fb06e4fa"
const SITE = "https://chakra-ui.com"
const DOCS_BASE = `${SITE}/docs/components`
const CONFIG_FILE = "docs.config.ts"

const SOURCE: SystemConfig["source"] = {
  kind: "repo",
  repo: REPO,
  ref: REF,
  files: [{ upstreamPath: `apps/www/${CONFIG_FILE}`, as: CONFIG_FILE }],
}

// Sidebar groups inside "Components" that are prose, not components.
const NON_COMPONENT_GROUPS = new Set(["Concepts"])

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Explicit, one line per documented page: a data/components.json slug, or null
// when the entry has no cross-system equivalent (layout/style primitives,
// providers, Chakra-specific compositions). At most one Chakra page claims a
// given canonical slug — near-misses (Icon Button, Close Button, Native Select,
// Fieldset) stay null and carry a note instead of duplicating the canonical.
const CANONICAL: Record<string, string | null> = {
  // Layout
  "aspect-ratio": null,
  bleed: null,
  box: null,
  "absolute-center": null,
  center: null,
  container: null,
  flex: null,
  float: null,
  grid: null,
  group: "button-group",
  "scroll-area": null,
  separator: "divider",
  "simple-grid": null,
  splitter: null,
  stack: null,
  wrap: null,
  // Typography
  blockquote: null,
  code: null,
  "code-block": null,
  em: null,
  heading: null,
  highlight: null,
  kbd: "kbd",
  link: "link",
  "link-overlay": null,
  list: "list",
  mark: null,
  prose: null,
  "rich-text-editor": null,
  text: null,
  // Buttons
  button: "button",
  "close-button": null,
  "icon-button": null,
  "download-trigger": null,
  // Date and Time
  "date-input": null,
  "date-picker": "date-picker",
  calendar: "calendar",
  // Forms
  checkbox: "checkbox",
  "checkbox-card": null,
  "color-picker": null,
  "color-swatch": null,
  editable: null,
  field: "form",
  fieldset: null,
  "file-upload": "file-upload",
  input: "text-input",
  "number-input": null,
  "password-input": null,
  "pin-input": null,
  "radio-card": null,
  radio: "radio",
  rating: "rating",
  "segmented-control": "segmented-control",
  "native-select": null,
  switch: "switch",
  slider: "slider",
  textarea: "textarea",
  "tags-input": null,
  // Collections
  combobox: "combobox",
  listbox: null,
  select: "select",
  "tree-view": null,
  // Overlays
  "action-bar": null,
  dialog: "dialog",
  drawer: "drawer",
  "floating-panel": null,
  "hover-card": null,
  menu: "dropdown-menu",
  "overlay-manager": null,
  popover: "popover",
  "toggle-tip": null,
  tooltip: "tooltip",
  // Disclosure
  accordion: "accordion",
  breadcrumb: "breadcrumbs",
  carousel: "carousel",
  collapsible: null,
  pagination: "pagination",
  steps: "progress-steps",
  tabs: "tabs",
  // Feedback
  alert: "alert",
  "empty-state": "empty-state",
  "progress-circle": null,
  progress: "progress-bar",
  skeleton: "skeleton",
  spinner: "loading",
  status: null,
  toast: "toast",
  // Data Display
  avatar: "avatar",
  badge: "badge",
  card: "card",
  clipboard: null,
  image: null,
  "data-list": null,
  icon: "icon",
  marquee: null,
  "qr-code": null,
  stat: null,
  table: "table",
  tag: null,
  timeline: "timeline",
  // Internationalization
  "locale-provider": null,
  "format-number": null,
  "format-byte": null,
  // Utilities
  checkmark: null,
  "client-only": null,
  "environment-provider": null,
  for: null,
  presence: null,
  portal: null,
  radiomark: null,
  show: null,
  "skip-nav": null,
  "visually-hidden": null,
  theme: null,
}

// Notes for entries whose canonical mapping (or absence of one) is a judgement
// call worth stating in the data.
const NOTES: Record<string, string> = {
  group:
    "Generic grouping primitive — Chakra has no dedicated ButtonGroup in v3; Group is what button toolbars are built from.",
  "icon-button":
    "A separate docs page rather than a Button variant; the canonical button entry is Chakra’s Button.",
  "close-button":
    "Preset icon button for dismissing overlays; kept unmapped so a single Chakra page owns the canonical button slug.",
  "native-select":
    "Wrapper around the browser’s <select>; the canonical select slug is held by Chakra’s composite Select.",
  fieldset:
    "Grouping wrapper that pairs with Field; the canonical form slug is held by Field.",
  collapsible:
    "Single disclosure region — the canonical accordion slug is held by Chakra’s Accordion.",
  tag: "Interactive, removable label; the canonical badge slug is held by Chakra’s Badge.",
}

// ── docs.config.ts parsing ───────────────────────────────────────────────────
interface NavLeaf {
  group: string
  title: string
  url: string
}

/** Slice the "Components" branch out of the nav literal. The file is a hand-
    maintained but highly regular literal; anything unexpected throws rather
    than emitting a partial inventory. */
function componentsSection(src: string): string {
  const start = src.indexOf('title: "Components"')
  if (start === -1)
    throw new Error(`${CONFIG_FILE}: "Components" nav not found`)
  const end = src.indexOf('title: "Charts"', start)
  if (end === -1) {
    throw new Error(`${CONFIG_FILE}: "Charts" nav (end marker) not found`)
  }
  return src.slice(start, end)
}

/** Read every `{ title, url }` leaf in the Components branch and attribute it
    to the sidebar group it sits under. Whitespace is collapsed first so
    multi-line leaves parse the same as single-line ones. */
function parseNav(src: string): NavLeaf[] {
  const flat = componentsSection(src).split(/\s+/).join(" ")

  const groups: { index: number; title: string }[] = []
  for (const m of flat.matchAll(
    /title: "([^"]+)", (?:url: "[^"]*", )?items: \[/g,
  )) {
    groups.push({ index: m.index!, title: m[1]! })
  }
  if (groups.length === 0) {
    throw new Error(`${CONFIG_FILE}: no sidebar groups under "Components"`)
  }

  const leaves: NavLeaf[] = []
  for (const m of flat.matchAll(
    /\{ title: "([^"]+)", url: "([^"]+)"(?:, status: "[^"]+")?,? \}/g,
  )) {
    let group: string | null = null
    for (const g of groups) {
      if (g.index < m.index!) group = g.title
      else break
    }
    if (group === null) {
      throw new Error(`${CONFIG_FILE}: leaf "${m[1]}" precedes every group`)
    }
    leaves.push({ group, title: m[1]!, url: m[2]! })
  }
  if (leaves.length === 0) {
    throw new Error(`${CONFIG_FILE}: no nav leaves under "Components"`)
  }
  return leaves
}

// ── demo ─────────────────────────────────────────────────────────────────────
// One standalone document per demo, loading Chakra's published ESM build from
// pinned esm.sh URLs. Verified rendering in a real browser at these exact
// versions. `children` is the createElement source for the row contents, so
// other components can reuse the same shell as the inventory grows.
//
// Color mode: `applyMode(dark)` is the single, idempotent, two-way mechanism —
// it adds or removes the class `dark` on <html> and notifies the React root so
// the canvas re-renders with the matching background. That class is Chakra v3's
// own default dark condition — the published @chakra-ui/react@3.30.0 base
// preset defines `dark: ".dark &, .dark .chakra-theme:not(.light) &"`, so every
// recipe and semantic token flips with nothing but that class. Chakra's own
// globalCss already paints `html { bg: bg }`; the canvas rules below use the
// same semantic token (`--chakra-colors-bg`, whose `_dark` value is
// `{colors.black}` = #09090B in this version) so the page matches before the
// module has hydrated. The light path keeps the original `#ffffff` rules.
//
// Mode resolution runs in a head IIFE before first paint:
//   - `?mode=` present → apply it once, no observation (standalone testing).
//   - otherwise → read the embedding parent's <html> (same-origin only; a
//     cross-origin or top-level page yields no root, so light is applied) and
//     mirror its `dark` class live through a MutationObserver on `class` that
//     is retained for the page lifetime. No reload is involved in a toggle.
const REACT_VERSION = "19.1.0"
const EMOTION_VERSION = "11.14.0"
const CHAKRA_VERSION = "3.30.0"
/** Fallback for the semantic `bg` token before Chakra's CSS is injected —
    the token's own `_dark` value in @chakra-ui/react@3.30.0
    (`bg.DEFAULT._dark = {colors.black}`, `colors.black = #09090B`). */
const DARK_CANVAS = "#09090B"
const CANVAS_BG = `dark ? "var(--chakra-colors-bg, ${DARK_CANVAS})" : "#ffffff"`

function demoHtml(opts: {
  title: string
  imports: string
  children: string
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${opts.title}</title>
<script>
  (function () {
    var el = document.documentElement;
    var listeners = [];
    var dark = false;

    // The whole dark mechanism, idempotent and two-way.
    function applyMode(next) {
      dark = !!next;
      if (dark) el.classList.add("dark");
      else el.classList.remove("dark");
      for (var i = 0; i < listeners.length; i++) listeners[i](dark);
    }

    window.__demoMode = {
      isDark: function () { return dark; },
      subscribe: function (fn) { listeners.push(fn); fn(dark); }
    };

    // 1. Explicit ?mode= override: apply once, never observe.
    var param = new URLSearchParams(window.location.search).get("mode");
    if (param !== null) {
      applyMode(param === "dark");
      return;
    }

    // 2. Otherwise mirror the embedding parent's <html> class, live.
    var root = null;
    try {
      if (window.parent !== window) root = window.parent.document.documentElement;
    } catch (err) {
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
    window.__demoModeObserver = observer;
  })();
</script>
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  html.dark, html.dark body { background: var(--chakra-colors-bg, ${DARK_CANVAS}); }
  #root { min-height: 100vh; }
</style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@${REACT_VERSION}",
    "react/jsx-runtime": "https://esm.sh/react@${REACT_VERSION}/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@${REACT_VERSION}?deps=react@${REACT_VERSION}",
    "react-dom/client": "https://esm.sh/react-dom@${REACT_VERSION}/client?deps=react@${REACT_VERSION}",
    "@emotion/react": "https://esm.sh/@emotion/react@${EMOTION_VERSION}?deps=react@${REACT_VERSION}",
    "@chakra-ui/react": "https://esm.sh/@chakra-ui/react@${CHAKRA_VERSION}?deps=react@${REACT_VERSION},react-dom@${REACT_VERSION},@emotion/react@${EMOTION_VERSION}"
  }
}
</script>
</head>
<body>
<div id="root"></div>
<script type="module">
  import React from "react";
  import { createRoot } from "react-dom/client";
  import { ChakraProvider, defaultSystem, ${opts.imports} } from "@chakra-ui/react";

  const h = React.createElement;

  function Row({ dark }) {
    return h(
      "div",
      {
        style: {
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          background: ${CANVAS_BG}
        }
      },
${opts.children}
    );
  }

  const root = createRoot(document.getElementById("root"));

  // Renders now with the resolved mode, and again on every parent change.
  window.__demoMode.subscribe(function (dark) {
    root.render(
      h(ChakraProvider, { value: defaultSystem }, h(Row, { dark: dark }))
    );
  });
</script>
</body>
</html>
`
}

/** Docs slug → demo. Only Button is in scope for this pass; the rest of the
    inventory ships without demos rather than with imitated ones. */
const DEMOS: Record<string, SystemComponent["demo"]> = {
  button: {
    html: demoHtml({
      title: "Chakra UI Button",
      imports: "Button",
      children: [
        '      h(Button, { colorPalette: "blue" }, "Primary"),',
        '      h(Button, { colorPalette: "blue", variant: "outline" }, "Secondary"),',
        '      h(Button, { colorPalette: "blue", disabled: true }, "Disabled")',
      ].join("\n"),
    }),
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  if (manifest.ref !== REF) {
    throw new Error(
      `snapshot ref ${manifest.ref ?? "(none)"} does not match the pinned ref ${REF}`,
    )
  }

  const src = fs.readFileSync(path.join(sourcesDir, CONFIG_FILE), "utf8")
  const leaves = parseNav(src).filter(
    (leaf) => !NON_COMPONENT_GROUPS.has(leaf.group),
  )

  const seen = new Set<string>()
  const claimed = new Map<string, string>()
  const components: SystemComponent[] = leaves.map((leaf) => {
    if (seen.has(leaf.url)) {
      throw new Error(`${CONFIG_FILE}: duplicate component url "${leaf.url}"`)
    }
    seen.add(leaf.url)

    if (!(leaf.url in CANONICAL)) {
      throw new Error(
        `no canonical mapping for Chakra component "${leaf.url}" (${leaf.title}) — add it to CANONICAL in scripts/systems/${SLUG}.ts`,
      )
    }
    const component = CANONICAL[leaf.url]!
    if (component !== null) {
      const other = claimed.get(component)
      if (other) {
        throw new Error(
          `canonical slug "${component}" claimed by both "${other}" and "${leaf.url}"`,
        )
      }
      claimed.set(component, leaf.url)
    }

    return {
      component,
      name: leaf.title,
      docsUrl: `${DOCS_BASE}/${leaf.url}`,
      demo: DEMOS[leaf.url] ?? null,
      note: NOTES[leaf.url] ?? null,
    }
  })

  // Stable sort by the system's own component name.
  components.sort((a, b) => a.name.localeCompare(b.name))

  const demoCount = components.filter((c) => c.demo).length
  console.error(
    `[${SLUG}] components=${components.length} mapped=${claimed.size} demos=${demoCount}`,
  )

  return {
    components,
    sources: [REPO, `${DOCS_BASE}/concepts/overview`],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "repo",
          url: REPO,
          ref: REF,
          retrievedAt: null,
          snapshot: SLUG,
        },
      ],
      notes:
        'Inventory is the "Components" branch of Chakra’s own docs sidebar (apps/www/docs.config.ts), vendored at a pinned commit SHA — display name and docs slug come straight from it, and docsUrl is that slug under https://chakra-ui.com/docs/components/. The "Concepts" group (overview, composition, animation, colour mode, server components, testing) is prose and is excluded; the Charts branch is a separate add-on package and is out of scope. Canonical taxonomy mapping is editorial: an explicit slug→slug map in the extractor, one canonical slug claimed at most once, unknown docs slugs fail the extract rather than defaulting to null. The Button demo loads @chakra-ui/react 3.30.0 (with React 19.1.0 and @emotion/react 11.14.0) from pinned esm.sh URLs — real published assets, no hand-written styles; its package version is pinned independently of the docs SHA. Demo colour mode is a single idempotent two-way `applyMode(dark)`: it adds or removes the class `dark` on <html> — Chakra v3’s own default dark condition (`dark: ".dark &, .dark .chakra-theme:not(.light) &"` in the published 3.30.0 base preset) — and re-renders the React root so the canvas uses Chakra’s semantic `bg` token (`--chakra-colors-bg`, `_dark` = `{colors.black}` = #09090B) in dark and `#ffffff` in light. Resolution happens in a head IIFE before first paint: an explicit `mode` query parameter is applied once with no observation (standalone testing), otherwise the demo reads the embedding parent’s <html> (same-origin only — a cross-origin or top-level page means light) and mirrors its `dark` class live via a MutationObserver on `class` kept for the page lifetime, so a parent theme toggle restyles the frame both ways without reloading it.',
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
