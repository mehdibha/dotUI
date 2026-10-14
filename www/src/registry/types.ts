import type {
  Registry as ShadcnRegistry,
  RegistryItem as ShadcnRegistryItem,
} from "shadcn/schema"

/** Density tiers a design system can be rendered at. */
export type Density = "compact" | "default" | "comfortable"

export type RegistryItemFile = NonNullable<ShadcnRegistryItem["files"]>[number]

/**
 * A param: one of a fixed set of named values. Each value can carry tv slices
 * in `createStyles` and/or CSS vars in `vars`.
 */
export type ParamDef = {
  default: string
  values: readonly string[]
  /** CSS vars a value sets as global tokens, keyed by value name. */
  vars?: Record<string, Record<`--${string}`, string>>
  /**
   * Source substitutions a value applies to the shipped base file, keyed by
   * value name (`{ ChevronDownIcon: "ChevronsUpDownIcon" }`). The www wrapper
   * (`index.tsx`) must mirror the same choice at runtime.
   */
  source?: Record<string, Record<string, string>>
  files?: Record<string, readonly RegistryItemFile[]>
  /**
   * Registry items only this value needs, keyed by value name; shipped only
   * when selected.
   */
  registryDependencies?: Record<string, readonly string[]>
  description?: string
}

export type RegistryItem = ShadcnRegistryItem & {
  /** The studio axes this component answers to. */
  params?: Record<string, ParamDef>
}

export type Registry = Omit<ShadcnRegistry, "items"> & {
  items: RegistryItem[]
}
