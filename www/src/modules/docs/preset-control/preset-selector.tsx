'use client'

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
import { PRESETS } from '@/modules/presets/presets-data'

import { presetAccent } from './resolve'
import { setSelectedPreset, useSelectedPreset, YOURS } from './store'

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
          <SelectItem id={YOURS}>Your design system</SelectItem>
          {PRESETS.map((preset) => (
            <SelectItem key={preset.id} id={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * The in-content control: a slim "Previewing components in [preset]" bar that
 * sits at the top of the docs body. It lives with the previews (not the site
 * header) so its scope reads honestly — it themes the components below, not the
 * surrounding docs chrome.
 */
export function PreviewPresetBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-lg border bg-card py-1.5 pr-1.5 pl-3 text-sm',
        className,
      )}
    >
      <span className="text-fg-muted">Previewing components in</span>
      <PresetSelector />
    </div>
  )
}
