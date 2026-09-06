/**
 * Publish one registry item the way `/r/$name` serves it: select the
 * publishable for the preset, publish, and format every shipped file. Shared
 * by the route and the examples preview so both produce the same files.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 */

import { format } from "oxfmt"

import {
  publishables,
  PUBLISHABLE_NAMES,
} from "@/registry/__generated__/publishables"
import type { RegistryItem } from "@/registry/types"

import {
  publish,
  selectPublishable,
  setDotuiDepResolver,
  setKnownDotuiNames,
} from "./publish"
import type { PublishPreset } from "./types"

// Prime the dep rewriter with every component name we ship. Module scope so
// it runs once per bundle load.
setKnownDotuiNames(PUBLISHABLE_NAMES)

// A fixed, conventional baseline — the consumer reformats with their own
// Prettier/Biome rules on commit, so formatting isn't a `codeOptions` axis.
// Only meant to keep the shipped + previewed source readable.
const OUTPUT_FORMAT = { printWidth: 80 } as const

export interface PublishItemInput {
  name: string
  preset: PublishPreset
  /** Origin transitive deps resolve to, e.g. `https://dotui.org`. */
  origin: string
  /** Encoded preset carried on transitive dep URLs. */
  encodedPreset?: string
}

/** The published item for `name`, or `undefined` when no publishable exists. */
export async function publishItem(
  input: PublishItemInput,
): Promise<RegistryItem | undefined> {
  const loader = publishables[input.name]
  if (!loader) return undefined

  // Transitive deps become absolute URLs back at the origin (with the preset
  // preserved) so `shadcn add` can follow them without a registry mapping in
  // the consumer's components.json.
  setDotuiDepResolver(
    input.origin,
    input.encodedPreset ? `?preset=${input.encodedPreset}` : "",
  )

  const mod = await loader()
  const publishable = selectPublishable(mod, input.preset)
  const { item } = publish({ publishable, preset: input.preset })

  // Format per-file — a base `.tsx` and a secondary `.ts` hook carry different
  // content and need their own parser. A formatter failure keeps the raw
  // content; it still works.
  if (item.files) {
    item.files = (await Promise.all(
      item.files.map(async (file) => {
        try {
          const result = await format(
            file.path,
            file.content ?? "",
            OUTPUT_FORMAT,
          )
          return { ...file, content: result.code }
        } catch {
          return file
        }
      }),
    )) as typeof item.files
  }
  return item
}

/** Where a shipped file lands in a consumer project using the default aliases. */
export function consumerPath(filePath: string): string {
  if (filePath.startsWith("ui/"))
    return `src/components/ui/${filePath.slice(3)}`
  if (filePath.startsWith("lib/")) return `src/lib/${filePath.slice(4)}`
  if (filePath.startsWith("hooks/")) return `src/hooks/${filePath.slice(6)}`
  return `src/${filePath}`
}
