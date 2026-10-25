// Validates data/catalog.json + every systems/ dir against the schema and
// emits the static index consumed by routes at build time. `--check` validates
// only. Exits non-zero on any violation so CI fails on bad data.
import fs from "node:fs"
import path from "node:path"

import { PRESET_CATALOG } from "../../www/src/modules/presets/__generated__/catalog"
import { blocksFileSchema } from "../src/data/blocks"
import type { BlocksFile } from "../src/data/blocks"
import { docsFileSchema } from "../src/data/docs"
import type { DocsFile } from "../src/data/docs"
import { CORE_COMPONENTS, looksFileSchema, MODES } from "../src/data/looks"
import {
  catalogSchema,
  colorsFileSchema,
  componentsCatalogSchema,
  componentsFileSchema,
  systemSchema,
} from "../src/data/schema"
import { pageLabel } from "../src/data/schema"
import type { CapturedSystem, DataIndex, SystemEntry } from "../src/data/schema"
import { specFileSchema } from "../src/data/spec"
import type { SpecFile } from "../src/data/spec"

const root = path.resolve(import.meta.dirname, "..")
const dataDir = path.join(root, "data")
const outFile = path.join(root, "src", "data", "__generated__", "index.json")
const checkOnly = process.argv.includes("--check")

const errors: string[] = []

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    errors.push(`${path.relative(root, file)}: ${(error as Error).message}`)
    return undefined
  }
}

const catalogRaw = readJson(path.join(dataDir, "catalog.json"))
const catalogResult = catalogSchema.safeParse(catalogRaw)
if (!catalogResult.success) {
  errors.push(`data/catalog.json: ${catalogResult.error.message}`)
}

const componentsCatalogRaw = readJson(path.join(dataDir, "components.json"))
const componentsCatalogResult =
  componentsCatalogSchema.safeParse(componentsCatalogRaw)
if (!componentsCatalogResult.success) {
  errors.push(`data/components.json: ${componentsCatalogResult.error.message}`)
}
const canonicalComponents = new Set(
  componentsCatalogResult.success
    ? componentsCatalogResult.data.components.map((c) => c.slug)
    : [],
)

const systemsDir = path.join(root, "systems")
const systemDirs = fs.existsSync(systemsDir)
  ? fs
      .readdirSync(systemsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []

const systems: SystemEntry[] = []
const looks: CapturedSystem[] = []

for (const dir of systemDirs) {
  const rel = `systems/${dir}`

  // A captured product's looks. It can come before the system is researched,
  // so it needs no system.json.
  const looksPath = path.join(systemsDir, dir, "looks.json")
  if (fs.existsSync(looksPath)) {
    const looksResult = looksFileSchema.safeParse(readJson(looksPath))
    if (!looksResult.success) {
      errors.push(`${rel}/looks.json: ${looksResult.error.message}`)
    } else if (looksResult.data.slug !== dir) {
      errors.push(`${rel}/looks.json: slug must match its directory name`)
    } else {
      const { preset, capture, components } = looksResult.data
      const name = PRESET_CATALOG.find((p) => p.id === preset)?.name
      if (!name) errors.push(`${rel}/looks.json: unknown preset "${preset}"`)
      const all = Object.values(components).flatMap((c) => c.looks)
      looks.push({
        slug: dir,
        name: name ?? dir,
        date: capture.date,
        pages: capture.pages.length,
        signedIn: capture.pages.filter((p) => p.signedIn).length,
        modes: MODES.filter((mode) =>
          capture.pages.some((p) => p.modes.includes(mode)),
        ),
        core: CORE_COMPONENTS.filter((c) => components[c]?.looks.length).length,
        looks: all.length,
        off: all.filter((l) => l.off?.length).length,
      })
    }
  }
  // Its components as variants × sizes grids, from the same capture.
  const specPath = path.join(systemsDir, dir, "spec.json")
  let spec: SpecFile | undefined
  if (fs.existsSync(specPath)) {
    const specResult = specFileSchema.safeParse(readJson(specPath))
    if (!specResult.success)
      errors.push(`${rel}/spec.json: ${specResult.error.message}`)
    else if (specResult.data.slug !== dir)
      errors.push(`${rel}/spec.json: slug must match its directory name`)
    else spec = specResult.data
  }
  // Its blocks: composed pieces frozen whole, and their pages' regions.
  const blocksPath = path.join(systemsDir, dir, "blocks.json")
  let blocks: BlocksFile | undefined
  if (fs.existsSync(blocksPath)) {
    const blocksResult = blocksFileSchema.safeParse(readJson(blocksPath))
    if (!blocksResult.success)
      errors.push(`${rel}/blocks.json: ${blocksResult.error.message}`)
    else if (blocksResult.data.slug !== dir)
      errors.push(`${rel}/blocks.json: slug must match its directory name`)
    else {
      blocks = blocksResult.data
      for (const block of blocks.blocks)
        if (!blocks.pages.some((page) => page.key === block.page))
          errors.push(
            `${rel}/blocks.json: block ${block.name} is on page ${block.page}, which has no entry in pages`,
          )
    }
  }
  // Its written docs, over the looks, the spec and the blocks: every key they
  // name must still be there, so a re-capture that moves one fails here.
  const docsPath = path.join(systemsDir, dir, "docs.json")
  let docs: DocsFile | undefined
  if (fs.existsSync(docsPath)) {
    const docsResult = docsFileSchema.safeParse(readJson(docsPath))
    if (!docsResult.success)
      errors.push(`${rel}/docs.json: ${docsResult.error.message}`)
    else if (docsResult.data.slug !== dir)
      errors.push(`${rel}/docs.json: slug must match its directory name`)
    else {
      docs = docsResult.data
      for (const [key, section] of Object.entries(docs.sections)) {
        for (const [group, entries] of Object.entries(section.groups ?? {})) {
          const grid = spec?.components[key]?.grids.find(
            (g) => g.group === group,
          )
          for (const axis of ["variants", "sizes"] as const)
            for (const id of Object.keys(entries[axis] ?? {}))
              if (!grid?.[axis].some((entry) => entry.key === id))
                errors.push(
                  `${rel}/docs.json: ${key}.${group}.${axis}.${id} is not in spec.json`,
                )
        }
      }
      for (const name of Object.keys(docs.blocks ?? {}))
        if (!blocks?.blocks.some((block) => block.name === name))
          errors.push(`${rel}/docs.json: block ${name} is not in blocks.json`)
      for (const key of Object.keys(docs.pages ?? {}))
        if (!blocks?.pages.some((page) => page.key === key))
          errors.push(`${rel}/docs.json: page ${key} is not in blocks.json`)
    }
  }
  const captured = looks.find((entry) => entry.slug === dir)
  if (captured && blocks)
    captured.blockPages = blocks.pages.map(
      (page) => docs?.pages?.[page.key]?.title ?? pageLabel(page.key),
    )
  if (!fs.existsSync(path.join(systemsDir, dir, "system.json"))) continue
  const systemResult = systemSchema.safeParse(
    readJson(path.join(systemsDir, dir, "system.json")),
  )
  if (!systemResult.success) {
    errors.push(`${rel}/system.json: ${systemResult.error.message}`)
    continue
  }
  if (systemResult.data.slug !== dir) {
    errors.push(
      `${rel}/system.json: slug "${systemResult.data.slug}" must match its directory name`,
    )
  }

  const entry: SystemEntry = { ...systemResult.data }

  // Components data is optional and independent of colors — a system can be
  // component-explorable before it is color-explorable, and vice versa.
  const componentsPath = path.join(systemsDir, dir, "components.json")
  if (fs.existsSync(componentsPath)) {
    const componentsResult = componentsFileSchema.safeParse(
      readJson(componentsPath),
    )
    if (!componentsResult.success) {
      errors.push(`${rel}/components.json: ${componentsResult.error.message}`)
    } else {
      for (const component of componentsResult.data.components) {
        if (
          component.component !== null &&
          !canonicalComponents.has(component.component)
        ) {
          errors.push(
            `${rel}/components.json: "${component.name}" maps to unknown canonical component "${component.component}"`,
          )
        }
      }
      entry.components = componentsResult.data
    }
  }

  // Color data is optional — a system can be explorable before its ramps and
  // tokens have been researched.
  const colorsPath = path.join(systemsDir, dir, "colors.json")
  if (!fs.existsSync(colorsPath)) {
    systems.push(entry)
    continue
  }

  const colorsResult = colorsFileSchema.safeParse(readJson(colorsPath))
  if (!colorsResult.success) {
    errors.push(`${rel}/colors.json: ${colorsResult.error.message}`)
    continue
  }

  // Every per-mode value must use a declared mode, so the mode switcher and
  // table columns can trust `modes` as the complete set.
  const colors = colorsResult.data
  const modes = new Set(colors.modes)
  const checkValues = (values: Record<string, string>, where: string) => {
    for (const mode of Object.keys(values)) {
      if (!modes.has(mode)) {
        errors.push(
          `${rel}/colors.json: ${where} uses undeclared mode "${mode}"`,
        )
      }
    }
  }
  for (const ramp of colors.ramps) {
    for (const step of ramp.steps) {
      checkValues(step.values, `ramp "${ramp.name}" step ${step.step}`)
    }
  }
  for (const group of colors.tokenGroups) {
    for (const token of group.tokens) {
      checkValues(token.values, `token "${token.name}"`)
    }
  }
  for (const pair of colors.contrast) {
    if (pair.mode !== null && !modes.has(pair.mode)) {
      errors.push(
        `${rel}/colors.json: contrast pair "${pair.label}" uses undeclared mode "${pair.mode}"`,
      )
    }
  }

  systems.push({ ...entry, colors })
}

for (const entry of catalogResult.success ? catalogResult.data.systems : []) {
  if (entry.preset && !looks.some((l) => l.slug === entry.preset)) {
    errors.push(
      `data/catalog.json: "${entry.slug}" opens preset "${entry.preset}", which has no looks.json`,
    )
  }
}

if (errors.length > 0) {
  console.error(`[build-data-index] ${errors.length} problem(s):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

if (!checkOnly) {
  const index: DataIndex = {
    catalog: catalogResult.success ? catalogResult.data.systems : [],
    componentsCatalog: componentsCatalogResult.success
      ? componentsCatalogResult.data.components
      : [],
    systems,
    looks,
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, `${JSON.stringify(index, null, 2)}\n`)
}

console.log(
  `[build-data-index] ${systemDirs.length} system(s)${checkOnly ? " — valid" : ` → ${path.relative(root, outFile)}`}`,
)
