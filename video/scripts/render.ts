/* Render the film: one bundle, one MP4 per scene (a crash or a re-take only
   costs that scene), then a lossless concat into out/launch.mp4.

   node scripts/render.ts [--scenes=Open,Wall] [--skip=Patterns] [--scale=1] [--concurrency=3] [--chunk=120] [--music=public/track.mp3]

   --scenes re-renders only those scenes and re-concats with the existing
   takes of the others. --skip leaves scenes out of the cut (a preview while one
   is broken). --scale=2 renders a 4K master (to out/launch@2x.mp4). */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import {
  makeCancelSignal,
  openBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer"

import { SCENE_LIST } from "../src/scene-list.ts"
import { makeWebpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]
const scale = Number(flag("scale") ?? 1)
const concurrency = Number(flag("concurrency") ?? 3)
const only = flag("scenes")?.split(",")
const skip = flag("skip")?.split(",") ?? []
const music = flag("music")
const chunk = Number(flag("chunk") ?? 120)
const suffix = scale === 1 ? "" : `@${scale}x`
const ffmpeg = fs.existsSync("/opt/homebrew/bin/ffmpeg")
  ? "/opt/homebrew/bin/ffmpeg"
  : "ffmpeg"

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  webpackOverride: makeWebpackOverride({
    root,
    resolve: createRequire(import.meta.url).resolve,
  }),
  onProgress: () => {},
})

const dir = path.join(root, "out/scenes")
fs.mkdirSync(dir, { recursive: true })
const takes: string[] = []

for (const scene of SCENE_LIST) {
  if (skip.includes(scene.id)) continue
  const output = path.join(dir, `${scene.file}${suffix}.mp4`)
  takes.push(output)
  if (only && !only.includes(scene.id) && fs.existsSync(output)) continue
  const composition = await selectComposition({ serveUrl, id: scene.id })
  const parts: string[] = []
  const started = performance.now()
  for (let a = 0; a < composition.durationInFrames; a += chunk) {
    const b = Math.min(a + chunk, composition.durationInFrames) - 1
    const part = path.join(dir, `${scene.file}${suffix}.${a}.mp4`)
    parts.push(part)
    for (let attempt = 1; ; attempt++) {
      const browser = await openBrowser("chrome")
      const { cancelSignal, cancel } = makeCancelSignal()
      // A chunk that stalls (a dropped tab Remotion keeps retrying) is cancelled.
      const timer = setTimeout(cancel, Math.max(120, (b - a + 1) * 3) * 1000)
      try {
        await renderMedia({
          composition,
          serveUrl,
          codec: "h264",
          crf: 16,
          pixelFormat: "yuv420p",
          imageFormat: "jpeg",
          jpegQuality: 95,
          scale,
          concurrency,
          frameRange: [a, b],
          timeoutInMilliseconds: 120_000,
          outputLocation: part,
          puppeteerInstance: browser,
          cancelSignal,
          onProgress: ({ progress }) =>
            process.stdout.write(
              `\r${scene.id} ${a}-${b}: ${Math.round(progress * 100)}%   `,
            ),
        })
        break
      } catch (error) {
        if (attempt >= 3) throw error
        console.log(
          `\n${scene.id} ${a}-${b}: attempt ${attempt} failed, retrying`,
        )
      } finally {
        clearTimeout(timer)
        await browser.close({ silent: true }).catch(() => {})
      }
    }
  }
  const partsList = path.join(dir, `${scene.file}${suffix}.parts.txt`)
  fs.writeFileSync(partsList, parts.map((p) => `file '${p}'`).join("\n"))
  execFileSync(ffmpeg, [
    "-v",
    "error",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    partsList,
    "-c",
    "copy",
    output,
  ])
  for (const p of [...parts, partsList]) fs.rmSync(p)
  const s = (performance.now() - started) / 1000
  console.log(`\r${scene.id}: done in ${s.toFixed(0)}s          `)
}

const list = path.join(dir, `list${suffix}.txt`)
fs.writeFileSync(list, takes.map((t) => `file '${t}'`).join("\n"))
const out = path.join(root, `out/launch${suffix}.mp4`)
execFileSync(ffmpeg, [
  "-v",
  "error",
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  list,
  ...(music ? ["-i", path.resolve(root, music)] : []),
  ...(music
    ? [
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "320k",
        "-shortest",
      ]
    : ["-c", "copy"]),
  "-movflags",
  "+faststart",
  out,
])
console.log(`film: ${path.relative(root, out)}`)
