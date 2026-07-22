'use client'

import { XIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'
import { useMyPresets } from '@/modules/create/preset'

import { PresetCard } from './preset-card'
import { PRESETS, type Preset } from './presets-data'
import { SavedPresetCard } from './saved-preset-card'

interface PresetGalleryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** The current working system, encoded — used to flag the active saved preset. */
  currentState: string
  /** Called with the picked built-in preset; the caller applies it and closes. */
  onApply: (preset: Preset) => void
  /** Called with a saved preset's (already encoded) state; the caller navigates. */
  onApplySaved: (state: string) => void
}

/**
 * The preset gallery: the user's saved systems above a grid of built-in preset
 * thumbnails. Picking one loads it as the editor's starting point — the change
 * goes through the regular `?preset=` update, so Undo can revert it.
 */
export function PresetGalleryModal({
  isOpen,
  onOpenChange,
  currentState,
  onApply,
  onApplySaved,
}: PresetGalleryModalProps) {
  const { presets, activeId, setActive, rename, duplicate, remove } =
    useMyPresets()

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
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
          <section className="space-y-3">
            <SectionHeading>My presets</SectionHeading>
            {presets.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {presets.map((saved) => (
                  <SavedPresetCard
                    key={saved.id}
                    saved={saved}
                    isActive={
                      saved.id === activeId && saved.state === currentState
                    }
                    onApply={() => {
                      setActive(saved.id)
                      onApplySaved(saved.state)
                    }}
                    onRename={(name) => rename(saved.id, name)}
                    onDuplicate={() => duplicate(saved.id)}
                    onDelete={() => remove(saved.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-fg-muted">
                No saved presets yet — save your current system from the panel.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <SectionHeading>Built-in</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRESETS.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onSelect={() => onApply(preset)}
                />
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Modal>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-1 text-[10px] tracking-widest text-fg-muted uppercase">
      {children}
    </h3>
  )
}
