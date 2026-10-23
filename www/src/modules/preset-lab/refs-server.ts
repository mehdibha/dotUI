/* Dev server only (vite.config.ts): hands /internal/compare the reference
   crops and part files under .scratch-refs/<preset id>/, which stay out of
   git. Any folder depth works, so a dated local capture and a headless
   `--shots` run sit side by side; of two folders holding one part and mode,
   the one with the newest file wins.

     GET /__preset-refs/<id>            { "<part>-<mode>": { png?, json? } }
     GET /__preset-refs/<id>/<path>     the file */

import { createReadStream } from "node:fs"
import { open, readdir, stat } from "node:fs/promises"
import { join, relative, resolve, sep } from "node:path"
import type { Plugin } from "vite"

const ROUTE = "/__preset-refs"

/** A crop and its part file, as paths under the preset's folder. */
export type RefsIndex = Record<string, { png?: string; json?: string }>

const NAME = /^(.+)-(light|dark)\.(png|json)$/
const DEPTH = 6

async function index(folder: string): Promise<RefsIndex> {
  const sets = new Map<
    string,
    { key: string; time: number; files: RefsIndex[string] }
  >()
  const walk = async (dir: string, depth: number) => {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (depth < DEPTH) await walk(path, depth + 1)
        continue
      }
      const match = NAME.exec(entry.name)
      if (!match) continue
      const [, part, mode, ext] = match as unknown as [
        string,
        string,
        string,
        "png" | "json",
      ]
      // Page bundles share the naming: only part files count.
      if (ext === "json" && !(await isPartFile(path))) continue
      const key = `${part}-${mode}`
      const set = sets.get(`${dir}|${key}`) ?? { key, time: 0, files: {} }
      set.files[ext] = relative(folder, path)
      set.time = Math.max(set.time, (await stat(path)).mtimeMs)
      sets.set(`${dir}|${key}`, set)
    }
  }
  await walk(folder, 0)
  // A crop pairs with the part file beside it (its box in the PNG), so both
  // come from one folder: the one holding the part's newest file.
  const found: RefsIndex = {}
  const times = new Map<string, number>()
  for (const { key, time, files } of sets.values())
    if ((times.get(key) ?? -1) < time) {
      times.set(key, time)
      found[key] = files
    }
  return found
}

async function isPartFile(path: string) {
  const file = await open(path)
  try {
    const { buffer } = await file.read(Buffer.alloc(32), 0, 32, 0)
    return buffer.toString("utf8").startsWith('{"kind":"dotui-part"')
  } finally {
    await file.close()
  }
}

export function presetRefs(root: string): Plugin {
  const base = resolve(root, ".scratch-refs")
  return {
    name: "dotui-preset-refs",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(ROUTE, (req, res, next) => {
        const [id = "", ...rest] = decodeURIComponent(
          (req.url ?? "").split("?")[0] ?? "",
        )
          .split("/")
          .filter(Boolean)
        const folder = resolve(base, id)
        const path = resolve(folder, ...rest)
        if (
          !folder.startsWith(base + sep) ||
          !path.startsWith(folder + (rest.length ? sep : ""))
        )
          return next()
        if (!rest.length) {
          void index(folder).then((found) => {
            res.setHeader("Content-Type", "application/json")
            res.setHeader("Cache-Control", "no-store")
            res.end(JSON.stringify(found))
          }, next)
          return
        }
        res.setHeader(
          "Content-Type",
          path.endsWith(".png") ? "image/png" : "application/json",
        )
        res.setHeader("Cache-Control", "no-store")
        createReadStream(path)
          .on("error", () => {
            res.statusCode = 404
            res.end()
          })
          .pipe(res)
      })
    },
  }
}
