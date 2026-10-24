// Shoelace pipeline config (components axis only).
//
// Shoelace ships a Custom Elements Manifest (custom-elements.json) inside its
// npm package: one module per component, each declaring its tag name, status,
// and summary. That file IS the inventory — every `<sl-*>` element the library
// registers, with the docs slug recoverable from the module path. The snapshot
// is taken from a version-pinned jsDelivr URL (npm tarball contents, immutable
// per version), so the bytes are pinned even though the fetch is a live-site
// kind of source.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "shoelace"
const VERSION = "2.20.1"
const CDN = `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${VERSION}/`
const MANIFEST_URL = `${CDN}dist/custom-elements.json`
const SITE = "https://shoelace.style"
const REPO = "https://github.com/shoelace-style/shoelace"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: CDN,
  files: [{ url: MANIFEST_URL, as: "custom-elements.json" }],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Explicit, exhaustive map: Shoelace tag → slug in data/components.json, or
// null when the element has no cross-system equivalent in the taxonomy (utility
// elements, formatters, and sub-parts whose parent already carries the mapping).
const CANONICAL: Record<string, string | null> = {
  "sl-alert": "alert",
  "sl-animated-image": null,
  "sl-animation": null,
  "sl-avatar": "avatar",
  "sl-badge": "badge",
  "sl-breadcrumb": "breadcrumbs",
  "sl-breadcrumb-item": null,
  "sl-button": "button",
  "sl-button-group": "button-group",
  "sl-card": "card",
  "sl-carousel": "carousel",
  "sl-carousel-item": null,
  "sl-checkbox": "checkbox",
  "sl-color-picker": null,
  "sl-copy-button": null,
  "sl-details": "accordion",
  "sl-dialog": "dialog",
  "sl-divider": "divider",
  "sl-drawer": "drawer",
  "sl-dropdown": "dropdown-menu",
  "sl-format-bytes": null,
  "sl-format-date": null,
  "sl-format-number": null,
  "sl-icon": "icon",
  "sl-icon-button": null,
  "sl-image-comparer": null,
  "sl-include": null,
  "sl-input": "text-input",
  "sl-menu": null,
  "sl-menu-item": null,
  "sl-menu-label": null,
  "sl-mutation-observer": null,
  "sl-option": null,
  "sl-popup": null,
  "sl-progress-bar": "progress-bar",
  "sl-progress-ring": null,
  "sl-qr-code": null,
  "sl-radio": "radio",
  "sl-radio-button": null,
  "sl-radio-group": null,
  "sl-range": "slider",
  "sl-rating": "rating",
  "sl-relative-time": null,
  "sl-resize-observer": null,
  "sl-select": "select",
  "sl-skeleton": "skeleton",
  "sl-spinner": "loading",
  "sl-split-panel": null,
  "sl-switch": "switch",
  "sl-tab": null,
  "sl-tab-group": "tabs",
  "sl-tab-panel": null,
  "sl-tag": null,
  "sl-textarea": "textarea",
  "sl-tooltip": "tooltip",
  "sl-tree": null,
  "sl-tree-item": null,
  "sl-visually-hidden": null,
}

// Acronyms Shoelace title-cases differently from a naive word-cap of its
// directory name (docs heading is "QR Code", not "Qr Code").
const ACRONYMS: Record<string, string> = { qr: "QR" }

function titleCase(dir: string): string {
  return dir
    .split("-")
    .map(
      (word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ")
}

// ── custom-elements.json parsing ─────────────────────────────────────────────
interface CemDeclaration {
  customElement?: boolean
  tagName?: string
  status?: string
  summary?: string
}

interface CemModule {
  path?: string
  declarations?: CemDeclaration[]
}

interface Cem {
  modules?: CemModule[]
  package?: { version?: string }
}

interface Element {
  tagName: string
  /** Component directory under components/ — also the docs slug. */
  dir: string
  status: string | null
  summary: string | null
}

function parseElements(cem: Cem): Element[] {
  const elements: Element[] = []
  for (const mod of cem.modules ?? []) {
    const dirMatch = /^components\/([a-z0-9-]+)\//.exec(mod.path ?? "")
    for (const decl of mod.declarations ?? []) {
      if (!decl.customElement || !decl.tagName) continue
      if (!dirMatch) {
        throw new Error(
          `custom-elements.json: <${decl.tagName}> is not under components/ (path "${mod.path}")`,
        )
      }
      elements.push({
        tagName: decl.tagName,
        dir: dirMatch[1]!,
        status: decl.status ?? null,
        summary: decl.summary ?? null,
      })
    }
  }
  if (elements.length === 0) {
    throw new Error("custom-elements.json: no custom elements found")
  }
  return elements
}

// ── demos ────────────────────────────────────────────────────────────────────
// Complete standalone documents loading Shoelace's real published theme and
// autoloader from version-pinned CDN URLs. No hand-imitated styles: everything
// visible is painted by the library's own CSS.
function demoDocument(title: string, version: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>

<!-- Shoelace ${version} — official light theme (real published CSS, pinned) -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${version}/cdn/themes/light.css"
/>

<!-- Shoelace ${version} — official dark theme. Scoped entirely to .sl-theme-dark
     (it declares no :root block), so loading it is inert until the class is set.
     Loaded after light.css so its equal-specificity declarations win in dark. -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${version}/cdn/themes/dark.css"
/>

<!-- Dark mode → Shoelace's own mechanism: the sl-theme-dark class on <html>.
     Runs in <head>, before first paint, so there is no light flash.
     ?mode= is a standalone-testing override; otherwise the demo follows the
     parent document's <html class="dark"> live, via a MutationObserver. -->
<script>
  (function () {
    // Idempotent, switches both ways: adding/removing sl-theme-dark is the
    // whole mechanism — the light canvas rule applies again once it is gone.
    function applyMode(dark) {
      document.documentElement.classList.toggle('sl-theme-dark', !!dark);
    }

    var override = new URLSearchParams(location.search).get('mode');
    if (override !== null) {
      applyMode(override === 'dark');
      return;
    }

    var root = null;
    try {
      if (window.parent !== window) root = window.parent.document.documentElement;
    } catch (err) {
      root = null; // cross-origin parent
    }
    if (!root) {
      applyMode(false);
      return;
    }

    applyMode(root.classList.contains('dark'));
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    // Keep the observer alive for the page lifetime.
    window.__dsModeObserver = observer;
  })();
</script>

<!-- Shoelace ${version} autoloader — lazily registers any <sl-*> element it finds -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${version}/cdn/shoelace-autoloader.js"
  data-shoelace="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${version}/cdn/"
></script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #ffffff;
  }
  /* Dark canvas from Shoelace's own dark palette — no invented hexes. */
  html.sl-theme-dark,
  html.sl-theme-dark body {
    background: var(--sl-color-neutral-0);
    color: var(--sl-color-neutral-900);
  }
  body {
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sl-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  /* Avoid a flash of unstyled/unregistered custom elements */
  .row > *:not(:defined) {
    visibility: hidden;
  }
  /* Safety net: if the CDN modules never load, still show the markup */
  body.sl-timeout .row > *:not(:defined) {
    visibility: visible;
  }
</style>
</head>
<body>
  <div class="row">
${body}
  </div>

  <script>
    // If Shoelace fails to register within 6s, un-hide so the page is never blank.
    setTimeout(function () {
      if (!customElements.get('sl-button')) {
        document.body.classList.add('sl-timeout');
      }
    }, 6000);
  </script>
</body>
</html>
`
}

/** Demo body markup per tag. Only tags listed here get a demo; the spike scope
    for this system is Button. Heights are per-tag too (default 130). */
const DEMO_BODIES: Record<string, string> = {
  "sl-button": `    <sl-button variant="primary">Primary</sl-button>
    <sl-button variant="default">Secondary</sl-button>
    <sl-button variant="primary" disabled>Disabled</sl-button>`,
}

const DEMO_HEIGHTS: Record<string, number> = {}
const DEFAULT_DEMO_HEIGHT = 130

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const cem = JSON.parse(
    fs.readFileSync(path.join(sourcesDir, "custom-elements.json"), "utf8"),
  ) as Cem
  const version = cem.package?.version
  if (!version) {
    throw new Error("custom-elements.json: package.version missing")
  }

  const elements = parseElements(cem)

  const unmapped = elements
    .map((e) => e.tagName)
    .filter((tag) => !(tag in CANONICAL))
    .sort()
  if (unmapped.length > 0) {
    throw new Error(
      `custom-elements.json: tags missing from the canonical map: ${unmapped.join(", ")}`,
    )
  }

  const components: SystemComponent[] = elements.map((el) => {
    const name = titleCase(el.dir)
    const body = DEMO_BODIES[el.tagName]
    const notes: string[] = []
    if (el.summary) notes.push(el.summary)
    notes.push(`<${el.tagName}>`)
    if (el.status && el.status !== "stable") notes.push(`Status: ${el.status}.`)
    return {
      component: CANONICAL[el.tagName] ?? null,
      name,
      docsUrl: `${SITE}/components/${el.dir}`,
      demo: body
        ? {
            html: demoDocument(`Shoelace ${name}`, version, body),
            height: DEMO_HEIGHTS[el.tagName] ?? DEFAULT_DEMO_HEIGHT,
          }
        : null,
      note: notes.join(" "),
    }
  })

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  return {
    components,
    sources: [SITE, REPO, MANIFEST_URL],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "npm",
          url: MANIFEST_URL,
          ref: version,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes:
        'Inventory comes entirely from the Custom Elements Manifest shipped in the @shoelace-style/shoelace npm package. The snapshot is fetched with the live-site source kind, but the URL is version-pinned (jsDelivr serves immutable npm tarball contents per version), so the bytes are pinned as strongly as a repo ref; the version in provenance.ref is read from the manifest’s own package.version. Docs URLs are derived from each module’s components/<dir>/ path, and display names are the title-cased directory (Shoelace’s own docs heading). Canonical taxonomy mapping is an explicit map in the extractor; sub-part elements (sl-tab, sl-menu-item, sl-tree-item…) and utility elements (sl-include, sl-mutation-observer, formatters…) map to null. Demos: Button only in this pass, built from Shoelace’s published light and dark themes + autoloader at the same pinned version. Each demo document applies Shoelace’s own dark mechanism — the sl-theme-dark class on <html> — with the page canvas taken from the theme’s --sl-color-neutral-0 token; light rendering is unchanged because dark.css declares no :root block. Mode resolution runs before first paint: an explicit “mode” query parameter is a one-shot standalone-testing override, otherwise the document reads the embedding parent’s <html class="dark"> (when same-origin and framed; a cross-origin or top-level document falls back to light) and keeps following it for the page lifetime through a MutationObserver on the parent’s class attribute, toggling the theme class in both directions without reloading.',
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
