import type { ReactNode } from 'react'

/**
 * Builds a preset-encoded registry URL for a given path, resolved against the
 * right host — e.g. `presetUrl('/r/init')` → `https://host/r/init?preset=<encoded>`.
 * Produced by `useExportUrl()`.
 */
export type PresetUrl = (path: string) => string

/**
 * A way to take the current design system out of dotUI and into an external
 * tool. Two render kinds today:
 *   - `command`  — a copy-able shell command (the shadcn CLI install box).
 *   - `deeplink` — an anchor that opens the target in a new tab (Open in v0).
 *
 * Adding a deeplink-style target (Bolt, Lovable, Claude design, …) is one entry
 * in `EXPORT_TARGETS` — no new component.
 */
export type ExportTarget =
  | {
      id: string
      label: string
      kind: 'command'
      command: (presetUrl: PresetUrl) => string
    }
  | {
      id: string
      label: string
      // Accessible name for screen readers when the visible label + brand icon
      // don't spell it out (e.g. "Open in" + a wordmark reads as just "Open in").
      ariaLabel?: string
      kind: 'deeplink'
      icon: ReactNode
      href: (presetUrl: PresetUrl) => string
    }
