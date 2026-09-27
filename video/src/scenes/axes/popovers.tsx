import type { CSSProperties, ReactNode } from "react"

import { fontStack } from "@/lib/fonts"
import {
  HeartIcon,
  SearchIcon as RegistrySearch,
  SettingsIcon,
} from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ColorArea } from "@/registry/ui/color-area"
import { ColorField } from "@/registry/ui/color-field"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/ui/color-swatch-picker"
import { Command } from "@/registry/ui/command"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import { RADIUS_OPTIONS, STYLE_OPTIONS } from "@/modules/studio/axes/buttons"
import { LIBRARY_OPTIONS } from "@/modules/studio/axes/icons"
import { roleRadiusPx } from "@/modules/studio/axes/shape"
import { DENSITY_TIERS } from "@/modules/studio/axes/space"
import type { DensityTier } from "@/modules/studio/axes/space"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGap,
  DialSegmented,
} from "@/modules/studio/dial"
import { CardGrid } from "@/modules/studio/patterns"
import type { StudioState } from "@/modules/studio/state"

import {
  CheckIcon,
  RacListBox,
  RacListBoxItem,
  SearchIcon,
  XIcon,
} from "./deps"

/* The panel's popovers, inline. Real ones portal and position against the
   viewport, which the camera's transform breaks, so each is its content —
   the same registry parts and panel primitives /studio renders — inside the
   PanelPopover surface, placed beside its row by the set. */

const noop = () => {}

export function PopoverSurface({
  x,
  y,
  width,
  arrowY,
  children,
  className,
  style,
  mark,
  hidden,
}: {
  x: number
  y: number
  width: number
  /** The anchor row's center, in the popover's own px. */
  arrowY: number
  children: ReactNode
  className?: string
  style?: CSSProperties
  mark: string
  hidden?: boolean
}) {
  return (
    <div
      data-mark={mark}
      data-hidden={hidden || undefined}
      className={cn(
        "absolute z-30 flex flex-col rounded-[14px] border border-fg/6 bg-card text-fg shadow-lg [--panel-surface:var(--color-card)]",
        className,
      )}
      style={{
        left: x,
        top: y,
        width,
        visibility: hidden ? "hidden" : undefined,
        ...style,
      }}
    >
      <svg
        aria-hidden
        width={10}
        height={10}
        viewBox="0 0 8 8"
        className="absolute fill-card stroke-fg/10"
        style={{ left: -9, top: arrowY - 5, transform: "rotate(90deg)" }}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
      {children}
    </div>
  )
}

const COLOR_PRESETS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
]

/** ColorPickerPopover's body: presets, area, hue, hex. */
export function ColorBody({ value }: { value: string }) {
  return (
    <ColorPicker value={value}>
      <div className="flex flex-col gap-3 p-2">
        <ColorSwatchPicker className="justify-between gap-0">
          {COLOR_PRESETS.map((preset) => (
            <ColorSwatchPickerItem
              key={preset}
              color={preset}
              className="size-5 rounded-full ring-offset-2 ring-offset-card before:hidden selected:ring-2 selected:ring-(--color)"
            />
          ))}
        </ColorSwatchPicker>
        <ColorArea
          aria-label="Saturation and brightness"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="w-full rounded-xl"
        />
        <div data-mark="hue">
          <ColorSlider
            aria-label="Hue"
            colorSpace="hsb"
            channel="hue"
            className="w-full"
          >
            <ColorSliderControl className="h-5 rounded-full" />
          </ColorSlider>
        </div>
        <ColorField aria-label="Hex" className="w-full">
          <InputGroup size="sm" className="w-full">
            <InputGroupAddon>
              <ColorSwatch className="size-4 rounded-full" />
            </InputGroupAddon>
            <Input className="font-mono uppercase" />
          </InputGroup>
        </ColorField>
      </div>
    </ColorPicker>
  )
}

export const FONT_GROUPS = [
  {
    category: "sans-serif",
    families: ["Geist", "Inter", "DM Sans", "Space Grotesk"],
  },
  { category: "serif", families: ["Source Serif 4", "Fraunces", "Newsreader"] },
]

/** FontListPopover's body: search over the catalog, each family in its face. */
export function FontBody({ value }: { value: string }) {
  return (
    <Command className="outline-hidden">
      <SearchField aria-label="Search fonts">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search fonts..." />
          <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
            <Button variant="quiet" isIconOnly>
              <XIcon aria-hidden="true" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </SearchField>
      <ListBox
        aria-label="Fonts"
        selectionMode="single"
        selectedKeys={value ? [value] : []}
        onSelectionChange={noop}
      >
        {FONT_GROUPS.map(({ category, families }) => (
          <ListBoxSection key={category}>
            <ListBoxSectionHeader className="capitalize">
              {category}
            </ListBoxSectionHeader>
            {families.map((family) => (
              <ListBoxItem key={family} id={family} textValue={family}>
                <span
                  data-mark={`font:${family}`}
                  style={{ fontFamily: fontStack(family) }}
                >
                  {family}
                </span>
              </ListBoxItem>
            ))}
          </ListBoxSection>
        ))}
      </ListBox>
    </Command>
  )
}

function Glyphs({ library }: { library: IconLibraryName }) {
  return (
    <IconLibraryContext.Provider value={library}>
      <IconWeightContext.Provider value={undefined}>
        <span className="flex shrink-0 items-center gap-1.5 **:[svg]:size-4">
          <RegistrySearch />
          <SettingsIcon />
          <HeartIcon />
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

/** DialSelect's list for the icon library, each row drawn by its library. */
export function IconBody({ value }: { value: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <RacListBox
        aria-label="Library"
        selectionMode="single"
        selectedKeys={[value]}
        className="flex flex-col gap-1.5 outline-hidden"
      >
        {LIBRARY_OPTIONS.map((option) => (
          <RacListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            data-mark={`icon:${option.value}`}
            className={cn(DIAL_ROW, DIAL_PRESS, "selected:tint-10")}
          >
            {({ isSelected }) => (
              <>
                <span className={DIAL_LABEL}>{option.label}</span>
                <span className="flex min-w-0 items-center gap-2 text-fg/70">
                  <Glyphs library={option.value as IconLibraryName} />
                  <CheckIcon
                    className={cn(
                      "size-4 shrink-0 text-fg",
                      !isSelected && "invisible",
                    )}
                  />
                </span>
              </>
            )}
          </RacListBoxItem>
        ))}
      </RacListBox>
    </div>
  )
}

/** Space's AppGlyph: a small app at a tier's real measurements. */
function AppGlyph({ tier, state }: { tier: DensityTier; state: StudioState }) {
  const px = (n: number) => n * state.spacingUnit
  const text = { height: tier.textPx * 0.5, borderRadius: 999 }
  const radius = (key: Parameters<typeof roleRadiusPx>[1]) => ({
    borderRadius: roleRadiusPx(state, key),
  })
  return (
    <span
      data-mark={`density:${tier.id}`}
      className="flex w-full flex-col border border-fg/15 bg-bg"
      style={{
        padding: px(tier.inset) / 2,
        gap: px(tier.gap),
        ...radius("rolePanel"),
      }}
    >
      <span className="w-2/5 bg-fg/20" style={text} />
      <span className="flex" style={{ gap: px(tier.gap) }}>
        <span
          className="flex flex-1 items-center border border-fg/20"
          style={{
            height: px(tier.control),
            paddingInline: px(2),
            ...radius("roleControl"),
          }}
        >
          <span className="w-1/2 bg-fg/15" style={text} />
        </span>
        <span
          className="bg-primary"
          style={{
            height: px(tier.control),
            width: px(tier.control) * 1.5,
            ...radius("roleControl"),
          }}
        />
      </span>
      <span className="flex flex-col" style={{ gap: 2 }}>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="flex items-center"
            style={{
              height: px(tier.item),
              paddingInline: px(2),
              ...radius("roleItem"),
              background:
                i === 0
                  ? "color-mix(in oklab, var(--color-fg) 10%, transparent)"
                  : undefined,
            }}
          >
            <span className="w-3/5 bg-fg/20" style={text} />
          </span>
        ))}
      </span>
    </span>
  )
}

/** The Density row's cards. */
export function DensityBody({ state }: { state: StudioState }) {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <CardGrid
        label="Density"
        value={state.density}
        onChange={noop}
        options={DENSITY_TIERS.map((tier) => ({
          id: tier.id,
          label: tier.label,
          children: <AppGlyph tier={tier} state={state} />,
        }))}
      />
    </div>
  )
}

/* Buttons' Style popover specimen: a primary and a secondary in one family. */
const FAMILY: Record<string, { primary: string; secondary: string }> = {
  flat: { primary: "", secondary: "" },
  outline: {
    primary: "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
    secondary: "shadow-[0_1px_0_rgb(0_0_0/0.08)]",
  },
  raised: {
    primary:
      "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
    secondary:
      "bg-linear-to-b from-white/8 to-black/8 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
  },
  elevated: {
    primary: "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
    secondary:
      "border-transparent shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
  },
}

function ButtonGlyph({ style }: { style: string }) {
  const family = FAMILY[style] ?? FAMILY.flat!
  return (
    <span
      data-mark={`button:${style}`}
      className="flex shrink-0 items-center justify-center gap-1.5 py-1.5"
    >
      <span
        className={cn(
          "flex h-6 items-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-fg-on-primary",
          family.primary,
        )}
      >
        Save
      </span>
      <span
        className={cn(
          "flex h-6 items-center rounded-md border border-border-control bg-neutral px-2.5 text-[11px] font-medium text-fg-on-neutral",
          family.secondary,
        )}
      >
        Cancel
      </span>
    </span>
  )
}

/** Buttons' Style popover: the family cards, then the radius segments. */
export function ButtonsBody({ state }: { state: StudioState }) {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <CardGrid
        label="Style"
        value={state.buttonStyle}
        onChange={noop}
        options={STYLE_OPTIONS.map((option) => ({
          id: option.value,
          label: option.label,
          children: <ButtonGlyph style={option.value} />,
        }))}
      />
      <DialGap />
      <div data-mark="button-radius">
        <DialSegmented
          label="Radius"
          value={state.buttonRadius}
          onChange={noop}
          options={RADIUS_OPTIONS}
        />
      </div>
    </div>
  )
}
