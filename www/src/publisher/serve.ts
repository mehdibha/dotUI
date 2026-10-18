/**
 * Publish one registry item the way `/r/<name>.json` serves it: select the
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

/**
 * Format one shipped file. A fixed baseline — the consumer reformats with their
 * own rules, so formatting isn't a `codeOptions` axis. Throws on a parse error:
 * the publisher emitted broken code.
 */
export async function formatShippedFile(
  filePath: string,
  content: string,
): Promise<string> {
  const { code, errors } = await format(filePath, content, { printWidth: 80 })
  if (errors.length > 0) {
    throw new Error(
      `[publisher] ${filePath} doesn't parse:${errors.map((e) => e.codeframe ?? ` ${e.message}`).join("")}`,
    )
  }
  return code
}

export interface PublishItemInput {
  name: string
  preset: PublishPreset
  /** Where a registry dep is served, e.g. `https://dotui.org/r/loader.json`. */
  itemUrl: (name: string) => string
}

/** The published item for `name`, or `undefined` when no publishable exists. */
export async function publishItem(
  input: PublishItemInput,
): Promise<RegistryItem | undefined> {
  const loader = KNOWN_NAMES.has(input.name) && publishables[input.name]
  if (!loader) return undefined

  const mod = await loader()
  const { item } = publish({
    publishable: selectPublishable(mod, input.preset),
    preset: input.preset,
    deps: { url: input.itemUrl, known: KNOWN_NAMES },
  })

  if (item.files) {
    item.files = (await Promise.all(
      item.files.map(async (file) => ({
        ...file,
        content: await formatShippedFile(file.path, file.content ?? ""),
      })),
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
