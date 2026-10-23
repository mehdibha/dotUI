// Material UI (MUI) pipeline config — components axis only.
//
// Inventory source: docs/data/material/pages.ts at a pinned SHA. That file is
// the docs navigation tree MUI itself renders, so every documented component
// page appears in it exactly once, with its docs pathname and (where the title
// differs from the pathname) its display title. Parsing it gives a complete,
// reproducible component inventory without touching the network.
//
// Only `/material-ui/react-*` pathnames are components: that is MUI's docs URL
// convention for a component page. Deliberately out of scope — the icon
// gallery pages (/material-ui/icons, /material-ui/material-icons), the
// transitions page, and the MUI X products (/x/react-data-grid, date pickers,
// charts, tree view), which are separate paid/plus packages linked outbound
// from the same nav.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const REPO = "https://github.com/mui/material-ui"
const REF = "fc3a3a0a8b7c8f20274eca4758ea07a33e25c1b4"
const DOCS_ORIGIN = "https://mui.com"
const DOCS_URL = "https://mui.com/material-ui/all-components/"
const PAGES_FILE = "pages.ts"

const SOURCE: SystemConfig["source"] = {
  kind: "repo",
  repo: REPO,
  ref: REF,
  files: [{ upstreamPath: "docs/data/material/pages.ts", as: PAGES_FILE }],
}

// ── canonical taxonomy mapping ───────────────────────────────────────────────
// Explicit, exhaustive: docs pathname → canonical slug in data/components.json,
// or null when MUI's component has no cross-system equivalent in the taxonomy
// (layout primitives, render-prop utilities, hooks, MUI-specific patterns).
// The extractor throws when the snapshot contains a pathname missing here, so
// an upstream addition surfaces as a failure rather than a silent gap.
const CANONICAL: Record<string, string | null> = {
  // inputs
  "react-autocomplete": "combobox",
  "react-button": "button",
  "react-button-group": "button-group",
  "react-checkbox": "checkbox",
  "react-floating-action-button": null,
  "react-number-field": null,
  "react-radio-button": "radio",
  "react-rating": "rating",
  "react-select": "select",
  "react-slider": "slider",
  "react-switch": "switch",
  "react-text-field": "text-input",
  "react-toggle-button": "segmented-control",
  "react-transfer-list": null,
  // data display
  "react-avatar": "avatar",
  "react-badge": "badge",
  "react-chip": null,
  "react-divider": "divider",
  "react-list": "list",
  "react-table": "table",
  "react-tooltip": "tooltip",
  "react-typography": null,
  // feedback
  "react-alert": "alert",
  "react-backdrop": null,
  "react-dialog": "dialog",
  "react-progress": "progress-bar",
  "react-skeleton": "skeleton",
  "react-snackbar": "toast",
  // surfaces
  "react-accordion": "accordion",
  "react-app-bar": "header",
  "react-card": "card",
  "react-paper": null,
  // navigation
  "react-bottom-navigation": null,
  "react-breadcrumbs": "breadcrumbs",
  "react-drawer": "drawer",
  "react-link": "link",
  "react-menu": "dropdown-menu",
  "react-menubar": null,
  "react-pagination": "pagination",
  "react-speed-dial": null,
  "react-stepper": "progress-steps",
  "react-tabs": "tabs",
  // layout
  "react-box": null,
  "react-container": null,
  "react-grid": null,
  "react-image-list": null,
  "react-stack": null,
  // utils
  "react-click-away-listener": null,
  "react-css-baseline": null,
  "react-init-color-scheme-script": null,
  "react-modal": null,
  "react-no-ssr": null,
  "react-popover": "popover",
  "react-popper": null,
  "react-portal": null,
  "react-textarea-autosize": "textarea",
  "react-use-media-query": null,
  // lab
  "react-masonry": null,
  "react-timeline": "timeline",
}

// Notes are attached where the mapping decision needs explaining; everything
// else carries a null note.
const NOTES: Record<string, string> = {
  "react-badge":
    "MUI’s Badge is the count/status overlay anchored to another element — the canonical badge. Chip covers the tag/pill sense of the same canonical name and is therefore left unmapped.",
  "react-chip":
    "Overlaps the canonical badge (its tag/pill sense), but MUI ships Badge under that name, so this entry stays system-specific.",
  "react-progress":
    "One docs page for both CircularProgress (a spinner) and LinearProgress (a bar); mapped to the bar, which is the closer canonical fit.",
  "react-modal":
    "The low-level focus-trapping primitive Dialog and Drawer are built on; Dialog holds the canonical dialog mapping.",
  "react-toggle-button":
    "ToggleButtonGroup is MUI’s connected row of exclusive options — the canonical segmented control.",
  "react-use-media-query": "A hook, documented alongside the components.",
  "react-init-color-scheme-script":
    "A script component for blocking-render color-scheme setup, not a UI control.",
}

// ── pages.ts parsing ─────────────────────────────────────────────────────────
interface DocsPage {
  /** Pathname tail, e.g. "react-button". */
  key: string
  pathname: string
  /** Explicit `title:` from the nav tree, when MUI overrides the derived one. */
  title: string | null
}

/** Title MUI derives from a pathname when the nav entry declares none:
    kebab tail → Start Case ("react-button-group" → "Button Group"). */
function titleFromKey(key: string): string {
  return key
    .replace(/^react-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Read every `/material-ui/react-*` nav entry out of the vendored pages.ts.
    Each entry is an object literal; we slice from its `pathname:` to its
    closing brace and read the optional `title:` inside that window, which
    keeps multi-line entries intact without a TS parse. */
function parsePages(src: string): DocsPage[] {
  const re = /pathname:\s*'(\/material-ui\/(react-[a-z0-9-]+))'/g
  const matches = [...src.matchAll(re)]
  const pages: DocsPage[] = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]!
    const start = match.index! + match[0].length
    const next = i + 1 < matches.length ? matches[i + 1]!.index! : src.length
    const close = src.indexOf("}", start)
    const window = src.slice(start, close === -1 ? next : Math.min(close, next))
    const title = window.match(/title:\s*'([^']+)'/)
    pages.push({
      key: match[2]!,
      pathname: match[1]!,
      title: title ? title[1]! : null,
    })
  }
  if (pages.length === 0) {
    throw new Error(
      "pages.ts: no /material-ui/react-* entries found — upstream nav reshaped",
    )
  }
  const seen = new Set<string>()
  for (const page of pages) {
    if (seen.has(page.key)) {
      throw new Error(`pages.ts: duplicate component page "${page.key}"`)
    }
    seen.add(page.key)
  }
  return pages
}

// ── demos ────────────────────────────────────────────────────────────────────
// Real published MUI at pinned CDN versions (esm.sh, React 18 + Emotion pinned
// through the same deps graph), never hand-imitated CSS. Roboto comes from
// @fontsource at a pinned version, as MUI's own default theme expects.
const REACT_VERSION = "18.3.1"
const MUI_VERSION = "6.4.7"
const EMOTION_VERSION = "11.14.0"
const EMOTION_DEPS = `@emotion/react@${EMOTION_VERSION},@emotion/styled@${EMOTION_VERSION}`
const ESM_DEPS = `react@${REACT_VERSION},react-dom@${REACT_VERSION},${EMOTION_DEPS}`
const EMOTION_REACT_URL = `https://esm.sh/@emotion/react@${EMOTION_VERSION}?deps=react@${REACT_VERSION}`
const EMOTION_CACHE_URL = `https://esm.sh/@emotion/cache@${EMOTION_VERSION}`

function muiImport(subpath: string): string {
  return `https://esm.sh/@mui/material@${MUI_VERSION}/${subpath}?deps=${ESM_DEPS}`
}

interface DemoSpec {
  /** Local name → @mui/material subpath, e.g. Button → "Button". */
  imports: Record<string, string>
  /** Body of the demo render, a `h(...)` children array as source text. */
  children: string
  height: number
}

/** MUI's own dark canvas: palette.background.default of the built-in dark
    palette (getDark() in @mui/material 6.4.7 styles/createPalette.js). Written
    into the stylesheet only so the page paints the right ground before the
    module runs; the module then re-applies the same value read off the live
    theme object, so the theme stays the source of truth. */
const DARK_BACKGROUND = "#121212"

/** Build a complete standalone demo document: white background, content
    centered in a horizontal flex row, MUI's own ThemeProvider/createTheme so
    the components paint with the published default theme.

    Dark mode follows the embedding page live. `applyMode(dark)` is the single
    switch — it stamps the document ground and re-renders the React root with
    MUI's real dark mechanism, createTheme({ palette: { mode: 'dark' } }) — and
    it is idempotent and symmetric: light restores the default theme and the
    light canvas. Resolution runs in an IIFE before first paint: an explicit
    `?mode=` in the URL is a standalone-testing override applied once with no
    observation; otherwise the demo reads the parent document's <html> class
    (same-origin embed only) and keeps a MutationObserver on it for the page
    lifetime, so toggling `dark` on the parent restyles the demo in place
    without reloading the frame. Cross-origin or top-level means no parent
    root: light, no observer. */
function buildDemo(spec: DemoSpec): { html: string; height: number } {
  const names = Object.keys(spec.imports).sort()
  const importMap = [
    `    "react": "https://esm.sh/react@${REACT_VERSION}"`,
    `    "react/jsx-runtime": "https://esm.sh/react@${REACT_VERSION}/jsx-runtime"`,
    `    "react-dom": "https://esm.sh/react-dom@${REACT_VERSION}?deps=react@${REACT_VERSION}"`,
    `    "react-dom/client": "https://esm.sh/react-dom@${REACT_VERSION}/client?deps=react@${REACT_VERSION}"`,
    ...names.map(
      (name) =>
        `    "@mui/material/${spec.imports[name]}": "${muiImport(spec.imports[name]!)}"`,
    ),
    `    "@mui/material/styles": "${muiImport("styles")}"`,
    `    "@emotion/react": "${EMOTION_REACT_URL}"`,
    `    "@emotion/cache": "${EMOTION_CACHE_URL}"`,
  ].join(",\n")
  const imports = names
    .map(
      (name) => `  import ${name} from "@mui/material/${spec.imports[name]}";`,
    )
    .join("\n")

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Material UI</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.2.5/400.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.2.5/500.css">
<style>
  html, body { margin: 0; padding: 0; background: #fff; }
  html[data-mode="dark"], html[data-mode="dark"] body { background: ${DARK_BACKGROUND}; }
  body {
    min-height: 100vh;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #root { display: flex; align-items: center; justify-content: center; }
  .row { display: flex; flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
<script>
  // Mode resolution, before first paint. applyMode(dark) is the one switch:
  // it stamps the document ground and — once the module below has loaded MUI —
  // re-renders the React root with the matching theme. Until then the latest
  // requested mode is buffered, so a toggle during load is never lost.
  window.__demoMode = (function () {
    var render = null;
    var current = null;
    function applyMode(dark) {
      current = !!dark;
      document.documentElement.dataset.mode = current ? "dark" : "light";
      if (render) render(current);
    }
    function setRenderer(fn) {
      render = fn;
      if (current !== null) fn(current);
    }
    var params = new URLSearchParams(location.search);
    if (params.has("mode")) {
      // Standalone-testing override: apply once, never observe.
      applyMode(params.get("mode") === "dark");
      return { applyMode: applyMode, setRenderer: setRenderer };
    }
    var root = null;
    try {
      if (window.parent !== window) {
        root = window.parent.document.documentElement;
      }
    } catch (err) {
      root = null; // cross-origin parent: unreadable
    }
    if (!root) {
      applyMode(false);
      return { applyMode: applyMode, setRenderer: setRenderer };
    }
    applyMode(root.classList.contains("dark"));
    // Held on window for the page lifetime, so it is never collected.
    window.__demoModeObserver = new MutationObserver(function () {
      applyMode(root.classList.contains("dark"));
    });
    window.__demoModeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return { applyMode: applyMode, setRenderer: setRenderer };
  })();
</script>
<script type="importmap">
{
  "imports": {
${importMap}
  }
}
</script>
</head>
<body>
<div id="root"></div>
<script type="module">
  import React from "react";
  import { createRoot } from "react-dom/client";
${imports}
  import { ThemeProvider, createTheme } from "@mui/material/styles";
  import { CacheProvider } from "@emotion/react";
  import createCache from "@emotion/cache";

  const h = React.createElement;
  const lightTheme = createTheme();
  const darkTheme = createTheme({ palette: { mode: "dark" } });

  // One Emotion cache per mode. Both palettes serialize MUI's Button to the
  // SAME generated class name, so with a single shared cache the rules inserted
  // by whichever mode rendered first win forever and re-theming silently does
  // nothing. Separate caches give each mode its own class prefix and its own
  // <style> container, so the two rule sets coexist and swapping the theme
  // actually swaps the painted styles — in both directions.
  const caches = {
    light: createCache({ key: "mui-light" }),
    dark: createCache({ key: "mui-dark" }),
  };

  function Demo({ mode, theme }) {
    return h(
      CacheProvider,
      { value: caches[mode] },
      h(
        ThemeProvider,
        { theme: theme },
        h("div", { className: "row" }, ${spec.children})
      )
    );
  }

  const reactRoot = createRoot(document.getElementById("root"));

  // The system mechanism, both directions: the live theme object is the source
  // of truth for the canvas, so light restores MUI's default background too.
  // \`key\` remounts the subtree, so nothing carries class names across modes.
  function render(dark) {
    const mode = dark ? "dark" : "light";
    const theme = dark ? darkTheme : lightTheme;
    const canvas = theme.palette.background.default;
    document.documentElement.style.background = canvas;
    document.body.style.background = canvas;
    document.body.style.color = theme.palette.text.primary;
    reactRoot.render(h(Demo, { key: mode, mode: mode, theme: theme }));
  }

  window.__demoMode.setRenderer(render);
</script>
</body>
</html>
`
  return { html, height: spec.height }
}

/** Demos by docs pathname key. Scoped to Button for now; adding a component is
    adding an entry here, not new machinery. */
const DEMOS: Record<string, DemoSpec> = {
  "react-button": {
    imports: { Button: "Button" },
    children: `[
        h(Button, { key: "a", variant: "contained", color: "primary" }, "Primary"),
        h(Button, { key: "b", variant: "outlined", color: "primary" }, "Secondary"),
        h(Button, { key: "c", variant: "contained", color: "primary", disabled: true }, "Disabled")
      ]`,
    height: 130,
  },
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  if (manifest.ref !== REF) {
    throw new Error(
      `snapshot ref ${manifest.ref} does not match the pinned REF ${REF} — re-run snapshot`,
    )
  }
  const src = fs.readFileSync(path.join(sourcesDir, PAGES_FILE), "utf8")
  const pages = parsePages(src)

  const unmapped = pages.filter((p) => !(p.key in CANONICAL)).map((p) => p.key)
  if (unmapped.length > 0) {
    throw new Error(
      `pages.ts: component pages missing from the canonical map: ${unmapped.join(", ")}`,
    )
  }
  const stale = Object.keys(CANONICAL).filter(
    (key) => !pages.some((p) => p.key === key),
  )
  if (stale.length > 0) {
    throw new Error(
      `canonical map has entries no longer documented upstream: ${stale.join(", ")}`,
    )
  }

  const components: SystemComponent[] = pages.map((page) => {
    const demo = DEMOS[page.key]
    return {
      component: CANONICAL[page.key]!,
      name: page.title ?? titleFromKey(page.key),
      docsUrl: `${DOCS_ORIGIN}${page.pathname}/`,
      demo: demo ? buildDemo(demo) : null,
      note: NOTES[page.key] ?? null,
    }
  })
  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  return {
    components,
    sources: [REPO, DOCS_URL],
    provenance: {
      method: "script",
      extractor: "scripts/systems/mui.ts",
      sources: [
        {
          kind: "repo",
          url: `${REPO}/blob/${REF}/docs/data/material/pages.ts`,
          ref: REF,
          retrievedAt: null,
          snapshot: "sources/mui",
        },
      ],
      notes:
        "Inventory is parsed from the docs navigation tree (docs/data/material/pages.ts) at a pinned SHA: every /material-ui/react-* entry becomes a component, with MUI’s own display title (explicit `title:` when the nav overrides the pathname-derived one) and the docs URL built from the pathname. Excluded by that rule: the icon gallery pages (/material-ui/icons, /material-ui/material-icons), the transitions page, and MUI X (/x/react-data-grid, date pickers, charts, tree view) which is a separate product linked outbound from the same nav — so date picker and data grid are absent from this inventory. Canonical taxonomy mapping is an explicit map in the extractor (editorial, not extracted); the extractor fails hard when upstream adds or removes a component page. Demos load real published @mui/material 6.4.7 from pinned esm.sh URLs with React 18.3.1 and Emotion 11.14.0; only Button has a demo so far. The manifest retrievedAt is not stamped into provenance because the git SHA pins the bytes.",
    },
  }
}

const config: SystemConfig = {
  slug: "mui",
  source: SOURCE,
  extractComponents,
}

export default config
