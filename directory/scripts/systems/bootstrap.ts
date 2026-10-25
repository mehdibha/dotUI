// Bootstrap pipeline config. Snapshot vendors the docs sidebar (the site's own
// machine-readable page index) and package.json at a pinned SHA; extract parses
// ONLY those vendored files into a ComponentsFile.
//
// Inventory model: Bootstrap's documented surface is grouped by sidebar
// section. Component-bearing sections are declared below in SECTIONS, page
// title → canonical taxonomy slug (or null when Bootstrap ships something with
// no cross-system equivalent). Docs URLs are derived from the same titles the
// site slugifies, so the inventory follows the snapshot rather than a list
// typed here.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { buildProvenance } from "../lib/extract"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const REPO = "https://github.com/twbs/bootstrap"
// v5.3.8 (annotated tag → commit).
const REF = "25aa8cc0b32f0d1a54be575347e6d84b70b1acd7"
const DOCS_VERSION = "5.3"
const DOCS_BASE = `https://getbootstrap.com/docs/${DOCS_VERSION}`
const COMPONENTS_DOCS_URL = `${DOCS_BASE}/components/`

// jsDelivr serves the published npm package; the version comes from the
// vendored package.json, so the demo assets are pinned to the same release the
// inventory is read from. The integrity hash is the one Bootstrap publishes for
// 5.3.8's bootstrap.min.css and is verified in a real browser.
const CSS_INTEGRITY =
  "sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"

/** Sidebar section title → { page title → canonical taxonomy slug | null }.
    A page absent from its section's map is documentation, not a component
    (Overview, Layout, Validation, utilities, helpers…), and is skipped. */
const SECTIONS: Record<string, Record<string, string | null>> = {
  Content: {
    Tables: "table",
  },
  Forms: {
    "Form control": "text-input",
    Select: "select",
    "Checks & radios": "checkbox",
    Range: "slider",
    "Input group": null,
    "Floating labels": null,
  },
  Components: {
    Accordion: "accordion",
    Alerts: "alert",
    Badge: "badge",
    Breadcrumb: "breadcrumbs",
    Buttons: "button",
    "Button group": "button-group",
    Card: "card",
    Carousel: "carousel",
    "Close button": null,
    Collapse: "accordion",
    Dropdowns: "dropdown-menu",
    "List group": "list",
    Modal: "dialog",
    Navbar: "header",
    "Navs & tabs": "tabs",
    Offcanvas: "drawer",
    Pagination: "pagination",
    Placeholders: "skeleton",
    Popovers: "popover",
    Progress: "progress-bar",
    Scrollspy: null,
    Spinners: "loading",
    Toasts: "toast",
    Tooltips: "tooltip",
  },
}

/** Editorial-free clarifications where one Bootstrap page covers several
    taxonomy entries or maps loosely; keyed by page title. */
const NOTES: Record<string, string> = {
  "Checks & radios":
    "One page covering checkboxes, radios, and switches — Bootstrap ships them as one control family.",
  Collapse:
    "Low-level disclosure plugin; the Accordion component is built on top of it.",
  "Close button":
    "Bootstrap-specific dismiss affordance shared by alerts, modals, offcanvas, and toasts.",
  Scrollspy:
    "Scroll-position plugin that updates nav state; no cross-system equivalent.",
  "Input group":
    "Composition wrapper that prepends/appends addons to form controls.",
  "Floating labels": "Label-in-field variant of Bootstrap form controls.",
}

/** The site slugifies sidebar titles: lowercase, non-alphanumerics collapse to
    single hyphens ("Navs & tabs" → navs-tabs, "Close button" → close-button). */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Minimal reader for the shape sidebar.yml actually uses: top-level entries
    `- title: X` with a nested `pages:` list of `    - title: Y`. No YAML
    dependency — the file is a flat two-level list. */
export function parseSidebar(
  yaml: string,
): { section: string; page: string }[] {
  const out: { section: string; page: string }[] = []
  let section: string | null = null
  for (const raw of yaml.split("\n")) {
    const top = raw.match(/^- title:\s*(.+?)\s*$/)
    if (top) {
      section = top[1]!
      continue
    }
    const page = raw.match(/^ {4}- title:\s*(.+?)\s*$/)
    if (page && section) out.push({ section, page: page[1]! })
  }
  return out
}

/** Bootstrap 5.3's own color-mode mechanism: `data-bs-theme` on the root
    element, which bootstrap.min.css targets via `[data-bs-theme=dark]` to
    redefine the CSS custom properties (including `--bs-body-bg`, #212529 in
    dark / #fff in light). applyMode(dark) writes "dark" or "light" — idempotent
    and symmetric, so toggling back restores Bootstrap's light ground exactly.

    Resolution runs in <head>, before first paint: an explicit `?mode=` in the
    demo's own URL is a standalone-testing override applied once with no
    observation; otherwise the demo mirrors the embedding parent's
    `<html class="dark">` and keeps mirroring it for the page lifetime via a
    MutationObserver on the parent root's class attribute. Cross-origin parents
    (the try/catch throws) and top-level loads have no readable root, so they
    fall back to light. */
const MODE_SCRIPT = `<script>
  (function () {
    function applyMode(dark) {
      document.documentElement.setAttribute(
        'data-bs-theme', dark ? 'dark' : 'light');
    }
    var mode = new URLSearchParams(window.location.search).get('mode');
    if (mode !== null) { applyMode(mode === 'dark'); return; }
    var root = null;
    try { if (window.parent !== window) root = window.parent.document.documentElement; }
    catch (e) { root = null; }
    if (!root) { applyMode(false); return; }
    applyMode(root.classList.contains('dark'));
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    window.__dsModeObserver = observer;
  })();
</script>`

/** Complete standalone demo document, built from Bootstrap's published CSS at
    the pinned release. Ground is Bootstrap's own --bs-body-bg (#fff in light,
    #212529 under data-bs-theme="dark"), one centered flex row. */
function buttonDemo(version: string): string {
  const css = `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/css/bootstrap.min.css`
  return `<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bootstrap Buttons</title>
<link rel="stylesheet" href="${css}" integrity="${CSS_INTEGRITY}" crossorigin="anonymous">
${MODE_SCRIPT}
<style>
  html, body { height: 100%; }
  body {
    margin: 0;
    padding: 16px;
    background: var(--bs-body-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .demo-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
</style>
</head>
<body>
  <div class="demo-row">
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-outline-primary">Outline</button>
    <button type="button" class="btn btn-primary" disabled>Disabled</button>
  </div>
</body>
</html>
`
}

function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const sidebar = fs.readFileSync(path.join(sourcesDir, "sidebar.yml"), "utf8")
  const pkg = JSON.parse(
    fs.readFileSync(path.join(sourcesDir, "package.json"), "utf8"),
  ) as { version: string }

  const components: SystemComponent[] = []
  for (const { section, page } of parseSidebar(sidebar)) {
    const map = SECTIONS[section]
    if (!map || !(page in map)) continue
    components.push({
      component: map[page] ?? null,
      name: page,
      docsUrl: `${DOCS_BASE}/${slugify(section)}/${slugify(page)}/`,
      demo:
        page === "Buttons"
          ? { html: buttonDemo(pkg.version), height: 130 }
          : null,
      note: NOTES[page] ?? null,
    })
  }

  components.sort((a, b) => a.name.localeCompare(b.name))

  return {
    components,
    sources: [COMPONENTS_DOCS_URL, REPO],
    provenance: buildProvenance({
      method: "script",
      extractor: "scripts/systems/bootstrap.ts",
      sources: [
        {
          kind: "repo",
          url: REPO,
          ref: manifest.ref ?? REF,
          retrievedAt: null,
          snapshot: "sources/bootstrap",
        },
        {
          kind: "npm",
          url: `https://cdn.jsdelivr.net/npm/bootstrap@${pkg.version}/dist/css/bootstrap.min.css`,
          ref: pkg.version,
          retrievedAt: null,
          snapshot: null,
        },
      ],
      notes: `Inventory read from site/data/sidebar.yml at v${pkg.version} (the docs site's own page index); docs URLs derived by the same title slugification the site uses. Canonical taxonomy mapping is an explicit table in the extractor. The Button demo loads Bootstrap's published bootstrap.min.css from jsDelivr at the same pinned version with its published SRI hash — a version-pinned URL, not a live fetch. The demo switches color mode via Bootstrap's own data-bs-theme root attribute, which that same stylesheet defines: an explicit ?mode= in its URL is applied once as a standalone override, otherwise it mirrors the embedding parent document's <html class="dark"> live through a MutationObserver.`,
    }),
  }
}

const config: SystemConfig = {
  slug: "bootstrap",
  source: {
    kind: "repo",
    repo: REPO,
    ref: REF,
    files: [
      { upstreamPath: "site/data/sidebar.yml", as: "sidebar.yml" },
      { upstreamPath: "package.json", as: "package.json" },
    ],
  },
  extractComponents,
}

export default config
