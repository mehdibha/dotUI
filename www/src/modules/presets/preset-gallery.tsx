'use client'

import { type ReactNode, useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { Responsive } from '@/registry/lib/responsive'
import { cn } from '@/registry/lib/utils'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import type { PopoverProps } from '@/registry/ui/popover'
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
  /** Names the overlay for assistive tech; the gallery shows no visible title. */
  label?: string
  /** Desktop popover placement. */
  placement?: PopoverProps['placement']
  /** Pin the tiles' previews to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /** Trailing controls on a tile's caption row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel header: a searchable gallery of live preset previews (see PresetTile),
 * laid out two-up in a popover on desktop and one-up in a bottom drawer on
 * mobile. You pick a design system by looking at it, not by reading its name
 * off a list.
 */
export function PresetGallery({
  children,
  sections,
  selectedId,
  onPick,
  isOpen,
  onOpenChange,
  label = 'Presets',
  placement = 'bottom start',
  previewMode,
  renderItemActions,
}: PresetGalleryProps) {
  const content = (surface: 'popover' | 'drawer') => (
    <DialogContent
      aria-label={label}
      className="flex flex-col gap-0 rounded-[inherit] p-0"
    >
      {({ close }) => (
        <PresetGalleryContent
          sections={sections}
          selectedId={selectedId}
          onPick={onPick}
          close={close}
          surface={surface}
          previewMode={previewMode}
          renderItemActions={renderItemActions}
        />
      )}
    </DialogContent>
  )

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <Responsive
        render={(isMobile) =>
          isMobile ? (
            <Drawer>{content('drawer')}</Drawer>
          ) : (
            // Two tile columns wide, clamped so the popover never outgrows a
            // narrow desktop window (RAC repositions it but won't shrink it).
            <Popover
              placement={placement}
              className="w-[min(calc(100vw-2rem),40rem)]"
            >
              {content('popover')}
            </Popover>
          )
        }
      />
    </Dialog>
  )
}

function PresetGalleryContent({
  sections,
  selectedId,
  onPick,
  close,
  surface,
  previewMode,
  renderItemActions,
}: {
  sections: PresetGallerySection[]
  selectedId?: string
  onPick: (item: PresetGalleryItem) => void
  close: () => void
  surface: 'popover' | 'drawer'
  previewMode?: 'light' | 'dark'
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}) {
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
    // This is the scroll container (the overlay caps its own height), so the
    // search field has to stick to its top or it scrolls away with the tiles.
    <div className="max-h-[inherit] overflow-y-auto">
      <SearchField
        // No search autofocus on mobile — the keyboard would cover the grid.
        autoFocus={surface === 'popover'}
        aria-label="Search presets"
        value={query}
        onChange={setQuery}
        className={cn(
          'sticky top-0 z-20 p-2',
          surface === 'popover' ? 'bg-popover' : 'bg-bg',
        )}
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search presets..." />
        </InputGroup>
      </SearchField>
      <div className="space-y-4 px-2 pb-2">
        {filtered.map((section) => (
          <section key={section.id} className="space-y-2">
            <h3 className="px-1 text-[10px] tracking-widest text-fg-muted uppercase">
              {section.title}
            </h3>
            {section.items.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
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
          <p className="py-8 text-center text-sm text-fg-muted">
            No presets found
          </p>
        )}
      </div>
    </div>
  )
}

export type { PresetGalleryItem, PresetGallerySection }
