/**
 * Shared `?preset=` resolution for the `/r/*` registry routes.
 *
 * Each handler reads the compressed-base64url `preset` query param and turns it
 * into the publisher's `PublishPreset`. The create-builder codec is imported
 * lazily so it stays out of the route handlers' eager server graph.
 */

import type { PublishPreset } from '@/publisher/types'

export function defaultPreset(): PublishPreset {
  return { density: 'compact', componentParams: {} }
}

/**
 * Resolve a `?preset=` value to a `PublishPreset`, falling back to the default
 * preset when the param is absent or fails to decode.
 */
export async function resolveRequestPreset(
  encoded: string | undefined,
): Promise<PublishPreset> {
  if (!encoded) return defaultPreset()
  try {
    const { decodePreset } = await import('@/modules/create/preset/codec')
    const ds = decodePreset(encoded)
    return {
      color: ds.color,
      density: ds.density,
      componentParams: ds.componentParams,
      codeOptions: ds.codeOptions,
      includedBlocks: ds.includedBlocks,
    }
  } catch {
    return defaultPreset()
  }
}
