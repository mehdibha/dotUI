// Adobe Spectrum Web Components pipeline config — component inventory axis.
//
// Inventory source: the public Storybook's generated `index.json`, which lists
// every documented story with the `importPath` it was authored at. Each story
// lives under `./packages/<package>/stories/…`, and one package is one shipped
// element family with one docs page, so the package directory is the inventory
// unit. The system's own display name is derived from the story titles (the
// longest shared title path of a package's stories), never typed by hand.
//
// Only Button carries a live demo for now; it loads the real published
// @spectrum-web-components packages at a pinned version from esm.sh.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "spectrum-wc"
const REPO = "https://github.com/adobe/spectrum-web-components"
const DOCS = "https://opensource.adobe.com/spectrum-web-components/"
const STORYBOOK =
  "https://opensource.adobe.com/spectrum-web-components/storybook/"
const INDEX_URL =
  "https://opensource.adobe.com/spectrum-web-components/storybook/index.json"

/** Version the Button demo pins its published packages at (esm.sh). */
const DEMO_VERSION = "1.12.2"

/** Dark canvas paint used before the theme's custom properties exist (the
    element is still undefined during module load). This is the published value
    of `--spectrum-background-layer-1-color` → `--spectrum-gray-50` →
    `--spectrum-gray-50-rgb: 27,27,27` in
    @spectrum-web-components/theme@1.12.2 spectrum-two/theme-dark-core-tokens —
    once <sp-theme> upgrades, the same token drives the paint via var(). */
const DARK_CANVAS = "rgb(27, 27, 27)"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: "https://opensource.adobe.com/spectrum-web-components/",
  files: [{ url: INDEX_URL, as: "storybook-index.json" }],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Every package in the snapshot must appear here (extraction throws otherwise,
// so a newly shipped package can never slip through unmapped). `null` = the
// component is Spectrum-specific with no cross-system equivalent in
// data/components.json.
const CANONICAL: Record<string, string | null> = {
  accordion: "accordion",
  "action-bar": null,
  "action-button": "button",
  "action-group": "button-group",
  "action-menu": "dropdown-menu",
  "alert-banner": "alert",
  "alert-dialog": "dialog",
  asset: null,
  avatar: "avatar",
  badge: "badge",
  breadcrumbs: "breadcrumbs",
  button: "button",
  "button-group": "button-group",
  card: "card",
  checkbox: "checkbox",
  coachmark: null,
  "color-area": null,
  "color-field": null,
  "color-handle": null,
  "color-loupe": null,
  "color-slider": null,
  "color-wheel": null,
  combobox: "combobox",
  "contextual-help": null,
  dialog: "dialog",
  divider: "divider",
  dropzone: "file-upload",
  "field-group": "form",
  "field-label": "form",
  "help-text": "form",
  icon: "icon",
  icons: "icon",
  "icons-ui": "icon",
  "icons-workflow": "icon",
  "illustrated-message": "empty-state",
  "infield-button": "button",
  link: "link",
  menu: "dropdown-menu",
  meter: "progress-bar",
  "number-field": "text-input",
  overlay: null,
  picker: "select",
  "picker-button": null,
  popover: "popover",
  "progress-bar": "progress-bar",
  "progress-circle": "loading",
  radio: "radio",
  search: "search-input",
  sidenav: null,
  slider: "slider",
  "split-view": null,
  "status-light": "badge",
  swatch: null,
  switch: "switch",
  table: "table",
  tabs: "tabs",
  tags: "badge",
  textfield: "text-input",
  thumbnail: null,
  toast: "toast",
  tooltip: "tooltip",
  "top-nav": "header",
  tray: "drawer",
  underlay: null,
}

// ── storybook index parsing ──────────────────────────────────────────────────
interface StorybookIndex {
  v?: number
  entries?: Record<string, { title?: string; importPath?: string }>
}

/** package dir → the distinct story titles authored in it, sorted. */
function parseIndex(json: string): Map<string, string[]> {
  const index = JSON.parse(json) as StorybookIndex
  const entries = index.entries
  if (!entries || typeof entries !== "object") {
    throw new Error("storybook-index.json: no `entries` object")
  }
  const byPackage = new Map<string, Set<string>>()
  for (const entry of Object.values(entries)) {
    const importPath = entry.importPath
    const title = entry.title
    if (!importPath || !title) continue
    // Only ./packages/<name>/… is a shipped component package; ./tools/… holds
    // infrastructure stories (theme, grid, styles, truncated).
    const match = /^\.\/packages\/([^/]+)\//.exec(importPath)
    if (!match) continue
    const pkg = match[1]!
    const titles = byPackage.get(pkg) ?? new Set<string>()
    titles.add(title)
    byPackage.set(pkg, titles)
  }
  if (byPackage.size === 0) {
    throw new Error("storybook-index.json: no ./packages/* stories found")
  }
  return new Map(
    [...byPackage.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([pkg, titles]) => [pkg, [...titles].sort()]),
  )
}

/** kebab package dir → Title Case, used only when the titles disagree. */
function titleCasePackage(pkg: string): string {
  return pkg
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** The system's own name for a package: the longest title path every one of
    its stories shares ("Button/Accent/Fill" + "Button/Black/Fill" → "Button",
    "Color/Area" alone → "Color Area"). When the stories share no first
    segment (e.g. Textfield + Textarea), fall back to the package name. */
function displayName(pkg: string, titles: string[]): string {
  const paths = titles.map((t) => t.split("/").map((s) => s.trim()))
  const shortest = Math.min(...paths.map((p) => p.length))
  const shared: string[] = []
  for (let i = 0; i < shortest; i++) {
    const segment = paths[0]![i]!
    if (!paths.every((p) => p[i] === segment)) break
    shared.push(segment)
  }
  return shared.length > 0 ? shared.join(" ") : titleCasePackage(pkg)
}

/** Distinct top-level story sections, listed when a package documents more
    than one element family (Menu / Menu Item / Menu Group…). */
function sectionNote(titles: string[]): string | null {
  const sections = [
    ...new Set(titles.map((t) => t.split("/")[0]!.trim())),
  ].sort()
  if (sections.length < 2) return null
  return `Storybook documents ${sections.length} sections in this package: ${sections.join(", ")}.`
}

// ── demos ────────────────────────────────────────────────────────────────────
/** A complete standalone demo document: white page, one centered flex row,
    rendering the system's real published custom elements from pinned CDN
    URLs. `imports` are esm.sh module specifiers, `body` the markup inside
    <sp-theme>.

    Dark mode is the system's own mechanism: <sp-theme color="dark">, which
    Theme resolves against the "dark-spectrum-two" color fragment registered
    by spectrum-two/theme-dark-core-tokens.js (imported at the same pinned
    version). The page canvas is then painted from that theme's own
    `--spectrum-background-layer-1-color`. `applyMode(dark)` is idempotent and
    switches both ways.

    Mode resolution: an explicit `?mode=` in the URL wins once and disables
    observation (standalone testing). Otherwise the demo observes the
    embedding parent's <html> class list live — dark iff it carries `dark` —
    via a MutationObserver that lives for the page lifetime, so toggling the
    host theme restyles the demo in place without reloading the frame. A
    cross-origin or top-level document yields no observable root: light. */
function demoDocument(opts: {
  title: string
  imports: string[]
  body: string
}): string {
  const imports = opts.imports
    .map((specifier) => `    import '${specifier}';`)
    .join("\n")
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${opts.title}</title>
<script>
  // Runs before the body parses, so the resolved mode is stamped on <html>
  // for the very first paint (no light flash).
  (function () {
    var dark = false;

    // The one place the system's dark mechanism lives. Idempotent, and it
    // switches both ways: dark drops <sp-theme color="dark"> and the
    // data-mode stamp the canvas rules key off, light restores both.
    function applyMode(next) {
      dark = !!next;
      var html = document.documentElement;
      if (dark) html.setAttribute('data-mode', 'dark');
      else html.removeAttribute('data-mode');
      // <sp-theme> is parsed after this script; the body re-calls applyMode
      // once it exists, and every later call finds it.
      var theme = document.querySelector('sp-theme');
      if (theme) theme.setAttribute('color', dark ? 'dark' : 'light');
    }
    window.__applyMode = applyMode;
    window.__isDark = function () { return dark; };

    // Explicit ?mode= wins once and disables observation (standalone testing).
    var override = null;
    try { override = new URLSearchParams(location.search).get('mode'); } catch (e) {}
    if (override) { applyMode(override === 'dark'); return; }

    // Otherwise follow the embedding parent's <html> class list, live.
    var root = null;
    try {
      if (window.parent !== window) root = window.parent.document.documentElement;
    } catch (e) { root = null; }
    if (!root) { applyMode(false); return; }

    applyMode(root.classList.contains('dark'));
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    // Held for the page lifetime so it is never collected.
    window.__modeObserver = observer;
  })();
</script>
<style>
  html, body { margin: 0; padding: 0; background: #fff; }
  body {
    min-height: 100vh;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  sp-theme {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    opacity: 1;
    transition: opacity 120ms ease;
  }
  sp-theme:not(:defined) { opacity: 0; }

  /* Dark mode — reached whenever applyMode stamped data-mode on <html>. */
  html[data-mode="dark"], html[data-mode="dark"] body { background: ${DARK_CANVAS}; }
  html[data-mode="dark"] body { padding: 0; }
  html[data-mode="dark"] sp-theme {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 16px;
    /* The theme's own canvas token, resolved inside <sp-theme>'s scope. */
    background: var(--spectrum-background-layer-1-color);
  }
</style>
</head>
<body>
  <sp-theme system="spectrum-two" color="light" scale="medium">
${opts.body}
  </sp-theme>
  <script>
    // <sp-theme> now exists, so re-apply the already-resolved mode to reach
    // the system's real mechanism (color="dark"/"light"). Runs before
    // DOMContentLoaded; later observer callbacks find the element themselves.
    window.__applyMode(window.__isDark());
  </script>

  <script type="module">
    // Adobe Spectrum Web Components ${DEMO_VERSION} — real published packages via esm.sh
    import 'https://esm.sh/@spectrum-web-components/theme@${DEMO_VERSION}/sp-theme.js';
    import 'https://esm.sh/@spectrum-web-components/theme@${DEMO_VERSION}/spectrum-two/theme-light-core-tokens.js';
    import 'https://esm.sh/@spectrum-web-components/theme@${DEMO_VERSION}/spectrum-two/theme-dark-core-tokens.js';
    import 'https://esm.sh/@spectrum-web-components/theme@${DEMO_VERSION}/spectrum-two/scale-medium-core-tokens.js';
${imports}
  </script>
  <script>
    // Safety net: if the module graph fails to load, still show the markup
    // rather than an empty white page.
    setTimeout(function () {
      var t = document.querySelector('sp-theme');
      if (t && !window.customElements.get('sp-theme')) t.style.opacity = '1';
    }, 6000);
  </script>
</body>
</html>
`
}

/** package dir → its demo. Only packages listed here get one. */
const DEMOS: Record<string, { html: string; height: number }> = {
  button: {
    html: demoDocument({
      title: "Spectrum Web Components — Button",
      imports: [
        `https://esm.sh/@spectrum-web-components/button@${DEMO_VERSION}/sp-button.js`,
      ],
      body: [
        '    <sp-button variant="accent" treatment="fill">Primary</sp-button>',
        '    <sp-button variant="secondary" treatment="outline">Secondary</sp-button>',
        '    <sp-button variant="accent" treatment="fill" disabled>Primary</sp-button>',
      ].join("\n"),
    }),
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const json = fs.readFileSync(
    path.join(sourcesDir, "storybook-index.json"),
    "utf8",
  )
  const byPackage = parseIndex(json)

  const unmapped = [...byPackage.keys()].filter((pkg) => !(pkg in CANONICAL))
  if (unmapped.length > 0) {
    throw new Error(
      `spectrum-wc: packages missing from CANONICAL: ${unmapped.join(", ")}`,
    )
  }

  const rows = [...byPackage.entries()].map(([pkg, titles]) => {
    const demo = DEMOS[pkg]
    const component: SystemComponent = {
      component: CANONICAL[pkg]!,
      name: displayName(pkg, titles),
      docsUrl: `https://opensource.adobe.com/spectrum-web-components/components/${pkg}/`,
      demo: demo ? { html: demo.html, height: demo.height } : null,
      note: sectionNote(titles),
    }
    return { pkg, component }
  })
  // Stable sort by the system's own name, package dir breaking any tie.
  rows.sort(
    (a, b) =>
      a.component.name.localeCompare(b.component.name) ||
      a.pkg.localeCompare(b.pkg),
  )
  const components: SystemComponent[] = rows.map((r) => r.component)

  console.error(
    `[spectrum-wc] ${components.length} package(s); ${components.filter((c) => c.demo).length} demo(s); ${components.filter((c) => c.component === null).length} unmapped to taxonomy`,
  )

  return {
    components,
    sources: [DOCS, STORYBOOK, REPO],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "live-site",
          url: INDEX_URL,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes:
        "Inventory is the published Storybook's generated index.json: one entry per ./packages/<name> story group, which is one shipped element family and one docs page (./tools/* stories — theme, grid, styles, truncated — are infrastructure, not components, and are excluded). Names are derived from the shared story-title path, falling back to the package directory when a package documents several families (Textfield/Textarea, Menu/Menu Item…); the `note` field lists those sections. The index.json URL is not version-pinned, so this is a live-site tier source stamped with retrievedAt. docsUrl is derived from the package directory against the documented /components/<package>/ URL pattern. The Button demo is not derived from the snapshot: it loads @spectrum-web-components/theme and /button at the pinned version " +
        `${DEMO_VERSION} from esm.sh (verified rendering in a browser), so its markup and pinned version live in this config. Dark mode applies Spectrum's own mechanism — <sp-theme color="dark">, resolved against the "dark-spectrum-two" color fragment registered by spectrum-two/theme-dark-core-tokens.js at the same pinned version — with the page canvas painted from that theme's --spectrum-background-layer-1-color (--spectrum-gray-50, rgb(27,27,27) at ${DEMO_VERSION}). It is wrapped in one idempotent applyMode(dark) that switches both ways. An explicit ?mode= in the URL applies once and stops (standalone testing); otherwise the demo reads the embedding parent's documentElement (same-origin only; cross-origin or top-level falls back to light) and follows its 'dark' class live via a MutationObserver on the class attribute that lives for the page lifetime, so host theme toggles restyle the frame in place.`,
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
