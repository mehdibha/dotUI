'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import { createPersistedStore, enumCodec } from '@/lib/persisted-store'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { DEFAULTS, type DesignSystem } from '@/modules/create/preset'
import {
  DEFAULT_DESIGN_SYSTEM_NAME,
  useDesignSystemName,
  useStoredPreset,
} from '@/modules/create/preset/storage'
import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Which design system and light/dark mode the docs previews render in. Global
 * and persisted, so every demo on the site stays in sync; `yours` is the design
 * system built at /create, `system` follows the site theme.
 */

const YOURS = 'yours'

const presetStore = createPersistedStore(
  'dotui:preview-preset',
  YOURS,
  enumCodec([YOURS, ...PRESETS.map((p) => p.id)], YOURS),
)

type PreviewMode = 'system' | 'light' | 'dark'

const modeStore = createPersistedStore<PreviewMode>(
  'dotui:preview-mode',
  'system',
  enumCodec(['system', 'light', 'dark'], 'system'),
)

export const useSelectedMode = modeStore.useValue

/** The design system the docs previews render in, resolved from the selection. */
export function useResolvedPreset(): DesignSystem {
  const selected = presetStore.useValue()
  const yours = useStoredPreset()
  if (selected === YOURS) return yours
  return PRESETS.find((p) => p.id === selected)?.designSystem ?? DEFAULTS
}

function PresetSwatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-3 shrink-0 rounded-full border border-border',
        className,
      )}
      style={{ background: color }}
    />
  )
}

function PresetSelector() {
  const selected = presetStore.useValue()
  const yours = useStoredPreset()
  const yoursName = useDesignSystemName().trim() || DEFAULT_DESIGN_SYSTEM_NAME
  const yoursSwatch =
    (yours.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? 'var(--color-primary)'
  const swatchFor = (id: string) =>
    id === YOURS
      ? yoursSwatch
      : (PRESETS.find((p) => p.id === id)?.swatch ?? yoursSwatch)

  return (
    // The field slot is w-full; keep the control sized to its content.
    <div className="w-fit">
      <Select
        aria-label="Preview design system"
        selectedKey={selected}
        onSelectionChange={(key: Key | null) => {
          if (key != null) presetStore.set(String(key))
        }}
      >
        <SelectTrigger size="sm" variant="quiet" className="gap-1.5">
          <PresetSwatch color={swatchFor(selected)} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent placement="bottom">
          <SelectItem id={YOURS} textValue={yoursName}>
            <span className="flex items-center gap-2">
              <PresetSwatch color={yoursSwatch} className="size-2.5" />
              {yoursName}
            </span>
          </SelectItem>
          {PRESETS.map((preset) => (
            <SelectItem key={preset.id} id={preset.id} textValue={preset.name}>
              <span className="flex items-center gap-2">
                <PresetSwatch color={preset.swatch} className="size-2.5" />
                {preset.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const PREVIEW_MODES: Record<
  PreviewMode,
  { label: string; Icon: typeof SunIcon; next: PreviewMode }
> = {
  system: { label: 'Match site theme', Icon: MonitorIcon, next: 'light' },
  light: { label: 'Light', Icon: SunIcon, next: 'dark' },
  dark: { label: 'Dark', Icon: MoonIcon, next: 'system' },
}

function PreviewModeToggle({ className }: { className?: string }) {
  const mode = useSelectedMode()
  const { label, Icon, next } = PREVIEW_MODES[mode]

  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Preview mode: ${label}. Switch to ${PREVIEW_MODES[next].label.toLowerCase()}`}
        className={cn('text-fg-muted', className)}
        onPress={() => modeStore.set(next)}
      >
        <Icon />
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/**
 * The toolbar above each docs preview: preset selector left, mode toggle right.
 * Site chrome — it sits outside DemoPreset, so a forced mode themes the canvas
 * below it, not the controls.
 */
export function PreviewControls({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-between gap-2 p-2', className)}
    >
      <PresetSelector />
      <PreviewModeToggle />
    </div>
  )
}
