import type {
  Registry as ShadcnRegistry,
  RegistryItem as ShadcnRegistryItem,
} from "shadcn/schema"

/**
 * Density tiers a design system can be rendered at. Lives at the registry layer
 * because both the runtime provider and the publish pipeline need it.
 */
export type Density = "compact" | "default" | "comfortable"

/**
 * Component groups for style editor UI organization.
 * Components in the same group share the same visual style.
 */
export type ComponentGroup =
  | "buttons"
  | "inputs"
  | "pickers"
  | "selection-controls"
  | "overlays"
  | "menus-lists"
  | "feedback"
  | "progress"
  | "tags"
  | "navigation"
  | "disclosure"
  | "containers"
  | "sliders"
  | "color-swatches"
  | "calendar"
  | "drop-zone"
  | "typography"
  | "charts"

/* ------------------------------- Params ------------------------------- */

export type RegistryItemFile = NonNullable<ShadcnRegistryItem["files"]>[number]

/**
 * A param: the user picks one of a fixed set of named values. Each value can
 * carry tv slices in `createStyles` and/or CSS vars in `vars` here.
 */
export type EnumParamDef = {
  kind: "enum"
  default: string
  values: readonly string[]
  /**
   * CSS vars a value sets as global tokens, keyed by value name. Lives in
   * meta (not the styles config) so the resolver can read selections from
   * data both server and client always share.
   */
  vars?: Record<string, Record<`--${string}`, string>>
  /**
   * Source substitutions a value applies to the shipped base file, keyed by
   * value name — `{ ChevronDownIcon: "ChevronsUpDownIcon" }` swaps an icon,
   * `{ 'weekdayStyle = "narrow"': 'weekdayStyle = "short"' }` a prop default.
   * The www wrapper (`index.tsx`) mirrors the same choice at runtime.
   */
  source?: Record<string, Record<string, string>>
  files?: Record<string, readonly RegistryItemFile[]>
  /** Registry items only this value needs (a drawer for the mobile-drawer
   *  popover), keyed by value name; shipped only when the value is selected. */
  registryDependencies?: Record<string, readonly string[]>
  description?: string
}

export type ParamDef = EnumParamDef

export type RegistryItem = ShadcnRegistryItem & {
  /** Component group for style editor UI organization */
  group?: ComponentGroup | null
  /** The studio axes this component answers to: 1-of-N named values that
   *  carry tv slices and/or global CSS vars. */
  params?: Record<string, ParamDef>
}

export type Registry = Omit<ShadcnRegistry, "items"> & {
  items: RegistryItem[]
}
