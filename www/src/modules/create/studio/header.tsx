'use client'

import { DicesIcon, Redo2Icon, RotateCcwIcon, Undo2Icon } from 'lucide-react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useDesignSystem } from '../preset'
import { CommandPalette } from './command-palette'
import { Segmented } from './controls'
import { useStudioActions } from './hooks'
import { useStudio } from './store'
import { useHistory } from './use-history'

/**
 * Two compact rows: identity + search, then mode + history. The theme toggle is
 * intentionally absent — the global site header already owns it, and the preview
 * has its own mode switch, so duplicating it here only spent a row.
 */
export function StudioHeader() {
  const { name, setName, depth, setDepth } = useStudio()
  const { reroll, reset } = useStudioActions()
  const { canUndo, canRedo, undo, redo } = useHistory()

  return (
    <div className="flex flex-col gap-2 border-b p-2">
      {/* Identity + search */}
      <div className="flex items-center gap-2">
        <BrandSwatch />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-semibold outline-none focus-visible:bg-neutral focus-visible:px-1"
        />
        <CommandPalette compact />
      </div>

      {/* Mode + history */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Segmented
            ariaLabel="Depth"
            value={depth}
            onChange={setDepth}
            options={[
              { value: 'quick', label: 'Quick' },
              { value: 'studio', label: 'Studio' },
            ]}
          />
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="Re-roll the system" onPress={reroll}>
            <DicesIcon />
          </IconButton>
          <IconButton label="Undo" onPress={undo} isDisabled={!canUndo}>
            <Undo2Icon />
          </IconButton>
          <IconButton label="Redo" onPress={redo} isDisabled={!canRedo}>
            <Redo2Icon />
          </IconButton>
          <IconButton label="Reset to default" onPress={reset}>
            <RotateCcwIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

function IconButton({
  label,
  onPress,
  isDisabled,
  children,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label={label}
        onPress={onPress}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/** Live brand-color swatch — edit the accent from anywhere in the studio. */
function BrandSwatch() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const accent =
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  return (
    <ColorPicker
      value={accent}
      onChange={(c) => setColorSeed('accent', c.toString('hex'))}
    >
      <Button
        isIconOnly
        size="sm"
        aria-label="Brand color"
        className="size-7 overflow-hidden p-0"
      >
        <span className="block size-full" style={{ backgroundColor: accent }} />
      </Button>
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
    </ColorPicker>
  )
}
