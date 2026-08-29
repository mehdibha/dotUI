"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { CheckIcon, SearchIcon } from "lucide-react"
import type { Key } from "react-aria-components"
import { useFilter } from "react-aria-components/Autocomplete"

import {
  DEFAULT_BODY_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_SANS_VAR,
} from "@/lib/fonts"
import { DesignSystemProvider } from "@/lib/styles"
import {
  ArrowRightIcon,
  SearchIcon as PresetSearchIcon,
} from "@/registry/__generated__/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Command,
  CommandContent,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from "@/registry/ui/command"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import type { PopoverProps } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Switch } from "@/registry/ui/switch"
import { Controls } from "@/components/showcase/controls"
import { DEFAULT_RADIUS, RADIUS_VAR } from "@/modules/create/layout"
import type { DesignSystem } from "@/modules/create/preset"

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
  placement?: PopoverProps["placement"]
  /** Pin the previews to one mode (docs previews pin light/dark). */
  previewMode?: "light" | "dark"
  /**
   * Show the live vignettes: a hover flyout beside the popover on desktop,
   * inline on each drawer row. Off by default.
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
 * `withPreview` adds live previews. On desktop the popover stays a plain
 * list; a detached flyout card — a big tooltip in the previewed preset's own
 * surface — opens beside it after a short hover delay and previews whatever
 * row the pointer or the keyboard highlight is on (see PresetPreviewFlyout).
 * Rows never change size, so scanning never reflows the list under the
 * cursor. Drawer rows — no pointer, no highlight — carry a compact vignette
 * inline instead.
 */
export function PresetPicker({
  children,
  sections,
  selectedId,
  onPick,
  isOpen,
  onOpenChange,
  placement = "bottom start",
  previewMode,
  withPreview = false,
  renderItemActions,
}: PresetPickerProps) {
  const content = (surface: "popover" | "drawer") => (
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
            <Drawer>{content("drawer")}</Drawer>
          ) : (
            // The popover always sizes to the list column — the preview, when
            // on, floats outside it as a detached flyout.
            <Popover placement={placement}>{content("popover")}</Popover>
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
  surface: "popover" | "drawer"
  previewMode?: "light" | "dark"
  withPreview: boolean
  renderItemActions?: (item: PresetPickerItem) => ReactNode
}) {
  // Autocomplete owns the filtering; we mirror the query only to keep the
  // section counts honest and to drop a section whose matches all filtered out
  // (its header is our child, so the collection can't hide it for us). Reading
  // it off `onInput` leaves the value under Autocomplete's control.
  const [query, setQuery] = useState("")
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })
  // Which preset the pane previews: the last row the pointer entered or the
  // keyboard highlight landed on, whichever signalled most recently. Focus only
  // counts once the user has actually navigated (arrows or typing) — the
  // collection may highlight a row on open, and until then the pane should show
  // the current selection, not the first row.
  const navigatedRef = useRef(false)
  const [previewId, setPreviewId] = useState<string | null>(selectedId ?? null)
  // The flyout lives and dies with the hover: it opens on a tooltip-style
  // delay — passing over a row on the way to a click shouldn't flash a panel —
  // swaps instantly while the pointer moves row to row, and closes again once
  // no row is hovered or highlighted. The close grace period covers the gaps
  // between rows so scanning doesn't flicker it.
  const [engaged, setEngaged] = useState(false)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Which row currently claims the preview — a row leaving only closes the
  // flyout if no successor has claimed it since (effect order between the two
  // rows isn't guaranteed).
  const activeRowRef = useRef<string | null>(null)
  useEffect(
    () => () => {
      if (openTimerRef.current != null) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current != null) clearTimeout(closeTimerRef.current)
    },
    [],
  )
  const showPreview = useCallback((id: string, via: "hover" | "focus") => {
    if (via === "focus" && !navigatedRef.current) return
    activeRowRef.current = id
    setPreviewId(id)
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    openTimerRef.current ??= setTimeout(() => {
      openTimerRef.current = null
      setEngaged(true)
    }, 400)
  }, [])
  const hidePreview = useCallback((id: string) => {
    if (activeRowRef.current !== id) return
    if (closeTimerRef.current != null) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      if (openTimerRef.current != null) {
        clearTimeout(openTimerRef.current)
        openTimerRef.current = null
      }
      activeRowRef.current = null
      setEngaged(false)
    }, 150)
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
  const flyout = surface === "popover" && withPreview

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
        autoFocus={surface === "popover"}
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
        // App-only utilities (fine here, www-side): hide the scrollbar and
        // fade the rows out at the scroll edges instead of clipping them hard.
        className="no-scrollbar scroll-fade-y scroll-fade-4"
        // Spacing and scrolling ride inline: the Command wrapper forces `p-0`
        // and `overflow-visible` on us through descendant selectors that any
        // class of ours would lose to.
        style={{
          // Relative so the rows' offsetTop reads against the scroller.
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "0 8px 8px",
          maxHeight: surface === "popover" ? 420 : "60vh",
          overflowY: "auto",
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
                {({ isHovered, isFocusVisible }) => (
                  <PresetOptionRow
                    item={item}
                    isSelected={item.id === selectedId}
                    // Focus-visible, not focus: hovering moves the collection's
                    // virtual focus too, and it lingers after the pointer
                    // leaves — only the keyboard's highlight should hold the
                    // flyout open.
                    isFocused={isFocusVisible}
                    isHovered={isHovered}
                    isActive={
                      surface === "popover" && item.id === previewItem?.id
                    }
                    withVignette={surface === "drawer" && withPreview}
                    onShow={surface === "popover" ? showPreview : undefined}
                    onHide={surface === "popover" ? hidePreview : undefined}
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

  if (surface === "drawer")
    return <Command className="gap-0 p-0">{list}</Command>

  return (
    <>
      <Command
        className="gap-0 overflow-hidden p-0"
        onKeyDownCapture={(e) => {
          if (e.key.startsWith("Arrow")) navigatedRef.current = true
        }}
      >
        <div className="flex w-[260px] shrink-0 flex-col">{list}</div>
      </Command>
      {flyout && (
        <PresetPreviewFlyout
          item={previewItem}
          isVisible={engaged}
          forcedMode={previewMode}
        />
      )}
    </>
  )
}

/** The palette roles the row's dots sample — the ones two systems disagree on first. */
const DOT_ROLES = ["bg-primary", "bg-accent", "bg-neutral"] as const

/** The vignette's swatch strip: the semantic vocabulary, not one ramp. */
const SWATCH_ROLES = [
  "bg-primary",
  "bg-accent",
  "bg-success",
  "bg-warning",
  "bg-danger",
  "bg-neutral",
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

/** The control radius the base lands on — `--radius-md` = 0.75 × the base. */
function radiusLabel(designSystem: DesignSystem) {
  const raw = designSystem.tokens[RADIUS_VAR] ?? DEFAULT_RADIUS
  const parsed = Number.parseFloat(raw)
  const px = raw.trim().endsWith("rem") ? parsed * 16 : parsed
  return `${Math.round((Number.isFinite(px) ? px : 10) * 0.75)}px`
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
  onHide,
  forcedMode,
  actions,
}: {
  item: PresetPickerItem
  isSelected: boolean
  isFocused: boolean
  isHovered: boolean
  isActive: boolean
  withVignette: boolean
  onShow?: (id: string, via: "hover" | "focus") => void
  onHide?: (id: string) => void
  forcedMode?: "light" | "dark"
  actions?: ReactNode
}) {
  const { designSystem } = item
  const { heading, body } = fontPair(designSystem)

  // Route this row to the flyout: the pointer and the keyboard highlight both
  // land here, and whichever spoke last wins. Losing both signals the flyout
  // to close — unless another row claims it first.
  useEffect(() => {
    if (isHovered) onShow?.(item.id, "hover")
    else if (isFocused) onShow?.(item.id, "focus")
    else onHide?.(item.id)
  }, [isHovered, isFocused, item.id, onShow, onHide])

  // Center the selected row when it enters the list: the collection carries no
  // selection (rows draw their own), so RAC never scrolls to it on open.
  // Offset math, not scrollIntoView — the popover's entering scale skews rects.
  const rowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isSelected) return
    const option = rowRef.current?.closest<HTMLElement>("[data-listbox-item]")
    const scroller = option?.offsetParent
    if (!option || !(scroller instanceof HTMLElement)) return
    scroller.scrollTop =
      option.offsetTop - (scroller.clientHeight - option.offsetHeight) / 2
  }, [isSelected])

  return (
    <div ref={rowRef} className="relative w-full">
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
            "overflow-hidden rounded-lg border bg-bg",
            isSelected && "ring-1 ring-accent",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 p-3",
              actions ? "pr-10" : undefined,
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[15px] leading-tight font-semibold text-fg">
                {item.name}
              </p>
              <p className="mt-1 truncate text-[11px] leading-none text-fg-muted">
                {heading === body ? body : `${heading} / ${body}`} ·{" "}
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
                    "size-2.5 rounded-full ring-1 ring-fg/10 ring-inset",
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

      {/* Hover/virtual-focus feedback: a faint wash in the site's own fg,
          flush with the row — extending past it reads as a glow ring on dark
          backgrounds. Keyboard focus is virtual — it lands as `data-focused`
          on the item, never as a real `:focus-visible`. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg bg-fg transition-opacity",
          isActive ? "opacity-5" : "opacity-0",
        )}
      />
    </div>
  )
}

/**
 * The detached preview: a big tooltip floating right of the popover, top
 * aligned with it and sized to its content, drawn entirely on the previewed
 * preset's own surface. The body is the landing showcase's Controls card — the
 * same sampler the marketing grid opens with — so the preview and the landing
 * agree on what a design system looks like. It opens once (after the hover
 * delay upstream) and then never moves; swapping presets swaps its content
 * outright — the highlight moves tens of times per open, and animating the
 * swap would only slow it down.
 */
function PresetPreviewFlyout({
  item,
  isVisible,
  forcedMode,
}: {
  item?: PresetPickerItem
  isVisible: boolean
  forcedMode?: "light" | "dark"
}) {
  if (!item) return null

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
      <div
        aria-hidden
        className={cn(
          // The Controls card *is* the surface: the shell borrows its bg and
          // sizes to it, so the flyout may run taller than the popover.
          "pointer-events-none absolute top-0 left-full ml-3 flex w-[340px] flex-col overflow-hidden rounded-xl border bg-card shadow-lg",
          "origin-left transition-[opacity,transform,scale] ease-out will-change-[transform,opacity] motion-reduce:transition-none",
          isVisible
            ? "scale-100 opacity-100 duration-200"
            : "-translate-x-1 scale-97 opacity-0 duration-150",
        )}
      >
        <div className="flex shrink-0 items-center gap-3 border-b p-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base leading-tight font-semibold text-fg">
              {item.name}
            </p>
            <p className="mt-1 truncate text-[11px] leading-none text-fg-muted">
              {heading === body ? body : `${heading} / ${body}`} ·{" "}
              {radiusLabel(designSystem)} · {designSystem.density}
            </p>
          </div>
          <div aria-hidden className="flex shrink-0 items-center gap-1">
            {DOT_ROLES.map((role) => (
              <span
                key={role}
                className={cn(
                  "size-2.5 rounded-full ring-1 ring-fg/10 ring-inset",
                  role,
                )}
              />
            ))}
          </div>
        </div>
        <Controls
          inert
          className="rounded-none border-0 bg-transparent shadow-none select-none"
        />
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
              "h-2.5 flex-1 rounded-[2px] ring-1 ring-fg/10 ring-inset",
              role,
            )}
          />
        ))}
      </div>
    </div>
  )
}

export type { PresetPickerItem, PresetPickerSection }
