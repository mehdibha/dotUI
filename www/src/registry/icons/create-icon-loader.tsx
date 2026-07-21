'use client'

import { use } from 'react'
import type * as React from 'react'

import type { CommonIconProps } from './create-icon'

type IconModule = Record<string, unknown>

// Each generated module exports plain icon components for the icons the
// registry uses (hugeicons data is wrapped into components at generation).
const libraryImporters = {
  hugeicons: () => import('../__generated__/__hugeicons__'),
  tabler: () => import('../__generated__/__tabler__'),
  remix: () => import('../__generated__/__remix__'),
  phosphor: () => import('../__generated__/__phosphor__'),
} satisfies Record<string, () => Promise<IconModule>>

export type LoadableLibrary = keyof typeof libraryImporters

export function createIconLoader(libraryName: LoadableLibrary) {
  // The module promise must be stable across renders for `use()` to resolve.
  let modulePromise: Promise<IconModule> | undefined

  return function IconLoader({
    name,
    fallback: Fallback,
    weight,
    ...props
  }: {
    name: string
    fallback: React.ComponentType<CommonIconProps>
    /** Forwarded to weight-capable libraries (phosphor); dropped by the lucide fallback path. */
    weight?: string
  } & CommonIconProps) {
    modulePromise ??= libraryImporters[libraryName]()
    const mod = use(modulePromise)
    const Icon = mod[name] as
      | React.ComponentType<CommonIconProps & { weight?: string }>
      | undefined
    if (!Icon) return <Fallback {...props} />
    return <Icon {...(weight ? { weight } : {})} {...props} />
  }
}
