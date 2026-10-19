/* Render the CardLooks experiment.

   node scripts/experiment.ts stills 0,60,72,84 [--scale=0.5]
   node scripts/experiment.ts video out/card-looks.mp4

   Set BROWSER to a Chrome binary when Remotion can't download its own. */

import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer"

import { makeWebpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const [mode, arg] = process.argv.slice(2)
const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/experiments/entry.tsx"),
  webpackOverride: makeWebpackOverride({
    root,
    resolve: createRequire(import.meta.url).resolve,
  }),
  onProgress: () => {},
})
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.BROWSER ?? null,
})
const composition = await selectComposition({
  serveUrl,
  id: flag("id") ?? "Steps",
  puppeteerInstance: browser,
  timeoutInMilliseconds: 120_000,
})

if (mode === "stills") {
  const dir = path.join(root, `out/frames/${composition.id}`)
  fs.mkdirSync(dir, { recursive: true })
  for (const frame of arg!.split(",").map(Number)) {
    const output = path.join(dir, `${String(frame).padStart(5, "0")}.jpg`)
    await renderStill({
      composition,
      serveUrl,
      frame,
      output,
      imageFormat: "jpeg",
      jpegQuality: 88,
      scale: Number(flag("scale") ?? 0.8),
      puppeteerInstance: browser,
      timeoutInMilliseconds: 120_000,
      onBrowserLog: (log) => {
        if (log.text.startsWith("DUMP")) console.log(log.text)
      },
    })
    console.log(output)
  }
} else {
  let last = 0
  await renderMedia({
    composition,
    serveUrl,
    // A .mov is a lossless-ish ProRes 4444 master from PNG frames, for
    // footage (dither, near-black fades) that jpeg frames would band.
    ...(arg?.endsWith(".mov")
      ? { codec: "prores", proResProfile: "4444", imageFormat: "png" }
      : {
          codec: "h264",
          crf: 16,
          pixelFormat: "yuv420p",
          imageFormat: "jpeg",
          jpegQuality: 95,
        }),
    concurrency: Number(flag("concurrency") ?? 3),
    scale: Number(flag("scale") ?? 1.6),
    frameRange: flag("frames")
      ? (flag("frames")!.split("-").map(Number) as [number, number])
      : null,
    timeoutInMilliseconds: 120_000,
    onBrowserLog: (log) => {
      if (log.text.startsWith("DUMP")) console.log(log.text)
    },
    outputLocation: path.resolve(arg ?? "out/card-looks.mp4"),
    puppeteerInstance: browser,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 20)
      if (p !== last) (console.log(`${p * 5}%`), (last = p))
    },
  })
}
await browser.close({ silent: true })
