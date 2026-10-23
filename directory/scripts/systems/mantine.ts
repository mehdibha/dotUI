// Mantine pipeline config — components axis only (no colors extractor yet).
//
// Inventory source: the deployed mantine.dev sitemap. Every documented core
// component owns exactly one `/core/<slug>` docs page, so the sitemap is the
// system's own machine-readable component list — no scraping of rendered pages,
// no hand-typed names. Snapshot vendors that one XML file; extract parses ONLY
// the vendored copy.
//
// Names: Mantine's docs slugs are the kebab form of its PascalCase exports
// (`app-shell` → `AppShell`), so the system's own name is derived, not typed.
// Canonical taxonomy mapping is the one editorial table in this config
// (CANONICAL below) — a slug from data/components.json, or null where Mantine
// ships something the taxonomy has no equivalent for.
import fs from "node:fs"
import path from "node:path"

import type {
  ComponentDemo,
  ComponentsFile,
  SystemComponent,
} from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SITE = "https://mantine.dev"
const SITEMAP_URL = `${SITE}/sitemap.xml`
const REPO = "https://github.com/mantinedev/mantine"

/** Version the demo documents pin. Mantine publishes both a prebuilt stylesheet
    (jsDelivr) and ESM builds (esm.sh) at exact versions, so a demo is byte-for
    -byte reproducible even though the inventory source is a live site. */
const DEMO_VERSION = "7.17.8"
const REACT_VERSION = "18.3.1"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: SITE,
  files: [{ url: SITEMAP_URL, as: "sitemap.xml" }],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// docs slug → canonical slug in data/components.json, or null when Mantine's
// component is system-specific (layout primitives, utilities, typography) or
// has no cross-system equivalent in the taxonomy yet.
const CANONICAL: Record<string, string | null> = {
  accordion: "accordion",
  "action-icon": "button",
  affix: null,
  alert: "alert",
  "alpha-slider": "slider",
  anchor: "link",
  "angle-slider": "slider",
  "app-shell": null,
  "aspect-ratio": null,
  autocomplete: "combobox",
  avatar: "avatar",
  "background-image": null,
  badge: "badge",
  blockquote: null,
  box: null,
  breadcrumbs: "breadcrumbs",
  burger: null,
  button: "button",
  card: "card",
  cascader: null,
  center: null,
  checkbox: "checkbox",
  chip: "badge",
  "close-button": "button",
  code: null,
  collapse: "accordion",
  "color-input": null,
  "color-picker": null,
  "color-swatch": null,
  combobox: "combobox",
  "combobox-popover": null,
  container: null,
  "copy-button": null,
  "data-list": "list",
  dialog: "dialog",
  divider: "divider",
  drawer: "drawer",
  "empty-state": "empty-state",
  fieldset: "form",
  "file-button": "file-upload",
  "file-input": "file-upload",
  flex: null,
  "floating-indicator": null,
  "floating-window": null,
  "focus-trap": null,
  grid: null,
  group: null,
  highlight: null,
  "hover-card": "popover",
  "hue-slider": "slider",
  image: null,
  indicator: "badge",
  input: "text-input",
  "json-input": "textarea",
  kbd: "kbd",
  list: "list",
  loader: "loading",
  "loading-overlay": "loading",
  mark: null,
  marquee: null,
  "mask-input": "text-input",
  menu: "dropdown-menu",
  menubar: null,
  modal: "dialog",
  "multi-select": "select",
  "native-select": "select",
  "nav-link": "link",
  notification: "toast",
  "number-formatter": null,
  "number-input": "text-input",
  "overflow-list": null,
  overlay: null,
  package: null,
  pagination: "pagination",
  paper: "card",
  "password-input": "text-input",
  pill: "badge",
  "pills-input": null,
  "pin-input": "text-input",
  popover: "popover",
  portal: null,
  progress: "progress-bar",
  radio: "radio",
  "range-slider": "slider",
  rating: "rating",
  "ring-progress": "progress-bar",
  "rolling-number": null,
  "scroll-area": null,
  scroller: null,
  "segmented-control": "segmented-control",
  select: "select",
  "semi-circle-progress": "progress-bar",
  "simple-grid": null,
  skeleton: "skeleton",
  slider: "slider",
  space: null,
  splitter: null,
  spoiler: null,
  stack: null,
  stepper: "progress-steps",
  switch: "switch",
  table: "table",
  "table-of-contents": null,
  tabs: "tabs",
  "tags-input": null,
  text: null,
  "text-input": "text-input",
  textarea: "textarea",
  "theme-icon": "icon",
  timeline: "timeline",
  title: null,
  tooltip: "tooltip",
  transition: null,
  tree: null,
  "tree-select": "select",
  typography: null,
  "unstyled-button": "button",
  "visually-hidden": null,
}

// ── sitemap parsing ──────────────────────────────────────────────────────────
/** Docs slugs of every `/core/<slug>` page in the vendored sitemap, sorted and
    deduped. Deeper paths and non-core sections are ignored. */
function parseCoreSlugs(xml: string): string[] {
  const slugs = new Set<string>()
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const loc = m[1]!
    const match = /^https:\/\/mantine\.dev\/core\/([a-z0-9-]+)\/?$/.exec(loc)
    if (match) slugs.add(match[1]!)
  }
  if (slugs.size === 0) {
    throw new Error(
      "mantine sitemap: no /core/<slug> pages found — source reshaped?",
    )
  }
  return [...slugs].sort()
}

/** `app-shell` → `AppShell`. Mantine's docs slug is the kebab form of its
    exported component name, so the display name is derived, never typed. */
function pascalCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

// ── demos ────────────────────────────────────────────────────────────────────
/** A complete standalone document: Mantine's own published stylesheet plus its
    published ESM build, both at a pinned version. One centered horizontal row.
    Only components with a body below get a demo.

    Color scheme mechanism (`applyMode`): stamp Mantine's own color-scheme hook,
    `data-mantine-color-scheme`, on <html> — the exact selector
    `@mantine/core@${DEMO_VERSION}/styles.css` keys its dark token block on
    (`:root[data-mantine-color-scheme='dark']`) — hand the value to the demo
    module via `window.__mantineColorScheme`, and re-render the React root
    through `window.__mantineRender` so MantineProvider's `forceColorScheme`
    always agrees with the attribute. It is idempotent and switches both ways:
    "light" restores Mantine's light tokens and the plain `#fff` canvas, "dark"
    paints the canvas with Mantine's own body token (`--mantine-color-body`,
    which the dark block resolves to `--mantine-color-dark-7`), never a hex.

    Mode resolution runs in a head IIFE before first paint: an explicit `?mode=`
    query parameter wins and is applied once (standalone testing, no
    observation); otherwise the demo follows its embedding parent live — it
    reads `dark` off the parent document's <html> classList and keeps a
    MutationObserver on that element's `class` attribute for the page lifetime,
    re-applying on every change. A cross-origin parent (or no parent at all)
    throws on access and falls back to light. */
function demoDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en" data-mantine-color-scheme="light">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<script>
  (function () {
    function applyMode(dark) {
      var scheme = dark ? "dark" : "light";
      window.__mantineColorScheme = scheme;
      document.documentElement.setAttribute("data-mantine-color-scheme", scheme);
      if (typeof window.__mantineRender === "function") {
        window.__mantineRender(scheme);
      }
    }
    window.__mantineApplyMode = applyMode;

    var param = new URLSearchParams(window.location.search).get("mode");
    if (param !== null) {
      applyMode(param === "dark");
      return;
    }

    var root = null;
    try {
      if (window.parent !== window) {
        root = window.parent.document.documentElement;
      }
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
    // Held on window so the observer outlives this IIFE for the page lifetime.
    window.__mantineModeObserver = observer;
  })();
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mantine/core@${DEMO_VERSION}/styles.css" />
<style>
  html, body { background: #fff; }
  :root[data-mantine-color-scheme='dark'],
  :root[data-mantine-color-scheme='dark'] body {
    background: var(--mantine-color-body);
  }
  body { margin: 0; padding: 16px; }
  #root {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: calc(100vh - 32px);
    flex-wrap: wrap;
  }
</style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@${REACT_VERSION}",
    "react-dom": "https://esm.sh/react-dom@${REACT_VERSION}?deps=react@${REACT_VERSION}",
    "react-dom/client": "https://esm.sh/react-dom@${REACT_VERSION}/client?deps=react@${REACT_VERSION}",
    "@mantine/hooks": "https://esm.sh/@mantine/hooks@${DEMO_VERSION}?deps=react@${REACT_VERSION}",
    "@mantine/core": "https://esm.sh/@mantine/core@${DEMO_VERSION}?deps=react@${REACT_VERSION},react-dom@${REACT_VERSION}"
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

/** Demo bodies, keyed by docs slug. Scope for this pass: Button only.
    `imports` are the `@mantine/core` exports the row uses; `children` are the
    provider's children, one `h(...)` call per line. */
const DEMO_BODIES: Record<
  string,
  { imports: string; children: string; height: number }
> = {
  button: {
    height: 130,
    imports: "Button",
    children: `        h(Button, { variant: "filled", color: "blue" }, "Primary"),
        h(Button, { variant: "default" }, "Secondary"),
        h(Button, { variant: "filled", color: "blue", disabled: true }, "Disabled")`,
  },
}

/** The module body: one persistent React root re-rendered by `render(scheme)`,
    which the head script's `applyMode` calls through `window.__mantineRender`
    on every parent color-scheme change — so a mode switch restyles in place
    instead of reloading the document. */
function demoModule(entry: { imports: string; children: string }): string {
  return `  import { createElement as h } from "react";
  import { createRoot } from "react-dom/client";
  import { MantineProvider, ${entry.imports} } from "@mantine/core";

  const root = createRoot(document.getElementById("root"));

  function render(scheme) {
    root.render(
      h(
        MantineProvider,
        { forceColorScheme: scheme },
${entry.children}
      )
    );
  }

  window.__mantineRender = render;
  render(window.__mantineColorScheme);`
}

function demoFor(slug: string, name: string): ComponentDemo | null {
  const entry = DEMO_BODIES[slug]
  if (!entry) return null
  return {
    html: demoDocument(`Mantine ${name}`, demoModule(entry)),
    height: entry.height,
  }
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const xml = fs.readFileSync(path.join(sourcesDir, "sitemap.xml"), "utf8")
  const manifest = readManifest(sourcesDir)

  const slugs = parseCoreSlugs(xml)
  const unmapped = slugs.filter((s) => !(s in CANONICAL))
  if (unmapped.length > 0) {
    console.error(
      `[mantine] ${unmapped.length} docs page(s) with no canonical mapping entry (emitted as null): ${unmapped.join(", ")}`,
    )
  }

  const components: SystemComponent[] = slugs.map((slug) => {
    const name = pascalCase(slug)
    return {
      component: CANONICAL[slug] ?? null,
      name,
      docsUrl: `${SITE}/core/${slug}`,
      demo: demoFor(slug, name),
      note: null,
    }
  })

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  const mapped = components.filter((c) => c.component !== null).length
  console.error(
    `[mantine] ${components.length} components; ${mapped} mapped to the taxonomy; ${components.filter((c) => c.demo).length} demo(s)`,
  )

  return {
    components,
    sources: [SITE, SITEMAP_URL, REPO],
    provenance: {
      method: "script",
      extractor: "scripts/systems/mantine.ts",
      sources: [
        {
          kind: "live-site",
          url: SITEMAP_URL,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: "sources/mantine",
        },
      ],
      notes: `Inventory is every /core/<slug> page in the deployed mantine.dev sitemap — Mantine's own machine-readable list of documented core components. Display names are derived from the docs slug (kebab → PascalCase, Mantine's export naming); docsUrl is the sitemap <loc>. The canonical-taxonomy mapping is an editorial table in the extractor, not extracted. The sitemap itself is not version-pinned (live-site tier), but the demo documents load only Mantine's published assets at pinned versions — @mantine/core@${DEMO_VERSION} styles.css from jsDelivr and the @mantine/core@${DEMO_VERSION} / react@${REACT_VERSION} ESM builds from esm.sh — so demos are reproducible. Demos follow their embedding parent's color scheme live: a head script reads \`dark\` off the parent document's <html> classList and keeps a MutationObserver on that element's \`class\` attribute, applying Mantine's own \`data-mantine-color-scheme\` on <html> (the selector its published styles.css keys the dark token block on), painting the canvas with Mantine's \`--mantine-color-body\` token in dark, and re-rendering the React root so MantineProvider's \`forceColorScheme\` agrees — both directions, no reload. A cross-origin or absent parent falls back to light; an explicit \`?mode=\` query parameter overrides observation and is applied once (standalone testing). Demo coverage in this pass is Button only; every other entry is inventory (name + docsUrl + mapping) with demo null.`,
    },
  }
}

const config: SystemConfig = {
  slug: "mantine",
  source: SOURCE,
  extractComponents,
}

export default config
