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

import { publish, selectPublishable } from "./publish"
import type { PublishPreset } from "./types"

const KNOWN_NAMES: ReadonlySet<string> = new Set(PUBLISHABLE_NAMES)

// A fixed, conventional baseline — the consumer reformats with their own
// Prettier/Biome rules on commit, so formatting isn't a `codeOptions` axis.
// Only meant to keep the shipped + previewed source readable.
const OUTPUT_FORMAT = { printWidth: 80 } as const

export interface PublishItemInput {
  name: string
  preset: PublishPreset
  /** Origin transitive deps resolve to, e.g. `https://dotui.org`. */
  origin: string
  /** The preset's query (without `?`) transitive dep URLs carry. */
  query: string
}

/** The published item for `name`, or `undefined` when no publishable exists. */
export async function publishItem(
  input: PublishItemInput,
): Promise<RegistryItem | undefined> {
  const loader = publishables[input.name]
  if (!loader) return undefined

  const mod = await loader()
  const { item } = publish({
    publishable: selectPublishable(mod, input.preset),
    preset: input.preset,
    // Transitive deps point back at this origin with the same preset.
    deps: {
      origin: input.origin,
      query: `?${input.query}`,
      known: KNOWN_NAMES,
    },
  })

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
