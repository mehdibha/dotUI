"use client"

/* What the preview blocks draw for the system's brand: its logo in place of
   the placeholder mark, its name in place of the made-up product's. Without
   a brand both render the block's own placeholder. */

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

/** The brand's logo in a `className`-sized box, else the placeholder. */
export function BrandMark({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const brand = useBrand()
  if (!brand) return children
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center p-1", className)}
    >
      <AssetImage asset={brand.logo} className="size-full" />
    </span>
  )
}

/** The brand's name, else the placeholder's. */
export function BrandName({ children }: { children: React.ReactNode }) {
  return useBrand()?.name ?? children
}
