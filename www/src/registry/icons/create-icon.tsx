'use client'

import { createContext, Suspense, use } from 'react'
import type * as React from 'react'

import { createIconLoader } from './create-icon-loader'
import type { IconLibraryName } from './icon-map'

interface CommonIconProps extends React.RefAttributes<SVGSVGElement> {
  className?: string
  width?: string | number
  height?: string | number
  size?: string | number
  style?: React.CSSProperties
  fill?: string
  stroke?: string
  strokeWidth?: string | number
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void
  onMouseEnter?: (event: React.MouseEvent<SVGSVGElement>) => void
  onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void
  'aria-label'?: string
  'aria-hidden'?: React.AriaAttributes['aria-hidden']
  role?: string
}

type IconComponent = React.ComponentType<CommonIconProps>

type IconNames = {
  lucide: string
  hugeicons: string
  tabler: string
  remix: string
}

/**
 * The active icon library. Icons render lucide by default; the /create builder
 * provides the user's choice (through `DesignSystemProvider`) so every registry
 * icon swaps at runtime.
 */
const IconLibraryContext = createContext<IconLibraryName>('lucide')

// One lazy loader per non-default library — the library chunk only ever loads
// when a design system selects it.
const loaders = {
  remix: createIconLoader('remix'),
  tabler: createIconLoader('tabler'),
  hugeicons: createIconLoader('hugeicons'),
} as const

export type { CommonIconProps }
export { IconLibraryContext }

export function createIcon(
  LucideIcon: IconComponent,
  names: IconNames,
): IconComponent {
  function Icon(props: CommonIconProps) {
    const library = use(IconLibraryContext)
    if (library === 'lucide') return <LucideIcon {...props} />
    const IconLoader = loaders[library]
    // While the library chunk loads (and if the name is missing from it), keep
    // showing the lucide equivalent — same footprint, no flash.
    return (
      <Suspense fallback={<LucideIcon {...props} />}>
        <IconLoader name={names[library]} fallback={LucideIcon} {...props} />
      </Suspense>
    )
  }
  Icon.displayName = names.lucide
  return Icon
}
