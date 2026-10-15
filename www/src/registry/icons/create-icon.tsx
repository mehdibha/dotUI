"use client"

import { createContext, Suspense, use } from "react"
import type * as React from "react"

import { createIconLoader } from "./create-icon-loader"
import type { IconLibraryName, PhosphorWeight } from "./icon-map"

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
  "aria-label"?: string
  "aria-hidden"?: React.AriaAttributes["aria-hidden"]
  role?: string
}

type IconComponent = React.ComponentType<CommonIconProps>

/**
 * The active icon library (default lucide); every registry icon swaps to it at
 * runtime.
 */
const IconLibraryContext = createContext<IconLibraryName>("lucide")

/**
 * The icon weight, for libraries that take a weight prop (phosphor);
 * `undefined` = library default.
 */
const IconWeightContext = createContext<PhosphorWeight | undefined>(undefined)

const loaders = {
  remix: createIconLoader("remix"),
  tabler: createIconLoader("tabler"),
  hugeicons: createIconLoader("hugeicons"),
  phosphor: createIconLoader("phosphor"),
  "material-symbols": createIconLoader("material-symbols"),
  octicons: createIconLoader("octicons"),
} satisfies Record<Exclude<IconLibraryName, "lucide">, unknown>

export type { CommonIconProps }
export { IconLibraryContext, IconWeightContext }

/** `name` is the registry name; each library module exports its glyph under it. */
export function createIcon(
  LucideIcon: IconComponent,
  name: string,
): IconComponent {
  function Icon(props: CommonIconProps) {
    const library = use(IconLibraryContext)
    const weight = use(IconWeightContext)
    if (library === "lucide") return <LucideIcon {...props} />
    const IconLoader = loaders[library]
    // `weight` is not a DOM attribute; only phosphor accepts it.
    const weightProps =
      library === "phosphor" && weight ? { weight } : undefined
    return (
      <Suspense fallback={<LucideIcon {...props} />}>
        <IconLoader
          name={name}
          fallback={LucideIcon}
          {...weightProps}
          {...props}
        />
      </Suspense>
    )
  }
  Icon.displayName = name
  return Icon
}
