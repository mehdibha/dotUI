'use client'

import type { ReactNode } from 'react'
import { SearchIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import { Responsive } from '@/registry/lib/responsive'
import {
  Command,
  CommandContent,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from '@/registry/ui/command'
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
  /** Names the option grid for assistive tech; the gallery shows no visible title. */
  label?: string
  /** Desktop popover placement. */
  placement?: PopoverProps['placement']
  /** Pin the tiles' previews to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /** Corner controls on a tile (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel header: a `Command` whose options are live preset previews (see
 * PresetTile), laid out two-up by the list box's grid layout — so arrow keys
 * walk the tiles in both axes while typing filters them. Popover on desktop,
 * bottom drawer on mobile.
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
          label={label}
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
  label,
  previewMode,
  renderItemActions,
}: {
  sections: PresetGallerySection[]
  selectedId?: string
  onPick: (item: PresetGalleryItem) => void
  close: () => void
  surface: 'popover' | 'drawer'
  label: string
  previewMode?: 'light' | 'dark'
  renderItemActions?: (item: PresetGalleryItem) => ReactNode
}) {
  function pick(key: Key) {
    const item = sections
      .flatMap((section) => section.items)
      .find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    close()
  }

  return (
    // The grid scrolls under a pinned search field, so the Command shell must
    // not scroll itself.
    <Command className="max-h-[inherit] gap-0 overflow-hidden p-0">
      <SearchField
        // No search autofocus on mobile — the keyboard would cover the grid.
        autoFocus={surface === 'popover'}
        aria-label="Search presets"
        className="shrink-0 p-2 pb-0"
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search presets..." />
        </InputGroup>
      </SearchField>
      <CommandContent
        aria-label={label}
        // Per-item `onAction` doesn't fire inside `Autocomplete`; activation has
        // to be handled at the list level.
        onAction={pick}
        // One tile column on mobile, two on desktop, where the grid layout also
        // gives arrow keys a second axis.
        layout={surface === 'popover' ? 'grid' : 'stack'}
        className="min-h-0 flex-1"
        // Spacing rides inline: the Command shell zeroes descendant list-box
        // padding, and the grid layout sets its own gap, through selectors any
        // class of ours would lose to.
        style={{ padding: 8, gap: 8 }}
        renderEmptyState={() => (
          <div className="col-span-full py-8 text-center text-sm text-fg-muted">
            No presets found
          </div>
        )}
      >
        {sections.map((section) => (
          // `contents` lifts the options into the grid, so headers and tiles
          // share one set of tracks.
          <CommandSection key={section.id} className="contents">
            <CommandSectionHeader className="col-span-full px-1 pt-1 pb-0 text-[10px] tracking-widest uppercase">
              {section.title}
            </CommandSectionHeader>
            {section.items.map((item) => (
              <CommandItem
                key={item.id}
                id={item.id}
                textValue={item.name}
                // The themed card IS the option and covers the item edge to
                // edge, so the list highlight never shows; hover/focus render
                // as an overlay on the card instead (group-*/option in
                // PresetTile). `overflow-visible` lets the corner badge sit
                // outside the card.
                className="group/option block h-full overflow-visible rounded-xl p-0"
              >
                <PresetTile
                  item={item}
                  isSelected={item.id === selectedId}
                  forcedMode={previewMode}
                  actions={renderItemActions?.(item)}
                />
              </CommandItem>
            ))}
          </CommandSection>
        ))}
      </CommandContent>
    </Command>
  )
}

export type { PresetGalleryItem, PresetGallerySection }
