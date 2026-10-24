// Microsoft Fluent 2 pipeline config — component inventory axis, taken from the
// web implementation Microsoft ships as custom elements (@fluentui/web-components v3).
//
// Two machine-readable inventory sources, both vendored into the snapshot:
//   1. custom-elements.json from the published npm package at a PINNED version
//      (jsdelivr URL carries @3.1.3, so the bytes are pinned even though the
//      snapshot mechanism calls it a live-site fetch). It is the authoritative
//      list of elements the package actually registers, with their tag names.
//   2. The public Storybook's generated index.json — the documentation set,
//      which supplies each component's docs page and the system's own name for
//      it. Not version-pinned: it tracks the repo's main branch, so it is a
//      live-site tier source stamped with retrievedAt.
//
// The inventory is the union: every registered element plus every documented
// component (the Storybook runs ahead of the published package for a few).
//
// Only Button carries a live demo; it loads the real published
// @fluentui/web-components bundle and @fluentui/tokens theme from pinned CDN URLs.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "fluent-2"
const REPO = "https://github.com/microsoft/fluentui"
const DOCS = "https://fluent2.microsoft.design"
const STORYBOOK = "https://storybooks.fluentui.dev/web-components/"
const STORYBOOK_INDEX_URL =
  "https://storybooks.fluentui.dev/web-components/index.json"

/** Published package version the custom-elements manifest is pinned at — and
    the version the Button demo loads its bundle from. */
const PKG_VERSION = "3.1.3"
const CUSTOM_ELEMENTS_URL = `https://cdn.jsdelivr.net/npm/@fluentui/web-components@${PKG_VERSION}/custom-elements.json`
/** Official Fluent design tokens package the demo applies its themes from. */
const TOKENS_VERSION = "1.0.0-alpha.24"
/** Value of `colorNeutralBackground1` in the published web dark theme (grey[16]
    in @fluentui/tokens' global palette) — used only as the pre-theme fallback so
    the page does not flash white before setTheme sets the real custom property. */
const DARK_CANVAS_FALLBACK = "#292929"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: STORYBOOK,
  files: [
    { url: CUSTOM_ELEMENTS_URL, as: "custom-elements.json" },
    { url: STORYBOOK_INDEX_URL, as: "storybook-index.json" },
  ],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Keyed by the source directory that identifies one component family. Every key
// found in the snapshot must appear here (extraction throws otherwise, so a
// newly shipped element can never slip through unmapped). `null` = Fluent-
// specific with no cross-system equivalent in data/components.json.
const CANONICAL: Record<string, string | null> = {
  accordion: "accordion",
  "accordion-item": "accordion",
  "anchor-button": "button",
  avatar: "avatar",
  badge: "badge",
  button: "button",
  checkbox: "checkbox",
  combobox: "combobox",
  "compound-button": "button",
  "counter-badge": "badge",
  dialog: "dialog",
  "dialog-body": "dialog",
  divider: "divider",
  drawer: "drawer",
  "drawer-body": "drawer",
  dropdown: "select",
  "dropdown-option": "select",
  field: "form",
  image: null,
  label: "form",
  link: "link",
  listbox: "select",
  menu: "dropdown-menu",
  "menu-button": "dropdown-menu",
  "menu-item": "dropdown-menu",
  "menu-list": "dropdown-menu",
  "message-bar": "alert",
  "progress-bar": "progress-bar",
  radio: "radio",
  "radio-group": "radio",
  "rating-display": "rating",
  slider: "slider",
  spinner: "loading",
  "split-button": "button",
  switch: "switch",
  tab: "tabs",
  tablist: "tabs",
  text: null,
  "text-area": "textarea",
  "text-input": "text-input",
  "toggle-button": "button",
  tooltip: "tooltip",
  tree: null,
  "tree-item": null,
}

/** The Storybook authors a few stories in a directory that differs from the
    package's element directory; map those onto the element directory so the two
    snapshots line up on one key. */
const STORYBOOK_DIR_ALIASES: Record<string, string> = {
  option: "dropdown-option",
  textarea: "text-area",
}

// ── custom-elements.json parsing ─────────────────────────────────────────────
interface CustomElementsManifest {
  modules?: {
    path?: string
    declarations?: {
      kind?: string
      name?: string
      tagName?: string
      customElement?: boolean
    }[]
  }[]
}

interface RegisteredElement {
  /** Element directory under dist/esm/, the inventory key. */
  dir: string
  tagName: string
  className: string
}

/** Every custom element the pinned package registers, keyed by its directory. */
function parseCustomElements(json: string): Map<string, RegisteredElement> {
  const manifest = JSON.parse(json) as CustomElementsManifest
  const modules = manifest.modules
  if (!Array.isArray(modules)) {
    throw new Error("custom-elements.json: no `modules` array")
  }
  const byDir = new Map<string, RegisteredElement>()
  for (const module of modules) {
    const modulePath = module.path
    if (!modulePath) continue
    // ./dist/esm/<dir>/<dir>.js is the element definition module.
    const match = /^\.\/dist\/esm\/([^/]+)\//.exec(modulePath)
    if (!match) continue
    const dir = match[1]!
    for (const declaration of module.declarations ?? []) {
      if (!declaration.customElement || !declaration.tagName) continue
      byDir.set(dir, {
        dir,
        tagName: declaration.tagName,
        className: declaration.name ?? dir,
      })
    }
  }
  if (byDir.size === 0) {
    throw new Error("custom-elements.json: no registered custom elements found")
  }
  return byDir
}

// ── storybook index parsing ──────────────────────────────────────────────────
interface StorybookIndex {
  v?: number
  entries?: Record<
    string,
    { id?: string; title?: string; importPath?: string; type?: string }
  >
}

interface DocsEntry {
  /** Element directory, after alias normalization — the inventory key. */
  dir: string
  /** The system's own name: the last segment of the story title. */
  name: string
  docsUrl: string
}

/** Every `Components/…` docs page in the published Storybook, keyed by the
    element directory its stories are authored in. */
function parseStorybook(json: string): Map<string, DocsEntry> {
  const index = JSON.parse(json) as StorybookIndex
  const entries = index.entries
  if (!entries || typeof entries !== "object") {
    throw new Error("storybook-index.json: no `entries` object")
  }
  const byDir = new Map<string, DocsEntry>()
  for (const entry of Object.values(entries)) {
    if (entry.type !== "docs") continue
    const title = entry.title
    const id = entry.id
    const importPath = entry.importPath
    if (!title || !id || !importPath) continue
    // Concepts/… and Theme/… are documentation, not components.
    if (!title.startsWith("Components/")) continue
    const match = /^\.\/src\/([^/]+)\//.exec(importPath)
    if (!match) continue
    const raw = match[1]!
    const dir = STORYBOOK_DIR_ALIASES[raw] ?? raw
    const segments = title.split("/").map((s) => s.trim())
    byDir.set(dir, {
      dir,
      name: segments[segments.length - 1]!,
      docsUrl: `${STORYBOOK}?path=/docs/${id}`,
    })
  }
  if (byDir.size === 0) {
    throw new Error("storybook-index.json: no Components/* docs entries found")
  }
  return byDir
}

// ── demos ────────────────────────────────────────────────────────────────────
/** A complete standalone demo document: white page, one centered flex row,
    rendering Fluent's real published custom elements from pinned CDN URLs.
    The v3 bundle has no import/export statements and registers every
    <fluent-*> element on load; the theme comes from @fluentui/tokens.

    Dark mode is one idempotent `applyMode(dark)`: it stamps/removes
    `data-mode="dark"` on <html> (which paints the canvas) and calls Fluent's
    own `setTheme()` with `webDarkTheme` / `webLightTheme` from the same pinned
    tokens package, so it switches both ways. Resolution: an explicit `?mode=`
    query wins once (standalone testing, no observation); otherwise the demo
    reads the embedding parent's <html> class list and keeps following it live
    through a MutationObserver held for the page lifetime. Cross-origin or
    top-level (no reachable parent) means light. */
function demoDocument(opts: { title: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${opts.title}</title>
<!-- Fluent UI Web Components v${PKG_VERSION} (Microsoft), official published bundle, pinned. -->
<script src="https://cdn.jsdelivr.net/npm/@fluentui/web-components@${PKG_VERSION}/dist/web-components.min.js"></script>
<script>
  // Runs before the body parses, so the resolved mode is stamped on <html>
  // for the very first paint (no light flash).
  (function () {
    var dark = false;

    // The one place the system's dark mechanism lives. Idempotent, and it
    // switches both ways: the data-mode stamp the canvas rules key off is
    // added or removed, and Fluent's own setTheme() is re-run with the
    // matching published theme object. The theme modules are imported by the
    // module script below; until they resolve, applyMode only stamps and the
    // module script re-applies the current mode as soon as they land.
    function applyMode(next) {
      dark = !!next;
      var html = document.documentElement;
      if (dark) html.setAttribute("data-mode", "dark");
      else html.removeAttribute("data-mode");
      var themes = window.__fluentThemes;
      if (!themes) return;
      try {
        globalThis.Fluent.setTheme(dark ? themes.dark : themes.light);
      } catch (e) {
        console.error("Fluent setTheme failed", e);
      }
    }
    window.__applyMode = applyMode;
    window.__isDark = function () { return dark; };

    // Explicit ?mode= wins once and disables observation (standalone testing).
    var override = null;
    try { override = new URLSearchParams(location.search).get("mode"); } catch (e) {}
    if (override) { applyMode(override === "dark"); return; }

    // Otherwise follow the embedding parent's <html> class list, live.
    var root = null;
    try {
      if (window.parent !== window) root = window.parent.document.documentElement;
    } catch (e) { root = null; }
    if (!root) { applyMode(false); return; }

    applyMode(root.classList.contains("dark"));
    var observer = new MutationObserver(function () {
      applyMode(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Held for the page lifetime so it is never collected.
    window.__modeObserver = observer;
  })();
</script>
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  /* Fluent's setTheme() writes the theme's tokens as custom properties on the
     document, so the dark canvas is the system's own colorNeutralBackground1;
     the literal is only the fallback for the moment before the module runs. */
  html[data-mode="dark"], html[data-mode="dark"] body {
    background: var(--colorNeutralBackground1, ${DARK_CANVAS_FALLBACK});
    color: var(--colorNeutralForeground1, #ffffff);
  }
  body {
    min-height: 100vh;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
</style>
</head>
<body>
  <div class="row">
${opts.body}
  </div>
  <script type="module">
    // Official Fluent design tokens package (native ESM, fully-specified
    // relative imports, so it loads straight from the CDN with no bundler).
    // Both themes ship in the same pinned package and are loaded up front, so
    // applyMode can switch either way without another network round trip.
    const [light, dark] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/@fluentui/tokens@${TOKENS_VERSION}/lib/themes/web/lightTheme.js"),
      import("https://cdn.jsdelivr.net/npm/@fluentui/tokens@${TOKENS_VERSION}/lib/themes/web/darkTheme.js"),
    ]);
    window.__fluentThemes = { light: light.webLightTheme, dark: dark.webDarkTheme };
    // Re-apply the already-resolved mode now that the real themes exist; every
    // later applyMode call (observer or override) finds them itself.
    window.__applyMode(window.__isDark());
  </script>
</body>
</html>
`
}

/** Inventory key → its demo. Only keys listed here get one. */
const DEMOS: Record<string, { html: string; height: number }> = {
  button: {
    html: demoDocument({
      title: "Fluent UI Web Components — Button",
      body: [
        '    <fluent-button appearance="primary">Primary</fluent-button>',
        "    <fluent-button>Secondary</fluent-button>",
        '    <fluent-button appearance="primary" disabled>Disabled</fluent-button>',
      ].join("\n"),
    }),
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const registered = parseCustomElements(
    fs.readFileSync(path.join(sourcesDir, "custom-elements.json"), "utf8"),
  )
  const documented = parseStorybook(
    fs.readFileSync(path.join(sourcesDir, "storybook-index.json"), "utf8"),
  )

  const keys = [...new Set([...registered.keys(), ...documented.keys()])].sort()
  const unmapped = keys.filter((key) => !(key in CANONICAL))
  if (unmapped.length > 0) {
    throw new Error(
      `${SLUG}: components missing from CANONICAL: ${unmapped.join(", ")}`,
    )
  }

  const rows = keys.map((key) => {
    const element = registered.get(key)
    const docs = documented.get(key)
    const demo = DEMOS[key]
    const note = element
      ? docs
        ? `Registered as <${element.tagName}> in @fluentui/web-components ${PKG_VERSION}.`
        : `Registered as <${element.tagName}> in @fluentui/web-components ${PKG_VERSION}; no dedicated Storybook docs page.`
      : `Documented in the Storybook but not registered as a custom element in @fluentui/web-components ${PKG_VERSION}.`
    const component: SystemComponent = {
      component: CANONICAL[key]!,
      // The Storybook title is the system's own name; fall back to the exported
      // class name for elements the Storybook does not document separately.
      name: docs?.name ?? element!.className,
      docsUrl: docs?.docsUrl ?? null,
      demo: demo ? { html: demo.html, height: demo.height } : null,
      note,
    }
    return { key, component }
  })

  // Stable sort by the system's own name, inventory key breaking any tie.
  rows.sort(
    (a, b) =>
      a.component.name.localeCompare(b.component.name) ||
      a.key.localeCompare(b.key),
  )
  const components: SystemComponent[] = rows.map((row) => row.component)

  console.error(
    `[${SLUG}] ${components.length} component(s); ${components.filter((c) => c.demo).length} demo(s); ${components.filter((c) => c.component === null).length} unmapped to taxonomy`,
  )

  return {
    components,
    sources: [DOCS, STORYBOOK, REPO],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "npm",
          url: CUSTOM_ELEMENTS_URL,
          ref: PKG_VERSION,
          retrievedAt: null,
          snapshot: `sources/${SLUG}`,
        },
        {
          kind: "live-site",
          url: STORYBOOK_INDEX_URL,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes:
        `Inventory is the union of two vendored machine-readable sources: the custom-elements.json shipped by @fluentui/web-components ${PKG_VERSION} (every registered <fluent-*> element, keyed by its dist/esm/<dir> directory) and the public Storybook's generated index.json (every Components/* docs page, keyed by the src/<dir> its stories are authored in; two directories that differ between the two — option/dropdown-option and textarea/text-area — are aliased onto the element directory). The Storybook tracks the repo's main branch, so it documents a few components the pinned package does not yet register (and a few registered sub-elements have no docs page of their own); the note on each entry says which side it came from. Names are the last segment of the Storybook story title, falling back to the exported class name; docsUrl is the Storybook docs path, null when there is no docs page. The jsdelivr URL carries the package version, so that file is pinned by ref despite being fetched through the live-site snapshot path; the Storybook index URL is not pinned and is stamped with retrievedAt. ` +
        `The Button demo is not derived from the snapshot: it loads the published @fluentui/web-components ${PKG_VERSION} bundle and the @fluentui/tokens ${TOKENS_VERSION} web themes from pinned jsDelivr URLs (verified rendering in a browser), so its markup and pinned versions live in this config. Dark mode is a single idempotent applyMode(dark) that stamps or removes data-mode="dark" on <html> (painting the canvas with the dark theme's own colorNeutralBackground1) and re-runs Fluent's setTheme() with webDarkTheme or webLightTheme (lib/themes/web/{darkTheme,lightTheme}.js from the same pinned tokens package, both preloaded), so it switches both ways. An explicit "mode" query parameter applies once and disables observation (standalone testing); otherwise the demo resolves dark from the embedding parent document's <html> class list and keeps following it live via a MutationObserver on that element's class attribute, held for the page lifetime. A cross-origin or top-level page has no reachable parent and stays light.`,
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
