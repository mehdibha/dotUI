import { registryUi } from "@/registry/ui/registry"

/** Every registry item's enum param defaults, by component — the floor under
 *  a resolved design system's component params. */
export const REGISTRY_PARAM_DEFAULTS: Record<
  string,
  Record<string, string>
> = Object.fromEntries(
  registryUi.flatMap((item) => {
    const params = Object.entries(item.params ?? {})
    if (params.length === 0) return []
    return [
      [item.name, Object.fromEntries(params.map(([n, d]) => [n, d.default]))],
    ]
  }),
)
