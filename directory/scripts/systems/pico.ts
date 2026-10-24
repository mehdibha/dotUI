// Pico CSS pipeline config — components axis only.
//
// Pico is a classless CSS framework: its "components" are styled semantic HTML
// elements (plus a handful of class/attribute-driven patterns like .dropdown,
// role="group" and <dialog>). The canonical inventory of what Pico documents
// lives in the docs site's own navigation data file
// (picocss/picocss.com app/data/documentationMenu.json), which is vendored at a
// pinned SHA and is the ONLY thing extraction parses.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "pico"
const SITE = "https://picocss.com"
const DOCS = "https://picocss.com/docs"
const CODE_REPO = "https://github.com/picocss/pico"
const DOCS_REPO = "https://github.com/picocss/picocss.com"
// Pinned commit of the docs site whose navigation data is vendored.
const DOCS_REF = "c68648909393e0d6a3ab4edd814f95af3a1e8240"
// Published stylesheet the demos load, pinned by version on jsDelivr.
const PICO_VERSION = "2.1.1"
const PICO_CSS = `https://cdn.jsdelivr.net/npm/@picocss/pico@${PICO_VERSION}/css/pico.min.css`

const MENU_FILE = "documentationMenu.json"

const SOURCE: SystemConfig["source"] = {
  kind: "repo",
  repo: DOCS_REPO,
  ref: DOCS_REF,
  files: [{ upstreamPath: `app/data/${MENU_FILE}`, as: MENU_FILE }],
}

// ── the snapshot's shape ─────────────────────────────────────────────────────
interface MenuLink {
  label: string
  route: string
}
interface MenuCategory {
  category: string
  links: MenuLink[]
}

/** Docs categories that document UI elements. The rest of the menu is
    getting-started / customization / layout / about prose, not components. */
const UI_CATEGORIES = new Set(["Content", "Forms", "Components"])

// ── canonical mapping ────────────────────────────────────────────────────────
/** route → canonical taxonomy slug in data/components.json (null when Pico's
    page has no cross-system component equivalent), plus an optional name
    override where the menu label is a nav word rather than the element's name,
    and an optional note. Explicit so an upstream menu reshuffle can never
    silently invent a mapping. */
interface Mapping {
  component: string | null
  name?: string
  note?: string
}

const MAP: Record<string, Mapping> = {
  // Content
  "/docs/typography": {
    component: null,
    note: "Base typographic styling for semantic HTML, not a discrete component.",
  },
  "/docs/link": { component: "link" },
  "/docs/button": { component: "button" },
  "/docs/table": { component: "table" },
  // Forms
  "/docs/forms": {
    component: "form",
    name: "Form elements",
    note: "Overview page covering the styled native form controls as a set.",
  },
  "/docs/forms/input": { component: "text-input" },
  "/docs/forms/textarea": { component: "textarea" },
  "/docs/forms/select": { component: "select" },
  "/docs/forms/checkboxes": { component: "checkbox" },
  "/docs/forms/radios": { component: "radio" },
  "/docs/forms/switch": { component: "switch" },
  "/docs/forms/range": {
    component: "slider",
    note: 'Styled native <input type="range">.',
  },
  // Components
  "/docs/accordion": {
    component: "accordion",
    note: "Built on native <details>/<summary>.",
  },
  "/docs/card": { component: "card" },
  "/docs/dropdown": {
    component: "dropdown-menu",
    note: 'One <details class="dropdown"> pattern that covers menus, custom selects and multi-selects.',
  },
  "/docs/group": {
    component: "button-group",
    note: 'role="group" wrapper joining inputs and buttons into one row.',
  },
  "/docs/loading": {
    component: "loading",
    note: 'aria-busy="true" renders a spinner on any element.',
  },
  "/docs/modal": {
    component: "dialog",
    note: "Styled native <dialog>.",
  },
  "/docs/nav": {
    component: "header",
    note: "Styled <nav>, used for the page header/navbar as well as breadcrumbs.",
  },
  "/docs/progress": { component: "progress-bar" },
  "/docs/tooltip": {
    component: "tooltip",
    note: "data-tooltip attribute on any element.",
  },
}

/** Menu labels carry inline markup — a "New" badge, e.g. "Group
    <mark>New</mark>". The badge is chrome, not part of the name: drop the whole
    element, then strip any remaining tags. */
function cleanLabel(label: string): string {
  return label
    .replace(/<mark\b[^>]*>[\s\S]*?<\/mark>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// ── demos ────────────────────────────────────────────────────────────────────
/** A complete standalone document loading Pico's real published stylesheet at a
    pinned version, with the sample centered in a horizontal flex row.

    Color mode follows the embedding page live. Pico ships both schemes in the
    one stylesheet and selects between them with `data-theme` on the root
    element ([data-theme=dark] in pico.min.css), so applyMode is a single
    attribute write — no extra asset, idempotent, and symmetric: back to
    data-theme="light" restores the light scheme and the white canvas, dark
    follows Pico's own --pico-background-color rather than an invented hex.

    Resolution, in an IIFE before first paint: an explicit `?mode=` query
    parameter wins and is applied once (standalone testing, no observation);
    otherwise the demo reads the parent document's <html> class list and mirrors
    `dark` on it, re-applying on every attribute change via a MutationObserver
    that lives for the page lifetime. Cross-origin parents and top-level loads
    throw or have no parent — those render light and stop. */
function demoDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pico CSS — ${title}</title>
<link rel="stylesheet" href="${PICO_CSS}">
<script>
  (function () {
    function applyMode(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    }

    var mode = new URLSearchParams(window.location.search).get('mode')
    if (mode !== null) {
      applyMode(mode === 'dark')
      return
    }

    var root = null
    try {
      if (window.parent !== window) root = window.parent.document.documentElement
    } catch (err) {
      root = null
    }
    if (!root) {
      applyMode(false)
      return
    }

    applyMode(root.classList.contains('dark'))
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains('dark'))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    window.__picoDemoModeObserver = observer
  })()
</script>
<style>
  html, body { background: #fff; }
  html[data-theme="dark"], html[data-theme="dark"] body {
    background: var(--pico-background-color);
  }
  body {
    margin: 0;
    padding: 16px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
</style>
</head>
<body>
  <div class="row">
${body}
  </div>
</body>
</html>
`
}

interface DemoSpec {
  title: string
  body: string
  height: number
}

/** route → demo. Scoped to Button for this system; every entry uses the same
    pinned stylesheet and centered-row document. */
const DEMOS: Record<string, DemoSpec> = {
  "/docs/button": {
    title: "Button",
    body: [
      '    <button type="button">Primary</button>',
      '    <button type="button" class="secondary">Secondary</button>',
      '    <button type="button" class="contrast">Contrast</button>',
      '    <button type="button" class="outline">Outline</button>',
      '    <button type="button" disabled>Disabled</button>',
    ].join("\n"),
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const menu = JSON.parse(
    fs.readFileSync(path.join(sourcesDir, MENU_FILE), "utf8"),
  ) as MenuCategory[]
  if (!Array.isArray(menu) || menu.length === 0) {
    throw new Error(`${MENU_FILE}: expected a non-empty array of categories`)
  }

  const seenCategories = new Set(menu.map((c) => c.category))
  for (const category of UI_CATEGORIES) {
    if (!seenCategories.has(category)) {
      throw new Error(
        `${MENU_FILE}: expected category "${category}" — the docs menu was reshaped`,
      )
    }
  }

  const components: SystemComponent[] = []
  for (const category of menu) {
    if (!UI_CATEGORIES.has(category.category)) continue
    for (const link of category.links) {
      const mapping = MAP[link.route]
      if (!mapping) {
        throw new Error(
          `${MENU_FILE}: no canonical mapping for documented route "${link.route}" — add it to MAP`,
        )
      }
      const demo = DEMOS[link.route]
      components.push({
        component: mapping.component,
        name: mapping.name ?? cleanLabel(link.label),
        docsUrl: `${SITE}${link.route}`,
        demo: demo
          ? { html: demoDocument(demo.title, demo.body), height: demo.height }
          : null,
        note: mapping.note ?? null,
      })
    }
  }

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  const manifest = readManifest(sourcesDir)

  return {
    components,
    sources: [SITE, DOCS, CODE_REPO, DOCS_REPO],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "repo",
          url: DOCS_REPO,
          ref: DOCS_REF,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes: `Inventory is the docs site's own navigation data (app/data/documentationMenu.json) at a pinned SHA; the Content, Forms and Components categories are the UI-element pages, the rest of the menu is getting-started/customization/layout/about prose. Pico is classless, so most entries are styled native HTML elements rather than named components; canonical taxonomy mapping and the one name override (/docs/forms → "Form elements", whose menu label is just "Overview") are explicit in the config. The Button demo loads Pico's published stylesheet from a version-pinned jsDelivr URL (@picocss/pico@${PICO_VERSION}), which pins the bytes the same way a git ref does even though it is not part of the snapshot. That same stylesheet ships both color schemes, selected by data-theme on <html>, so the demo switches mode by writing that one attribute ("dark" for Pico's own dark scheme and --pico-background-color canvas, "light" to restore the white one). Mode follows the embedding page live: an explicit "mode" query parameter is applied once for standalone testing, otherwise the demo mirrors the "dark" class on the parent document's <html> and re-applies it through a MutationObserver on that element's class attribute; a cross-origin or top-level load has no readable parent and renders light.`,
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
