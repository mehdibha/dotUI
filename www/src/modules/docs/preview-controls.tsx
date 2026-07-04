'use client'

import type { ReactNode } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'
import { useTheme } from 'starter-themes'

import { createPersistedStore, enumCodec } from '@/lib/persisted-store'
import { DesignSystemProvider } from '@/lib/styles'
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
 * system built at /create. The mode defaults to the site theme until the user
 * picks one, then pins previews to that choice.
 */

const YOURS = 'yours'

const presetStore = createPersistedStore(
  'dotui:preview-preset',
  YOURS,
  enumCodec([YOURS, ...PRESETS.map((p) => p.id)], YOURS),
)

type PreviewMode = 'light' | 'dark'

const modeStore = createPersistedStore<PreviewMode | null>(
  'dotui:preview-mode',
  null,
  {
    decode: (raw) => (raw === 'light' || raw === 'dark' ? raw : null),
    encode: (mode) => mode,
  },
)

/** The stored choice, else the site theme; undefined until that is known. */
function usePreviewMode(): PreviewMode | undefined {
  const stored = modeStore.useValue()
  const { resolvedTheme } = useTheme()
  if (stored) return stored
  return resolvedTheme === 'dark' || resolvedTheme === 'light'
    ? resolvedTheme
    : undefined
}

/** The mode previews must pin, or undefined when the site theme already provides it. */
export function useForcedPreviewMode(): PreviewMode | undefined {
  const mode = usePreviewMode()
  const { resolvedTheme } = useTheme()
  return mode === undefined || mode === resolvedTheme ? undefined : mode
}

/** The design system the docs previews render in, resolved from the selection. */
export function useResolvedPreset(): DesignSystem {
  const selected = presetStore.useValue()
  const yours = useStoredPreset()
  if (selected === YOURS) return yours
  return PRESETS.find((p) => p.id === selected)?.designSystem ?? DEFAULTS
}

/**
 * The frame around a docs preview: pins the whole panel — toolbar included — to
 * the selected preview mode, staying in the site design system. The preset only
 * applies inside DemoPreset, so the toolbar switches mode but never re-themes.
 */
export function PreviewPanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <DesignSystemProvider forcedMode={useForcedPreviewMode()} scoped>
      {/* `relative` anchors the absolutely-positioned PreviewControls toolbar. */}
      <div className={cn('relative bg-bg', className)}>{children}</div>
    </DesignSystemProvider>
  )
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

function PreviewModeToggle({ className }: { className?: string }) {
  const mode = usePreviewMode() ?? 'light'
  const next = mode === 'light' ? 'dark' : 'light'
  const Icon = mode === 'light' ? SunIcon : MoonIcon

  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Switch preview to ${next} mode`}
        className={cn('text-fg-muted', className)}
        onPress={() => modeStore.set(next)}
      >
        <Icon />
      </Button>
      <TooltipContent>Switch to {next} mode</TooltipContent>
    </Tooltip>
  )
}

/**
 * The toolbar over each docs preview: preset selector left, mode toggle right.
 * Absolutely positioned so it overlays the canvas instead of taking its own row.
 */
export function PreviewControls({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-2 pt-2',
        className,
      )}
    >
      <PresetSelector />
      <PreviewModeToggle />
    </div>
  )
}
