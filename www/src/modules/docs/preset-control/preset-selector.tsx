'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import { cn } from '@/registry/lib/utils'
import type { ButtonProps } from '@/registry/ui/button'
import type { PopoverProps } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
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
          <SelectItem id={YOURS} textValue="Your design system">
            <span className="flex items-center gap-2">
              <PresetSwatch id={YOURS} className="size-2.5" />
              Your design system
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

const PREVIEW_MODES: {
  id: PreviewMode
  label: string
  Icon: typeof SunIcon
}[] = [
  { id: 'system', label: 'Match site theme', Icon: MonitorIcon },
  { id: 'light', label: 'Light', Icon: SunIcon },
  { id: 'dark', label: 'Dark', Icon: MoonIcon },
]

/** Forces the previews to light/dark, or follows the site theme ("system"). */
export function PreviewModeToggle({ className }: { className?: string }) {
  const mode = useSelectedMode()

  return (
    <ToggleButtonGroup
      aria-label="Preview light or dark mode"
      size="sm"
      isIconOnly
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={new Set([mode])}
      onSelectionChange={(keys: Set<Key>) => {
        const next = [...keys][0]
        if (next) setSelectedMode(next as PreviewMode)
      }}
      className={className}
    >
      {PREVIEW_MODES.map(({ id, label, Icon }) => (
        <ToggleButton key={id} id={id} aria-label={label}>
          <Icon />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/**
 * The in-content preview controls: a slim bar at the top of the docs body with
 * the design-system preset (left) and the light/dark mode (right). It lives with
 * the previews (not the site header) so its scope reads honestly — it themes the
 * component previews below, not the surrounding docs chrome.
 */
export function PreviewPresetBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-lg border bg-card p-1.5 pl-2',
        className,
      )}
    >
      <PresetSelector />
      <PreviewModeToggle />
    </div>
  )
}
