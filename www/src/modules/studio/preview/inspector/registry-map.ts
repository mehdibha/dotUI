import { registryUi } from "@/registry/ui/registry"

export interface InspectorEntry {
  /** Exported component name, e.g. "MenuItem". */
  name: string
  /** Registry item slug, e.g. "menu". */
  slug: string
  /** Whether the item has params — i.e. a panel section to jump to. */
  customizable: boolean
}

// Identification is by identity, not by name: every component the previews can
// render is imported from `@/registry/ui/<slug>`, so matching fibers against
// these exact exports is minification-safe and can never flag non-dotUI
// components. Loaded lazily — only when the inspector is switched on.
const modules = import.meta.glob("/src/registry/ui/*/index.tsx")

async function build(): Promise<Map<unknown, InspectorEntry>> {
  const customizable = new Set(
    registryUi
      .filter((item) => item.params && Object.keys(item.params).length > 0)
      .map((item) => item.name),
  )

  const loaded = await Promise.all(
    Object.entries(modules).map(async ([path, load]) => {
      try {
        return [path, (await load()) as Record<string, unknown>] as const
      } catch {
        return null
      }
    }),
  )

  const map = new Map<unknown, InspectorEntry>()
  for (const item of loaded) {
    if (!item) continue
    const [path, mod] = item
    const slug = path.split("/").at(-2)!
    for (const [exportName, value] of Object.entries(mod)) {
      // Components only — styles/hooks exports are lowercase.
      if (!/^[A-Z]/.test(exportName)) continue
      const entry: InspectorEntry = {
        name: exportName,
        slug,
        customizable: customizable.has(slug),
      }
      // Register the export and its memo/forwardRef inners — a fiber's `type`
      // can hold either, depending on how React resolved the wrapper.
      let v: unknown = value
      while (
        typeof v === "function" ||
        (typeof v === "object" && v !== null && "$$typeof" in v)
      ) {
        if (!map.has(v)) map.set(v, entry)
        const inner =
          (v as { type?: unknown }).type ?? (v as { render?: unknown }).render
        if (inner == null || inner === v) break
        v = inner
      }
    }
  }
  return map
}

let mapPromise: Promise<Map<unknown, InspectorEntry>> | null = null

export function loadInspectorRegistry() {
  mapPromise ??= build()
  return mapPromise
}
