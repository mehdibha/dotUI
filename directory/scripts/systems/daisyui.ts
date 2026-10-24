// daisyUI pipeline config — components axis.
//
// daisyUI is a pure-CSS component layer for Tailwind: every component is a set
// of class names, so the whole inventory can be demoed live from one pinned
// stylesheet with no JavaScript runtime.
//
// Snapshot (live-site, three files):
//   - components-index.html — https://daisyui.com/components/ — the component
//     grid: one card per component carrying daisyUI's own display name and the
//     docs URL. This is the inventory.
//   - sitemap.xml — an independent inventory list; extraction asserts the two
//     agree exactly, so a component added or removed upstream fails loudly.
//   - daisyui.css — the published package at a PINNED version
//     (cdn.jsdelivr.net/npm/daisyui@<version>/daisyui.css). It is both the
//     demo asset and the cross-check: every class name a demo ships must exist
//     in it.
//
// Extraction is pure string work over those three files. Demo documents are
// built here in code (they are markup, not extracted values) and load only the
// pinned daisyUI stylesheet — no hand-written component CSS.
import fs from "node:fs"
import path from "node:path"

import type { ComponentsFile, SystemComponent } from "../../src/data/schema"
import { readManifest } from "../lib/snapshot"
import type { SystemConfig } from "../lib/system"

const SITE = "https://daisyui.com"
const COMPONENTS_INDEX = `${SITE}/components/`
const SITEMAP = `${SITE}/sitemap.xml`
const REPO = "https://github.com/saadeghi/daisyui"

/** Pinned daisyUI release the snapshot and every demo load. */
const VERSION = "5.7.22"
const CSS_URL = `https://cdn.jsdelivr.net/npm/daisyui@${VERSION}/daisyui.css`

// daisyUI ships no calendar of its own — it styles third-party calendars. The
// documented CDN recipe uses the Cally web component; pinned here too.
const CALLY_VERSION = "0.9.2"
const CALLY_URL = `https://cdn.jsdelivr.net/npm/cally@${CALLY_VERSION}/dist/cally.js`

const SOURCE: SystemConfig["source"] = {
  kind: "live-site",
  site: SITE,
  files: [
    { url: COMPONENTS_INDEX, as: "components-index.html" },
    { url: SITEMAP, as: "sitemap.xml" },
    { url: CSS_URL, as: "daisyui.css" },
  ],
}

// ── demo documents ───────────────────────────────────────────────────────────
/** Shared shell: white page, content centred in a horizontal flex row, styled
    only by the pinned daisyUI stylesheet. `themed` swaps the page background
    to daisyUI's own --color-base-100 (the theme-controller demo needs the page
    to react to the theme it switches).

    Dark mode: the mechanism is daisyUI's own — data-theme="dark" on <html>,
    the selector the pinned daisyui.css ships its [data-theme=dark]
    custom-property block under; the page canvas follows --color-base-100 from
    that same block. applyMode() writes it both ways: dark stamps
    data-theme="dark", light restores the document's own light state (the
    explicit data-theme="light", or no attribute at all for a themed demo, so
    the theme-controller demo falls back to its own default).

    Mode resolution runs in an IIFE before the stylesheet parses, so the theme
    is already correct at first paint:
      - `?mode=` in the URL wins and is applied once (standalone testing).
      - otherwise the demo observes its embedder: it mirrors the `dark` class
        on the parent document's <html> and keeps a MutationObserver on it for
        the page lifetime, so toggling the host theme restyles the live iframe
        without reloading it.
      - cross-origin parent, or no parent at all, means no root to read: light. */
function demoDoc(
  name: string,
  body: string,
  opts: { head?: string; themed?: boolean } = {},
): string {
  const background = opts.themed ? "var(--color-base-100)" : "#fff"
  const themeAttr = opts.themed ? "" : ' data-theme="light"'
  // The light state this document restores when it leaves dark: the same
  // attribute the markup ships with (none, for a themed demo).
  const lightTheme = opts.themed ? "null" : "'light'"
  return `<!doctype html>
<html lang="en"${themeAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>daisyUI — ${name}</title>
<script>
  // Runs before the stylesheet is parsed, so the theme is already stamped on
  // the first paint.
  (function () {
    var LIGHT_THEME = ${lightTheme}
    var root = document.documentElement
    // daisyUI's own dark mechanism, idempotent and reversible.
    function applyMode(dark) {
      if (dark) root.setAttribute('data-theme', 'dark')
      else if (LIGHT_THEME) root.setAttribute('data-theme', LIGHT_THEME)
      else root.removeAttribute('data-theme')
    }
    // Standalone override: ?mode= wins outright, no observation.
    var param = new URLSearchParams(location.search).get('mode')
    if (param) {
      applyMode(param === 'dark')
      return
    }
    // Otherwise follow the embedder's <html class="dark">.
    var host = null
    try {
      if (window.parent !== window) host = window.parent.document.documentElement
    } catch (e) {
      host = null
    }
    if (!host) {
      applyMode(false)
      return
    }
    var sync = function () { applyMode(host.classList.contains('dark')) }
    sync()
    var observer = new MutationObserver(sync)
    observer.observe(host, { attributes: true, attributeFilter: ['class'] })
    // Held for the page lifetime so it is never collected.
    window.__daisyuiModeObserver = observer
  })()
</script>
<!-- Declared before the stylesheet so this layer sits BELOW every daisyUI
     layer: the reset must never win against a daisyUI rule. -->
<style>@layer demo-reset;</style>
<link rel="stylesheet" href="${CSS_URL}">${opts.head ? `\n${opts.head}` : ""}
<style>
@layer demo-reset {
  /* The browser-default reset daisyUI assumes (Tailwind Preflight, trimmed).
     Nothing here styles a component — daisyUI's own rules always win. */
  *, *::before, *::after { box-sizing: border-box; }
  h1, h2, h3, h4, h5, h6, p, figure, pre, fieldset, ol, ul, dl { margin: 0; }
  ol, ul, menu { list-style: none; padding: 0; }
  button, input, select, textarea { font: inherit; color: inherit; }
  img, video { display: block; max-width: 100%; }
}
  html, body { height: 100%; }
  body {
    margin: 0;
    padding: 16px;
    background: ${background};
    color: var(--color-base-content);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Dark canvas comes from daisyUI's own [data-theme=dark] --color-base-100;
     inert unless the mode script stamped the attribute. */
  html[data-theme="dark"] body { background: var(--color-base-100); }
  .demo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px;
    max-width: 100%;
  }
</style>
</head>
<body>
  <div class="demo-row">
${body}
  </div>
</body>
</html>
`
}

// ── the inventory map ────────────────────────────────────────────────────────
/** One documented daisyUI component: how it maps onto the canonical taxonomy,
    and the markup its demo renders. `component: null` means daisyUI ships it
    but the taxonomy has no cross-system equivalent (yet). */
interface ComponentSpec {
  component: string | null
  /** Markup placed inside the centred flex row; null when no demo is shipped. */
  demo: string | null
  height?: number
  head?: string
  themed?: boolean
  note?: string
}

const COL = "display:flex;flex-direction:column"

const SPECS: Record<string, ComponentSpec> = {
  accordion: {
    component: "accordion",
    height: 210,
    demo: `    <div style="width:22rem">
      <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="daisy-accordion" checked>
        <div class="collapse-title">How do I create an account?</div>
        <div class="collapse-content"><p>Press the sign-up button in the top right corner.</p></div>
      </div>
      <div class="collapse collapse-arrow bg-base-200" style="margin-top:.5rem">
        <input type="radio" name="daisy-accordion">
        <div class="collapse-title">I forgot my password.</div>
        <div class="collapse-content"><p>Use the reset link on the login page.</p></div>
      </div>
    </div>`,
    note: "Built from the Collapse component plus grouped radio inputs — only one item can stay open.",
  },
  alert: {
    component: "alert",
    height: 200,
    demo: `    <div style="width:24rem;${COL};gap:.5rem">
      <div role="alert" class="alert alert-info">New software update available.</div>
      <div role="alert" class="alert alert-success">Your purchase has been confirmed.</div>
      <div role="alert" class="alert alert-warning alert-soft">Your subscription expires soon.</div>
    </div>`,
  },
  aura: {
    component: null,
    height: 170,
    demo: `    <div class="aura aura-rainbow"><button class="btn btn-primary">Rainbow aura</button></div>
    <div class="aura aura-gold"><button class="btn">Gold aura</button></div>`,
    note: "daisyUI-specific: an animated border-light effect that wraps any element.",
  },
  avatar: {
    component: "avatar",
    height: 150,
    demo: `    <div class="avatar avatar-placeholder">
      <div class="bg-neutral text-neutral-content mask mask-squircle" style="width:3.5rem"><span>DS</span></div>
    </div>
    <div class="avatar avatar-online avatar-placeholder">
      <div class="bg-primary text-primary-content" style="width:3.5rem;border-radius:9999px"><span>ON</span></div>
    </div>
    <div class="avatar avatar-offline avatar-placeholder">
      <div class="bg-base-300" style="width:3.5rem;border-radius:9999px"><span>AB</span></div>
    </div>`,
  },
  badge: {
    component: "badge",
    demo: `    <span class="badge badge-primary">Primary</span>
    <span class="badge badge-secondary badge-soft">Soft</span>
    <span class="badge badge-outline">Outline</span>
    <span class="badge badge-success badge-sm">Small</span>`,
  },
  breadcrumbs: {
    component: "breadcrumbs",
    demo: `    <div class="breadcrumbs" style="font-size:.875rem">
      <ul>
        <li><a>Home</a></li>
        <li><a>Documents</a></li>
        <li>Add document</li>
      </ul>
    </div>`,
  },
  button: {
    component: "button",
    demo: `    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary btn-soft">Soft</button>
    <button type="button" class="btn btn-outline">Outline</button>
    <button type="button" class="btn btn-primary" disabled>Disabled</button>`,
  },
  calendar: {
    component: "calendar",
    height: 300,
    head: `<script type="module" src="${CALLY_URL}"></script>`,
    demo: `    <calendar-date class="cally bg-base-100 rounded-box">
      <svg aria-label="Previous" slot="previous" style="width:1rem;height:1rem;fill:currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
      <svg aria-label="Next" slot="next" style="width:1rem;height:1rem;fill:currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      <calendar-month></calendar-month>
    </calendar-date>`,
    note: `daisyUI ships no calendar of its own — the .cally/.pika-*/.rdp-* classes theme third-party calendars. The demo loads the Cally web component (pinned ${CALLY_VERSION}), which is the recipe daisyUI documents.`,
  },
  card: {
    component: "card",
    height: 250,
    demo: `    <div class="card bg-base-200" style="width:20rem">
      <div class="card-body">
        <h2 class="card-title">Card title</h2>
        <p>A bounded container that groups the content and actions of one item.</p>
        <div class="card-actions" style="justify-content:flex-end">
          <button class="btn btn-primary btn-sm">Buy now</button>
        </div>
      </div>
    </div>`,
  },
  carousel: {
    component: "carousel",
    height: 200,
    demo: `    <div class="carousel rounded-box" style="width:20rem;height:8rem">
      <div class="carousel-item" style="width:100%">
        <div class="bg-primary text-primary-content" style="width:100%;display:grid;place-items:center;font-size:1.25rem">Slide 1</div>
      </div>
      <div class="carousel-item" style="width:100%">
        <div class="bg-secondary text-secondary-content" style="width:100%;display:grid;place-items:center;font-size:1.25rem">Slide 2</div>
      </div>
      <div class="carousel-item" style="width:100%">
        <div class="bg-accent text-accent-content" style="width:100%;display:grid;place-items:center;font-size:1.25rem">Slide 3</div>
      </div>
    </div>`,
  },
  chat: {
    component: null,
    height: 200,
    demo: `    <div style="width:22rem">
      <div class="chat chat-start">
        <div class="chat-header">Obi-Wan</div>
        <div class="chat-bubble">You were the chosen one!</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-header">Anakin</div>
        <div class="chat-bubble chat-bubble-primary">I hate you!</div>
      </div>
    </div>`,
    note: "daisyUI-specific: a conversation bubble with header, footer and avatar slots.",
  },
  checkbox: {
    component: "checkbox",
    demo: `    <input type="checkbox" class="checkbox" checked>
    <input type="checkbox" class="checkbox checkbox-primary" checked>
    <input type="checkbox" class="checkbox checkbox-secondary">
    <input type="checkbox" class="checkbox" disabled checked>`,
  },
  collapse: {
    component: null,
    height: 180,
    demo: `    <div class="collapse collapse-plus bg-base-200" style="width:22rem">
      <input type="checkbox" checked>
      <div class="collapse-title">Click to toggle this panel</div>
      <div class="collapse-content"><p>The content is revealed by a checkbox — no JavaScript.</p></div>
    </div>`,
    note: "The single-panel disclosure primitive; the taxonomy entry is mapped by daisyUI’s Accordion, which groups these with radio inputs.",
  },
  countdown: {
    component: null,
    height: 140,
    demo: `    <span class="countdown" style="font-size:2.5rem;font-variant-numeric:tabular-nums">
      <span style="--value:10;" aria-live="polite" aria-label="10">10</span>
    </span>
    <span style="font-size:2.5rem">:</span>
    <span class="countdown" style="font-size:2.5rem;font-variant-numeric:tabular-nums">
      <span style="--value:24;" aria-live="polite" aria-label="24">24</span>
    </span>
    <span style="font-size:2.5rem">:</span>
    <span class="countdown" style="font-size:2.5rem;font-variant-numeric:tabular-nums">
      <span style="--value:59;" aria-live="polite" aria-label="59">59</span>
    </span>`,
    note: "daisyUI-specific: a CSS transition between numbers 0–999, driven by the --value custom property.",
  },
  diff: {
    component: null,
    height: 220,
    demo: `    <figure class="diff rounded-box" style="width:20rem;aspect-ratio:16/9" tabindex="0">
      <div class="diff-item-1" role="img">
        <div class="bg-primary text-primary-content" style="width:100%;display:grid;place-content:center;font-size:2rem;font-weight:700">daisyUI</div>
      </div>
      <div class="diff-item-2" role="img">
        <div class="bg-neutral text-neutral-content" style="width:100%;display:grid;place-content:center;font-size:2rem;font-weight:700">daisyUI</div>
      </div>
      <div class="diff-resizer"></div>
    </figure>`,
    note: "daisyUI-specific: a draggable side-by-side comparison of two layers.",
  },
  divider: {
    component: "divider",
    height: 180,
    demo: `    <div style="width:18rem">
      <div class="divider">OR</div>
      <div class="divider divider-primary">Primary</div>
      <div class="divider"></div>
    </div>`,
  },
  dock: {
    component: null,
    height: 110,
    demo: `    <div class="dock">
      <button class="dock-active"><span class="dock-label">Home</span></button>
      <button><span class="dock-label">Inbox</span></button>
      <button><span class="dock-label">Settings</span></button>
    </div>`,
    note: "daisyUI-specific: the bottom navigation bar; it pins to the bottom of the viewport (here, the demo frame).",
  },
  drawer: {
    component: "drawer",
    height: 300,
    demo: `    <div class="drawer drawer-open bg-base-200 rounded-box" style="width:26rem;height:15rem;overflow:hidden">
      <input id="daisy-drawer" type="checkbox" class="drawer-toggle">
      <div class="drawer-content" style="display:grid;place-items:center">Page content</div>
      <div class="drawer-side">
        <ul class="menu bg-base-300" style="width:11rem;height:100%">
          <li><a>Sidebar item 1</a></li>
          <li><a>Sidebar item 2</a></li>
        </ul>
      </div>
    </div>`,
  },
  dropdown: {
    component: "dropdown-menu",
    height: 260,
    demo: `    <div class="dropdown dropdown-open">
      <div tabindex="0" role="button" class="btn">Open menu</div>
      <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box" style="width:12rem;padding:.5rem;z-index:1;box-shadow:0 8px 24px rgb(0 0 0 / .15)">
        <li><a>Profile</a></li>
        <li><a>Settings</a></li>
        <li><a>Log out</a></li>
      </ul>
    </div>`,
  },
  fab: {
    component: null,
    height: 130,
    demo: `    <div class="fab">
      <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-primary">F</div>
      <button class="btn btn-lg btn-circle">A</button>
      <button class="btn btn-lg btn-circle">B</button>
    </div>`,
    note: "daisyUI-specific: a floating action button with speed-dial actions; it pins to the bottom corner of the viewport (here, the demo frame) and opens on focus.",
  },
  fieldset: {
    component: "form",
    height: 280,
    demo: `    <fieldset class="fieldset bg-base-200 rounded-box" style="width:20rem;padding:1rem">
      <legend class="fieldset-legend">Page details</legend>
      <label class="label">Title</label>
      <input type="text" class="input" placeholder="My awesome page" style="width:100%">
      <label class="label">Slug</label>
      <input type="text" class="input" placeholder="my-awesome-page" style="width:100%">
      <p class="fieldset-label">You can change the slug later.</p>
    </fieldset>`,
    note: "daisyUI’s form-assembly container: legend, labels, fields and help text in one block.",
  },
  "file-input": {
    component: "file-upload",
    height: 150,
    demo: `    <div style="${COL};gap:.75rem">
      <input type="file" class="file-input" style="width:18rem">
      <input type="file" class="file-input file-input-primary file-input-sm" style="width:18rem">
    </div>`,
  },
  filter: {
    component: null,
    height: 140,
    demo: `    <form class="filter">
      <input class="btn btn-square" type="reset" value="×">
      <input class="btn" type="radio" name="daisy-filter" aria-label="Svelte">
      <input class="btn" type="radio" name="daisy-filter" aria-label="Vue">
      <input class="btn" type="radio" name="daisy-filter" aria-label="React">
    </form>`,
    note: "daisyUI-specific: a radio group that hides the unchosen options and reveals a reset button.",
  },
  footer: {
    component: "footer",
    height: 220,
    demo: `    <footer class="footer footer-horizontal bg-base-200 text-base-content rounded-box" style="width:26rem;padding:1.5rem">
      <nav>
        <h6 class="footer-title">Services</h6>
        <a class="link link-hover">Branding</a>
        <a class="link link-hover">Design</a>
      </nav>
      <nav>
        <h6 class="footer-title">Company</h6>
        <a class="link link-hover">About us</a>
        <a class="link link-hover">Contact</a>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <a class="link link-hover">Terms of use</a>
        <a class="link link-hover">Privacy policy</a>
      </nav>
    </footer>`,
  },
  hero: {
    component: null,
    height: 250,
    demo: `    <div class="hero bg-base-200 rounded-box" style="width:26rem;padding:2rem">
      <div class="hero-content" style="text-align:center">
        <div style="max-width:20rem">
          <h1 style="font-size:1.5rem;font-weight:700">Hello there</h1>
          <p style="padding:.75rem 0">A full-width block for a headline, a short pitch and one call to action.</p>
          <button class="btn btn-primary">Get started</button>
        </div>
      </div>
    </div>`,
    note: "daisyUI-specific: the page-opening banner layout (content, overlay and background image slots).",
  },
  "hover-3d": {
    component: null,
    height: 240,
    demo: `    <div class="hover-3d" style="width:14rem">
      <div class="card bg-base-200 rounded-box" style="padding:2rem;text-align:center">Hover me for the tilt</div>
      <div></div><div></div><div></div><div></div>
      <div></div><div></div><div></div><div></div>
    </div>`,
    note: "daisyUI-specific: a CSS-only 3D tilt on hover; the eight empty divs are the hover quadrants the effect needs.",
  },
  "hover-gallery": {
    component: null,
    height: 220,
    demo: `    <figure class="hover-gallery rounded-box" style="width:16rem">
      <div class="bg-primary text-primary-content" style="height:9rem;display:flex;align-items:center;justify-content:center;font-size:1.25rem">Image 1</div>
      <div class="bg-secondary text-secondary-content" style="height:9rem;display:flex;align-items:center;justify-content:center;font-size:1.25rem">Image 2</div>
      <div class="bg-accent text-accent-content" style="height:9rem;display:flex;align-items:center;justify-content:center;font-size:1.25rem">Image 3</div>
      <div class="bg-neutral text-neutral-content" style="height:9rem;display:flex;align-items:center;justify-content:center;font-size:1.25rem">Image 4</div>
    </figure>`,
    note: "daisyUI-specific: hovering across the container swaps between up to ten stacked images.",
  },
  indicator: {
    component: null,
    height: 160,
    demo: `    <div class="indicator">
      <span class="indicator-item badge badge-primary">99+</span>
      <button class="btn">Inbox</button>
    </div>
    <div class="indicator">
      <span class="indicator-item indicator-bottom indicator-start badge badge-secondary">new</span>
      <div class="bg-base-200 rounded-box" style="width:7rem;height:3.5rem"></div>
    </div>`,
    note: "daisyUI-specific: a positioner that pins any element to a corner or edge of another.",
  },
  input: {
    component: "text-input",
    height: 150,
    demo: `    <div style="${COL};gap:.75rem">
      <input type="text" class="input" placeholder="Type here" style="width:16rem">
      <input type="text" class="input input-primary" placeholder="Primary" style="width:16rem">
      <input type="text" class="input" placeholder="Disabled" style="width:16rem" disabled>
    </div>`,
  },
  join: {
    component: "button-group",
    demo: `    <div class="join">
      <button class="btn join-item">Prev</button>
      <button class="btn join-item btn-active">1</button>
      <button class="btn join-item">Next</button>
    </div>
    <div class="join">
      <input class="input join-item" placeholder="Search" style="width:9rem">
      <button class="btn btn-primary join-item">Go</button>
    </div>`,
    note: "daisyUI’s generic grouping container — it rounds the outer corners of any run of buttons or inputs.",
  },
  kbd: {
    component: "kbd",
    demo: `    <kbd class="kbd">ctrl</kbd>
    <kbd class="kbd">shift</kbd>
    <kbd class="kbd">K</kbd>
    <kbd class="kbd kbd-sm">esc</kbd>
    <kbd class="kbd kbd-lg">enter</kbd>`,
  },
  label: {
    component: null,
    height: 150,
    demo: `    <div style="${COL};gap:.75rem">
      <label class="input" style="width:16rem"><span class="label">https://</span><input type="text" placeholder="URL"></label>
      <label class="input" style="width:16rem"><input type="text" placeholder="Price"><span class="label">USD</span></label>
    </div>`,
    note: "daisyUI-specific: the prefix/suffix chip a form control carries inside its own box.",
  },
  link: {
    component: "link",
    demo: `    <a class="link">A plain link</a>
    <a class="link link-primary">Primary</a>
    <a class="link link-secondary">Secondary</a>
    <a class="link link-hover">Underline on hover</a>`,
  },
  list: {
    component: "list",
    height: 210,
    demo: `    <ul class="list bg-base-200 rounded-box" style="width:22rem">
      <li class="list-row">
        <div class="bg-primary text-primary-content" style="width:2.5rem;height:2.5rem;border-radius:9999px;display:grid;place-items:center">DL</div>
        <div><div>Dio Lupa</div><div style="font-size:.75rem;opacity:.6">Remaining Reason</div></div>
        <button class="btn btn-square btn-ghost">▶</button>
      </li>
      <li class="list-row">
        <div class="bg-secondary text-secondary-content" style="width:2.5rem;height:2.5rem;border-radius:9999px;display:grid;place-items:center">EB</div>
        <div><div>Ellie Beilish</div><div style="font-size:.75rem;opacity:.6">Bears of a fever</div></div>
        <button class="btn btn-square btn-ghost">▶</button>
      </li>
    </ul>`,
  },
  loading: {
    component: "loading",
    demo: `    <span class="loading loading-spinner loading-lg"></span>
    <span class="loading loading-dots loading-lg text-primary"></span>
    <span class="loading loading-ring loading-lg text-secondary"></span>
    <span class="loading loading-bars loading-lg"></span>`,
  },
  mask: {
    component: null,
    height: 160,
    demo: `    <div class="mask mask-star-2 bg-primary" style="width:4rem;height:4rem"></div>
    <div class="mask mask-heart bg-secondary" style="width:4rem;height:4rem"></div>
    <div class="mask mask-hexagon bg-accent" style="width:4rem;height:4rem"></div>
    <div class="mask mask-squircle bg-neutral" style="width:4rem;height:4rem"></div>`,
    note: "daisyUI-specific: a set of clip-path shapes that crop any element.",
  },
  megamenu: {
    component: null,
    height: 170,
    demo: `    <div class="megamenu bg-base-200 rounded-box" style="padding:.25rem" id="daisy-megamenu" popover>
      <span class="megamenu-active"></span>
      <button popovertarget="daisy-mm-1">Services</button>
      <div id="daisy-mm-1" popover>
        <ul class="menu"><li><a>Enterprise</a></li><li><a>CRM software</a></li></ul>
      </div>
      <button popovertarget="daisy-mm-2">AI</button>
      <div id="daisy-mm-2" popover>
        <ul class="menu"><li><a>AI infrastructure</a></li><li><a>MCP servers</a></li></ul>
      </div>
      <button popovertarget="daisy-mm-3">Cloud</button>
      <div id="daisy-mm-3" popover>
        <ul class="menu"><li><a>Cloud computing</a></li><li><a>Storage</a></li></ul>
      </div>
    </div>`,
    note: "daisyUI-specific: a top-level navigation bar whose items open wide popovers, built on the native popover API and CSS anchor positioning.",
  },
  menu: {
    component: null,
    height: 230,
    demo: `    <ul class="menu bg-base-200 rounded-box" style="width:14rem">
      <li class="menu-title">Workspace</li>
      <li><a class="menu-active">Dashboard</a></li>
      <li><a>Projects</a></li>
      <li><a class="menu-disabled">Archived</a></li>
    </ul>
    <ul class="menu menu-horizontal bg-base-200 rounded-box">
      <li><a>Home</a></li>
      <li><a>Docs</a></li>
      <li><a>Blog</a></li>
    </ul>`,
    note: "daisyUI’s navigation list (vertical or horizontal, with titles, submenus and active/disabled states) — the surface a Dropdown or Drawer usually holds.",
  },
  "mockup-browser": {
    component: null,
    height: 230,
    demo: `    <div class="mockup-browser bg-base-200" style="width:24rem">
      <div class="mockup-browser-toolbar"><div class="input">https://daisyui.com</div></div>
      <div class="bg-base-100" style="display:grid;place-content:center;padding:2rem">Hello!</div>
    </div>`,
    note: "daisyUI-specific: a decorative browser-window frame for screenshots.",
  },
  "mockup-code": {
    component: null,
    height: 200,
    demo: `    <div class="mockup-code" style="width:24rem">
      <pre data-prefix="$"><code>npm i daisyui</code></pre>
      <pre data-prefix=">" class="text-warning"><code>installing...</code></pre>
      <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
    </div>`,
    note: "daisyUI-specific: a decorative code-editor frame with line prefixes.",
  },
  "mockup-phone": {
    component: null,
    height: 300,
    demo: `    <div class="mockup-phone" style="width:8.5rem">
      <div class="mockup-phone-camera"></div>
      <div class="mockup-phone-display bg-base-200" style="display:grid;place-content:center">Hi.</div>
    </div>`,
    note: "daisyUI-specific: a decorative phone frame for screenshots.",
  },
  "mockup-window": {
    component: null,
    height: 200,
    demo: `    <div class="mockup-window bg-base-200" style="width:22rem">
      <div class="bg-base-100" style="display:grid;place-content:center;padding:2rem">Hello!</div>
    </div>`,
    note: "daisyUI-specific: a decorative OS-window frame for screenshots.",
  },
  modal: {
    component: "dialog",
    height: 300,
    demo: `    <div class="modal modal-open" role="dialog">
      <div class="modal-box">
        <h3 style="font-size:1.125rem;font-weight:700">Congratulations!</h3>
        <p style="padding:.75rem 0">You have been selected for a chance to win a prize.</p>
        <div class="modal-action">
          <button class="btn">Close</button>
          <button class="btn btn-primary">Claim</button>
        </div>
      </div>
    </div>`,
    note: "Shown with the modal-open class so the dialog and its backdrop render statically.",
  },
  navbar: {
    component: "header",
    height: 160,
    demo: `    <div class="navbar bg-base-200 rounded-box" style="width:26rem">
      <div class="navbar-start"><a class="btn btn-ghost" style="font-size:1.25rem">daisyUI</a></div>
      <div class="navbar-center">
        <ul class="menu menu-horizontal"><li><a>Docs</a></li><li><a>Themes</a></li></ul>
      </div>
      <div class="navbar-end"><button class="btn btn-primary btn-sm">Sign up</button></div>
    </div>`,
  },
  otp: {
    component: null,
    height: 160,
    demo: `    <label class="otp">
      <span></span><span></span><span></span><span></span>
      <input type="text" autocomplete="one-time-code" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" value="1234" required>
    </label>
    <label class="otp otp-primary otp-sm">
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <input type="text" autocomplete="one-time-code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required>
    </label>`,
    note: "daisyUI-specific: a one-time-code field — one real input painted as separate character cells.",
  },
  pagination: {
    component: "pagination",
    height: 180,
    demo: `    <div style="${COL};gap:.75rem;align-items:center">
      <div class="join">
        <button class="join-item btn">«</button>
        <button class="join-item btn">Page 2</button>
        <button class="join-item btn">»</button>
      </div>
      <div class="join">
        <button class="join-item btn btn-sm">1</button>
        <button class="join-item btn btn-sm btn-active">2</button>
        <button class="join-item btn btn-sm">3</button>
        <button class="join-item btn btn-sm">4</button>
      </div>
    </div>`,
    note: "Not a class of its own: daisyUI documents pagination as buttons inside a Join container.",
  },
  progress: {
    component: "progress-bar",
    height: 170,
    demo: `    <div style="${COL};gap:.75rem">
      <progress class="progress" value="40" max="100" style="width:16rem"></progress>
      <progress class="progress progress-primary" value="70" max="100" style="width:16rem"></progress>
      <progress class="progress progress-success" value="100" max="100" style="width:16rem"></progress>
    </div>`,
  },
  "radial-progress": {
    component: null,
    height: 170,
    demo: `    <div class="radial-progress" style="--value:30;" role="progressbar" aria-valuenow="30">30%</div>
    <div class="radial-progress text-primary" style="--value:70;" role="progressbar" aria-valuenow="70">70%</div>
    <div class="radial-progress bg-primary text-primary-content" style="--value:100;" role="progressbar" aria-valuenow="100">100%</div>`,
    note: "The circular counterpart of Progress; the taxonomy’s progress-bar entry is mapped by daisyUI’s linear Progress.",
  },
  radio: {
    component: "radio",
    demo: `    <input type="radio" name="daisy-radio" class="radio" checked>
    <input type="radio" name="daisy-radio" class="radio radio-primary">
    <input type="radio" name="daisy-radio" class="radio radio-secondary">
    <input type="radio" name="daisy-radio-2" class="radio" disabled checked>`,
  },
  range: {
    component: "slider",
    height: 170,
    demo: `    <div style="${COL};gap:1rem">
      <input type="range" min="0" max="100" value="40" class="range" style="width:16rem">
      <input type="range" min="0" max="100" value="70" class="range range-primary range-sm" style="width:16rem">
      <input type="range" min="0" max="100" value="20" class="range range-success range-xs" style="width:16rem">
    </div>`,
  },
  rating: {
    component: "rating",
    height: 150,
    demo: `    <div class="rating">
      <input type="radio" name="daisy-rating" class="mask mask-star-2 bg-warning" aria-label="1 star">
      <input type="radio" name="daisy-rating" class="mask mask-star-2 bg-warning" aria-label="2 star">
      <input type="radio" name="daisy-rating" class="mask mask-star-2 bg-warning" aria-label="3 star" checked>
      <input type="radio" name="daisy-rating" class="mask mask-star-2 bg-warning" aria-label="4 star">
      <input type="radio" name="daisy-rating" class="mask mask-star-2 bg-warning" aria-label="5 star">
    </div>
    <div class="rating rating-sm">
      <input type="radio" name="daisy-rating-2" class="mask mask-heart bg-error" aria-label="1 heart">
      <input type="radio" name="daisy-rating-2" class="mask mask-heart bg-error" aria-label="2 heart" checked>
      <input type="radio" name="daisy-rating-2" class="mask mask-heart bg-error" aria-label="3 heart">
    </div>`,
  },
  select: {
    component: "select",
    height: 150,
    demo: `    <div style="${COL};gap:.75rem">
      <select class="select" style="width:14rem">
        <option disabled selected>Pick a colour</option>
        <option>Crimson</option>
        <option>Amber</option>
      </select>
      <select class="select select-primary" style="width:14rem">
        <option selected>Primary</option>
        <option>Another option</option>
      </select>
    </div>`,
  },
  skeleton: {
    component: "skeleton",
    height: 170,
    demo: `    <div style="display:flex;gap:1rem;align-items:center;width:20rem">
      <div class="skeleton" style="width:4rem;height:4rem;border-radius:9999px;flex-shrink:0"></div>
      <div style="${COL};gap:.5rem;flex:1">
        <div class="skeleton" style="height:1rem;width:100%"></div>
        <div class="skeleton" style="height:1rem;width:80%"></div>
        <div class="skeleton" style="height:1rem;width:60%"></div>
      </div>
    </div>`,
  },
  stack: {
    component: null,
    height: 190,
    demo: `    <div class="stack" style="width:12rem;height:6rem">
      <div class="card bg-primary text-primary-content" style="display:grid;place-content:center">A</div>
      <div class="card bg-secondary text-secondary-content" style="display:grid;place-content:center">B</div>
      <div class="card bg-accent text-accent-content" style="display:grid;place-content:center">C</div>
    </div>`,
    note: "daisyUI-specific: a layout that piles elements on top of each other, offset like a deck of cards.",
  },
  stat: {
    component: null,
    height: 190,
    demo: `    <div class="stats bg-base-200">
      <div class="stat">
        <div class="stat-title">Downloads</div>
        <div class="stat-value">31K</div>
        <div class="stat-desc">Jan 1st – Feb 1st</div>
      </div>
      <div class="stat">
        <div class="stat-title">New users</div>
        <div class="stat-value text-primary">4,200</div>
        <div class="stat-desc">↗ 400 (22%)</div>
      </div>
    </div>`,
    note: "daisyUI-specific: a metric block (title, value, description, figure) laid out in a stats row.",
  },
  status: {
    component: null,
    height: 140,
    demo: `    <span style="display:inline-flex;align-items:center;gap:.375rem"><span class="status status-success"></span>Online</span>
    <span style="display:inline-flex;align-items:center;gap:.375rem"><span class="status status-warning status-lg"></span>Degraded</span>
    <span style="display:inline-flex;align-items:center;gap:.375rem"><span class="status status-error status-xl"></span>Offline</span>`,
    note: "daisyUI-specific: a tiny status dot, sized and coloured by state.",
  },
  steps: {
    component: "progress-steps",
    height: 160,
    demo: `    <ul class="steps">
      <li class="step step-primary">Register</li>
      <li class="step step-primary">Choose plan</li>
      <li class="step">Purchase</li>
      <li class="step">Receive product</li>
    </ul>`,
  },
  swap: {
    component: null,
    height: 150,
    demo: `    <label class="swap swap-rotate" style="font-size:1.5rem">
      <input type="checkbox">
      <div class="swap-on">ON</div>
      <div class="swap-off">OFF</div>
    </label>
    <label class="swap swap-flip" style="font-size:2rem">
      <input type="checkbox">
      <div class="swap-on">😈</div>
      <div class="swap-off">😇</div>
    </label>`,
    note: "daisyUI-specific: a checkbox-driven crossfade between two pieces of content.",
  },
  tab: {
    component: "tabs",
    height: 210,
    demo: `    <div style="${COL};gap:1rem;align-items:center">
      <div role="tablist" class="tabs tabs-box">
        <a role="tab" class="tab">Tab 1</a>
        <a role="tab" class="tab tab-active">Tab 2</a>
        <a role="tab" class="tab">Tab 3</a>
      </div>
      <div role="tablist" class="tabs tabs-border">
        <a role="tab" class="tab">Tab 1</a>
        <a role="tab" class="tab tab-active">Tab 2</a>
        <a role="tab" class="tab tab-disabled">Tab 3</a>
      </div>
    </div>`,
  },
  table: {
    component: "table",
    height: 250,
    demo: `    <div class="bg-base-200 rounded-box" style="width:24rem;overflow-x:auto">
      <table class="table table-zebra table-sm">
        <thead><tr><th></th><th>Name</th><th>Job</th></tr></thead>
        <tbody>
          <tr><th>1</th><td>Cy Ganderton</td><td>Quality Control</td></tr>
          <tr><th>2</th><td>Hart Hagerty</td><td>Desktop Support</td></tr>
          <tr><th>3</th><td>Brice Swyre</td><td>Tax Accountant</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  "text-rotate": {
    component: null,
    height: 140,
    demo: `    <div style="font-size:1.5rem">daisyUI is
      <span class="text-rotate text-primary"><span><span>fast</span><span>simple</span><span>beautiful</span></span></span>
    </div>`,
    note: "daisyUI-specific: a CSS-only loop through up to six lines of text.",
  },
  textarea: {
    component: "textarea",
    height: 170,
    demo: `    <textarea class="textarea" placeholder="Bio" style="width:14rem"></textarea>
    <textarea class="textarea textarea-primary" placeholder="Primary" style="width:14rem"></textarea>`,
  },
  "theme-controller": {
    component: null,
    height: 170,
    themed: true,
    demo: `    <div style="${COL};gap:1rem;align-items:center">
      <div class="join">
        <input type="radio" name="daisy-theme" class="btn join-item theme-controller" aria-label="Light" value="light" checked>
        <input type="radio" name="daisy-theme" class="btn join-item theme-controller" aria-label="Dark" value="dark">
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <button class="btn btn-primary btn-sm">Primary</button>
        <span class="badge badge-secondary">Secondary</span>
        <span class="badge badge-accent badge-soft">Accent</span>
      </div>
    </div>`,
    note: "daisyUI-specific: a checkbox or radio whose value switches the page theme with no JavaScript. The standalone stylesheet ships the light and dark themes.",
  },
  timeline: {
    component: "timeline",
    height: 270,
    demo: `    <ul class="timeline timeline-vertical timeline-compact">
      <li>
        <div class="timeline-middle">●</div>
        <div class="timeline-end timeline-box">First Macintosh computer</div>
        <hr>
      </li>
      <li>
        <hr>
        <div class="timeline-middle">●</div>
        <div class="timeline-end timeline-box">iMac</div>
        <hr>
      </li>
      <li>
        <hr>
        <div class="timeline-middle">●</div>
        <div class="timeline-end timeline-box">iPod</div>
      </li>
    </ul>`,
  },
  toast: {
    component: "toast",
    height: 200,
    demo: `    <div class="toast toast-end">
      <div class="alert alert-info">New message arrived.</div>
      <div class="alert alert-success">Message sent successfully.</div>
    </div>`,
    note: "A positioning wrapper: it pins stacked alerts to a corner of the viewport (here, the demo frame).",
  },
  toggle: {
    component: "switch",
    demo: `    <input type="checkbox" class="toggle" checked>
    <input type="checkbox" class="toggle toggle-primary" checked>
    <input type="checkbox" class="toggle toggle-success">
    <input type="checkbox" class="toggle" disabled checked>`,
  },
  tooltip: {
    component: "tooltip",
    height: 190,
    demo: `    <div class="tooltip tooltip-open" data-tip="Above the trigger"><button class="btn">Top</button></div>
    <div class="tooltip tooltip-open tooltip-bottom tooltip-primary" data-tip="Below the trigger"><button class="btn">Bottom</button></div>`,
    note: "Shown with the tooltip-open class so both bubbles render statically.",
  },
  validator: {
    component: null,
    height: 180,
    demo: `    <div style="${COL};gap:.25rem;width:18rem">
      <input type="email" class="input validator" required aria-invalid="true" placeholder="mail@site.com" value="not-an-email" style="width:100%">
      <p class="validator-hint">Enter a valid email address</p>
      <input type="email" class="input validator" required placeholder="mail@site.com" value="hi@daisyui.com" style="width:100%">
    </div>`,
    note: "daisyUI-specific: a class that colours any form control from its native :user-valid / :user-invalid state (or aria-invalid, as in the first field here) and reveals the hint beside it.",
  },
}

// ── snapshot parsing ─────────────────────────────────────────────────────────
interface DocsComponent {
  slug: string
  name: string
  docsUrl: string
}

function stripTags(html: string): string {
  return html
    .replace(/<!--[^]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** The components index renders one `<a class="card …">` per component, whose
    `<h2 class="card-title …">` carries daisyUI's own name for it. */
function parseComponentIndex(html: string): DocsComponent[] {
  const found: DocsComponent[] = []
  const seen = new Set<string>()
  const cardRe =
    /<a class="card[^"]*" href="\/components\/([a-z0-9-]+)\/">([^]*?)<\/a>/g
  for (const card of html.matchAll(cardRe)) {
    const slug = card[1]!
    const title = /<h2 class="card-title[^"]*">([^]*?)<\/h2>/.exec(card[2]!)
    if (!title) {
      throw new Error(`components-index.html: no card title for "${slug}"`)
    }
    const name = stripTags(title[1]!)
    if (!name) {
      throw new Error(`components-index.html: empty card title for "${slug}"`)
    }
    if (seen.has(slug)) {
      throw new Error(`components-index.html: duplicate card for "${slug}"`)
    }
    seen.add(slug)
    found.push({ slug, name, docsUrl: `${SITE}/components/${slug}/` })
  }
  if (found.length === 0) {
    throw new Error("components-index.html: no component cards found")
  }
  return found
}

/** Component slugs the sitemap lists — the independent inventory check. */
function parseSitemapSlugs(xml: string): Set<string> {
  const slugs = new Set<string>()
  for (const loc of xml.matchAll(
    /<loc>https:\/\/daisyui\.com\/components\/([a-z0-9-]+)\/<\/loc>/g,
  )) {
    slugs.add(loc[1]!)
  }
  if (slugs.size === 0) {
    throw new Error("sitemap.xml: no component URLs found")
  }
  return slugs
}

/** Every class selector the stylesheet defines. Over-inclusive by design (it
    also picks up class-like text inside data URIs) — it is used only to reject
    demo markup that references a class daisyUI does not ship. */
function cssClassNames(css: string): Set<string> {
  const names = new Set<string>()
  for (const m of css.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)) {
    names.add(m[1]!)
  }
  return names
}

function classesUsed(markup: string): string[] {
  const used = new Set<string>()
  for (const m of markup.matchAll(/class="([^"]*)"/g)) {
    for (const token of m[1]!.split(/\s+/).filter(Boolean)) used.add(token)
  }
  return [...used].sort()
}

/** Mirrors scripts/build-demos.ts: the filename a demo is materialized under. */
function demoBasename(component: string | null, name: string): string {
  return (
    component ??
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  )
}

function assertSameSets(a: Set<string>, b: Set<string>, label: string): void {
  const onlyA = [...a].filter((x) => !b.has(x)).sort()
  const onlyB = [...b].filter((x) => !a.has(x)).sort()
  if (onlyA.length > 0 || onlyB.length > 0) {
    throw new Error(
      `${label}: only in first [${onlyA.join(", ")}]; only in second [${onlyB.join(", ")}]`,
    )
  }
}

// ── extract ──────────────────────────────────────────────────────────────────
function extractComponents(sourcesDir: string): ComponentsFile {
  const read = (name: string) =>
    fs.readFileSync(path.join(sourcesDir, name), "utf8")

  const docs = parseComponentIndex(read("components-index.html"))
  const sitemapSlugs = parseSitemapSlugs(read("sitemap.xml"))
  const css = read("daisyui.css")

  // The docs index and the sitemap must describe the same inventory.
  assertSameSets(
    new Set(docs.map((d) => d.slug)),
    sitemapSlugs,
    "inventory mismatch between components-index.html and sitemap.xml",
  )
  // …and this config must cover it exactly: an upstream addition or removal
  // fails here rather than silently emitting a partial inventory.
  assertSameSets(
    new Set(docs.map((d) => d.slug)),
    new Set(Object.keys(SPECS)),
    "inventory mismatch between the docs index and this config",
  )

  if (!css.includes(`daisyUI ${VERSION}`)) {
    throw new Error(
      `daisyui.css: snapshot is not the pinned ${VERSION} build (banner missing)`,
    )
  }

  const known = cssClassNames(css)
  const canonical = new Set<string>()
  const basenames = new Set<string>()

  const components: SystemComponent[] = docs.map((entry) => {
    const spec = SPECS[entry.slug]!

    if (spec.component !== null) {
      if (canonical.has(spec.component)) {
        throw new Error(
          `two daisyUI components map to the canonical slug "${spec.component}"`,
        )
      }
      canonical.add(spec.component)
    }
    const basename = demoBasename(spec.component, entry.name)
    if (basenames.has(basename)) {
      throw new Error(`two demos would be written to "${basename}.html"`)
    }
    basenames.add(basename)

    let demo: SystemComponent["demo"] = null
    if (spec.demo) {
      // Cross-check: every class a demo ships must be one daisyUI defines, so
      // demos can never drift into hand-imitated styling.
      const unknown = classesUsed(spec.demo).filter((c) => !known.has(c))
      if (unknown.length > 0) {
        throw new Error(
          `${entry.slug} demo uses classes daisyUI does not define: ${unknown.join(", ")}`,
        )
      }
      demo = {
        html: demoDoc(entry.name, spec.demo, {
          head: spec.head,
          themed: spec.themed,
        }),
        height: spec.height ?? 130,
      }
    }

    return {
      component: spec.component,
      name: entry.name,
      docsUrl: entry.docsUrl,
      demo,
      note: spec.note ?? null,
    }
  })

  components.sort((a, b) => a.name.localeCompare(b.name, "en"))

  const retrievedAt = readManifest(sourcesDir).retrievedAt
  const demoCount = components.filter((c) => c.demo).length
  console.error(
    `[daisyui] ${components.length} components, ${demoCount} demos, ${canonical.size} mapped to the taxonomy`,
  )

  return {
    components,
    sources: [COMPONENTS_INDEX, SITEMAP, CSS_URL, REPO],
    provenance: {
      method: "script",
      extractor: "scripts/systems/daisyui.ts",
      sources: [
        {
          kind: "live-site",
          url: COMPONENTS_INDEX,
          ref: null,
          retrievedAt,
          snapshot: "sources/daisyui",
        },
        {
          kind: "live-site",
          url: SITEMAP,
          ref: null,
          retrievedAt,
          snapshot: "sources/daisyui",
        },
        {
          kind: "live-site",
          url: CSS_URL,
          ref: VERSION,
          retrievedAt,
          snapshot: "sources/daisyui",
        },
      ],
      notes: `Inventory and names come from the components index page, cross-checked against sitemap.xml — extraction throws if the two disagree or if this config does not cover the inventory exactly. The stylesheet source is fetched over HTTP (hence the live-site kind) but its URL pins the npm release, so daisyui@${VERSION} is byte-stable; the snapshot manifest hashes it either way. Demo documents are markup written in the extractor, not extracted values; each one loads only that pinned stylesheet, and every class it uses is verified to exist in it. The Calendar demo additionally loads the Cally web component (pinned ${CALLY_VERSION}) because daisyUI ships calendar theming, not a calendar.`,
    },
  }
}

const config: SystemConfig = {
  slug: "daisyui",
  source: SOURCE,
  extractComponents,
}

export default config
