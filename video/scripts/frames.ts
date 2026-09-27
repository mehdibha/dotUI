/* Render stills of one composition from a single bundle, plus a contact sheet.

   node scripts/frames.ts <Composition> <frames> [--sheet] [--scale=0.5] [--cols=4] [--concurrency=3]

   <frames>: "0,45,90" · "0-600:30" (range with step) · "all:60"
   Writes out/frames/<Composition>/<frame>.jpg and out/frames/<Composition>.sheet.jpg.
   A scene id bundles only that scene (a broken sibling can't break it).
   Set VIDEO_NO_CACHE=1 to skip webpack's disk cache (parallel runs). */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { bundle } from "@remotion/bundler"
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer"

import { SCENE_LIST } from "../src/scene-list.ts"
import { webpackOverride } from "../webpack.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const [id, spec = "0", ...flags] = process.argv.slice(2)
if (!id) {
  console.error(
    "usage: node scripts/frames.ts <Composition> <frames> [--sheet] [--scale=0.5]",
  )
  process.exit(1)
}
const flag = (name: string) =>
  flags.find((f) => f.startsWith(`--${name}`))?.split("=")[1]
const scale = Number(flag("scale") ?? 0.5)
const cols = Number(flag("cols") ?? 4)
const sheet = flags.includes("--sheet")

const concurrency = Number(flag("concurrency") ?? 3)

// A single scene gets its own entry, so it bundles without its siblings.
const scene = SCENE_LIST.find((s) => s.id === id)
let entryPoint = path.join(root, "src/index.ts")
if (scene) {
  entryPoint = path.join(root, "src/.entries", `${scene.file}.tsx`)
  fs.mkdirSync(path.dirname(entryPoint), { recursive: true })
  fs.writeFileSync(
    entryPoint,
    `import "../styles.css"
import { Composition, registerRoot } from "remotion"
import { Film } from "../film"
import { BAR, FPS, HEIGHT, WIDTH } from "../lib/timing"
import { ${scene.id} as Scene } from "../scenes/${scene.file}"
function Filmed() {
  return <Film><Scene /></Film>
}
registerRoot(() => (
  <Composition id="${scene.id}" component={Filmed} durationInFrames={${scene.bars} * BAR} fps={FPS} width={WIDTH} height={HEIGHT} />
))
`,
  )
}

const serveUrl = await bundle({
  entryPoint,
  webpackOverride,
  enableCaching: !process.env.VIDEO_NO_CACHE,
  onProgress: () => {},
})
const browser = await openBrowser("chrome")
const composition = await selectComposition({
  serveUrl,
  id,
  puppeteerInstance: browser,
})

const last = composition.durationInFrames - 1
const frames = spec.split(",").flatMap((part) => {
  const [range, step] = part.split(":")
  if (range === "all") return steps(0, last, Number(step ?? 60))
  if (range?.includes("-")) {
    const [a, b] = range.split("-").map(Number)
    return steps(a!, Math.min(b!, last), Number(step ?? 30))
  }
  return [Math.min(Number(range), last)]
})

function steps(a: number, b: number, step: number) {
  const out: number[] = []
  for (let f = a; f <= b; f += step) out.push(f)
  return out
}

const dir = path.join(root, "out/frames", id)
fs.rmSync(dir, { recursive: true, force: true })
fs.mkdirSync(dir, { recursive: true })

const files: string[] = []
const queue = [...frames]
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const frame = queue.shift()!
      const output = path.join(dir, `${String(frame).padStart(5, "0")}.jpg`)
      await renderStill({
        composition,
        serveUrl,
        frame,
        output,
        imageFormat: "jpeg",
        jpegQuality: 88,
        scale,
        puppeteerInstance: browser,
      })
      files.push(output)
    }
  }),
)
await browser.close({ silent: true })
files.sort()
console.log(files.map((f) => path.relative(root, f)).join("\n"))

if (sheet) {
  const out = path.join(root, "out/frames", `${id}.sheet.jpg`)
  const rows = Math.ceil(files.length / cols)
  execFileSync(
    fs.existsSync("/opt/homebrew/bin/ffmpeg")
      ? "/opt/homebrew/bin/ffmpeg"
      : "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-pattern_type",
      "glob",
      "-i",
      path.join(dir, "*.jpg"),
      "-vf",
      `scale=480:-1,pad=iw+6:ih+6:3:3:black,tile=${cols}x${rows}`,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      out,
    ],
  )
  console.log(
    `sheet: ${path.relative(root, out)} (frames ${frames.join(", ")})`,
  )
}
