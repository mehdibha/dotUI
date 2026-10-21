"use client"

/* What the preview blocks draw for the system's brand: its logo, and its
   name in place of the made-up product's. Without a brand, the generic mark
   in the theme's primary and the system's own name. */

import { createContext, useContext } from "react"

import { cn } from "@/registry/lib/utils"

import type { BrandName } from "../axes/assets"
import { BRANDS } from "./brands"
import type { Asset } from "./brands"

export const BrandContext = createContext<BrandName | undefined>(undefined)

/** The name of the system on screen: the generic brand's name. */
export const SystemNameContext = createContext<string | undefined>(undefined)

const useBrand = () => {
  const brand = useContext(BrandContext)
  return brand && BRANDS[brand]
}

/** An asset in the page's mode: CSS picks the variant, so a mode flip
 *  never waits on React. */
export function AssetImage({
  asset,
  className,
}: {
  asset: Asset
  className?: string
}) {
  if (!asset.dark) return <img src={asset.light} alt="" className={className} />
  return (
    <>
      <img src={asset.light} alt="" className={cn("dark:hidden", className)} />
      <img
        src={asset.dark}
        alt=""
        className={cn("hidden dark:block", className)}
      />
    </>
  )
}

/** The generic brand's mark: two rows in `currentColor`. */
export function GenericMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M6 3h12a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" />
      <path
        d="M6 14h6a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3z"
        opacity={0.45}
      />
    </svg>
  )
}

/** The brand's logo in a `className`-sized box, else the generic mark. */
export function BrandMark({ className }: { className?: string }) {
  const brand = useBrand()
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center p-1 text-primary",
        className,
      )}
    >
      {brand ? (
        <AssetImage asset={brand.logo} className="size-full" />
      ) : (
        <GenericMark className="size-full" />
      )}
    </span>
  )
}

/** The brand's name, else the system's, else the block's own. */
export function BrandName({ children }: { children: React.ReactNode }) {
  const systemName = useContext(SystemNameContext)
  return useBrand()?.name ?? systemName ?? children
}
