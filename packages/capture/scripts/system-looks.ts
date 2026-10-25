/**
 * Writes a system's looks.json for its doc page (src/system-looks.ts) from
 * its pack and census. Run from www/.
 *
 *   pnpm presets:looks --pack <id>… [--census <dir>] [--fit <file>] [--out <file>]
 *     Reads refs/<id>/model.json (required: run presets:crawl first),
 *     tokens.json, gaps.json and targets.json; the newest census under
 *     .scratch-refs/<id>/ for fuller values, custom properties and copies;
 *     and .scratch-specimens/<id>/fit.json for the rows the preset misses.
 *     Writes ../directory/systems/<id>/looks.json unless --out. --census,
 *     --fit and --out take one pack.
 */
import { existsSync, readdirSync, statSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"
import { parseArgs } from "node:util"

import type { Inventory } from "../src/census"
import type { GapsFile } from "../src/looks"
import type { Model } from "../src/model"
import { type SystemInput, systemLooks } from "../src/system-looks"
import { newest, readReference, REFS, walk } from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string", multiple: true, default: [] },
    census: { type: "string" },
    fit: { type: "string" },
    out: { type: "string" },
  },
})
// --census, --fit and --out name one pack's files.
if (
  !args.pack.length ||
  (args.pack.length > 1 && (args.census || args.fit || args.out))
) {
  console.error(
    "usage: --pack <id>… [--census <dir>] [--fit <file>] [--out <file>]",
  )
  process.exit(1)
}

type Residuals = NonNullable<SystemInput["residuals"]>

const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8"))

for (const pack of args.pack) {
  const modelFile = resolve(REFS, pack, "model.json")
  if (!existsSync(modelFile)) {
    console.error(`${pack}: no model.json; run presets:crawl --pack ${pack}`)
    process.exitCode = 1
    continue
  }
  const model = await readJson<Model>(modelFile)
  const scratch = resolve(".scratch-refs", pack)
  const censusFile = args.census
    ? resolve(args.census, "census.json")
    : newest(walk(scratch, (path) => path.endsWith("/census/census.json")))
  const census =
    censusFile && existsSync(censusFile)
      ? await readJson<Inventory>(censusFile)
      : undefined
  const censusDir = censusFile && relative(scratch, dirname(censusFile))
  const cropsDir = censusFile && resolve(dirname(censusFile), "crops")
  const copies = new Set(
    cropsDir && existsSync(cropsDir) ? readdirSync(cropsDir) : [],
  )
  // The probe's own crops, `--shots`: newest per part and mode.
  const crops: Record<string, string> = {}
  for (const file of walk(scratch, (path) =>
    /\/crops\/[^/]+-(light|dark)\.png$/.test(path),
  ).sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs))
    crops[
      file
        .split("/")
        .at(-1)
        ?.replace(/\.png$/, "") ?? ""
    ] = relative(scratch, file)
  const fitFile = resolve(args.fit ?? `.scratch-specimens/${pack}/fit.json`)
  const fit = existsSync(fitFile)
    ? await readJson<{
        gaps: { rows?: Residuals }[]
        unfiled?: Residuals
      }>(fitFile)
    : undefined
  const targetsFile = resolve(REFS, pack, "targets.json")
  const gapsFile = resolve(REFS, pack, "gaps.json")
  const looks = systemLooks({
    slug: pack,
    model,
    targets: existsSync(targetsFile) ? await readJson(targetsFile) : undefined,
    reference: readReference(pack),
    gaps: existsSync(gapsFile)
      ? (await readJson<GapsFile>(gapsFile)).gaps
      : undefined,
    residuals: fit && [
      ...fit.gaps.flatMap((gap) => gap.rows ?? []),
      ...(fit.unfiled ?? []),
    ],
    census,
    censusDir,
    copies,
    crops,
    date:
      censusDir?.match(/\d{4}-\d{2}-\d{2}/)?.[0] ??
      new Date().toISOString().slice(0, 10),
  })
  const out = resolve(args.out ?? `../directory/systems/${pack}/looks.json`)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, `${JSON.stringify(looks, null, 2)}\n`)
  const all = Object.values(looks.components).flatMap((c) => c.looks)
  console.log(
    `${pack}: ${Object.keys(looks.components).length} components, ${all.length} looks (${all.filter((look) => look.part).length} matched to a probe part, ${all.filter((look) => Object.keys(look.states).length > 1).length} with states, ${all.filter((look) => look.states.rest?.light?.copy ?? look.states.rest?.dark?.copy).length} with copies) → ${out}`,
  )
}
