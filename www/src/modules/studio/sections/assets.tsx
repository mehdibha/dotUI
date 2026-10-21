"use client"

/* Brand assets — the brand's logo and wordmark, each in its light and dark
   variant. A preset shows its product's; Origin and the user's own system
   show the generic mark in the primary beside the system's name until
   uploads land.
   Read-only either way. */

import { ImageUpIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { AssetImage, GenericMark } from "../assets/brand"
import { BRANDS } from "../assets/brands"
import type { Asset } from "../assets/brands"
import type { BrandName } from "../axes/assets"
import { DialGlyph, DialPopover, DialTrigger } from "../dial"
import { usePanelMode } from "../panel-mode"
import type { RowMap } from "../row-host"
import { systemName, useCurrent } from "../selection"
import { useAxis } from "../use-axis"

const MODES = [
  { mode: "light", label: "Light", tile: "bg-white" },
  { mode: "dark", label: "Dark", tile: "bg-neutral-950" },
] as const

type Mode = (typeof MODES)[number]["mode"]

/** One variant on its own mode's ground, or an empty drop zone. */
function Tile({
  label,
  tile,
  children,
}: {
  label: string
  tile: string
  children?: React.ReactNode
}) {
  return (
    <figure className="flex flex-1 flex-col gap-1">
      {children ? (
        <div
          className={cn(
            "flex h-16 items-center justify-center rounded-lg p-3 ring-1 ring-fg/10",
            tile,
          )}
        >
          {children}
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

function Slot({
  label,
  render,
}: {
  label: string
  render: (mode: Mode) => React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 px-1.5 pt-1">
      <span className="text-[13px] font-medium text-fg/85">{label}</span>
      <div className="flex gap-2">
        {MODES.map(({ mode, label, tile }) => (
          <Tile key={mode} label={label} tile={tile}>
            {render(mode)}
          </Tile>
        ))}
      </div>
    </div>
  )
}

const image = (asset?: Asset) => (mode: Mode) =>
  asset && (
    <img
      src={mode === "dark" ? (asset.dark ?? asset.light) : asset.light}
      alt=""
      className="max-h-full max-w-full"
    />
  )

function AssetsRow() {
  const value = useAxis("brandAssets").effective
  const brand = value === "none" ? undefined : BRANDS[value as BrandName]
  const current = useCurrent()
  const primary = useAxis("buttonColor").effective
  const { theme, mode: panelMode } = usePanelMode()
  // The generic mark paints in the primary, as the preview's `text-primary`.
  const ink = (mode: Mode) =>
    primary === "accent"
      ? theme[mode].scales.accent?.["700"]
      : theme[mode].scales.neutral?.["950"]
  const name = systemName(current)
  return (
    <DialTrigger
      axis="brandAssets"
      label="Brand assets"
      value={
        <DialGlyph>
          {brand ? (
            <AssetImage asset={brand.logo} />
          ) : (
            <GenericMark style={{ color: ink(panelMode) }} />
          )}
          <span className="sr-only">{brand?.name ?? name}</span>
        </DialGlyph>
      }
    >
      <DialPopover className="w-72">
        <Slot
          label="Logo"
          render={
            brand
              ? image(brand.logo)
              : (mode) => (
                  <GenericMark
                    className="size-8"
                    style={{ color: ink(mode) }}
                  />
                )
          }
        />
        <Slot
          label="Wordmark"
          render={
            brand
              ? image(brand.wordmark)
              : (mode) => (
                  <span
                    className={cn(
                      "flex min-w-0 items-center gap-1.5 text-base font-semibold tracking-tight",
                      mode === "dark" ? "text-white" : "text-neutral-950",
                    )}
                  >
                    <GenericMark
                      className="size-5 shrink-0"
                      style={{ color: ink(mode) }}
                    />
                    <span className="truncate">{name}</span>
                  </span>
                )
          }
        />
        <p className="px-1.5 pt-1 pb-0.5 text-xs text-fg/50">
          {brand
            ? `${brand.name}'s own assets, shown across the preview.`
            : "The generic mark in your primary color, beside your system's name. Uploading your own logo and wordmark is coming soon."}
        </p>
      </DialPopover>
    </DialTrigger>
  )
}

export const ROWS: RowMap = {
  brandAssets: AssetsRow,
}
