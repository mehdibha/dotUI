/* Render the film: one bundle, one MP4 per scene (a crash or a re-take only
   costs that scene), then a lossless concat into out/launch.mp4.

   node scripts/render.ts [--scenes=Open,Wall] [--scale=1] [--concurrency=3] [--music=public/track.mp3]

   --scenes re-renders only those scenes and re-concats with the existing
   takes of the others. --scale=2 renders a 4K master (to out/launch@2x.mp4). */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import { renderMedia, selectComposition } from "@remotion/renderer"

import { SCENE_LIST } from "../src/scene-list.ts"
import { makeWebpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]
const scale = Number(flag("scale") ?? 1)
const concurrency = Number(flag("concurrency") ?? 3)
const only = flag("scenes")?.split(",")
const music = flag("music")
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
  const output = path.join(dir, `${scene.file}${suffix}.mp4`)
  takes.push(output)
  if (only && !only.includes(scene.id) && fs.existsSync(output)) continue
  const composition = await selectComposition({ serveUrl, id: scene.id })
  for (let attempt = 1; ; attempt++) {
    try {
      const started = performance.now()
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
        timeoutInMilliseconds: 120_000,
        outputLocation: output,
        onProgress: ({ progress }) =>
          process.stdout.write(
            `\r${scene.id}: ${Math.round(progress * 100)}%   `,
          ),
      })
      const s = (performance.now() - started) / 1000
      console.log(`\r${scene.id}: done in ${s.toFixed(0)}s`)
      break
    } catch (error) {
      if (attempt >= 3) throw error
      console.log(`\n${scene.id}: attempt ${attempt} failed, retrying`, error)
    }
  }
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
