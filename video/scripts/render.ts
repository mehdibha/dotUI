/* Render the film: one bundle, one MP4 per scene, then a lossless concat into
   out/launch.mp4.

   node scripts/render.ts [--scenes=Open,Wall] [--skip=Patterns] [--scale=1] [--concurrency=3] [--chunk=60] [--music=public/track.mp3]

   Heavy scenes grow a Chrome page's memory until the tab drops, and Remotion
   can then throw outside any promise. So every chunk (default: half a bar)
   renders in its own child process on a fresh browser, is retried when that
   process dies or stalls, and is kept on disk under the bundle's hash:
   rerunning the same code resumes where it stopped. --scenes re-renders only
   those scenes and re-concats with the existing takes of the others. --skip leaves scenes
   out of the cut. --scale=2 renders a 4K master (to out/launch@2x.mp4). */

import { execFileSync, spawn } from "node:child_process"
import { createHash } from "node:crypto"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import { openBrowser, renderMedia, selectComposition } from "@remotion/renderer"

import { BAR } from "../src/lib/timing.ts"
import { SCENE_LIST } from "../src/scene-list.ts"
import { makeWebpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]
const scale = Number(flag("scale") ?? 1)
const concurrency = Number(flag("concurrency") ?? 3)
const ffmpeg = fs.existsSync("/opt/homebrew/bin/ffmpeg")
  ? "/opt/homebrew/bin/ffmpeg"
  : "ffmpeg"

/* ---- worker: one chunk, one process ------------------------------------ */

if (process.argv[2] === "--worker") {
  const [, , , serveUrl, id, a, b, output] = process.argv
  process.on("uncaughtException", () => process.exit(1))
  process.on("unhandledRejection", () => process.exit(1))
  const browser = await openBrowser("chrome")
  const composition = await selectComposition({
    serveUrl: serveUrl!,
    id: id!,
    puppeteerInstance: browser,
  })
  await renderMedia({
    composition,
    serveUrl: serveUrl!,
    codec: "h264",
    crf: 16,
    pixelFormat: "yuv420p",
    imageFormat: "jpeg",
    jpegQuality: 95,
    scale,
    concurrency,
    frameRange: [Number(a), Number(b)],
    timeoutInMilliseconds: 120_000,
    outputLocation: `${output}.tmp.mp4`,
    puppeteerInstance: browser,
  })
  fs.renameSync(`${output}.tmp.mp4`, output!)
  await browser.close({ silent: true }).catch(() => {})
  process.exit(0)
}

/* ---- parent ------------------------------------------------------------ */

const chunk = Number(flag("chunk") ?? 60)
const only = flag("scenes")?.split(",")
const skip = flag("skip")?.split(",") ?? []
const music = flag("music")
const suffix = scale === 1 ? "" : `@${scale}x`
const dir = path.join(root, "out/scenes")
fs.mkdirSync(dir, { recursive: true })

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  webpackOverride: makeWebpackOverride({
    root,
    resolve: createRequire(import.meta.url).resolve,
  }),
  outDir: path.join(root, "out/bundle"),
  onProgress: () => {},
})

const hash = createHash("sha1")
  .update(fs.readFileSync(path.join(root, "out/bundle/bundle.js")))
  .digest("hex")
  .slice(0, 8)
for (const p of fs.readdirSync(dir))
  if (p.includes(".part-") && !p.includes(`.${hash}.`))
    fs.rmSync(path.join(dir, p))

function runChunk(id: string, a: number, b: number, output: string) {
  return new Promise<boolean>((resolve) => {
    const child = spawn(
      process.execPath,
      [
        fileURLToPath(import.meta.url),
        "--worker",
        serveUrl,
        id,
        String(a),
        String(b),
        output,
        `--scale=${scale}`,
        `--concurrency=${concurrency}`,
      ],
      { stdio: "ignore" },
    )
    // A chunk that stalls is killed and retried.
    const timer = setTimeout(
      () => child.kill("SIGKILL"),
      Math.max(180, (b - a + 1) * 4) * 1000,
    )
    child.on("exit", (code) => {
      clearTimeout(timer)
      resolve(code === 0 && fs.existsSync(output))
    })
  })
}

const takes: string[] = []
for (const scene of SCENE_LIST) {
  if (skip.includes(scene.id)) continue
  const output = path.join(dir, `${scene.file}${suffix}.mp4`)
  takes.push(output)
  if (!only?.includes(scene.id) && fs.existsSync(output)) continue
  const frames = scene.bars * BAR
  const parts: string[] = []
  const started = performance.now()
  for (let a = 0; a < frames; a += chunk) {
    const b = Math.min(a + chunk, frames) - 1
    const part = path.join(dir, `${scene.file}${suffix}.part-${a}.${hash}.mp4`)
    parts.push(part)
    if (fs.existsSync(part)) continue
    for (let attempt = 1; ; attempt++) {
      process.stdout.write(`\r${scene.id} ${a}-${b} (try ${attempt})     `)
      if (await runChunk(scene.id, a, b, part)) break
      if (attempt >= 4) throw new Error(`${scene.id} ${a}-${b} failed`)
    }
  }
  const list = path.join(dir, `${scene.file}${suffix}.parts.txt`)
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"))
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
    "-c",
    "copy",
    output,
  ])
  for (const p of [...parts, list]) fs.rmSync(p)
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
