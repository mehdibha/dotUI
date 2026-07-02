import type { DesignSystem } from '@/modules/create/preset'
import { encodePreset } from '@/modules/create/preset/codec'

/** Preview slug for a block — matches its `group-examples/block-<slot>.tsx` file. */
export const blockPreviewSlug = (slot: string) => `block-${slot}`

/**
 * `/create` deeplink that adds a block to the visitor's current design system at
 * a chosen variant, opens the Blocks panel, and focuses the block in the preview.
 * Merges into the stored DS (rather than resetting it) so "Open in editor" keeps
 * whatever the visitor already built.
 */
export function blockEditorHref(
  ds: DesignSystem,
  slot: string,
  variant: string,
): string {
  const next: DesignSystem = {
    ...ds,
    includedBlocks: Array.from(new Set([...(ds.includedBlocks ?? []), slot])),
    componentParams: {
      ...ds.componentParams,
      [slot]: { ...(ds.componentParams[slot] ?? {}), variant },
    },
  }
  const params = new URLSearchParams()
  const enc = encodePreset(next)
  if (enc) params.set('preset', enc)
  params.set('panel', 'blocks')
  params.set('preview', blockPreviewSlug(slot))
  return `/create?${params.toString()}`
}
