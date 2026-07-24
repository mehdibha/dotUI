import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

/* ----------------------------------------------------------------------------
 * Panel schema
 *
 * The panel is data: a list of sections ("chapters" of one continuous scroll),
 * each a list of atomic `Control`s. A control's widget renders its own complete
 * row — label included, inside the input — so the panel adds no chrome around
 * it. `label`/`keywords` exist for the command palette.
 * -------------------------------------------------------------------------- */

export interface Control {
  id: string
  label: string
  /** Extra search terms for the command palette beyond the label. */
  keywords?: string[]
  /** Renders the whole control (label inside the input). Owns its own hooks. */
  Widget: ComponentType
}

export interface Section {
  id: string
  label: string
  icon: LucideIcon
  /** Chapter-opening live visual — pure preview, not a control. */
  Visual?: ComponentType
  controls: Control[]
}
