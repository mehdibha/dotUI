/**
 * Helpers for a local Claude Code session that captures signed-in products
 * in the user's Chrome (see RUNBOOK.md next to this file). Run from www/.
 *
 *   tsx scripts/local-capture/kit.mts > <file>
 *     Prints the kit: one JavaScript expression to run in the tab after each
 *     full load. It defines `window.__dotui` with the preset-lab probe, and
 *     keeps results in the tab's sessionStorage, so they survive reloads and
 *     leave the page as one download per page and mode. Where the page allows
 *     eval, `(0, eval)(sessionStorage.getItem("__dotui_kit"))` re-runs it
 *     after a load of the same site without resending it.
 *
 *   tsx scripts/local-capture/kit.mts --targets <file> --url <page key>
 *     Prints the calls that measure one page of a pack-format targets file:
 *     one for the plain parts, then one per focus or `before` part.
 *
 *   tsx scripts/local-capture/kit.mts --collect <preset id> --out <dir> [--downloads ~/Downloads]
 *     Moves the newest dotui__<id>__<slug>__<mode>.json of each page from the
 *     downloads folder to <dir>/<slug>-<mode>.json.
 *
 *   tsx scripts/local-capture/kit.mts --crop <screenshot> --rects <file> --out <dir> --mode <mode>
 *     Crops each part `__dotui.rects()` returned out of a viewport
 *     screenshot taken in the same state, as <dir>/<part>-<mode>.png.
 */
import { execFileSync } from "node:child_process"
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises"
import { homedir, tmpdir } from "node:os"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import { PNG } from "pngjs"
import { minifySync } from "vite"

import {
  type Pack,
  type Step,
  type Target,
  ownedProps,
  snippet,
} from "../../src/modules/preset-lab/probe"

const { values: args } = parseArgs({
  options: {
    targets: { type: "string" },
    url: { type: "string" },
    crop: { type: "string" },
    rects: { type: "string" },
    out: { type: "string" },
    mode: { type: "string" },
    pad: { type: "string", default: "8" },
    collect: { type: "string" },
    downloads: { type: "string", default: resolve(homedir(), "Downloads") },
  },
})

/** The probe's own source, taken from the expression `snippet` builds. */
const probeSource = () => {
  const head = "(() => { const __name = (fn) => fn; return ("
  const tail = ")({}, {}, false, false) })()"
  const expression = snippet({})
  if (!expression.startsWith(head) || !expression.endsWith(tail))
    throw new Error("snippet() changed shape: update probeSource()")
  return expression.slice(head.length, -tail.length)
}

/* Runs in the page. It keeps its own source in sessionStorage, so on a page
   that allows eval the next load re-runs it with RELOAD instead of resending
   it. */
const KIT = `(function kit() {
  sessionStorage.setItem("__dotui_kit", "(" + kit.toString() + ")()")
  const __name = (fn) => fn
  const probe = ${probeSource()}
  const KEY = "__dotui", CURRENT = "__dotui_current"
  const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "{}") } catch { return {} } }
  const save = (all) => sessionStorage.setItem(KEY, JSON.stringify(all))
  const current = () => sessionStorage.getItem(CURRENT)
  const update = (fn) => {
    const name = current()
    if (!name) throw new Error("call __dotui.begin(name, key) first")
    const all = load()
    all[name] = all[name] || { probe: {} }
    fn(all[name])
    save(all)
  }
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
  const box = (cs) => {
    const o = {}
    const sides = ["Top", "Right", "Bottom", "Left"].map((s) => cs["border" + s + "Width"] + " " + cs["border" + s + "Style"] + " " + cs["border" + s + "Color"])
    if (sides.some((s) => !s.startsWith("0px"))) o.border = new Set(sides).size === 1 ? sides[0] : sides.join(" | ")
    if (cs.borderRadius !== "0px") o.radius = cs.borderRadius
    if (cs.boxShadow !== "none") o.shadow = cs.boxShadow
    if (cs.backgroundColor !== "rgba(0, 0, 0, 0)") o.bg = cs.backgroundColor
    if (cs.backgroundImage !== "none") o.bgImage = cs.backgroundImage.slice(0, 200)
    if (cs.backdropFilter && cs.backdropFilter !== "none") o.backdrop = cs.backdropFilter
    return o
  }
  const style = (el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    const o = {
      tag: el.tagName.toLowerCase(),
      size: Math.round(r.width) + "x" + Math.round(r.height),
      color: cs.color,
      font: cs.fontWeight + " " + cs.fontSize + "/" + cs.lineHeight + " " + cs.fontFamily.split(",")[0],
      padding: cs.padding,
      ...box(cs),
    }
    for (const a of ["role", "data-testid", "data-test", "data-variant", "data-size", "data-state", "aria-selected", "aria-checked", "aria-pressed", "aria-current", "aria-expanded", "disabled"])
      if (el.hasAttribute(a)) o[a] = (el.getAttribute(a) || "").slice(0, 40)
    if (cs.letterSpacing !== "normal") o.letterSpacing = cs.letterSpacing
    if (cs.textDecorationLine !== "none") o.decoration = cs.textDecorationLine + " " + cs.textDecorationStyle + " " + cs.textDecorationColor + " " + cs.textDecorationThickness + " offset " + cs.textUnderlineOffset
    if (cs.outlineStyle !== "none") o.outline = cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor + " " + cs.outlineOffset
    if (cs.opacity !== "1") o.opacity = cs.opacity
    for (const p of ["::before", "::after"]) {
      const ps = getComputedStyle(el, p)
      if (ps.content === "none" || ps.content === "normal") continue
      const b = box(ps)
      if (Object.keys(b).length) o[p] = { ...b, inset: ps.top + " " + ps.right + " " + ps.bottom + " " + ps.left }
    }
    return o
  }
  const sample = (selector, max) => {
    const seen = new Map()
    let els = []
    try { els = [...document.querySelectorAll(selector)] } catch { return { error: "bad selector" } }
    for (const el of els) {
      if (!visible(el)) continue
      const s = style(el)
      const { size, ...rest } = s
      const sig = JSON.stringify(rest)
      if (seen.has(sig)) seen.get(sig).count++
      else if (seen.size < max) seen.set(sig, { ...s, count: 1 })
    }
    return [...seen.values()]
  }
  const KINDS = {
    button: "button,[role=button]",
    link: "a[href]",
    input: "input:not([type=hidden]):not([type=checkbox]):not([type=radio]),textarea,[contenteditable=true]",
    select: "select,[role=combobox],[aria-haspopup=listbox]",
    checkbox: "input[type=checkbox],[role=checkbox]",
    radio: "input[type=radio],[role=radio]",
    switch: "[role=switch]",
    tab: "[role=tab]",
    menu: "[role=menu],[role=listbox]",
    menuitem: "[role=menuitem],[role=option],[role=menuitemcheckbox],[role=menuitemradio]",
    dialog: "[role=dialog],[role=alertdialog],dialog[open]",
    tooltip: "[role=tooltip]",
    nav: "nav a,[role=navigation] a,aside a",
    heading: "h1,h2,h3,h4,[role=heading]",
    badge: "[class*=badge i],[class*=tag i],[class*=chip i],[class*=pill i]",
    card: "[class*=card i],[class*=tile i]",
    table: "th,td,[role=columnheader],[role=row]",
    kbd: "kbd",
    progress: "progress,[role=progressbar]",
  }
  window.__dotui = {
    begin(name, key) {
      sessionStorage.setItem(CURRENT, name)
      update((b) => { b.key = key; b.url = location.origin })
      const html = document.documentElement
      const theme = { prefersDark: matchMedia("(prefers-color-scheme: dark)").matches, colorScheme: getComputedStyle(html).colorScheme, bodyBg: getComputedStyle(document.body).backgroundColor }
      for (const el of [html, document.body])
        for (const a of el.attributes)
          if (a.name === "class" || /theme|mode|scheme|dark|light|appearance/i.test(a.name)) theme[el.tagName.toLowerCase() + "." + a.name] = a.value.slice(0, 200)
      update((b) => { b.theme = theme; b.viewport = { width: innerWidth, height: innerHeight, dpr: devicePixelRatio } })
      return { name, ...theme }
    },
    measure(targets, props, focus = false) {
      const result = probe(targets, props, focus, true)
      update((b) => Object.assign(b.probe, result))
      return Object.fromEntries(Object.entries(result).map(([part, m]) => [part, m ? Object.keys(m).length + " props" : null]))
    },
    peek(part) { return load()[current()]?.probe?.[part] },
    vars() {
      const names = new Set()
      const scan = (rules) => { for (const r of rules) { if (r.style) for (const p of r.style) if (p.startsWith("--")) names.add(p); if (r.cssRules) scan(r.cssRules) } }
      for (const sheet of document.styleSheets) { try { scan(sheet.cssRules) } catch {} }
      const read = (el) => { const cs = getComputedStyle(el); for (const p of cs) if (p.startsWith("--")) names.add(p); return cs }
      const root = read(document.documentElement), body = read(document.body)
      const vars = {}, bodyVars = {}
      for (const n of [...names].sort()) {
        const v = root.getPropertyValue(n).trim(), w = body.getPropertyValue(n).trim()
        if (v) vars[n] = v.slice(0, 300)
        if (w && w !== v) bodyVars[n] = w.slice(0, 300)
      }
      const fonts = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, "") + " " + f.weight + " " + f.style))]
      update((b) => { b.vars = vars; b.bodyVars = bodyVars; b.fonts = fonts })
      return { vars: Object.keys(vars).length, bodyVars: Object.keys(bodyVars).length, fonts: fonts.length }
    },
    inventory(extra = {}, max = 6) {
      const out = {}
      for (const [kind, selector] of Object.entries({ ...KINDS, ...extra })) {
        const found = sample(selector, max)
        if (found.length) out[kind] = found
      }
      update((b) => { b.inventory = { ...b.inventory, ...out } })
      return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length]))
    },
    classes(prefix, max = 200) {
      const counts = {}, first = {}
      for (const el of document.querySelectorAll("[class*='" + prefix + "']"))
        for (const c of el.classList)
          if (c.startsWith(prefix)) { counts[c] = (counts[c] || 0) + 1; if (!first[c] && visible(el)) first[c] = el }
      const out = {}
      for (const c of Object.keys(counts).sort().slice(0, max)) out[c] = { count: counts[c], ...(first[c] ? style(first[c]) : {}) }
      update((b) => { b.classes = { ...b.classes, ...out } })
      return Object.keys(out).length + " classes"
    },
    note(key, value) { update((b) => { b.notes = { ...b.notes, [key]: value } }); return "noted" },
    rects() {
      const parts = {}
      for (const el of document.querySelectorAll("[data-probe-part]")) {
        const r = el.getBoundingClientRect()
        if (r.width && r.height && r.bottom > 0 && r.top < innerHeight) parts[el.getAttribute("data-probe-part")] = [r.x, r.y, r.width, r.height].map(Math.round)
      }
      return JSON.stringify({ width: innerWidth, height: innerHeight, parts })
    },
    survey(extra = {}) { return { ...this.vars(), inventory: this.inventory(extra) } },
    finish(name = current()) {
      const data = load()[name]
      const json = JSON.stringify(data, null, 1)
      const a = document.createElement("a")
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }))
      a.download = "dotui__" + name.replace(/\\//g, "__") + ".json"
      document.body.appendChild(a); a.click(); a.remove()
      const nulls = Object.entries(data.probe).filter(([, m]) => !m).map(([p]) => p)
      return { file: a.download, bytes: json.length, parts: Object.keys(data.probe).length, nulls }
    },
    list() { return Object.fromEntries(Object.entries(load()).map(([n, b]) => [n, JSON.stringify(b).length])) },
    read(offset = 0, length = 900) { return JSON.stringify(load()[current()]).slice(offset, offset + length) },
    reset() { for (const k of [KEY, CURRENT, "__dotui_kit"]) sessionStorage.removeItem(k); return "reset" },
  }
  for (const el of document.querySelectorAll("[data-probe-part]")) el.removeAttribute("data-probe-part")
  return "dotui kit ready" + (current() ? ", bundle " + current() : "")
})()`

const say = (step: Step) =>
  "click" in step
    ? `click ${step.click}`
    : "hover" in step
      ? `hover ${step.hover}`
      : "focus" in step
        ? `focus ${step.focus} (keyboard, no pointer)`
        : "wait" in step
          ? `wait for ${step.wait}`
          : `press ${step.press}`

const call = (targets: Record<string, Target>, focus = false) => {
  const props = Object.fromEntries(
    Object.entries(targets).map(([part, target]) => [
      part,
      ownedProps(part, target),
    ]),
  )
  return `__dotui.measure(${JSON.stringify(targets)}, ${JSON.stringify(props)}${focus ? ", true" : ""})`
}

if (args.collect) {
  if (!args.out) {
    console.error("--collect needs --out")
    process.exit(1)
  }
  const prefix = `dotui__${args.collect}__`
  const newest = new Map<string, { file: string; time: number }>()
  for (const name of await readdir(args.downloads)) {
    const match = /^(.+?)(?: \(\d+\))?\.json$/.exec(name)
    if (!match || !name.startsWith(prefix)) continue
    const [mode, ...slug] = match[1].slice(prefix.length).split("__").reverse()
    const target = `${slug.reverse().join("-")}-${mode}.json`
    const file = resolve(args.downloads, name)
    const time = (await stat(file)).mtimeMs
    if ((newest.get(target)?.time ?? -1) < time)
      newest.set(target, { file, time })
  }
  await mkdir(resolve(args.out), { recursive: true })
  for (const [target, { file }] of newest) {
    await copyFile(file, resolve(args.out, target))
    console.log(`${target} ← ${file}`)
  }
  for (const name of await readdir(args.downloads))
    if (name.startsWith(prefix)) await unlink(resolve(args.downloads, name))
  process.exit(0)
}

if (args.crop) {
  if (!args.rects || !args.out || !args.mode) {
    console.error("--crop needs --rects, --out and --mode")
    process.exit(1)
  }
  let file = resolve(args.crop)
  const head = (await readFile(file)).subarray(0, 4)
  if (head.toString("hex") !== "89504e47") {
    // Not a PNG (the extension may save JPEG): convert with macOS sips.
    const png = resolve(tmpdir(), `dotui-crop-${Date.now()}.png`)
    execFileSync("sips", ["-s", "format", "png", file, "--out", png])
    file = png
  }
  const shot = PNG.sync.read(await readFile(file))
  const rects: { width: number; parts: Record<string, number[]> } = JSON.parse(
    await readFile(resolve(args.rects), "utf8"),
  )
  const scale = shot.width / rects.width
  const pad = Number(args.pad)
  await mkdir(resolve(args.out), { recursive: true })
  for (const [part, [x, y, w, h]] of Object.entries(rects.parts)) {
    const left = Math.max(0, Math.floor((x - pad) * scale))
    const top = Math.max(0, Math.floor((y - pad) * scale))
    const width = Math.min(shot.width - left, Math.ceil((w + 2 * pad) * scale))
    const height = Math.min(shot.height - top, Math.ceil((h + 2 * pad) * scale))
    if (width <= 0 || height <= 0) continue
    const crop = new PNG({ width, height })
    PNG.bitblt(shot, crop, left, top, width, height, 0, 0)
    const out = resolve(args.out, `${part}-${args.mode}.png`)
    await writeFile(out, PNG.sync.write(crop))
    console.log(out)
  }
  process.exit(0)
}

if (args.targets) {
  const pack: Pack = JSON.parse(await readFile(resolve(args.targets), "utf8"))
  const page = pack[args.url ?? ""]
  if (!page) {
    console.error(
      `--url must be one of: ${Object.keys(pack).join(", ") || "(none)"}`,
    )
    process.exit(1)
  }
  const stepped = (target: Target) => target.focus || target.before
  const entries = Object.entries(page.parts)
  if (page.steps?.length)
    console.log(
      `// After each load, before any call: ${page.steps.map(say).join("; ")}.\n`,
    )
  const plain = entries.filter(([, target]) => !stepped(target))
  if (plain.length)
    console.log(`// Plain parts.\n${call(Object.fromEntries(plain))}\n`)
  for (const [part, target] of entries.filter(([, target]) =>
    stepped(target),
  )) {
    const steps = (target.before ?? []).map(say)
    if (target.focus)
      steps.push(
        "run this (it focuses the part), press Tab then Shift+Tab, run it again",
      )
    console.log(
      `// ${part}: ${steps.join("; ")}. Then press Escape (reload and re-run the kit if the state stays).\n${call({ [part]: target }, !!target.focus)}\n`,
    )
  }
  process.exit(0)
}

const { code, errors } = minifySync("kit.js", KIT)
if (errors.length) throw new Error(errors.map((e) => e.message).join("\n"))
console.log(code.trim())
