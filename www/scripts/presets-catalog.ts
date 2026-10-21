/**
 * Prints every studio axis as Markdown: what it accepts (labels and the
 * systems each option is copied from), Origin's value, and its follows.
 * With --preset, also where each of that preset's values comes from.
 * Run from www/.
 *
 *   tsx scripts/presets-catalog.ts [--preset <id>] [--chapter <id>]
 */
import { parseArgs } from "node:util"

import { getPreset, PRESETS } from "../src/modules/presets"
import {
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  FOLLOWS,
  KEY_OWNER,
  SCHEMA,
} from "../src/modules/studio/axes"
import { OPTIONS } from "../src/modules/studio/axes/meta"

const { values: args } = parseArgs({
  options: {
    preset: { type: "string" },
    chapter: { type: "string" },
  },
})

const preset = args.preset ? getPreset(args.preset) : undefined
if (args.preset && !preset) {
  console.error(
    `unknown preset "${args.preset}". Presets: ${PRESETS.map((p) => p.id).join(", ")}`,
  )
  process.exit(1)
}

const show = (value: unknown) =>
  value === "" || value === null ? "auto" : JSON.stringify(value)

function accepts(key: string): string[] {
  const kind = SCHEMA[key as keyof typeof SCHEMA].value
  if (kind.type === "number")
    return [
      `number ${kind.min}–${kind.max}${kind.step ? ` step ${kind.step}` : ""}`,
    ]
  if (kind.type !== "enum") return [kind.type]
  const options = OPTIONS[key]
  if (!options) return [kind.values.join(" · ")]
  return options.map(({ value, label, description, credits }) => {
    const parts = [`\`${value}\` ${label}`]
    if (description) parts.push(`— ${description}`)
    if (credits?.length) parts.push(`(${credits.join(", ")})`)
    return parts.join(" ")
  })
}

const origin = effective(DEFAULT_STATE).values
const ours = preset ? effective(preset.state) : undefined

/* Where the preset's value comes from: its own diff, a follow, a rule, or
   Origin's default. */
function source(key: string): string {
  if (!preset || !ours) return ""
  if (key in preset.diff) return "set"
  const explain = ours.explain[key as keyof typeof ours.explain]
  if (explain?.rule) return `rule ${explain.rule}`
  if (explain?.via)
    return explain.via === "style" ? "style" : `follows (${explain.via})`
  return "default"
}

const keys = Object.keys(DEFAULTS).filter(
  (key) => !args.chapter || KEY_OWNER[key] === args.chapter,
)
const chapters = [...new Set(keys.map((key) => KEY_OWNER[key]))]

const lines: string[] = [
  `# Studio axes${preset ? ` · ${preset.name}` : ""}`,
  "",
]
if (preset && ours) {
  const counts: Record<string, number> = {}
  for (const key of keys) {
    const [from = ""] = source(key).split(" ")
    counts[from] = (counts[from] ?? 0) + 1
  }
  lines.push(
    `${keys.length} keys: ${Object.entries(counts)
      .map(([from, n]) => `${n} ${from}`)
      .join(", ")}. Keys left at "default" are where reviews miss things.`,
    "",
  )
} else {
  const used = new Set(PRESETS.flatMap((p) => Object.keys(p.diff)))
  const unused = keys.filter((key) => !used.has(key))
  lines.push(
    `${keys.length} keys; ${unused.length} set by no preset: ${unused.join(", ")}.`,
    "",
  )
}

for (const chapter of chapters) {
  lines.push(`## ${chapter}`, "")
  for (const key of keys.filter((k) => KEY_OWNER[k] === chapter)) {
    const follows = FOLLOWS[key]?.map((follow) => follow.id) ?? []
    const head = [
      `- **${key}** · Origin ${show(origin[key as keyof typeof origin])}`,
    ]
    if (
      DEFAULTS[key as keyof typeof DEFAULTS] !==
      origin[key as keyof typeof origin]
    )
      head.push(`(saved ${show(DEFAULTS[key as keyof typeof DEFAULTS])})`)
    if (follows.length) head.push(`· follows ${follows.join(", ")}`)
    if (preset && ours)
      head.push(
        `· **${preset.name} ${show(ours.values[key as keyof typeof ours.values])}** (${source(key)})`,
      )
    lines.push(head.join(" "))
    for (const option of accepts(key)) lines.push(`  - ${option}`)
  }
  lines.push("")
}

console.log(lines.join("\n"))
