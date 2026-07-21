import type { ReactNode } from 'react'

import { BoltIcon } from '@/components/icons/bolt'
import { LovableIcon } from '@/components/icons/lovable'
import { V0Icon } from '@/components/icons/v0'

import type { PresetUrl } from './types'

/**
 * An external tool the design system can be opened in via a deeplink. Adding
 * one (Bolt, Lovable, Claude design, …) is one entry in `DEEPLINK_TARGETS`:
 * an id, name, brand wordmark, and an `href` built from the preset-encoded
 * URL. Only targets that emit a *new* artifact need their own `routes/r/`
 * endpoint. The shadcn CLI path is not a target here — it has its own bespoke
 * pane in the export dialog (package manager, init + add steps).
 */
export interface DeeplinkTarget {
  id: string
  name: string
  /** Brand wordmark, tinted by `currentColor`; sized by the consumer. */
  wordmark: ReactNode
  /** One sentence shown in the target's pane: what opening it does. */
  description: string
  href: (presetUrl: PresetUrl) => string
}

export const DEEPLINK_TARGETS: DeeplinkTarget[] = [
  {
    id: 'v0',
    name: 'v0',
    // h-3 (not h-3.5): V0Icon's viewBox is cropped to the glyph, so it renders
    // optically larger than the padded wordmarks beside it.
    wordmark: <V0Icon className="h-3 w-auto" />,
    description:
      'Boots a v0 project with every component and a demo screen, all themed to your design system — ready to prompt.',
    // Deeplink shape: `https://v0.dev/chat/api/open?url=<url-encoded item URL>`.
    // v0 fetches the `/r/v0` item server-side. Only reachable on the deployed
    // origin (v0 can't fetch back to localhost).
    href: (presetUrl) =>
      `https://v0.dev/chat/api/open?url=${encodeURIComponent(presetUrl('/r/v0'))}`,
  },
]

/** Planned targets, listed disabled in the picker so the roadmap is visible. */
export const UPCOMING_TARGETS: {
  id: string
  name: string
  wordmark: ReactNode
}[] = [
  {
    id: 'lovable',
    name: 'Lovable',
    wordmark: <LovableIcon className="h-3.5 w-auto" />,
  },
  { id: 'bolt', name: 'Bolt', wordmark: <BoltIcon className="h-3.5 w-auto" /> },
]
