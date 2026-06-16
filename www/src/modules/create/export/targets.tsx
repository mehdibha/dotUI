import { V0Icon } from '@/components/icons/v0'

import type { ExportTarget } from './types'

/**
 * The curated export targets shown in the customizer footer, in order. Adding a
 * deeplink-style target (Bolt, Lovable, Claude design, …) is one entry here: an
 * id, label, brand icon, and an `href` built from the preset-encoded URL. Only
 * targets that emit a *new* artifact need their own `routes/r/` endpoint.
 */
export const EXPORT_TARGETS: ExportTarget[] = [
  {
    id: 'shadcn',
    label: 'Copy install command',
    kind: 'command',
    // `shadcn init <url>` (not `add`): `init` is the only command that merges
    // the item's `config.registries` into the consumer's components.json, so a
    // later `shadcn add @dotui/<name>` resolves with the same preset baked in.
    // `add` on an existing components.json silently drops `config.registries`.
    command: (presetUrl) => `npx shadcn init ${presetUrl('/r/init')}`,
  },
  {
    id: 'v0',
    label: 'Open in',
    ariaLabel: 'Open in v0',
    kind: 'deeplink',
    // h-3 (not h-3.5): V0Icon's viewBox is cropped to the glyph, so it renders
    // optically larger than the padded legacy lockup it replaced.
    icon: <V0Icon className="h-3 w-auto" />,
    // Deeplink shape: `https://v0.dev/chat/api/open?url=<url-encoded item URL>`.
    // v0 fetches the `/r/showcase-bundle` item and boots a whole project
    // rendering the dotUI showcase, themed to the preset. Only reachable on the
    // deployed origin (v0 can't fetch back to localhost).
    href: (presetUrl) =>
      `https://v0.dev/chat/api/open?url=${encodeURIComponent(presetUrl('/r/showcase-bundle'))}`,
  },
]
