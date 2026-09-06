import type { IconLibraryName } from "@/registry/icons/icon-map"
import type { ColorConfig } from "@/registry/theme"
import type { Density } from "@/registry/types"
import type { CodeOptions } from "@/publisher/code-options"

export type { CodeOptions, Density, IconLibraryName }

/**
 * The engine's view of a design system — what the provider renders and the
 * publisher ships. Derived from studio state (see `modules/studio/resolve`),
 * never edited directly.
 */
export type DesignSystem = {
  /** Per-component param selections, every registry param present. */
  componentParams: Record<string, Record<string, string>>
  /** Global CSS vars written on `:root` (radius, fonts, cursors, …). */
  tokens: Record<string, string>
  density: Density
  /** Generative color recipe; `undefined` means the default generated palette. */
  color?: ColorConfig
  /** Icon library; `undefined` means the default (lucide). */
  icons?: IconLibraryName
}
