/* `GET /r/…`: the shadcn registry, per design system.
     /r/<name>.json              Origin
     /r/p/<preset>/<name>.json   a built-in preset
     /r/s/<id>/<name>.json       a published snapshot
   `<name>` is a component, a `font-*` item, `init` (what `shadcn init`
   consumes), `registry` (the index) or `v0` (the "Open in v0" project).
   `?code=` sets the code style; every URL an item emits keeps the prefix and
   the flags. */

import type { SnapshotStore } from "@/lib/snapshots/store"
import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables"
import { registryUi } from "@/registry/__generated__/registry-items"
import { emitFontItem } from "@/publisher/emit-font"
import { emitInitItem } from "@/publisher/emit-theme"
import { registryDepsFor } from "@/publisher/publish"
import { publishItem } from "@/publisher/serve"
import type { PublishPreset } from "@/publisher/types"

import { parseRegistryRequest, resolveSource } from "./request"
import { guard, notFound, registryJson } from "./response"

const META_BY_NAME = new Map(registryUi.map((item) => [item.name, item]))

/** The discovery index: identity and dependency metadata per installable
 *  item; files come from `<name>.json`. Library primitives ship in `init`. */
function registryIndex(origin: string, preset: PublishPreset) {
  const items = [...PUBLISHABLE_NAMES]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const item = META_BY_NAME.get(name)
      if (!item) return { name, type: "registry:ui" }
      const registryDependencies = registryDepsFor(
        item,
        preset.componentParams[name] ?? {},
      )
      return {
        name: item.name,
        type: item.type,
        ...(item.title !== undefined ? { title: item.title } : {}),
        ...(item.description !== undefined
          ? { description: item.description }
          : {}),
        ...(item.dependencies ? { dependencies: item.dependencies } : {}),
        ...(item.devDependencies
          ? { devDependencies: item.devDependencies }
          : {}),
        ...(registryDependencies.length > 0 ? { registryDependencies } : {}),
      }
    })
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "dotui",
    homepage: origin,
    items,
  }
}

export const serveRegistry = (request: Request, store: SnapshotStore) =>
  guard(async () => {
    const url = new URL(request.url)
    const parsed = parseRegistryRequest(url)
    if (!parsed.ok) return parsed.response
    const { name, source, codeOptions, itemUrl } = parsed.value

    const designSystem = await resolveSource(source, store)
    if (!designSystem) return notFound("No design system by this id.")
    const preset: PublishPreset = { ...designSystem, codeOptions }

    if (name === "registry")
      return registryJson(registryIndex(url.origin, preset))
    if (name === "init")
      return registryJson(emitInitItem({ baseRegistryCss, preset, itemUrl }))
    if (name === "v0") {
      const { v0Item } = await import("./v0")
      return registryJson(await v0Item(preset))
    }
    const item = name.startsWith("font-")
      ? emitFontItem(name)
      : await publishItem({ name, preset, itemUrl })
    return item
      ? registryJson(item)
      : notFound("No registry item by this name.")
  })
