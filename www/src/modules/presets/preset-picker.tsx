'use client'

import {
  type ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'
import { Autocomplete, useFilter } from 'react-aria-components/Autocomplete'

import {
  DEFAULT_BODY_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_SANS_VAR,
  loadFontPreview,
} from '@/lib/fonts'
import { Responsive } from '@/registry/lib/responsive'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Modal } from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'
import {
  DEFAULT_RADIUS_FACTOR,
  RADIUS_FACTOR_VAR,
} from '@/modules/create/layout'
import type { DesignSystem } from '@/modules/create/preset'

import { PresetPreview, type PreviewSceneId } from './preset-preview'

interface PresetPickerItem {
  id: string
  name: string
  /** Themes the preview pane while the row is previewed. */
  designSystem: DesignSystem
  /** Dot colour; falls back to the system's accent seed. */
  swatch?: string
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
  /** Item flagged as the current selection. */
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Pin the preview to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /** Trailing controls on a row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel: a modal with a searchable rail of systems on the left and, on the
 * right, a full product screen rendered live in whichever one the pointer or
 * the arrow keys are on (see PresetShowcase). Browsing is free — nothing is
 * applied until a row is pressed.
 *
 * Mobile drops the preview pane and keeps the rail as a bottom drawer; a
 * dashboard doesn't survive that width, and the rows still carry the identity
 * cues (accent dot, the name in the system's own heading face, radius/density).
 */
export function PresetPicker({
  children,
  sections,
  selectedId,
  onPick,
  isOpen,
  onOpenChange,
  previewMode,
  renderItemActions,
}: PresetPickerProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <Responsive
        render={(isMobile) =>
          isMobile ? (
            <Drawer>
              <DialogContent
                aria-label="Presets"
                className="flex h-[70vh] flex-col rounded-[inherit] p-0"
              >
                {({ close }) => (
                  <PresetList
                    sections={sections}
                    selectedId={selectedId}
                    onPick={onPick}
                    close={close}
                    surface="drawer"
                    renderItemActions={renderItemActions}
                  />
                )}
              </DialogContent>
            </Drawer>
          ) : (
            <Modal className="h-[min(660px,85vh)] w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
              <DialogContent
                aria-label="Presets"
                // `overflow-visible` so the close button can sit above the
                // panel; the panes below clip themselves to its corners.
                className="flex min-h-0 flex-1 flex-col gap-0 overflow-visible rounded-[inherit] p-0"
              >
                {({ close }) => (
                  <>
                    {/* Sits just outside the panel's top-right corner — kept
                        inside the dialog so focus management still scopes to it. */}
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Close"
                      onPress={close}
                      className="absolute -top-10 right-0 text-fg-muted hover:bg-inverse/10 hover:text-fg"
                    >
                      <XIcon />
                    </Button>
                    <PresetPickerPanes
                      sections={sections}
                      selectedId={selectedId}
                      onPick={onPick}
                      close={close}
                      previewMode={previewMode}
                      renderItemActions={renderItemActions}
                    />
                  </>
                )}
              </DialogContent>
            </Modal>
          )
        }
      />
    </Dialog>
  )
}

function PresetPickerPanes({
  sections,
  selectedId,
  onPick,
  close,
  previewMode,
  renderItemActions,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  previewMode?: 'light' | 'dark'
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}) {
  const items = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  )
  // What the right pane shows: the row under the pointer or the keyboard
  // highlight, falling back to the current selection so the pane is never blank.
  const [previewId, setPreviewId] = useState<string | undefined>(selectedId)
  const previewed =
    items.find((item) => item.id === previewId) ??
    items.find((item) => item.id === selectedId) ??
    items[0]

  // The scene outlives the row you're on, so switching to e.g. the style guide
  // and then walking the rail compares every system on the same screen.
  const [scene, setScene] = useState<PreviewSceneId>('app')

  // Deferred so the rail always keeps up with the keyboard: the heavier scenes
  // cost a couple of hundred milliseconds to re-render, and at low priority
  // React lets the highlight land first and the preview catch up.
  const shown = useDeferredValue(previewed)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-[inherit]">
      <div className="flex w-64 shrink-0 flex-col border-r lg:w-72">
        <PresetList
          sections={sections}
          selectedId={selectedId}
          onPick={onPick}
          close={close}
          surface="modal"
          onPreview={setPreviewId}
          renderItemActions={renderItemActions}
        />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        {shown && (
          // Not keyed per preset: the provider re-themes in place (same path as
          // the live builder), so browsing the rail never remounts the screen.
          <PresetPreview
            name={shown.name}
            designSystem={shown.designSystem}
            forcedMode={previewMode}
            scene={scene}
            onSceneChange={setScene}
          />
        )}
      </div>
    </div>
  )
}

function PresetList({
  sections,
  selectedId,
  onPick,
  close,
  surface,
  onPreview,
  renderItemActions,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  surface: 'modal' | 'drawer'
  onPreview?: (id: string) => void
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}) {
  // The rail owns its filtering (Autocomplete gets no `filter`, so it only
  // wires the field to the list's keyboard nav): one predicate, so the counts
  // on the section headers and in the footer always describe what's rendered.
  const { contains } = useFilter({
    sensitivity: 'base',
    ignorePunctuation: true,
  })
  const [query, setQuery] = useState('')
  const matched = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => query === '' || contains(item.name, query),
      ),
    }))
    .filter((section) => section.items.length > 0)
  const total = matched.reduce(
    (count, section) => count + section.items.length,
    0,
  )

  function pick(key: Key) {
    const item = sections
      .flatMap((section) => section.items)
      .find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    close()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Autocomplete>
        <SearchField
          // No search autofocus on mobile — the keyboard would cover the list.
          autoFocus={surface === 'modal'}
          aria-label="Search design systems"
          className="shrink-0 p-2"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {/* `onInput`, not the field's `onChange`: Autocomplete owns the
                field's value through context, and a direct `onChange` would
                take its place. */}
            <Input
              placeholder="Search design systems..."
              onInput={(event) => setQuery(event.currentTarget.value)}
            />
          </InputGroup>
        </SearchField>
        <ListBox
          aria-label="Design systems"
          onAction={pick}
          className="min-h-0 flex-1 px-1.5 pb-1.5"
          renderEmptyState={() => (
            <div className="py-6 text-center text-sm text-fg-muted">
              No presets found
            </div>
          )}
        >
          {matched.map((section) => (
            <ListBoxSection key={section.id}>
              <ListBoxSectionHeader className="flex items-center justify-between gap-2 pr-1">
                {section.title}
                <span className="tabular-nums">{section.items.length}</span>
              </ListBoxSectionHeader>
              {section.items.map((item) => (
                <ListBoxItem
                  key={item.id}
                  id={item.id}
                  textValue={item.name}
                  className={cn(
                    'gap-2.5 py-2 pl-2.5',
                    // The current selection keeps an accent bar on the rail edge —
                    // it has to stay readable while another row is highlighted.
                    item.id === selectedId &&
                      'bg-muted before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent',
                  )}
                >
                  {({ isFocused }) => (
                    <PresetRow
                      item={item}
                      isFocused={isFocused}
                      onPreview={onPreview}
                      actions={renderItemActions?.(item)}
                    />
                  )}
                </ListBoxItem>
              ))}
            </ListBoxSection>
          ))}
        </ListBox>
      </Autocomplete>
      <div className="shrink-0 border-t px-3 py-2 text-xs text-fg-muted">
        {total} {total === 1 ? 'system' : 'systems'}
      </div>
    </div>
  )
}

/** `6px · def` — the two axes a name alone can't carry, at a glance. */
function metaLine(designSystem: DesignSystem) {
  const factor = Number.parseFloat(
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR,
  )
  // `--radius-md`, the control radius, is 0.375rem before the factor.
  const radius = Math.round(6 * (Number.isFinite(factor) ? factor : 1))
  const density = { compact: 'cpt', default: 'def', comfortable: 'cmf' }[
    designSystem.density
  ]
  return `${radius}px · ${density}`
}

/**
 * One row: accent dot, the name set in the system's own heading face, and the
 * radius/density pair. Hover or keyboard highlight drives the preview pane, so
 * the row is a browsing control first and the press is the commitment.
 */
function PresetRow({
  item,
  isFocused,
  onPreview,
  actions,
}: {
  item: PresetPickerItem
  isFocused: boolean
  onPreview?: (id: string) => void
  actions?: ReactNode
}) {
  const { designSystem } = item
  const headingStack = designSystem.tokens[FONT_HEADING_VAR]
  const bodyStack = designSystem.tokens[FONT_SANS_VAR]
  const family = headingStack
    ? familyFromStack(headingStack)
    : bodyStack
      ? familyFromStack(bodyStack)
      : DEFAULT_BODY_FAMILY
  const dot =
    item.swatch ??
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ??
    'var(--color-accent)'

  // The rail sets each name in its own face: fetch just that name's glyphs
  // (a couple of KB) instead of the family's full face for a label.
  useEffect(() => {
    loadFontPreview(document, family, item.name)
  }, [family, item.name])

  // Keyboard highlight inside the search field is virtual focus — it lands as
  // `isFocused` on the item, never as a DOM focus event on this row.
  useEffect(() => {
    if (isFocused) onPreview?.(item.id)
  }, [isFocused, item.id, onPreview])

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-2.5"
      onPointerEnter={() => onPreview?.(item.id)}
    >
      <span
        aria-hidden
        className="size-2.5 shrink-0 rounded-full ring-1 ring-fg/15 ring-inset"
        style={{ background: dot }}
      />
      <span
        className="min-w-0 flex-1 truncate"
        // The label is its own type specimen. Only the 400 face is fetched, so
        // no weight is set here — a synthetic bold would misreport the family.
        style={{ fontFamily: headingStack ?? bodyStack }}
      >
        {item.name}
      </span>
      {actions}
      <span className="shrink-0 text-[11px] text-fg-muted tabular-nums">
        {metaLine(designSystem)}
      </span>
    </div>
  )
}

export type { PresetPickerItem, PresetPickerSection }
