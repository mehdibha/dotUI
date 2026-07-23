'use client'

import type { ReactNode } from 'react'
import { CheckIcon, SearchIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import { DesignSystemProvider } from '@/lib/styles'
import { Responsive } from '@/registry/lib/responsive'
import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Checkbox } from '@/registry/ui/checkbox'
import { Command } from '@/registry/ui/command'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import type { PopoverProps } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import type { DesignSystem } from '@/modules/create/preset'

interface PresetPickerItem {
  id: string
  name: string
  description?: string
  /** Themes the option's card preview. */
  designSystem: DesignSystem
}

interface PresetPickerSection {
  id: string
  title: string
  items: PresetPickerItem[]
}

interface PresetPickerProps {
  /** The pressable trigger — wired to the overlay via the Dialog trigger context. */
  children: ReactNode
  sections: PresetPickerSection[]
  /** Item flagged with a check mark (e.g. the current selection). */
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Desktop popover placement. */
  placement?: PopoverProps['placement']
  /** Pin the rows' mini previews to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /** Trailing controls on a row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel: a searchable command list where every option is a live card preview
 * of the preset (see PresetOptionCard). Popover on desktop, bottom drawer on
 * mobile.
 */
export function PresetPicker({
  children,
  sections,
  selectedId,
  onPick,
  isOpen,
  onOpenChange,
  placement = 'bottom start',
  previewMode,
  renderItemActions,
}: PresetPickerProps) {
  const content = (autoFocusSearch: boolean) => (
    <DialogContent
      aria-label="Presets"
      className="flex flex-col gap-0 rounded-[inherit] p-0"
    >
      {({ close }) => (
        <PresetPickerContent
          sections={sections}
          selectedId={selectedId}
          onPick={onPick}
          close={close}
          autoFocusSearch={autoFocusSearch}
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
            // No search autofocus on mobile — the keyboard would cover the list.
            <Drawer>{content(false)}</Drawer>
          ) : (
            <Popover placement={placement} className="w-96">
              {content(true)}
            </Popover>
          )
        }
      />
    </Dialog>
  )
}

function PresetPickerContent({
  sections,
  selectedId,
  onPick,
  close,
  autoFocusSearch,
  previewMode,
  renderItemActions,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  autoFocusSearch: boolean
  previewMode?: 'light' | 'dark'
  renderItemActions?: (item: PresetPickerItem) => ReactNode
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
    <Command>
      <SearchField
        autoFocus={autoFocusSearch}
        aria-label="Search presets"
        className="p-1"
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search presets..." />
        </InputGroup>
      </SearchField>
      <MenuContent
        aria-label="Presets"
        onAction={pick}
        className="max-h-96 overflow-y-auto p-1 pt-0"
        renderEmptyState={() => (
          <div className="py-6 text-center text-sm text-fg-muted">
            No presets found
          </div>
        )}
      >
        {sections.map((section) => (
          <MenuSection key={section.id}>
            {/* px-0 keeps the title flush with the card edges below it. */}
            <MenuSectionHeader className="px-0">
              {section.title}
            </MenuSectionHeader>
            {section.items.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                textValue={item.name}
                // The themed card IS the option — it fills the item, so the
                // menu highlight never shows; hover/focus render as an overlay
                // on the card instead (group-*/option below).
                className="group/option mb-1 rounded-lg p-0"
              >
                <PresetOptionCard
                  item={item}
                  isSelected={item.id === selectedId}
                  forcedMode={previewMode}
                  actions={renderItemActions?.(item)}
                />
              </MenuItem>
            ))}
          </MenuSection>
        ))}
      </MenuContent>
    </Command>
  )
}

/**
 * One preset option: a full-width card that IS the preview — themed by the
 * preset via a scoped provider, name set in the preset's own heading font,
 * over a small cluster of real components (buttons, switch, input, checkbox,
 * badge, slider) covering the preset's telling axes: accent + primary color,
 * neutral surfaces, radius, fonts, density. No iframes, no scaling; the scoped
 * stylesheet is content-cached, so a list of these stays cheap. The check and
 * actions menu sit over the card but OUTSIDE the scope, so site chrome (and
 * the rename modal the actions open) keeps the site theme.
 */
function PresetOptionCard({
  item,
  isSelected,
  forcedMode,
  actions,
}: {
  item: PresetPickerItem
  isSelected: boolean
  forcedMode?: 'light' | 'dark'
  actions?: ReactNode
}) {
  const { designSystem } = item
  const hasControls = isSelected || actions !== undefined
  return (
    <div className="relative w-full">
      <DesignSystemProvider
        scoped
        params={designSystem.componentParams}
        tokens={designSystem.tokens}
        density={designSystem.density}
        color={designSystem.color}
        icons={designSystem.icons}
        forcedMode={forcedMode}
      >
        <div className="relative w-full overflow-hidden rounded-lg border bg-bg p-3 pt-2.5">
          <div
            className={cn('flex items-baseline gap-2', hasControls && 'pr-14')}
          >
            <span className="shrink-0 font-heading text-sm font-medium text-fg">
              {item.name}
            </span>
            {item.description && (
              <span className="min-w-0 flex-1 truncate text-xs text-fg-muted">
                {item.description}
              </span>
            )}
          </div>
          <div
            inert
            aria-hidden
            className="pointer-events-none mt-2.5 flex flex-col gap-2.5 select-none"
          >
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm">
                Save
              </Button>
              <Button size="sm">Cancel</Button>
              <Switch
                isSelected
                aria-label="Sample switch"
                className="ml-auto"
              />
            </div>
            <Input placeholder="Input" className="w-full" />
            <div className="flex items-center gap-2.5">
              <Checkbox isSelected aria-label="Sample checkbox" />
              <Badge>Badge</Badge>
              <Slider
                aria-label="Sample slider"
                defaultValue={60}
                className="ml-auto w-28"
              >
                <SliderControl />
              </Slider>
            </div>
          </div>
          {/* Hover/virtual-focus feedback: a subtle lightening overlay (the
              preset's own fg, so it adapts to the card's mode) — no border
              change. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-fg opacity-0 transition-opacity group-hover/option:opacity-4 group-data-focused/option:opacity-6"
          />
        </div>
      </DesignSystemProvider>
      {hasControls && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5">
          {isSelected && (
            <CheckIcon aria-hidden className="size-4 shrink-0 text-fg-accent" />
          )}
          {actions}
        </div>
      )}
    </div>
  )
}

export type { PresetPickerItem, PresetPickerSection }
