"use client"

/* Assets — the brand's logo and wordmark, each in its light and dark
   variant. A preset shows its product's; the user's own system shows empty
   drop zones until uploads land. Read-only either way. */

import { ImageUpIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { AssetImage } from "../assets/brand"
import { BRANDS } from "../assets/brands"
import type { Asset } from "../assets/brands"
import type { BrandName } from "../axes/assets"
import { DialGlyph, DialPopover, DialTrigger } from "../dial"
import type { RowMap } from "../row-host"
import { useAxis } from "../use-axis"

const MODES = [
  { mode: "light", label: "Light", tile: "bg-white" },
  { mode: "dark", label: "Dark", tile: "bg-neutral-950" },
] as const

/** One variant: the asset on its own mode's ground, or an empty drop zone. */
function Tile({
  src,
  label,
  tile,
}: {
  src?: string
  label: string
  tile: string
}) {
  return (
    <figure className="flex flex-1 flex-col gap-1">
      {src ? (
        <div
          className={cn(
            "flex h-16 items-center justify-center rounded-lg p-3 ring-1 ring-fg/10",
            tile,
          )}
        >
          <img src={src} alt="" className="max-h-full max-w-full" />
        </div>
      ) : (
        <div
          aria-disabled
          className="flex h-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-fg/20 text-fg/35"
        >
          <ImageUpIcon className="size-4" />
          <span className="text-[11px] font-medium">SVG or PNG</span>
        </div>
      )}
      <figcaption className="text-[11px] font-medium text-fg/50">
        {label}
      </figcaption>
    </figure>
  )
}

function Slot({ label, asset }: { label: string; asset?: Asset }) {
  return (
    <div className="flex flex-col gap-1.5 px-1.5 pt-1">
      <span className="text-[13px] font-medium text-fg/85">{label}</span>
      <div className="flex gap-2">
        {MODES.map(({ mode, label, tile }) => (
          <Tile
            key={mode}
            label={label}
            tile={tile}
            src={
              asset &&
              (mode === "dark" ? (asset.dark ?? asset.light) : asset.light)
            }
          />
        ))}
      </div>
    </div>
  )
}

function AssetsRow() {
  const value = useAxis("brandAssets").effective
  const brand = value === "none" ? undefined : BRANDS[value as BrandName]
  return (
    <DialTrigger
      axis="brandAssets"
      label="Assets"
      value={
        <>
          <span className="truncate">{brand?.name ?? "None"}</span>
          {brand && (
            <DialGlyph>
              <AssetImage asset={brand.logo} />
            </DialGlyph>
          )}
        </>
      }
    >
      <DialPopover className="w-72">
        <Slot label="Logo" asset={brand?.logo} />
        <Slot label="Wordmark" asset={brand?.wordmark} />
        <p className="px-1.5 pt-1 pb-0.5 text-xs text-fg/50">
          {brand
            ? `${brand.name}'s own assets, shown across the preview.`
            : "Uploading your logo and wordmark is coming soon."}
        </p>
      </DialPopover>
    </DialTrigger>
  )
}

export const ROWS: RowMap = {
  brandAssets: AssetsRow,
}
