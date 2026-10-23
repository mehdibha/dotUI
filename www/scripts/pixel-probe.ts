/**
 * The pixel probe (src/modules/preset-lab/pixel.ts) over a screenshot, for
 * products with no DOM to read: native apps. Run from www/.
 *
 *   tsx scripts/pixel-probe.ts --pack <id> --shot <png> --rects <file> --mode light|dark [--parts a,b] [--exact] [--write]
 *     Reads each part's box in <rects> ({ width, parts: { part: [x, y, w, h] } }
 *     in the shot's points: `__dotui.rects()` output, or written by eye from
 *     the screenshot) and prints what the pixels say. Boxes are snapped to
 *     the drawn edges within 8 points unless --exact. --write merges the
 *     readings into refs/<id>/pixel.json, which the diff and the fit read
 *     for what tokens.json lacks.
 */
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import { PNG } from "pngjs"

import { type Box, measureBox, snap } from "../src/modules/preset-lab/pixel"
import type { Measures, ReferenceTokens } from "../src/modules/preset-lab/probe"
import { REFS } from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string" },
    shot: { type: "string" },
    rects: { type: "string" },
    mode: { type: "string" },
    parts: { type: "string" },
    exact: { type: "boolean", default: false },
    write: { type: "boolean", default: false },
  },
})

const mode = args.mode
if (!args.pack || !args.shot || !args.rects || (mode !== "light" && mode !== "dark")) {
  console.error("usage: --pack <id> --shot <png> --rects <file> --mode light|dark [--parts a,b] [--exact] [--write]")
  process.exit(1)
}

const shot = PNG.sync.read(await readFile(resolve(args.shot)))
const rects: { width: number; parts: Record<string, Box> } = JSON.parse(await readFile(resolve(args.rects), "utf8"))
const scale = shot.width / rects.width
const only = args.parts?.split(",")

const measures: Measures = {}
console.log(`| part | box | fill | ink | edge | radius | height | padding | shadow |`)
console.log(`| --- | --- | --- | --- | --- | --- | --- | --- | --- |`)
for (const [part, [x, y, w, h]] of Object.entries(rects.parts)) {
  if (only && !only.includes(part)) continue
  const rough: Box = [x * scale, y * scale, w * scale, h * scale]
  const box = args.exact ? rough : snap(shot, rough, Math.round(8 * scale))
  const m = measureBox(shot, box, scale)
  measures[part] = m
  console.log(
    `| ${part} | ${box.map((n) => Math.round(n / scale)).join(" ")} | ${m.backgroundColor} | ${m.color ?? ""} | ${m.edge} | ${m.borderRadius ?? ""} | ${m.height} | ${m.paddingInline ?? ""} | ${m.boxShadow === "none" ? "" : "yes"} |`,
  )
}

if (args.write) {
  const file = resolve(REFS, args.pack, "pixel.json")
  const pixel: ReferenceTokens = existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : { probe: "pixel" }
  pixel[mode] = { ...pixel[mode], ...measures }
  await writeFile(file, `${JSON.stringify(pixel, null, 2)}\n`)
  console.log(`\npixel → ${file} (${Object.keys(measures).length} parts, ${mode})`)
}
