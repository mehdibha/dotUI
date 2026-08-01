'use client'

/* Surfaces — the canvas decisions pulled out of Colors into their own section:
   background lightness per mode, and the overlay material grouped tweak (one
   switch for menus/popovers/tooltips: solid or glass). The hero shows both
   modes at once — editing a background means comparing modes, not toggling. */

import { MoonIcon, SunIcon } from 'lucide-react'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import {
  ControlGroup,
  GroupCaption,
  SliderRow,
} from '@/modules/control-lab/rows'

import { OVERLAY_OPTIONS } from './data'
import type { Lab } from './data'
import { cssToHex, useLabConfig } from './engine'
import { SegmentedControlRow } from './patterns'

/** One mode's surface stack, engine-true: the background carrying a card
 *  (neutral-50) with text bars, and a floating menu chip that demos the
 *  overlay material — glass shows the accent dot bleeding through. */
function SurfaceTile({
  label,
  icon: Icon,
  value,
  background,
  scales,
  glass,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: string
  background: string
  scales: Record<string, Record<string, string> | undefined>
  glass: boolean
}) {
  const card = scales.neutral?.['50'] ?? background
  const border = scales.neutral?.['300'] ?? background
  const fg = scales.neutral?.['900'] ?? background
  const accent = scales.accent?.['700'] ?? background

  return (
    <div
      className="flex-1 overflow-hidden rounded-xl border border-border/45"
      style={{ backgroundColor: background, color: fg }}
    >
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="flex items-center gap-1.5 opacity-60">
          <Icon className="size-3" />
          <span className="text-[10px] font-medium">{label}</span>
        </span>
        <span className="font-mono text-[10px] opacity-60">{value}</span>
      </div>
      <div
        className="relative mx-3 mt-2 mb-3 h-16 rounded-lg border p-2"
        style={{ backgroundColor: card, borderColor: border }}
      >
        <span className="block h-1.5 w-1/2 rounded-full bg-current opacity-70" />
        <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-current opacity-25" />
        <span
          aria-hidden
          className="absolute top-1.5 right-8 size-5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute top-3 right-2 flex h-9 w-14 flex-col justify-center gap-1 rounded-md border px-1.5"
          style={{
            borderColor: border,
            backgroundColor: glass ? `${cssToHex(card)}B3` : card,
            backdropFilter: glass ? 'blur(5px)' : undefined,
          }}
        >
          <span className="block h-1 w-3/4 rounded-full bg-current opacity-60" />
          <span className="block h-1 w-1/2 rounded-full bg-current opacity-25" />
        </div>
      </div>
    </div>
  )
}

export function SurfacesSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)
  const glass = state.overlayMaterial === 'glass'

  return (
    <>
      <div className="flex gap-2">
        <SurfaceTile
          label="Light"
          icon={SunIcon}
          value={`L* ${state.bgLight.toFixed(1)}`}
          background={theme.light.background}
          scales={theme.light.scales}
          glass={glass}
        />
        <SurfaceTile
          label="Dark"
          icon={MoonIcon}
          value={state.bgDark === 0 ? 'OLED' : `L* ${state.bgDark.toFixed(1)}`}
          background={theme.dark.background}
          scales={theme.dark.scales}
          glass={glass}
        />
      </div>
      <ControlGroup>
        <SliderRow
          label="Light background"
          value={state.bgLight}
          onChange={set('bgLight')}
          minValue={90}
          maxValue={100}
          step={0.5}
          format={(v) => `L* ${v.toFixed(1)}`}
        />
        <SliderRow
          label="Dark background"
          value={state.bgDark}
          onChange={set('bgDark')}
          minValue={0}
          maxValue={20}
          step={0.5}
          format={(v) => (v === 0 ? 'OLED' : `L* ${v.toFixed(1)}`)}
        />
      </ControlGroup>
      <GroupCaption>
        The canvas each mode builds on — cards and text keep their contrast as
        it moves. Dark at 0 is true black.
      </GroupCaption>
      <SegmentedControlRow
        label="Overlays"
        value={state.overlayMaterial}
        onChange={set('overlayMaterial')}
        options={OVERLAY_OPTIONS}
      />
      <GroupCaption>
        One material for menus, popovers and tooltips together.
      </GroupCaption>
    </>
  )
}
