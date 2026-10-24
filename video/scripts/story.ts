/* Render the whole story scene by scene, each to its own ProRes 4444 .mov
   (a stuck frame stalls one scene, not the film), then join them losslessly.

   node scripts/story.ts out/story [--scenes=Demos,Export] [--scale=1.6]

   Scenes already rendered are kept; delete a .mov to redo it. */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import { openBrowser, renderMedia, selectComposition } from "@remotion/renderer"

import { makeWebpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.resolve(process.argv[2] ?? "out/story")
const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]
const ORDER = [
  "Create",
  "Blocks",
  "Catalog",
  "Demos",
  "Export",
  "Agent",
  "End",
].map((id) => `Story${id}`)
const only = flag("scenes")?.split(",")
fs.mkdirSync(out, { recursive: true })

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/experiments/entry.tsx"),
  webpackOverride: makeWebpackOverride({
    root,
    resolve: createRequire(import.meta.url).resolve,
  }),
  onProgress: () => {},
})

for (const id of ORDER) {
  const file = path.join(out, `${id}.mov`)
  if (only ? !only.includes(id) : fs.existsSync(file)) continue
  // A fresh browser per attempt; a scene that times out (fonts or icon
  // chunks under load) gets two more tries.
  for (let attempt = 1; ; attempt++) {
    try {
      const browser = await openBrowser("chrome", {
        browserExecutable: process.env.BROWSER ?? null,
      })
      const composition = await selectComposition({
        serveUrl,
        id,
        puppeteerInstance: browser,
        timeoutInMilliseconds: 120_000,
      })
      let last = -1
      await renderMedia({
        composition,
        serveUrl,
        codec: "prores",
        proResProfile: "4444",
        imageFormat: "png",
        concurrency: Number(flag("concurrency") ?? 2),
        scale: Number(flag("scale") ?? 1.6),
        timeoutInMilliseconds: 120_000,
        outputLocation: `${file}.part.mov`,
        puppeteerInstance: browser,
        onProgress: ({ renderedFrames, encodedFrames }) => {
          const step = Math.floor(renderedFrames / 60)
          if (step !== last) {
            last = step
            console.log(
              `${id} rendered ${renderedFrames}/${composition.durationInFrames} encoded ${encodedFrames}`,
            )
          }
        },
      })
      fs.renameSync(`${file}.part.mov`, file)
      await browser.close({ silent: true })
      break
    } catch (error) {
      console.log(
        `${id} attempt ${attempt} failed: ${String(error).slice(0, 200)}`,
      )
      if (attempt >= 3) throw error
    }
  }
  console.log(`${id} done`)
}

const list = path.join(out, "list.txt")
fs.writeFileSync(
  list,
  ORDER.map((id) => `file '${path.join(out, `${id}.mov`)}'`).join("\n"),
)
if (ORDER.every((id) => fs.existsSync(path.join(out, `${id}.mov`)))) {
  execFileSync("ffmpeg", [
    "-loglevel",
    "error",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c",
    "copy",
    path.join(out, "story.mov"),
  ])
  console.log(path.join(out, "story.mov"))
}
