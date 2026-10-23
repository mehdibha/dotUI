// Ant Design pipeline config — components axis only.
//
// Inventory source: two small machine-readable files, joined on the component
// directory slug.
//   1. ant.design/sitemap.xml — the published docs URL set. Every documented
//      component has exactly one English page at /components/<slug> (plus a
//      "-cn" twin, ignored). This decides WHAT is documented, and gives the
//      docs URL verbatim rather than by guesswork.
//   2. antd@<version>/es/index.js from jsDelivr — the shipped package entry
//      point, one `export { default as <Name> } from './<slug>';` line per
//      component. This gives the system's OWN name for each slug (QRCode, not
//      "Qr Code"; AutoComplete, not "Auto Complete") without deriving it from
//      the URL. The URL is version-pinned (antd@6.6.2), so those bytes are
//      pinned even though the snapshot kind is live-site.
//
// Non-component docs pages under /components/ (_util, overview, changelog) are
// excluded by an explicit list; `icon` is documented but has no default export
// (the glyphs live in @ant-design/icons), so its name comes from an explicit
// docs-only map. Every other slug must appear on both sides or extraction
// throws — an upstream addition surfaces as a failure, never a silent gap.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "ant-design"
const SITE = "https://ant.design"
const REPO = "https://github.com/ant-design/ant-design"
const DOCS_URL = "https://ant.design/components/overview"
const SITEMAP_URL = "https://ant.design/sitemap.xml"
const SITEMAP_FILE = "sitemap.xml"

/** npm version whose package entry point supplies the component names. */
const ANTD_VERSION = "6.6.2"
const INDEX_URL = `https://cdn.jsdelivr.net/npm/antd@${ANTD_VERSION}/es/index.js`
const INDEX_FILE = "antd-index.js"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: SITE,
  files: [
    { url: SITEMAP_URL, as: SITEMAP_FILE },
    { url: INDEX_URL, as: INDEX_FILE },
  ],
}

// Pages that live under /components/ in the docs but are not components.
const NON_COMPONENT_PAGES = new Set(["_util", "overview", "changelog"])

// Documented components with no default export in the package entry point.
const DOCS_ONLY_NAMES: Record<string, string> = {
  icon: "Icon",
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Explicit and exhaustive: docs slug → canonical slug in data/components.json,
// or null when Ant Design's component has no cross-system equivalent (layout
// primitives, providers, Ant-specific patterns, or a canonical name already
// claimed by a closer Ant component).
const CANONICAL: Record<string, string | null> = {
  affix: null,
  alert: "alert",
  anchor: null,
  app: null,
  "auto-complete": "combobox",
  avatar: "avatar",
  badge: "badge",
  "border-beam": null,
  breadcrumb: "breadcrumbs",
  button: "button",
  calendar: "calendar",
  card: "card",
  carousel: "carousel",
  cascader: null,
  checkbox: "checkbox",
  collapse: "accordion",
  "color-picker": null,
  "config-provider": null,
  "date-picker": "date-picker",
  descriptions: null,
  divider: "divider",
  drawer: "drawer",
  dropdown: "dropdown-menu",
  empty: "empty-state",
  flex: null,
  "float-button": null,
  form: "form",
  grid: null,
  icon: "icon",
  image: null,
  input: "text-input",
  "input-number": null,
  layout: null,
  list: "list",
  listy: null,
  masonry: null,
  mentions: null,
  menu: null,
  message: "toast",
  modal: "dialog",
  notification: null,
  pagination: "pagination",
  popconfirm: null,
  popover: "popover",
  progress: "progress-bar",
  "qr-code": null,
  radio: "radio",
  rate: "rating",
  result: null,
  segmented: "segmented-control",
  select: "select",
  skeleton: "skeleton",
  slider: "slider",
  space: null,
  spin: "loading",
  splitter: null,
  statistic: null,
  steps: "progress-steps",
  switch: "switch",
  table: "table",
  tabs: "tabs",
  tag: null,
  "time-picker": null,
  timeline: "timeline",
  tooltip: "tooltip",
  tour: null,
  transfer: null,
  tree: null,
  "tree-select": null,
  typography: null,
  upload: "file-upload",
  watermark: null,
}

// Notes explain mapping decisions that are not self-evident; everything else
// carries a null note.
const NOTES: Record<string, string> = {
  "auto-complete":
    "An input with a dropdown of suggestions — Ant Design’s take on the canonical combobox; Select with `showSearch` covers the same ground from the select side.",
  cascader:
    "A multi-level select over hierarchical options; no cross-system canonical equivalent, and Select holds the canonical select mapping.",
  collapse:
    "Ant Design’s name for the expand/collapse stack — the canonical accordion.",
  icon: "Documented under /components/icon, but the glyphs ship separately in @ant-design/icons, so there is no default export in the antd entry point.",
  input:
    "The Input family: Input.TextArea, Input.Search, Input.Password and Input.OTP share this one docs page, so textarea and search-input have no separate entry in this inventory.",
  message:
    "The lightweight global feedback strip — the canonical toast. Exported lowercase (`message`) because it is an imperative API object, not a component class.",
  menu: "The persistent navigation menu (sidebar/top nav), not a pop-up action list; Dropdown holds the canonical dropdown-menu mapping.",
  notification:
    "A stacked corner notification with title and description. Overlaps the canonical toast, but `message` is the closer fit and holds that mapping, so this entry stays system-specific.",
  popconfirm:
    "A popover-anchored confirmation bubble; Popover holds the canonical popover mapping.",
  progress:
    "One docs page for the line, circle and dashboard variants; mapped to the bar, the closer canonical fit.",
  spin: "Ant Design’s loading indicator — the canonical loading component.",
  tag: "Overlaps the canonical badge (its tag/pill sense), but Badge ships under that name and holds the mapping, so this entry stays system-specific.",
  "time-picker":
    "Time-only sibling of DatePicker, which holds the canonical date-picker mapping.",
  typography:
    "A text family (Title/Text/Paragraph/Link) rather than a single control; Link has no standalone Ant Design page.",
}

// ── sitemap parsing ──────────────────────────────────────────────────────────
interface DocsPage {
  slug: string
  url: string
}

/** Read the English /components/<slug> pages out of the vendored sitemap. The
    "-cn" twins are the Chinese locale of the same page and are dropped. */
function parseSitemap(xml: string): DocsPage[] {
  const pages = new Map<string, DocsPage>()
  for (const m of xml.matchAll(
    /<loc>\s*(https:\/\/ant\.design\/components\/([a-z0-9_-]+))\s*<\/loc>/g,
  )) {
    const slug = m[2]!
    if (slug.endsWith("-cn")) continue
    pages.set(slug, { slug, url: m[1]! })
  }
  if (pages.size === 0) {
    throw new Error(
      "sitemap.xml: no /components/* entries found — upstream sitemap reshaped",
    )
  }
  return [...pages.values()]
}

// ── package entry point parsing ──────────────────────────────────────────────
/** slug → the name antd exports it under, from `export { default as X } from
    './slug';` lines in es/index.js. */
function parseExports(src: string): Map<string, string> {
  const names = new Map<string, string>()
  for (const m of src.matchAll(
    /export\s*\{\s*default as ([A-Za-z][A-Za-z0-9]*)\s*\}\s*from\s*'\.\/([a-z0-9-]+)'/g,
  )) {
    names.set(m[2]!, m[1]!)
  }
  if (names.size === 0) {
    throw new Error(
      `${INDEX_FILE}: no default re-exports found — upstream entry point reshaped`,
    )
  }
  return names
}

// ── demos ────────────────────────────────────────────────────────────────────
// Real published antd from pinned jsDelivr UMD bundles (React 18 + dayjs, the
// dependency set antd's UMD dist expects), never hand-imitated CSS. The UMD
// dist is what antd ships for script-tag use; it is pinned at 5.29.3, the last
// line that publishes dist/antd.min.js.
const DEMO_REACT_VERSION = "18.3.1"
const DEMO_DAYJS_VERSION = "1.11.13"
const DEMO_ANTD_VERSION = "5.29.3"

interface DemoSpec {
  /** antd globals used by the demo body, e.g. ["Button"]. */
  globals: string[]
  /** Children of the centered row, as `e(...)` source text. */
  children: string
  height: number
}

/** Build a complete standalone demo document: white background, content
    centered in a horizontal flex row, antd's own published stylesheet-in-JS
    doing all the painting.

    Dark mode: the mechanism is antd v5's own — ConfigProvider with
    `theme.algorithm = antd.theme.darkAlgorithm` — and the page canvas is
    painted with `colorBgContainer` read out of antd's own dark design token
    (`antd.theme.getDesignToken({ algorithm: darkAlgorithm })`), so no hex is
    invented here. It is wrapped in a single idempotent `applyMode(dark)` that
    switches both ways: dark re-renders the React root inside the provider and
    sets `--demo-bg`, light re-renders the bare tree and removes the override.

    Mode resolution happens once, before first paint. `?mode=` in the URL is a
    standalone-testing override: applied once, no observation. Otherwise the
    demo follows its embedding page live — it reads
    `window.parent.document.documentElement`, applies dark iff that element
    carries the `dark` class, and keeps a MutationObserver on its `class`
    attribute for the page lifetime so parent theme toggles restyle the demo in
    place, without a reload. Cross-origin parents (the read throws) and
    top-level loads have no such root and render light. */
function buildDemo(spec: DemoSpec): { html: string; height: number } {
  const globals = [...spec.globals]
    .sort()
    .map((name) => `  var ${name} = antd.${name};`)
    .join("\n")

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ant Design</title>
<style>
  html, body { margin: 0; padding: 0; background: var(--demo-bg, #fff); }
  body {
    padding: 16px;
    box-sizing: border-box;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #root { display: flex; align-items: center; justify-content: center; }
  .row { display: flex; flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
<script src="https://cdn.jsdelivr.net/npm/react@${DEMO_REACT_VERSION}/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@${DEMO_REACT_VERSION}/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@${DEMO_DAYJS_VERSION}/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/antd@${DEMO_ANTD_VERSION}/dist/antd.min.js"></script>
</head>
<body>
<div id="root"></div>
<script>
  var e = React.createElement;
  var ConfigProvider = antd.ConfigProvider;
${globals}

  var content = e("div", { className: "row" }, ${spec.children});
  var reactRoot = ReactDOM.createRoot(document.getElementById("root"));
  var darkToken = antd.theme.getDesignToken({ algorithm: antd.theme.darkAlgorithm });

  // The whole dark mechanism, idempotent and switching both ways: antd v5's own
  // darkAlgorithm via ConfigProvider, plus a canvas painted with antd's own
  // colorBgContainer token — never a hand-picked hex. Light re-renders the bare
  // tree and drops the canvas override.
  function applyMode(dark) {
    if (dark) {
      document.documentElement.style.setProperty("--demo-bg", darkToken.colorBgContainer);
      reactRoot.render(
        e(ConfigProvider, { theme: { algorithm: antd.theme.darkAlgorithm } }, content)
      );
    } else {
      document.documentElement.style.removeProperty("--demo-bg");
      reactRoot.render(content);
    }
  }

  // Resolve the mode before first paint. ?mode= is a standalone-testing
  // override applied once; otherwise follow the embedding page's <html class>
  // live, for the lifetime of this document.
  window.__demoModeObserver = (function () {
    var override = new URLSearchParams(location.search).get("mode");
    if (override !== null) {
      applyMode(override === "dark");
      return null;
    }
    var parentRoot = null;
    try {
      if (window.parent !== window) parentRoot = window.parent.document.documentElement;
    } catch (err) {
      parentRoot = null;
    }
    if (!parentRoot) {
      applyMode(false);
      return null;
    }
    var sync = function () { applyMode(parentRoot.classList.contains("dark")); };
    sync();
    var observer = new MutationObserver(sync);
    observer.observe(parentRoot, { attributes: true, attributeFilter: ["class"] });
    return observer;
  })();
</script>
</body>
</html>
`
  return { html, height: spec.height }
}

/** Demos by docs slug. Scoped to Button for now; adding a component is adding
    an entry here, not new machinery. */
const DEMOS: Record<string, DemoSpec> = {
  button: {
    globals: ["Button"],
    children: `[
      e(Button, { key: "a", type: "primary" }, "Primary"),
      e(Button, { key: "b", type: "default" }, "Default"),
      e(Button, { key: "c", type: "primary", disabled: true }, "Disabled")
    ]`,
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const read = (name: string) =>
    fs.readFileSync(path.join(sourcesDir, name), "utf8")

  const pages = parseSitemap(read(SITEMAP_FILE)).filter(
    (page) => !NON_COMPONENT_PAGES.has(page.slug),
  )
  const exportNames = parseExports(read(INDEX_FILE))

  const unmapped = pages
    .filter((p) => !(p.slug in CANONICAL))
    .map((p) => p.slug)
  if (unmapped.length > 0) {
    throw new Error(
      `sitemap.xml: component pages missing from the canonical map: ${unmapped.join(", ")}`,
    )
  }
  const stale = Object.keys(CANONICAL).filter(
    (slug) => !pages.some((p) => p.slug === slug),
  )
  if (stale.length > 0) {
    throw new Error(
      `canonical map has entries no longer documented upstream: ${stale.join(", ")}`,
    )
  }
  const nameless = pages
    .filter((p) => !exportNames.has(p.slug) && !(p.slug in DOCS_ONLY_NAMES))
    .map((p) => p.slug)
  if (nameless.length > 0) {
    throw new Error(
      `no exported name for documented component(s): ${nameless.join(", ")}`,
    )
  }

  const components: SystemComponent[] = pages.map((page) => {
    const demo = DEMOS[page.slug]
    return {
      component: CANONICAL[page.slug]!,
      name: exportNames.get(page.slug) ?? DOCS_ONLY_NAMES[page.slug]!,
      docsUrl: page.url,
      demo: demo ? buildDemo(demo) : null,
      note: NOTES[page.slug] ?? null,
    }
  })
  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  return {
    components,
    sources: [SITE, DOCS_URL, REPO],
    provenance: {
      method: "script",
      extractor: `scripts/systems/${SLUG}.ts`,
      sources: [
        {
          kind: "live-site",
          url: SITEMAP_URL,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
        {
          kind: "npm",
          url: INDEX_URL,
          ref: ANTD_VERSION,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes: `Inventory is the join of two snapshot files: ant.design/sitemap.xml decides which components are documented (every English /components/<slug> page, minus the non-component pages _util, overview and changelog) and supplies the docs URL verbatim; the antd@${ANTD_VERSION} package entry point (es/index.js, fetched from a version-pinned jsDelivr URL — pinned bytes even though the snapshot kind is live-site) supplies the system's own name per slug. Extraction throws when a documented slug is missing from the canonical map, when the map holds a slug no longer documented, or when a documented slug has no exported name, so upstream additions fail loudly. The one documented component with no default export is Icon, whose glyphs ship in @ant-design/icons; its name comes from an explicit docs-only map. \`message\` and \`notification\` keep antd's lowercase export identifiers because those are imperative API objects rather than component classes. Canonical taxonomy mapping and the notes are editorial (an explicit map in the extractor), not extracted. Only Button carries a demo; it loads antd 5.29.3 UMD with React ${DEMO_REACT_VERSION} and dayjs ${DEMO_DAYJS_VERSION} from pinned jsDelivr URLs — the 5.x line is used because it is the last one publishing dist/antd.min.js for script-tag use, so the demo is one major version behind the ${ANTD_VERSION} inventory. The demo document's dark mechanism is antd v5's own: ConfigProvider with \`theme.algorithm = antd.theme.darkAlgorithm\`, plus a page canvas painted with \`colorBgContainer\` read from \`antd.theme.getDesignToken\` under that same algorithm, so the dark canvas is an antd token rather than a chosen hex. It is wrapped in one idempotent \`applyMode(dark)\` that switches both ways (light re-renders the bare tree and removes the canvas override). Mode is resolved before first paint: a \`mode\` query parameter, when present, is a standalone-testing override applied once with no observation; otherwise the demo reads \`window.parent.document.documentElement\`, applies dark iff that element carries the \`dark\` class, and keeps a MutationObserver on its \`class\` attribute for the page lifetime, so toggling the embedding page's theme restyles the demo in place without reloading the iframe. A cross-origin parent (the read throws) or a top-level load renders light. Ant Design documents component families on one page (Input covers TextArea/Search/Password/OTP, DatePicker covers RangePicker), so the sub-components of those families have no separate inventory entry.`,
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
