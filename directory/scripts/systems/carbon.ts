// IBM Carbon pipeline config — components axis only (no colors extractor yet).
//
// Inventory source: the public Carbon React Storybook's generated index.json.
// It is the machine-readable manifest Storybook builds from the component
// stories, so every documented component appears there with a stable story id
// that doubles as its docs URL. The demo's stylesheet comes from the pinned
// @carbon/styles CDN build, whose package.json is vendored alongside so the
// version in the demo markup is read from the snapshot, never typed here.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "carbon"
const STORYBOOK = "https://react.carbondesignsystem.com"
const STORYBOOK_INDEX = `${STORYBOOK}/index.json`
const DOCS = "https://carbondesignsystem.com"
const STYLES_PKG = "@carbon/styles"
const STYLES_VERSION = "1.114.0"
const STYLES_PKG_URL = `https://cdn.jsdelivr.net/npm/${STYLES_PKG}@${STYLES_VERSION}/package.json`
const STYLES_NPM_URL = "https://www.npmjs.com/package/@carbon/styles"

const INDEX_FILE = "storybook-index.json"
const STYLES_PKG_FILE = "carbon-styles-package.json"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: STORYBOOK,
  files: [
    { url: STORYBOOK_INDEX, as: INDEX_FILE },
    { url: STYLES_PKG_URL, as: STYLES_PKG_FILE },
  ],
}

// ── storybook index parsing ──────────────────────────────────────────────────
interface StoryEntry {
  id: string
  title: string
  name: string
  type: string
}

/** Top-level Storybook sections that hold shipped components. Everything else
    is excluded on purpose: `Preview/*` (unstable, not yet released),
    `Deprecated/*`, `Elements/*` (grid, type and icon foundations rather than
    components), and the `Hooks|Helpers|Utilities|Getting Started` sections. */
const COMPONENT_SECTIONS = new Set(["components", "layout"])

/** Storybook folders that group several real components under one title
    segment — the component name is then the segment after the group. */
const TITLE_GROUPS = new Set([
  "Fluid Components",
  "Notifications",
  "Skeleton",
  "UI Shell",
])

interface Grouped {
  /** Carbon's own component name, as the Storybook title spells it. */
  name: string
  /** Storybook group the story sits under, when it sits in one. */
  group: string | null
  entries: StoryEntry[]
}

function parseIndex(json: string): Grouped[] {
  const parsed = JSON.parse(json) as { entries: Record<string, StoryEntry> }
  if (!parsed.entries || typeof parsed.entries !== "object") {
    throw new Error(`${INDEX_FILE}: no "entries" map — index shape changed`)
  }
  const byName = new Map<string, Grouped>()
  for (const entry of Object.values(parsed.entries)) {
    const raw = entry.title.split("/")
    if (!COMPONENT_SECTIONS.has(raw[0]!.toLowerCase())) continue
    // "Feature Flag" / "Feature Flags" leaves are alternate stories of the same
    // component, never components of their own.
    const segments = raw.filter((s) => !s.startsWith("Feature Flag"))
    const grouped = segments.length > 2 && TITLE_GROUPS.has(segments[1]!)
    const name = grouped ? segments[2]! : segments[1]!
    if (!name) continue
    const bucket = byName.get(name) ?? {
      name,
      group: grouped ? segments[1]! : null,
      entries: [],
    }
    bucket.entries.push(entry)
    byName.set(name, bucket)
  }
  if (byName.size === 0) {
    throw new Error(`${INDEX_FILE}: no component stories found`)
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** The story that best documents a component: its autodocs "Overview" page,
    else any docs page, else its first story — ids sorted for determinism. */
function docsUrlFor(group: Grouped): string {
  const ranked = [...group.entries].sort((a, b) => {
    const rank = (e: StoryEntry) =>
      (e.type === "docs" ? 0 : 2) + (e.name === "Overview" ? 0 : 1)
    return rank(a) - rank(b) || a.id.localeCompare(b.id)
  })
  const best = ranked[0]!
  const kind = best.type === "docs" ? "docs" : "story"
  return `${STORYBOOK}/?path=/${kind}/${best.id}`
}

// ── canonical taxonomy mapping (data/components.json slugs) ──────────────────
// Explicit and exhaustive: a Carbon component with no cross-system equivalent
// maps to null rather than being force-fitted. Any name missing from this map
// makes extraction throw, so a new upstream component can't slip through
// unmapped.
const CANONICAL: Record<string, string | null> = {
  AILabel: null,
  AISkeleton: "skeleton",
  Accordion: "accordion",
  Actionable: "alert",
  AspectRatio: null,
  Breadcrumb: "breadcrumbs",
  Button: "button",
  Callout: "alert",
  Checkbox: "checkbox",
  ClassPrefix: null,
  CodeSnippet: null,
  ComboBox: "combobox",
  ComboButton: "button-group",
  ComposedModal: "dialog",
  ContainedList: "list",
  ContentSwitcher: "segmented-control",
  CopyButton: "button",
  DataTable: "table",
  DatePicker: "date-picker",
  DefinitionTooltip: "tooltip",
  Dropdown: "select",
  ErrorBoundary: null,
  FileUploader: "file-upload",
  FluidComboBox: "combobox",
  FluidDatePicker: "date-picker",
  FluidDropdown: "select",
  FluidForm: "form",
  FluidMultiSelect: "select",
  FluidNumberInput: "text-input",
  FluidPasswordInput: "text-input",
  FluidSearch: "search-input",
  FluidSelect: "select",
  FluidTextArea: "textarea",
  FluidTextInput: "text-input",
  FluidTimePicker: null,
  Form: "form",
  FormGroup: "form",
  FormLabel: "form",
  Header: "header",
  Heading: null,
  IconButton: "button",
  IdPrefix: null,
  Inline: "alert",
  InlineLoading: "loading",
  Layer: null,
  Link: "link",
  Loading: "loading",
  Menu: "dropdown-menu",
  MenuButton: "dropdown-menu",
  Modal: "dialog",
  MultiSelect: "select",
  NumberInput: "text-input",
  OrderedList: "list",
  OverflowMenu: "dropdown-menu",
  Pagination: "pagination",
  PaginationNav: "pagination",
  PasswordInput: "text-input",
  Popover: "popover",
  ProgressBar: "progress-bar",
  ProgressIndicator: "progress-steps",
  RadioButton: "radio",
  Search: "search-input",
  Section: null,
  Select: "select",
  SideNav: null,
  SkeletonIcon: "skeleton",
  SkeletonPlaceholder: "skeleton",
  SkeletonText: "skeleton",
  Slider: "slider",
  Stack: null,
  StructuredList: "list",
  Tabs: "tabs",
  Tag: "badge",
  TextArea: "textarea",
  TextInput: "text-input",
  Theme: null,
  Tile: "card",
  TimePicker: null,
  Toast: "toast",
  Toggle: "switch",
  Toggletip: "popover",
  Tooltip: "tooltip",
  TreeView: null,
  UnorderedList: "list",
}

// ── demos ────────────────────────────────────────────────────────────────────
/** Carbon ships its themes as "theme zone" classes in the one compiled
    stylesheet: `.cds--white` / `.cds--g10` / `.cds--g90` / `.cds--g100` each
    redeclare the whole `--cds-*` token set on the element they sit on. Dark
    mode is therefore a class swap on <body> — no extra stylesheet — and the
    page canvas reads `--cds-background` from that same zone (#fff in white,
    #161616 in g100), so the background is the system's own token rather than
    an invented colour. */
const LIGHT_ZONE = "cds--white"
const DARK_ZONE = "cds--g100"

/** Runs at the top of <body> (so document.body exists and the swap lands
    before first paint). `applyMode` is the whole mechanism in one idempotent
    function that switches both ways — it removes the opposite theme-zone class
    and adds the wanted one, so light restores Carbon's own white zone (and with
    it the `--cds-background` the page canvas reads).

    Resolution: an explicit `?mode=` in the URL wins and stops there (standalone
    testing). Otherwise the demo follows its embedder live — it reads the parent
    document's <html> class list, applies dark iff it carries `dark`, and keeps a
    MutationObserver on that element's `class` attribute for the page lifetime so
    later toggles restyle the iframe in place, with no reload. A cross-origin
    parent (or no parent at all) throws on access, which means no root to watch:
    the demo settles on light. */
const MODE_SCRIPT = `      <script>
        (function () {
          function applyMode(dark) {
            var body = document.body;
            body.classList.remove(dark ? "${LIGHT_ZONE}" : "${DARK_ZONE}");
            body.classList.add(dark ? "${DARK_ZONE}" : "${LIGHT_ZONE}");
          }
          var override = null;
          try {
            override = new URLSearchParams(location.search).get("mode");
          } catch (e) {}
          if (override) {
            applyMode(override === "dark");
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
          var sync = function () {
            applyMode(root.classList.contains("dark"));
          };
          sync();
          var observer = new MutationObserver(sync);
          observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
          });
          window.__cdsModeObserver = observer;
        })();
      </script>`

/** A complete standalone document loading Carbon's real published compiled
    stylesheet at the pinned version vendored in the snapshot, plus IBM Plex
    Sans (Carbon's typeface). Body sits in a Carbon theme zone, content centred
    in a flex row. */
function demoDocument(
  title: string,
  stylesVersion: string,
  body: string,
): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>IBM Carbon — ${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@carbon/styles@${stylesVersion}/css/styles.min.css"
    />
    <style>
      html,
      body {
        height: 100%;
      }
      body {
        margin: 0;
        padding: 16px;
        box-sizing: border-box;
        background: var(--cds-background, #fff);
        font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }
    </style>
  </head>
  <body class="${LIGHT_ZONE}">
${MODE_SCRIPT}
    <div class="row">
${body}
    </div>
  </body>
</html>
`
}

const BUTTON_BODY = `      <button
        type="button"
        class="cds--btn cds--btn--lg cds--layout--size-lg cds--btn--primary"
      >
        Primary
      </button>
      <button
        type="button"
        class="cds--btn cds--btn--lg cds--layout--size-lg cds--btn--secondary"
      >
        Secondary
      </button>
      <button
        type="button"
        disabled
        class="cds--btn cds--btn--lg cds--layout--size-lg cds--btn--primary cds--btn--disabled"
      >
        Disabled
      </button>`

/** Demo markup per Carbon component name. Only Button is covered so far; the
    rest of the inventory ships without a demo (`demo: null`). Carbon buttons
    are 48px tall at size lg, so the frame is taller than the 130px default. */
const DEMOS: Record<string, { body: string; height: number }> = {
  Button: { body: BUTTON_BODY, height: 180 },
}

/** Read the vendored @carbon/styles package.json so the demo's CDN version is
    snapshot-derived rather than typed into the emitted data. */
function readStylesVersion(sourcesDir: string): string {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(sourcesDir, STYLES_PKG_FILE), "utf8"),
  ) as { name?: string; version?: string }
  if (pkg.name !== STYLES_PKG || !pkg.version) {
    throw new Error(`${STYLES_PKG_FILE}: not a ${STYLES_PKG} package.json`)
  }
  return pkg.version
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const stylesVersion = readStylesVersion(sourcesDir)
  const groups = parseIndex(
    fs.readFileSync(path.join(sourcesDir, INDEX_FILE), "utf8"),
  )

  const unmapped = groups
    .map((g) => g.name)
    .filter((name) => !(name in CANONICAL))
  if (unmapped.length > 0) {
    throw new Error(
      `carbon: components missing from the canonical map: ${unmapped.join(", ")}`,
    )
  }

  const components: SystemComponent[] = groups.map((group) => {
    const demo = DEMOS[group.name]
    return {
      component: CANONICAL[group.name]!,
      name: group.name,
      docsUrl: docsUrlFor(group),
      demo: demo
        ? {
            html: demoDocument(group.name, stylesVersion, demo.body),
            height: demo.height,
          }
        : null,
      note: group.group
        ? `Documented under the “${group.group}” group in the Carbon React Storybook.`
        : null,
    }
  })

  const demoCount = components.filter((c) => c.demo).length
  console.error(
    `[carbon] components=${components.length} mapped=${components.filter((c) => c.component).length} demos=${demoCount}`,
  )

  return {
    components,
    sources: [DOCS, STORYBOOK, STORYBOOK_INDEX],
    provenance: {
      method: "script",
      extractor: "scripts/systems/carbon.ts",
      sources: [
        {
          kind: "live-site",
          url: STORYBOOK_INDEX,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
        {
          kind: "npm",
          url: STYLES_NPM_URL,
          ref: STYLES_VERSION,
          retrievedAt: null,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes:
        "Inventory comes from the Carbon React Storybook’s generated index.json (unversioned URL, so it is stamped live-site with the snapshot’s retrievedAt); component names and docs URLs are derived from its story titles and ids. Excluded on purpose: the Preview (unreleased), Deprecated, Elements (grid/type/icon foundations), Hooks, Helpers and Utilities sections. Feature-flag stories are folded into their component, and the Fluid Components / Notifications / Skeleton / UI Shell folders are unwrapped to their leaf components (the folder is recorded in each entry’s note). Canonical taxonomy mapping is an explicit table in the extractor. The Button demo loads the compiled @carbon/styles CSS from jsDelivr at a pinned version, read from the vendored package.json of that exact version — a pinned URL despite the live-site fetch; only Button has a demo so far. Dark mode swaps the body’s Carbon theme-zone class between cds--white and cds--g100 (both declared in that same compiled stylesheet), and the page canvas reads the zone’s own --cds-background token, so dark mode uses Carbon’s real g100 theme rather than any invented colour. The demo resolves its mode from its embedder: an explicit “mode” query parameter wins and is applied once (standalone testing), otherwise the page follows the parent document’s <html> class list live — dark iff it carries “dark” — via a MutationObserver on that element’s class attribute, so toggling the site theme restyles the iframe in place without reloading it; a cross-origin or absent parent falls back to light.",
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
