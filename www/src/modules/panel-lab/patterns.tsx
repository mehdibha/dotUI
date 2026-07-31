'use client'

/* Panel Lab patterns — controls invented for the full-panel recreation, built
   on the control-lab row language. If one earns its keep it graduates into
   control-lab/rows.tsx. Prototype only: local state in, callback out. */

import { ChevronDownIcon, SearchIcon } from 'lucide-react'
import { Button as RacButton } from 'react-aria-components'

import { fontStack } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Disclosure, DisclosurePanel } from '@/registry/ui/disclosure'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { ROW, ROW_LABEL, ROW_VALUE } from '@/modules/control-lab/rows'
import { useLoadedFamilies } from '@/modules/create/typography'

/* -------------------------------- Detail row ------------------------------- */

/**
 * Depth without navigation: a collapsed row summarizing its contents (swatch
 * dots, a value), expanding in place to sub-rows. The panel's answer to both
 * "status colors clutter" and "params-only components" — same pattern.
 */
export function DetailRow({
  label,
  summary,
  defaultExpanded,
  id,
  children,
}: {
  label: string
  /** What the collapsed row shows on the right — dots, a value, a count. */
  summary?: React.ReactNode
  defaultExpanded?: boolean
  /** Required when rendered inside a DisclosureGroup. */
  id?: string
  children: React.ReactNode
}) {
  return (
    <Disclosure
      id={id ?? label}
      defaultExpanded={defaultExpanded}
      className="w-full rounded-xl bg-muted"
    >
      <RacButton
        slot="trigger"
        className={cn(
          ROW,
          'flex cursor-interactive items-center justify-between gap-3 px-4 focus-reset hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight motion-safe:pressed:scale-[0.99]',
        )}
      >
        <span className={ROW_LABEL}>{label}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {summary && <span className={ROW_VALUE}>{summary}</span>}
          <ChevronDownIcon className="size-3.5 text-fg-muted transition-transform duration-200 group-expanded/disclosure:rotate-180" />
        </span>
      </RacButton>
      <DisclosurePanel className="text-inherit">
        <div className="flex flex-col px-2 pb-1.5">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  )
}

/* ------------------------------- Swatch dots ------------------------------- */

/** Collapsed-row summary for a set of colors: overlapping dots. */
export function SwatchDots({ colors }: { colors: string[] }) {
  return (
    <span className="flex items-center -space-x-1">
      {colors.map((color, i) => (
        <span
          key={i}
          className="size-3.5 rounded-full ring-2 ring-muted"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  )
}

/* ------------------------------ Mini color row ----------------------------- */

/** Shared picker popover body (area + hue + hex). */
function PickerPopoverContent() {
  return (
    <Popover>
      <DialogContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <ColorArea
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
          />
          <ColorSlider
            orientation="vertical"
            colorSpace="hsb"
            channel="hue"
            className="h-auto self-stretch"
          />
        </div>
        <ColorField aria-label="Hex" className="w-full">
          <Input size="sm" className="w-full" />
        </ColorField>
      </DialogContent>
    </Popover>
  )
}

/** A color picker at sub-row scale, for use inside an expanded DetailRow. */
export function MiniColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      {({ color }) => (
        <>
          <Button
            variant="quiet"
            className="flex h-9 w-full items-center justify-between gap-3 rounded-lg px-2 font-normal"
          >
            <span className="truncate text-xs text-fg-muted">{label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-xs text-fg-muted uppercase">
                {color.toString('hex')}
              </span>
              <ColorSwatch className="size-4 rounded-full" />
            </span>
          </Button>
          <PickerPopoverContent />
        </>
      )}
    </ColorPicker>
  )
}

/* -------------------------------- Ramp strip ------------------------------- */

/* Approximate 10-step ramps via color-mix — enough to sell the visual; the
   real ramps come from the color engine, not the panel. */
const RAMP_MIXES = [
  'white 92%',
  'white 82%',
  'white 68%',
  'white 52%',
  'white 32%',
  'white 12%',
  'black 10%',
  'black 26%',
  'black 42%',
  'black 58%',
]

/** Live ramps for the given seeds — the Color section's opening visual. */
export function RampStrip({ seeds }: { seeds: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      {seeds.map((seed) => (
        <div key={seed} className="flex h-4 overflow-hidden rounded-md">
          {RAMP_MIXES.map((mix) => (
            <div
              key={mix}
              className="flex-1"
              style={{
                backgroundColor: `color-mix(in oklch, ${seed}, ${mix})`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------ Type specimen ------------------------------ */

/** The Typography section's opening visual: the chosen faces, in use. */
export function TypeSpecimen({
  heading,
  body,
}: {
  heading: string
  body: string
}) {
  useLoadedFamilies([heading, body])
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-muted px-4 py-3">
      <span
        className="text-2xl/none font-semibold text-fg"
        style={{ fontFamily: fontStack(heading) }}
      >
        Ag
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className="truncate text-[0.8125rem]/tight font-semibold text-fg"
          style={{ fontFamily: fontStack(heading) }}
        >
          Almost before we knew it
        </span>
        <span
          className="truncate text-xs/tight text-fg-muted"
          style={{ fontFamily: fontStack(body) }}
        >
          we had left the ground.
        </span>
      </div>
    </div>
  )
}

/* -------------------------------- Filter row ------------------------------- */

/** Search shaped as a row — filters the component list as you type. */
export function FilterRow({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <SearchField value={value} onChange={onChange} aria-label={placeholder}>
      <InputGroup className={cn(ROW, 'border-0 shadow-none')}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder={placeholder} className="text-[0.8125rem]" />
      </InputGroup>
    </SearchField>
  )
}

/* ------------------------------ Cluster header ----------------------------- */

/** A sub-marker inside a section: quieter than SectionHeader, groups a run of
 *  component rows by category (Buttons, Forms, Overlays…). */
export function ClusterHeader({ label }: { label: string }) {
  return (
    <span className="mt-2.5 px-1 text-[11px] font-medium text-fg-muted/80 first:mt-0">
      {label}
    </span>
  )
}
