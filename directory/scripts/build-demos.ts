// Materializes live component demos: reads every systems/<slug>/components.json
// and writes each entry's demo document to public/demos/<slug>/<component>.html,
// where the explorer's sandboxed iframes load them. public/demos/ is generated
// (gitignored) — the committed source of truth is the data file.
import fs from "node:fs"
import path from "node:path"

import { componentsFileSchema } from "../src/data/schema"

const root = path.resolve(import.meta.dirname, "..")
const systemsDir = path.join(root, "systems")
const outRoot = path.join(root, "public", "demos")

fs.rmSync(outRoot, { recursive: true, force: true })

const systemDirs = fs.existsSync(systemsDir)
  ? fs
      .readdirSync(systemsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []

function demoBasename(component: string | null, name: string): string {
  return (
    component ??
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  )
}

let written = 0
for (const dir of systemDirs) {
  const file = path.join(systemsDir, dir, "components.json")
  if (!fs.existsSync(file)) continue
  const data = componentsFileSchema.parse(
    JSON.parse(fs.readFileSync(file, "utf8")),
  )
  const outDir = path.join(outRoot, dir)
  for (const component of data.components) {
    if (!component.demo) continue
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(
      path.join(
        outDir,
        `${demoBasename(component.component, component.name)}.html`,
      ),
      component.demo.html,
    )
    written++
  }
}

console.log(`[build-demos] ${written} demo page(s) → public/demos/`)
