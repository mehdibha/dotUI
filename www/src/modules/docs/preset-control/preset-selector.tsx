'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import { cn } from '@/registry/lib/utils'
import { Button, type ButtonProps } from '@/registry/ui/button'
import type { PopoverProps } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { useDesignSystemName } from '@/modules/create/preset/storage'
import { PRESETS } from '@/modules/presets/presets-data'

import { presetAccent } from './resolve'
import {
  setSelectedMode,
  setSelectedPreset,
  useSelectedMode,
  useSelectedPreset,
  YOURS,
  type PreviewMode,
} from './store'

/** A small dot in the preset's accent color (site primary for "your design system"). */
function PresetSwatch({ id, className }: { id: string; className?: string }) {
  const accent = presetAccent(id)
  return (
    <span
      aria-hidden
      className={cn(
        'size-3 shrink-0 rounded-full border border-border',
        className,
      )}
      style={{ background: accent ?? 'var(--color-primary)' }}
    />
  )
}

interface PresetSelectorProps {
  className?: string
  triggerClassName?: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  placement?: PopoverProps['placement']
}

/**
 * Picks the design-system preset every docs preview renders in. The choice is
 * global (stored in localStorage via the preset store), so changing it here
 * re-themes every demo/playground/example on the site at once.
 */
export function PresetSelector({
  className,
  triggerClassName,
  size = 'sm',
  variant = 'quiet',
  placement = 'bottom',
}: PresetSelectorProps) {
  const selected = useSelectedPreset()
  // The user's own design system shows its name (defaults to "Untitled" until
  // renamed at /create), not a generic label.
  const yoursLabel = useDesignSystemName().trim() || 'Untitled'

  return (
    // The field slot is `w-full`; a `w-fit` wrapper keeps the control sized to
    // its content instead of stretching to fill the bar.
    <div className={cn('w-fit', className)}>
      <Select
        aria-label="Preview design system"
        selectedKey={selected}
        onSelectionChange={(key: Key | null) => {
          if (key != null) setSelectedPreset(String(key))
        }}
      >
        <SelectTrigger
          size={size}
          variant={variant}
          className={cn('gap-1.5', triggerClassName)}
        >
          <PresetSwatch id={selected} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent placement={placement}>
          <SelectItem id={YOURS} textValue={yoursLabel}>
            <span className="flex items-center gap-2">
              <PresetSwatch id={YOURS} className="size-2.5" />
              {yoursLabel}
            </span>
          </SelectItem>
          {PRESETS.map((preset) => (
            <SelectItem key={preset.id} id={preset.id} textValue={preset.name}>
              <span className="flex items-center gap-2">
                <PresetSwatch id={preset.id} className="size-2.5" />
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

/**
 * Forces the previews to light/dark, or follows the site theme ("system").
 * A single icon button cycling system → light → dark; the icon shows the
 * current mode.
 */
export function PreviewModeToggle({ className }: { className?: string }) {
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
        onPress={() => setSelectedMode(next)}
      >
        <Icon />
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/**
 * The per-demo preview controls, in their own space at the top of the preview
 * area: the design-system preset top-left, the light/dark mode top-right.
 * Deliberately backdrop-free — no bg or divider — so they read as part of the
 * preview rather than a detached toolbar. The controls are site chrome (outside
 * DemoPreset), so a forced mode themes the canvas below, not them. The choice is
 * global, so every demo's controls stay in sync.
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
