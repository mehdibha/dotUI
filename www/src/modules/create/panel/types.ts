import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

/* ----------------------------------------------------------------------------
 * Control taxonomy
 *
 * The whole panel is data: a flat list of atomic `Control`s, each tagged on
 * three independent axes so the panel lab can re-group and re-order the SAME
 * controls live (by domain, by tier, or by macro→micro) and the command
 * palette can search them. A control owns only its *widget* (the input) — the
 * label, description and row layout are rendered by the panel chrome from this
 * metadata, so a single control reads correctly in every layout/density.
 * -------------------------------------------------------------------------- */

/** What part of the system a control touches — the "by domain" grouping. */
export type Domain =
  | 'color'
  | 'typography'
  | 'shape'
  | 'spacing'
  | 'elevation'
  | 'motion'
  | 'interaction'
  | 'component'
  | 'icon'
  | 'mode'
  // Extra domains exercised only by the /create?studio experiment (see studio/tweaks).
  | 'brand'
  | 'surface'
  | 'a11y'
  | 'states'

/** Token altitude — the "by tier" grouping (primitive → semantic → component). */
export type Tier = 'primitive' | 'semantic' | 'component'

/** Authoring posture — the "macro → micro" grouping and the front-door filter. */
export type Tempo = 'macro' | 'micro'

/** A binding honesty flag, surfaced in the UI so nothing pretends to be real. */
export type Binding =
  | 'live' // drives the preview through the existing token channel
  | 'stub' // local state only; the preview has no consumer for it yet

export interface Control {
  id: string
  label: string
  description?: string
  domain: Domain
  tier: Tier
  tempo: Tempo
  binding: Binding
  /** Extra search terms for the command palette beyond the label. */
  keywords?: string[]
  /** Renders the input widget only (no label) unless `block`. Owns its own hooks. */
  Widget: ComponentType
  /**
   * When true the widget renders its own complete UI (its own labels/structure,
   * e.g. the full color editor) and the chrome must not wrap it in a label row.
   */
  block?: boolean
}

export interface Section {
  id: string
  label: string
  domain: Domain
  icon: LucideIcon
  controls: Control[]
}

/* ----------------------------------------------------------------------------
 * Panel lab config — the shape the meta-tool mutates live
 * -------------------------------------------------------------------------- */

/** Navigation / information-architecture pattern for the whole panel. */
export type LayoutId =
  | 'scroll' // long scroll, sticky section headers
  | 'tabs' // tabbed top-level sections
  | 'accordion' // collapsible groups
  | 'sidebar' // sidebar-of-sections + content pane
  | 'command' // search-first, minimal chrome

/** How the same controls are bucketed into sections. */
export type Grouping = 'domain' | 'tier' | 'tempo'

export type PanelDensity = 'compact' | 'comfortable'
export type RowLayout = 'inline' | 'stacked'
export type DockSide = 'left' | 'right'

export interface HeaderConfig {
  showBrand: boolean
  showName: boolean
  showMode: boolean
  showSearch: boolean
  showReroll: boolean
  tall: boolean
  sticky: boolean
}

export interface PanelConfig {
  layout: LayoutId
  grouping: Grouping
  density: PanelDensity
  rowLayout: RowLayout
  showDescriptions: boolean
  /** Show the macro front door (Quick posture) pinned above the controls. */
  showMacros: boolean
  /** Reveal micro controls; off = macros-only (the hobbyist front door). */
  advanced: boolean
  width: number
  dockSide: DockSide
  stickyFooter: boolean
  header: HeaderConfig
}
