/**
 * Pairs a preset's reference screenshots with its specimen captures.
 *
 *   tsx scripts/compose-refs.mts --preset <id> --refs <dir of reference pngs>
 *     [--shots .scratch-specimens] [--out <shots>/<preset>]
 *
 * Each reference is matched to a sheet by its filename (`buttons-dark.png` →
 * actions, dark) and written next to that sheet's capture in the reference's
 * mode: <out>/compare-<sheet>[-n].png, four references per image. References no
 * keyword matches land in compare-unmatched.png. Run from www/.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import { basename, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer"

const { values: args } = parseArgs({
  options: {
    preset: { type: "string" },
    refs: { type: "string" },
    shots: { type: "string", default: ".scratch-specimens" },
    out: { type: "string" },
  },
})
if (!args.preset || !args.refs) {
  console.error(
    "usage: --preset <id> --refs <dir> [--shots <dir>] [--out <dir>]",
  )
  process.exit(1)
}

// First sheet whose keyword appears as a filename token wins, so order matters:
// overlays before the controls they contain.
const KEYWORDS: [sheet: string, words: string[]][] = [
  ["dates", ["calendar", "date", "datepicker"]],
  ["dialog", ["dialog", "modal", "confirm", "alertdialog"]],
  ["drawer", ["drawer", "sheet"]],
  [
    "menu",
    [
      "menu",
      "dropdown",
      "popover",
      "listbox",
      "tooltip",
      "command",
      "palette",
      "contextmenu",
      "overlays",
      "menus",
    ],
  ],
  [
    "feedback",
    [
      "badge",
      "badges",
      "alert",
      "banner",
      "banners",
      "toast",
      "progress",
      "spinner",
      "loader",
      "skeleton",
      "feedback",
      "notification",
      "callout",
      "tag",
      "tags",
      "chip",
      "chips",
      "label",
      "labels",
    ],
  ],
  [
    "selection",
    [
      "checkbox",
      "radio",
      "switch",
      "toggle",
      "slider",
      "choice",
      "choicelist",
      "choicebox",
    ],
  ],
  [
    "fields",
    [
      "input",
      "inputs",
      "field",
      "fields",
      "textfield",
      "form",
      "login",
      "signin",
      "select",
      "combobox",
      "otp",
      "search",
      "textarea",
      "number",
    ],
  ],
  [
    "navigation",
    [
      "tabs",
      "tab",
      "nav",
      "navigation",
      "sidebar",
      "breadcrumbs",
      "breadcrumb",
      "link",
      "links",
      "appshell",
      "shell",
      "app",
      "header",
    ],
  ],
  [
    "display",
    [
      "card",
      "cards",
      "table",
      "accordion",
      "avatar",
      "avatars",
      "kbd",
      "list",
      "collection",
      "tile",
    ],
  ],
  [
    "actions",
    [
      "button",
      "buttons",
      "segmented",
      "pagination",
      "group",
      "cta",
      "actions",
      "groups",
    ],
  ],
  [
    "type",
    [
      "type",
      "typography",
      "heading",
      "headings",
      "text",
      "hero",
      "relnotes",
      "home",
    ],
  ],
]

function match(file: string) {
  const tokens = basename(file, ".png")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
  const mode = tokens.includes("dark") ? "dark" : "light"
  const sheet =
    KEYWORDS.find(([name]) => tokens.includes(name))?.[0] ??
    KEYWORDS.find(([, words]) => words.some((w) => tokens.includes(w)))?.[0]
  return { file, sheet, mode }
}

const refsDir = resolve(args.refs)
const shotsDir = resolve(args.shots, args.preset)
const outDir = resolve(args.out ?? shotsDir)
const refs = (await readdir(refsDir))
  .filter((f) => f.endsWith(".png"))
  .sort()
  .map((f) => match(resolve(refsDir, f)))

const groups = new Map<string, typeof refs>()
for (const ref of refs) {
  const key = ref.sheet ?? "unmatched"
  groups.set(key, [...(groups.get(key) ?? []), ref])
}

const url = (path: string) => pathToFileURL(path).href
const figure = (src: string, caption: string) =>
  `<figure><figcaption>${caption}</figcaption><img src="${url(src)}"></figure>`

function page(title: string, specimens: string[], refFiles: string[]) {
  const left = specimens
    .map((s) =>
      existsSync(s)
        ? figure(s, `specimen · ${basename(s)}`)
        : `<p class="missing">missing ${basename(s)} — run capture-specimens first</p>`,
    )
    .join("")
  const right = refFiles
    .map((r) => figure(r, `reference · ${basename(r)}`))
    .join("")
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:24px;background:#e5e5e5;font:14px ui-monospace,monospace;color:#111;width:1952px}
    h1{font-size:20px;margin:0 0 16px}
    main{display:grid;grid-template-columns:960px 960px;gap:32px;align-items:start}
    section{display:flex;flex-direction:column;gap:24px}
    figure{margin:0}figcaption{margin-bottom:6px}
    img{display:block;max-width:960px;max-height:1600px;object-fit:contain;object-position:left top;outline:1px solid #999;background:#fff}
    .missing{color:#b00}
  </style><h1>${title}</h1><main><section>${left}</section><section>${right}</section></main>`
}

await mkdir(outDir, { recursive: true })
const browser = await puppeteer.launch({ headless: "shell" })
try {
  const tab = await browser.newPage()
  await tab.setViewport({ width: 2000, height: 1000 })
  for (const [sheet, group] of groups) {
    for (let i = 0; i < group.length; i += 4) {
      const chunk = group.slice(i, i + 4)
      const modes = [...new Set(chunk.map((r) => r.mode))]
      const specimens =
        sheet === "unmatched"
          ? []
          : modes.map((m) => resolve(shotsDir, `${sheet}-${m}.png`))
      const suffix = i === 0 ? "" : `-${i / 4 + 1}`
      const html = resolve(outDir, `.compose-${sheet}${suffix}.html`)
      await writeFile(
        html,
        page(
          `${args.preset} · ${sheet}`,
          specimens,
          chunk.map((r) => r.file),
        ),
      )
      await tab.goto(url(html), { waitUntil: "load" })
      const out = resolve(outDir, `compare-${sheet}${suffix}.png`)
      await tab.screenshot({ path: out, fullPage: true })
      await rm(html)
      console.log(
        `  ${basename(out)}  ${chunk.map((r) => basename(r.file)).join(", ")}`,
      )
    }
  }
} finally {
  await browser.close()
}
