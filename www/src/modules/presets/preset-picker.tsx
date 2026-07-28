'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckIcon, SearchIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'
import { useFilter } from 'react-aria-components/Autocomplete'

import {
  DEFAULT_BODY_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_SANS_VAR,
} from '@/lib/fonts'
import { DesignSystemProvider } from '@/lib/styles'
import {
  ArrowRightIcon,
  SearchIcon as PresetSearchIcon,
} from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Checkbox } from '@/registry/ui/checkbox'
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
import { Switch } from '@/registry/ui/switch'
import { RADIUS_FACTOR_VAR } from '@/modules/create/layout'
import type { DesignSystem } from '@/modules/create/preset'

interface PresetPickerItem {
  id: string
  name: string
  /** Themes the option's preview. */
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
  /** Pin the previews to one mode (docs previews pin light/dark). */
  previewMode?: 'light' | 'dark'
  /**
   * Show the live vignettes: a pinned preview pane on desktop, inline on each
   * drawer row. Off by default.
   */
  withPreview?: boolean
  /** Trailing controls on a row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel: a searchable list of compact, themed rows — each preset's name in its
 * own heading font, its font/radius/density and three palette dots. Popover on
 * desktop, drawer on mobile.
 *
 * `withPreview` adds live vignettes. Desktop becomes master–detail: the rows
 * beside a pinned pane previewing the row under the pointer or the keyboard
 * highlight (see PresetPreviewPane) — rows never change size, so scanning
 * never reflows the list under the cursor. Drawer rows — no pointer, no
 * highlight — carry the vignette inline instead.
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
  withPreview = false,
  renderItemActions,
}: PresetPickerProps) {
  const content = (surface: 'popover' | 'drawer') => (
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
          surface={surface}
          previewMode={previewMode}
          withPreview={withPreview}
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
            // With the pane, 600px = the 260px list column + its 1px divider +
            // the 337px the pane's vignette needs + the popover's 1px borders;
            // without it, the popover sizes to the list column.
            <Popover
              placement={placement}
              className={withPreview ? 'w-[600px]' : undefined}
            >
              {content('popover')}
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
  surface,
  previewMode,
  withPreview,
  renderItemActions,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  surface: 'popover' | 'drawer'
  previewMode?: 'light' | 'dark'
  withPreview: boolean
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}) {
  // Autocomplete owns the filtering; we mirror the query only to keep the
  // section counts honest and to drop a section whose matches all filtered out
  // (its header is our child, so the collection can't hide it for us). Reading
  // it off `onInput` leaves the value under Autocomplete's control.
  const [query, setQuery] = useState('')
  const { contains } = useFilter({
    sensitivity: 'base',
    ignorePunctuation: true,
  })
  // Which preset the pane previews: the last row the pointer entered or the
  // keyboard highlight landed on, whichever signalled most recently. Focus only
  // counts once the user has actually navigated (arrows or typing) — the
  // collection may highlight a row on open, and until then the pane should show
  // the current selection, not the first row.
  const navigatedRef = useRef(false)
  const [previewId, setPreviewId] = useState<string | null>(selectedId ?? null)
  const showPreview = useCallback((id: string, via: 'hover' | 'focus') => {
    if (via === 'focus' && !navigatedRef.current) return
    setPreviewId(id)
  }, [])

  const visible = sections
    .map((section) => ({
      ...section,
      items: query
        ? section.items.filter((item) => contains(item.name, query))
        : section.items,
    }))
    .filter((section) => section.items.length > 0)
  const allItems = sections.flatMap((section) => section.items)
  const previewItem =
    allItems.find((item) => item.id === previewId) ?? allItems[0]

  function pick(key: Key) {
    const item = allItems.find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    close()
  }

  const list = (
    <>
      <SearchField
        // No search autofocus on mobile — the keyboard would cover the list.
        autoFocus={surface === 'popover'}
        aria-label="Search design systems"
        className="shrink-0 p-2"
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input
            placeholder="Search design systems..."
            onInput={(e) => {
              setQuery(e.currentTarget.value)
              // Typing moves the highlight to the first match, so from here on
              // the pane follows it.
              navigatedRef.current = true
            }}
          />
        </InputGroup>
      </SearchField>
      <CommandContent
        aria-label="Design systems"
        onAction={pick}
        // Spacing and scrolling ride inline: the Command wrapper forces `p-0`
        // and `overflow-visible` on us through descendant selectors that any
        // class of ours would lose to.
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '0 8px 8px',
          maxHeight: surface === 'popover' ? 420 : '60vh',
          overflowY: 'auto',
          scrollPaddingBlock: 8,
        }}
        renderEmptyState={() => (
          <div className="py-6 text-center text-sm text-fg-muted">
            No design systems found
          </div>
        )}
      >
        {visible.map((section) => (
          // `contents` lifts the options into the outer column, so one gap rule
          // spaces headers and rows alike.
          <CommandSection key={section.id} className="contents">
            <CommandSectionHeader className="flex items-center justify-between px-1 pt-2.5 pb-1 text-[10px] font-medium tracking-[0.09em] uppercase">
              {section.title}
              <span className="tabular-nums">{section.items.length}</span>
            </CommandSectionHeader>
            {section.items.map((item) => (
              <CommandItem
                key={item.id}
                id={item.id}
                textValue={item.name}
                // The themed row IS the option and covers the item edge to edge,
                // so the list highlight never shows; hover/focus render on the
                // row instead (`before:hidden` drops the highlight style's own
                // accent bar, which would paint the site's accent over the
                // preset's). `overflow-visible` lets the focus ring and the
                // selected badge sit outside the row.
                className="block overflow-visible rounded-xl p-0 before:hidden"
              >
                {({ isFocused, isHovered }) => (
                  <PresetOptionRow
                    item={item}
                    isSelected={item.id === selectedId}
                    isFocused={isFocused}
                    isHovered={isHovered}
                    isActive={
                      surface === 'popover' && item.id === previewItem?.id
                    }
                    withVignette={surface === 'drawer' && withPreview}
                    onShow={surface === 'popover' ? showPreview : undefined}
                    forcedMode={previewMode}
                    actions={renderItemActions?.(item)}
                  />
                )}
              </CommandItem>
            ))}
          </CommandSection>
        ))}
      </CommandContent>
    </>
  )

  if (surface === 'drawer')
    return <Command className="gap-0 p-0">{list}</Command>

  return (
    <Command
      className="gap-0 overflow-hidden p-0"
      onKeyDownCapture={(e) => {
        if (e.key.startsWith('Arrow')) navigatedRef.current = true
      }}
    >
      <div className="flex min-h-0">
        <div
          className={cn(
            'flex w-[260px] shrink-0 flex-col',
            withPreview && 'border-r',
          )}
        >
          {list}
        </div>
        {withPreview && (
          <PresetPreviewPane item={previewItem} forcedMode={previewMode} />
        )}
      </div>
    </Command>
  )
}

/** The palette roles the row's dots sample — the ones two systems disagree on first. */
const DOT_ROLES = ['bg-primary', 'bg-accent', 'bg-neutral'] as const

/** The vignette's swatch strip: the semantic vocabulary, not one ramp. */
const SWATCH_ROLES = [
  'bg-primary',
  'bg-accent',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-neutral',
] as const

/** The families behind the preset's heading/body tokens, resolved to names. */
function fontPair(designSystem: DesignSystem) {
  const body = designSystem.tokens[FONT_SANS_VAR]
    ? familyFromStack(designSystem.tokens[FONT_SANS_VAR])
    : DEFAULT_BODY_FAMILY
  const headingStack = designSystem.tokens[FONT_HEADING_VAR]
  const heading = headingStack ? familyFromStack(headingStack) : body
  return { heading, body }
}

/** The control radius the factor lands on — `--radius-md` is 0.375rem at 1x. */
function radiusLabel(designSystem: DesignSystem) {
  const parsed = Number.parseFloat(
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1',
  )
  const factor = Number.isFinite(parsed) ? parsed : 1
  return `${Math.round(6 * factor)}px`
}

/**
 * One option: a compact themed row answering the three questions you scan a
 * preset list for — what is it called (set in the preset's own heading font, so
 * the name is its own type specimen), what does it read like (body family ·
 * control radius · density) and what colour is it (primary / accent / neutral
 * dots).
 *
 * On desktop the row stays this size forever; pointing or arrowing at it sends
 * the vignette to the pinned pane instead of unfolding in place, so the list
 * never reflows under the cursor. In the drawer — no pointer, no highlight —
 * every row carries its vignette inline.
 */
function PresetOptionRow({
  item,
  isSelected,
  isFocused,
  isHovered,
  isActive,
  withVignette,
  onShow,
  forcedMode,
  actions,
}: {
  item: PresetPickerItem
  isSelected: boolean
  isFocused: boolean
  isHovered: boolean
  isActive: boolean
  withVignette: boolean
  onShow?: (id: string, via: 'hover' | 'focus') => void
  forcedMode?: 'light' | 'dark'
  actions?: ReactNode
}) {
  const { designSystem } = item
  const { heading, body } = fontPair(designSystem)

  // Route this row to the pane: the pointer and the keyboard highlight both
  // land here, and whichever spoke last wins.
  useEffect(() => {
    if (isHovered) onShow?.(item.id, 'hover')
    else if (isFocused) onShow?.(item.id, 'focus')
  }, [isHovered, isFocused, item.id, onShow])

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
        <div
          className={cn(
            'overflow-hidden rounded-lg border bg-bg',
            isSelected && 'ring-1 ring-accent',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3 p-3',
              actions ? 'pr-10' : undefined,
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[15px] leading-tight font-semibold text-fg">
                {item.name}
              </p>
              <p className="mt-1 truncate text-[11px] leading-none text-fg-muted">
                {heading === body ? body : `${heading} / ${body}`} ·{' '}
                {radiusLabel(designSystem)} · {designSystem.density}
              </p>
            </div>
            <div aria-hidden className="flex shrink-0 items-center gap-1">
              {DOT_ROLES.map((role) => (
                <span
                  key={role}
                  // The hairline keeps a near-white or near-black role from
                  // vanishing into the row it sits on.
                  className={cn(
                    'size-2.5 rounded-full ring-1 ring-fg/10 ring-inset',
                    role,
                  )}
                />
              ))}
            </div>
          </div>

          {withVignette && (
            <div className="border-t p-3">
              <PresetVignette />
            </div>
          )}
        </div>
      </DesignSystemProvider>

      {/* Site chrome, deliberately outside the preset scope: the actions menu
          belongs to the site, not to the system it acts on. */}
      {actions ? (
        <div className="absolute top-2.5 right-2.5 z-10">{actions}</div>
      ) : null}
      {isSelected && (
        <span
          aria-hidden
          // Site fg, not accent: the row's own ring already answers in the
          // preset's colour, and this marker has to stay legible over every
          // palette (Vercel's accent is near-black).
          className="absolute -top-1.5 -left-1.5 z-10 flex size-4.5 items-center justify-center rounded-full bg-fg text-bg shadow-sm"
        >
          <CheckIcon className="size-2.5" />
        </span>
      )}

      {/* Hover/virtual-focus feedback over the whole option, in the site's own
          fg so it reads consistently regardless of the preset underneath.
          Keyboard focus is virtual — it lands as `data-focused` on the item,
          never as a real `:focus-visible`. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-1 rounded-xl bg-fg ring-fg/20 transition-opacity',
          isActive ? 'opacity-5 ring-2' : 'opacity-0',
        )}
      />
    </div>
  )
}

/**
 * The pinned detail pane: a live vignette of the previewed preset, always
 * visible beside the list. Swapping presets swaps its content outright — the
 * highlight moves tens of times per open, and animating that would only slow
 * it down.
 */
function PresetPreviewPane({
  item,
  forcedMode,
}: {
  item?: PresetPickerItem
  forcedMode?: 'light' | 'dark'
}) {
  if (!item) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center text-sm text-fg-muted">
        No design systems
      </div>
    )
  }

  const { designSystem } = item
  const { heading, body } = fontPair(designSystem)

  return (
    <DesignSystemProvider
      scoped
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
      forcedMode={forcedMode}
    >
      <div className="flex min-w-0 flex-1 flex-col bg-bg">
        <div className="flex items-center gap-3 border-b p-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base leading-tight font-semibold text-fg">
              {item.name}
            </p>
            <p className="mt-1 truncate text-[11px] leading-none text-fg-muted">
              {heading === body ? body : `${heading} / ${body}`} ·{' '}
              {radiusLabel(designSystem)} · {designSystem.density}
            </p>
          </div>
          <div aria-hidden className="flex shrink-0 items-center gap-1">
            {DOT_ROLES.map((role) => (
              <span
                key={role}
                className={cn(
                  'size-2.5 rounded-full ring-1 ring-fg/10 ring-inset',
                  role,
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 p-3.5">
          <PresetVignette />
        </div>
      </div>
    </DesignSystemProvider>
  )
}

/**
 * What UI built with the preset looks like — the one question a summary row
 * can't answer. Real components — a primary and a secondary action, a badge, a
 * switch, a checkbox, a search field — plus the semantic swatch strip, so
 * radius, field style, control height, icon set and the whole colour vocabulary
 * read off actual UI. Renders inside a DesignSystemProvider scope; no iframes,
 * no scaling, and the scoped stylesheet is content-cached, so many of these
 * stay cheap.
 */
function PresetVignette() {
  return (
    <div inert aria-hidden className="flex flex-col gap-2.5 select-none">
      <div>
        <p className="font-heading text-sm leading-tight font-semibold text-fg">
          Ship a system you own
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-fg-muted">
          Every token, component and style, exported as code in your codebase.
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="primary" size="sm">
          Get started
          <ArrowRightIcon />
        </Button>
        <Button size="sm">Preview</Button>
        <Badge variant="accent" appearance="subtle" size="sm">
          Beta
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Switch isSelected />
        <Checkbox isSelected />
        <InputGroup className="min-w-0 flex-1">
          <InputGroupAddon>
            <PresetSearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search" />
        </InputGroup>
      </div>

      <div className="flex gap-1">
        {SWATCH_ROLES.map((role) => (
          <span
            key={role}
            className={cn(
              'h-2.5 flex-1 rounded-[2px] ring-1 ring-fg/10 ring-inset',
              role,
            )}
          />
        ))}
      </div>
    </div>
  )
}

export type { PresetPickerItem, PresetPickerSection }
