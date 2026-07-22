'use client'

import { XIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

import { PresetCard } from './preset-card'
import { PRESETS, type Preset } from './presets-data'

interface PresetGalleryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the picked preset; the caller applies it and closes. */
  onApply: (preset: Preset) => void
}

/**
 * The preset gallery: a grid of live preset thumbnails in a modal over the
 * editor. Picking one loads it as the editor's starting point — the change goes
 * through the regular `?preset=` update, so Undo can revert it.
 */
export function PresetGalleryModal({
  isOpen,
  onOpenChange,
  onApply,
}: PresetGalleryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="h-[85vh] w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
    >
      <DialogContent
        aria-label="Presets"
        className="relative flex h-full min-h-0 flex-col rounded-[inherit] p-0"
      >
        {/* Close sits just outside the panel's top-right corner (kept inside the
            dialog so focus management still scopes to it). */}
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Close"
          onPress={() => onOpenChange(false)}
          className="absolute -top-10 right-0 z-10 text-fg-muted hover:bg-inverse/10 hover:text-fg"
        >
          <XIcon />
        </Button>
        <div className="flex shrink-0 flex-col gap-1 border-b p-5">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Start from a preset
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            Ready-made design systems. Pick one, then make it yours — Undo
            brings your current system back.
          </DialogDescription>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onSelect={() => onApply(preset)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Modal>
  )
}
