'use client'

import type { ReactNode } from 'react'
import { CheckIcon, SearchIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import {
  DEFAULT_BODY_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_SANS_VAR,
} from '@/lib/fonts'
import { DesignSystemProvider } from '@/lib/styles'
import {
  ArrowRightIcon,
  CircleIcon,
  LayersIcon,
  SearchIcon as PresetSearchIcon,
  SparklesIcon,
} from '@/registry/__generated__/icons'
import { Responsive } from '@/registry/lib/responsive'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
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
import type { DesignSystem } from '@/modules/create/preset'

interface PresetPickerItem {
  id: string
  name: string
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
 * of the preset (see PresetOptionCard). Two-column grid inside a wide popover
 * on desktop, single-column bottom drawer on mobile.
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
            // 348px = the picked 330px card + the list's 8px gutters + the
            // popover's 1px borders. Where the browser draws a classic
            // scrollbar it takes ~12px of that back off the card.
            <Popover placement={placement} className="w-[348px]">
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
  renderItemActions,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  surface: 'popover' | 'drawer'
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
    // The Command wrapper is the scroll container, so the search field has to
    // stick to its top or it scrolls away with the cards.
    <Command className="gap-0 p-0">
      <SearchField
        // No search autofocus on mobile — the keyboard would cover the list.
        autoFocus={surface === 'popover'}
        aria-label="Search presets"
        className={cn(
          'sticky top-0 z-10 p-2',
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
      <CommandContent
        aria-label="Presets"
        onAction={pick}
        // Spacing rides inline: the Command wrapper forces `p-0` on us through a
        // descendant selector that any class of ours would lose to.
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '0 8px 8px',
        }}
        renderEmptyState={() => (
          <div className="py-6 text-center text-sm text-fg-muted">
            No presets found
          </div>
        )}
      >
        {sections.map((section) => (
          // `contents` lifts the options into the outer column, so one gap rule
          // spaces headers and cards alike.
          <CommandSection key={section.id} className="contents">
            <CommandSectionHeader className="px-0.5 pt-1 pb-0">
              {section.title}
            </CommandSectionHeader>
            {section.items.map((item) => (
              <CommandItem
                key={item.id}
                id={item.id}
                textValue={item.name}
                // The themed card IS the option and covers the item edge to
                // edge, so the list highlight never shows; hover/focus render
                // as an overlay on the card instead (group-*/option below).
                // `overflow-visible` lets the selected badge sit on the corner.
                className="group/option block overflow-visible rounded-xl p-0"
              >
                <PresetOptionCard
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

/** Accent steps rendered as the ramp strip — the mid-range read best at swatch size. */
const RAMP_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
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

/**
 * One preset option: a scoped, themed miniature of the design system, and
 * nothing else — no site-chrome caption underneath. The card carries its own
 * name, and selection plus the saved-preset actions ride as a corner badge.
 *
 * The miniature reads top-to-bottom as identity → palette → product, which is
 * what keeps the preset's NAME the loudest thing on the card:
 *
 * - Identity strip — the two font families each set in their own face (so the
 *   label is itself the type specimen), and on the right three glyphs from the
 *   preset's icon library, picked because their silhouettes diverge most
 *   between libraries.
 * - The name in the heading font, closed by a hairline rule. This is the card's
 *   headline; everything below it is deliberately smaller.
 * - The accent ramp.
 * - A vignette panel — real components (body copy, a search field, the primary
 *   action) nested inside an inset surface, so radius, field style, primary
 *   color, icon set and control height all read off actual UI while staying
 *   visually subordinate to the headline.
 *
 * No iframes, no scaling; the scoped stylesheet is content-cached, so a list of
 * these stays cheap.
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
  const { heading, body } = fontPair(designSystem)

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
            'relative overflow-hidden rounded-lg border bg-bg p-3',
            isSelected &&
              'ring-2 ring-accent ring-offset-2 ring-offset-popover',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[11px] leading-none text-fg-accent">
              <span className="font-heading">{heading}</span>
              {heading !== body && (
                <>
                  <span className="text-fg-muted"> / </span>
                  <span className="font-sans">{body}</span>
                </>
              )}
            </span>
            <div
              aria-hidden
              className="flex shrink-0 items-center gap-1.5 text-fg-muted [&_svg]:size-4"
            >
              {/* Only the off-default densities earn a chip — the vignette's
                  real control heights carry the rest. */}
              {designSystem.density !== 'default' && (
                <>
                  <span className="text-[10px] leading-none tracking-wide uppercase">
                    {designSystem.density}
                  </span>
                  <span className="h-3.5 w-px bg-border" />
                </>
              )}
              <SparklesIcon />
              <LayersIcon />
              <CircleIcon />
            </div>
          </div>

          <p className="mt-2.5 truncate border-b pb-2.5 font-heading text-lg leading-tight font-semibold text-fg">
            {item.name}
          </p>

          <div aria-hidden className="mt-2.5 flex gap-[3px]">
            {RAMP_STEPS.map((step) => (
              <span
                key={step}
                // The hairline keeps the near-white low steps from vanishing
                // into a light card.
                className="h-3.5 flex-1 rounded-[2px] ring-1 ring-fg/10 ring-inset"
                style={{ background: `var(--accent-${step})` }}
              />
            ))}
          </div>

          <div
            inert
            aria-hidden
            className="mt-2.5 rounded-md border bg-muted p-2.5 select-none"
          >
            <p className="line-clamp-2 text-[11px] leading-relaxed text-fg-muted">
              The quick brown fox jumps over the lazy dog.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <InputGroup className="min-w-0 flex-1">
                <InputGroupAddon>
                  <PresetSearchIcon />
                </InputGroupAddon>
                <Input placeholder="Search" />
              </InputGroup>
              <Button variant="primary" size="sm" className="shrink-0">
                Continue
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </DesignSystemProvider>

      {/* Site chrome, deliberately outside the preset scope and outside the
          card's `overflow-hidden` so it can sit on the corner. */}
      {(isSelected || actions !== undefined) && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
          {isSelected && (
            <span
              aria-hidden
              // Site fg, not accent: the card's own ring already answers in the
              // preset's colour, and this marker has to stay legible over every
              // palette (Vercel's accent is near-black).
              className="flex size-5 items-center justify-center rounded-full bg-fg text-bg shadow-sm"
            >
              <CheckIcon className="size-3" />
            </span>
          )}
          {actions}
        </div>
      )}

      {/* Hover/virtual-focus feedback over the whole option, in the site's own
          fg so it reads consistently regardless of the
          preset underneath. Keyboard focus is virtual — it lands as
          `data-focused` on the item, never as a real `:focus-visible`. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-xl bg-fg opacity-0 ring-fg/25 transition-opacity group-hover/option:opacity-4 group-data-focused/option:opacity-6 group-data-focused/option:ring-2"
      />
    </div>
  )
}

export type { PresetPickerItem, PresetPickerSection }
