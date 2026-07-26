'use client'

import { type ReactNode, useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import { useIsMobile } from '@/registry/hooks/use-mobile'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'

import { type PresetGalleryItem, PresetTile } from './preset-tile'

interface PresetGallerySection {
  id: string
  title: string
  items: PresetGalleryItem[]
  /** Shown in place of the grid when the section has no items and no search is running. */
  emptyState?: ReactNode
}

interface PresetGalleryProps {
  /** The pressable trigger — wired to the overlay via the Dialog trigger context. */
  children: ReactNode
  sections: PresetGallerySection[]
  /** Item flagged as selected (e.g. the current design system). */
  selectedId?: string
  onPick: (item: PresetGalleryItem) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  /** Pin the tiles' previews to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /** Trailing controls on a tile's caption row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel header: a searchable gallery of live preset previews (see PresetTile),
 * laid out as a grid in a wide modal. One surface everywhere — you pick a
 * design system by looking at it, not by reading its name off a list.
 */
export function PresetGallery({
  children,
  sections,
  selectedId,
  onPick,
  isOpen,
  onOpenChange,
  title = 'Presets',
  description,
  previewMode,
  renderItemActions,
}: PresetGalleryProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <Modal className="h-[85vh] w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        <DialogContent
          aria-label={title}
          className="relative flex h-full min-h-0 flex-col rounded-[inherit] p-0"
        >
          {({ close }) => (
            <PresetGalleryContent
              sections={sections}
              selectedId={selectedId}
              onPick={onPick}
              close={close}
              title={title}
              description={description}
              previewMode={previewMode}
              renderItemActions={renderItemActions}
            />
          )}
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function PresetGalleryContent({
  sections,
  selectedId,
  onPick,
  close,
  title,
  description,
  previewMode,
  renderItemActions,
}: {
  sections: PresetGallerySection[]
  selectedId?: string
  onPick: (item: PresetGalleryItem) => void
  close: () => void
  title: string
  description?: string
  previewMode?: 'light' | 'dark'
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}) {
  const isMobile = useIsMobile()
  const [query, setQuery] = useState('')
  const search = query.trim().toLowerCase()
  const filtered = search
    ? sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.name.toLowerCase().includes(search),
          ),
        }))
        .filter((section) => section.items.length > 0)
    : sections

  function pick(item: PresetGalleryItem) {
    onPick(item)
    close()
  }

  return (
    <>
      {/* Close sits just outside the panel's top-right corner (kept inside the
          dialog so focus management still scopes to it). */}
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label="Close"
        onPress={close}
        className="absolute -top-10 right-0 z-10 text-fg-muted hover:bg-inverse/10 hover:text-fg"
      >
        <XIcon />
      </Button>
      <div className="flex shrink-0 flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          {description && (
            // Three lines of preamble on a phone push every tile below the fold.
            <DialogDescription className="hidden text-sm text-fg-muted sm:block">
              {description}
            </DialogDescription>
          )}
        </div>
        <SearchField
          // No search autofocus on mobile — the keyboard would cover the grid.
          autoFocus={!isMobile}
          aria-label="Search presets"
          value={query}
          onChange={setQuery}
          className="w-full sm:w-56"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search presets..." />
          </InputGroup>
        </SearchField>
      </div>
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-5">
        {filtered.map((section) => (
          <section key={section.id} className="space-y-3">
            <h3 className="px-1 text-[10px] tracking-widest text-fg-muted uppercase">
              {section.title}
            </h3>
            {section.items.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <PresetTile
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    forcedMode={previewMode}
                    actions={renderItemActions?.(item)}
                    onSelect={() => pick(item)}
                  />
                ))}
              </div>
            ) : (
              section.emptyState
            )}
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-fg-muted">
            No presets found
          </p>
        )}
      </div>
    </>
  )
}

export type { PresetGalleryItem, PresetGallerySection }
