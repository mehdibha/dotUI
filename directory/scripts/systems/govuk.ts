// GOV.UK Design System — component inventory.
//
// Two snapshot files, both fetched as `live-site` because neither is a file in
// a git tree served by raw.githubusercontent.com:
//   - components-tree.json: the GitHub git-trees API listing of
//     packages/govuk-frontend/src/govuk/components/ at govuk-frontend v6.5.0.
//     Addressed by the directory's own tree SHA, so the URL is content-pinned
//     and immutable even though the snapshot kind is `live-site`.
//   - sitemap.xml: the published docs sitemap — the authoritative list of which
//     components the Design System actually documents (a superset/subset of the
//     source tree: `hint`, `label`, `input` exist only in code, `text-input`
//     only in docs).
//
// The inventory is the documented set (sitemap), because that is what the
// Design System publishes as "a component". Everything else — names, docs URLs,
// implementation paths — is derived from those two files.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SLUG = "govuk"
const REPO = "https://github.com/alphagov/govuk-frontend"
const DOCS = "https://design-system.service.gov.uk"
const COMPONENTS_DOCS = `${DOCS}/components/`
const VERSION = "6.5.0"

/** Tree SHA of packages/govuk-frontend/src/govuk/components at v6.5.0
    (commit fbf045a0d6013d7dd1e5d878d21027a239645324). Git tree SHAs are
    content hashes: this URL can never return different bytes. */
const COMPONENTS_TREE_SHA = "388325c279329ce22bc2308912c80f943efa5317"
const TREE_URL = `https://api.github.com/repos/alphagov/govuk-frontend/git/trees/${COMPONENTS_TREE_SHA}`
const SITEMAP_URL = `${DOCS}/sitemap.xml`
const SRC_DIR = "packages/govuk-frontend/src/govuk/components"

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: DOCS,
  files: [
    { url: TREE_URL, as: "components-tree.json" },
    { url: SITEMAP_URL, as: "sitemap.xml" },
  ],
}

// ── taxonomy mapping ────────────────────────────────────────────────────────
// Docs slug → canonical slug in data/components.json, or null where GOV.UK
// ships something with no cross-system equivalent (or a form-page pattern
// rather than a widget). Editorial, and deliberately explicit: an unmapped
// slug is a hard error so a new GOV.UK component can never land unclassified.
const CANONICAL: Record<string, string | null> = {
  accordion: "accordion",
  "back-link": "link",
  breadcrumbs: "breadcrumbs",
  button: "button",
  "character-count": null,
  checkboxes: "checkbox",
  "cookie-banner": null,
  "date-input": "date-picker",
  details: "accordion",
  "error-message": "form",
  "error-summary": "alert",
  "exit-this-page": null,
  feedback: null,
  fieldset: "form",
  "file-upload": "file-upload",
  footer: "footer",
  "generic-header": "header",
  header: "header",
  "inset-text": null,
  "language-navigation": null,
  "notification-banner": "alert",
  pagination: "pagination",
  panel: "card",
  "password-input": "text-input",
  "phase-banner": null,
  radios: "radio",
  select: "select",
  "service-navigation": "header",
  "skip-link": "link",
  "summary-list": "list",
  table: "table",
  tabs: "tabs",
  tag: "badge",
  "task-list": "list",
  "text-input": "text-input",
  textarea: "textarea",
  "warning-text": "alert",
}

/** Docs slug → source directory name, where govuk-frontend names the
    implementation differently from the documentation page. */
const SRC_DIR_OVERRIDES: Record<string, string> = {
  "text-input": "input",
}

/** Docs slugs whose title-cased form is not the name GOV.UK publishes. */
const NAME_OVERRIDES: Record<string, string> = {}

// ── demos ───────────────────────────────────────────────────────────────────
// A demo is a complete standalone document loading the real published
// govuk-frontend stylesheet at a pinned version — no hand-imitated styles.
// Only layout (centering, and undoing the block-level button's full-width /
// form-flow margin) is authored here.
const CSS_URL = `https://cdn.jsdelivr.net/npm/govuk-frontend@${VERSION}/dist/govuk/govuk-frontend.min.css`

function demoDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GOV.UK Design System — ${title}</title>
<!-- Real published govuk-frontend CSS, pinned to v${VERSION} -->
<link rel="stylesheet" href="${CSS_URL}">
<style>
  /* Layout only. No component styling: all appearance comes from govuk-frontend.min.css. */
  html { background: #fff; }
  body.govuk-template__body {
    min-height: 100vh;
    margin: 0;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }
  .demo-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
  /* govuk-frontend makes buttons full-width below its 40.0625em breakpoint and adds a
     bottom margin for form flow; neutralised here so the demo is a single tight row. */
  .demo-row .govuk-button { width: auto; margin: 0; }
</style>
</head>
<body class="govuk-template__body">
  <div class="demo-row">
${body}
  </div>
</body>
</html>
`
}

/** Docs slug → demo. Scoped to Button for now; the document builder above is
    shared so further components are a body string away. */
const DEMOS: Record<string, { html: string; height: number }> = {
  button: {
    html: demoDocument(
      "Buttons",
      `    <button type="submit" class="govuk-button" data-module="govuk-button">
      Save and continue
    </button>
    <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
      Secondary button
    </button>
    <button type="submit" disabled aria-disabled="true" class="govuk-button" data-module="govuk-button">
      Disabled button
    </button>`,
    ),
    // Long labels wrap the row to two or three lines at card width.
    height: 190,
  },
}

// ── parsing ─────────────────────────────────────────────────────────────────

interface TreeEntry {
  path: string
  type: string
}

/** Component directory names in the vendored git-tree listing. */
function readSourceDirs(sourcesDir: string): Set<string> {
  const raw = JSON.parse(
    fs.readFileSync(path.join(sourcesDir, "components-tree.json"), "utf8"),
  ) as { tree: TreeEntry[] }
  return new Set(raw.tree.filter((e) => e.type === "tree").map((e) => e.path))
}

/** Documented component slugs, from the docs sitemap. The bare
    /components/ index is not a component. */
function readDocumentedSlugs(sourcesDir: string): string[] {
  const xml = fs.readFileSync(path.join(sourcesDir, "sitemap.xml"), "utf8")
  const slugs = new Set<string>()
  for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const url = match[1]!
    const m = url.match(
      /^https:\/\/design-system\.service\.gov\.uk\/components\/([a-z0-9-]+)\/?$/,
    )
    if (m) slugs.add(m[1]!)
  }
  return [...slugs]
}

function titleCase(slug: string): string {
  const words = slug.split("-")
  return [
    words[0]!.charAt(0).toUpperCase() + words[0]!.slice(1),
    ...words.slice(1),
  ].join(" ")
}

// ── extract ─────────────────────────────────────────────────────────────────

function extractComponents(sourcesDir: string): ComponentsFile {
  const manifest = readManifest(sourcesDir)
  const sourceDirs = readSourceDirs(sourcesDir)
  const documented = readDocumentedSlugs(sourcesDir)

  const unmapped = documented.filter((slug) => !(slug in CANONICAL))
  if (unmapped.length > 0) {
    throw new Error(
      `[${SLUG}] documented component(s) missing from the canonical map: ${unmapped.sort().join(", ")}`,
    )
  }

  const components: SystemComponent[] = documented.map((slug) => {
    const name = NAME_OVERRIDES[slug] ?? titleCase(slug)
    const dir = SRC_DIR_OVERRIDES[slug] ?? slug
    const implemented = sourceDirs.has(dir)
    const demo = DEMOS[slug] ?? null
    return {
      component: CANONICAL[slug] ?? null,
      name,
      docsUrl: `${COMPONENTS_DOCS}${slug}/`,
      demo,
      note: implemented
        ? `Nunjucks/Sass source: ${SRC_DIR}/${dir}/ (govuk-frontend v${VERSION}).`
        : `Documented on the Design System site with no matching directory in ${SRC_DIR}/ at govuk-frontend v${VERSION}.`,
    }
  })

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  const orphanDirs = [...sourceDirs]
    .filter((dir) => !dir.startsWith("_") && !dir.startsWith("."))
    .filter(
      (dir) =>
        !documented.some((slug) => (SRC_DIR_OVERRIDES[slug] ?? slug) === dir),
    )
    .sort()

  return {
    components,
    sources: [DOCS, COMPONENTS_DOCS, REPO],
    provenance: {
      method: "script",
      extractor: "scripts/systems/govuk.ts",
      sources: [
        {
          kind: "live-site",
          url: TREE_URL,
          ref: COMPONENTS_TREE_SHA,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
        {
          kind: "live-site",
          url: SITEMAP_URL,
          ref: null,
          retrievedAt: manifest.retrievedAt,
          snapshot: `sources/${SLUG}`,
        },
      ],
      notes: [
        `Inventory = every component documented at ${COMPONENTS_DOCS}, read from the docs sitemap; docs URLs are the sitemap's own <loc> values.`,
        `Implementation notes come from the GitHub git-trees listing of ${SRC_DIR}/ at govuk-frontend v${VERSION} (commit fbf045a0d6013d7dd1e5d878d21027a239645324). The snapshot kind is live-site because the API is not a raw git file, but the URL is addressed by that directory's tree SHA (${COMPONENTS_TREE_SHA}) — a content hash, so it is version-pinned and immutable; only the sitemap can drift.`,
        "Component names are title-cased from the docs slug, not scraped from the page titles.",
        `Source directories with no documented page at this version: ${orphanDirs.join(", ") || "none"} — these are field building blocks reused inside other components rather than standalone documented components, so they are not inventory entries.`,
        "Canonical taxonomy mapping is editorial (declared in this config); GOV.UK-specific patterns with no cross-system equivalent map to null.",
        "Demos load the published govuk-frontend stylesheet from jsDelivr at a pinned version; only centering and the button width/margin reset are authored locally. Demo scope: Button.",
      ].join(" "),
    },
  }
}

const config: SystemConfig = {
  slug: SLUG,
  source: SOURCE,
  extractComponents,
}

export default config
