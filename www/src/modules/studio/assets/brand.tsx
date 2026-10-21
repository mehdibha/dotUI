"use client"

/* What the preview blocks draw for the system's brand: its logo, and its
   name in place of the made-up product's. Without a brand, the generic mark
   in the theme's accent and the block's own name. */

import { createContext, useContext } from "react"

import { cn } from "@/registry/lib/utils"

import type { BrandName } from "../axes/assets"
import { BRANDS } from "./brands"
import type { Asset } from "./brands"

export const BrandContext = createContext<BrandName | undefined>(undefined)

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

/** The default brand's mark: a pinwheel in `currentColor`. */
export function GenericMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a6 6 0 0 1 6 6v4h-6zM22 12a6 6 0 0 1-6 6h-4v-6zM12 22a6 6 0 0 1-6-6v-4h6zM2 12a6 6 0 0 1 6-6h4v6z" />
    </svg>
  )
}

/** The brand's logo in a `className`-sized box, else the generic mark. */
export function BrandMark({ className }: { className?: string }) {
  const brand = useBrand()
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center p-1 text-accent",
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

/** The brand's name, else the placeholder's. */
export function BrandName({ children }: { children: React.ReactNode }) {
  return useBrand()?.name ?? children
}
