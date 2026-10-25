/**
 * Writes a system's spec.json (src/spec.ts): each component's looks as a
 * grid of variants × sizes with the states read on each cell, from the
 * newest census under .scratch-refs/<id>/. Run from www/, after
 * presets:crawl.
 *
 *   pnpm presets:spec --pack <id>… [--census <dir>] [--out <file>]
 *     Writes ../directory/systems/<id>/spec.json unless --out. --census and
 *     --out take one pack.
 */
import { existsSync, readdirSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"
import { parseArgs } from "node:util"

import type { Inventory } from "../src/census"
import { systemSpec } from "../src/spec"
import { newest, walk } from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string", multiple: true, default: [] },
    census: { type: "string" },
    out: { type: "string" },
  },
})
if (!args.pack.length || (args.pack.length > 1 && (args.census || args.out))) {
  console.error("usage: --pack <id>… [--census <dir>] [--out <file>]")
  process.exit(1)
}

for (const pack of args.pack) {
  const scratch = resolve(".scratch-refs", pack)
  const censusFile = args.census
    ? resolve(args.census, "census.json")
    : newest(walk(scratch, (path) => path.endsWith("/census/census.json")))
  if (!censusFile || !existsSync(censusFile)) {
    console.error(`${pack}: no census; run presets:crawl --pack ${pack}`)
    process.exitCode = 1
    continue
  }
  const census = JSON.parse(await readFile(censusFile, "utf8")) as Inventory & {
    census?: string
  }
  const censusDir = relative(scratch, dirname(censusFile))
  const cropsDir = resolve(dirname(censusFile), "crops")
  const spec = systemSpec({
    slug: pack,
    census,
    censusDir,
    copies: new Set(existsSync(cropsDir) ? readdirSync(cropsDir) : []),
    date:
      censusDir.match(/\d{4}-\d{2}-\d{2}/)?.[0] ??
      new Date().toISOString().slice(0, 10),
  })
  const out = resolve(args.out ?? `../directory/systems/${pack}/spec.json`)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, `${JSON.stringify(spec, null, 2)}\n`)
  const grids = Object.values(spec.components).flatMap((c) => c.grids)
  const named = grids.flatMap((grid) =>
    [...grid.variants, ...grid.sizes].filter((axis) => axis.name),
  ).length
  const axes = grids.reduce(
    (sum, grid) => sum + grid.variants.length + grid.sizes.length,
    0,
  )
  console.log(
    `${pack}: ${Object.keys(spec.components).length} components, ${grids.length} grids, ${grids.reduce((sum, grid) => sum + grid.cells.length, 0)} cells, ${named} of ${axes} variants and sizes named → ${out}`,
  )
}
