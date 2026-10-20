"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode, Ref } from "react"
import {
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import type { Key } from "react-aria-components"
import { useFilter } from "react-aria-components/Autocomplete"
import { MenuContext } from "react-aria-components/Menu"
import { useControlledState } from "react-stately/useControlledState"

import { DesignSystemProvider } from "@/lib/styles"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Command,
  CommandContent,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from "@/registry/ui/command"
import { Drawer } from "@/registry/ui/drawer"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import type { PopoverProps } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Select } from "@/registry/ui/select"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { Controls } from "@/components/showcase/controls"
import type { DesignSystem } from "@/modules/studio/preset/types"

interface PresetPickerItem {
  id: string
  name: string
  /** The row's dot. */
  swatch: string
  description?: string
  /** The brand a preset recreates, disclaimed under its description. */
  inspiredBy?: string
  /** Gets a ⋯ menu from `renderItemMenu`. */
  hasMenu?: boolean
  /** Themes the flyout — called only for the previewed item. */
  resolve: () => DesignSystem
}

interface PresetPickerSection {
  id: string
  title: string
  items: PresetPickerItem[]
}

interface PresetPickerProps {
  /** The pressable trigger — the Select's button, through its context. */
  children: ReactNode
  sections: PresetPickerSection[]
  /** The current selection, checked in the list. */
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Desktop popover placement. */
  placement?: PopoverProps["placement"]
  /** Pin the flyout to one mode (docs previews pin light/dark). */
  previewMode?: "light" | "dark"
  /** Show the hover flyout beside the popover on desktop. Off by default. */
  withPreview?: boolean
  /** Called with the row the pointer or an arrow-moved highlight rests on
   *  (desktop), then null once none does or the picker closes. */
  onPreview?: (id: string | null) => void
  /** A row's ⋯ menu, as a MenuContent. It renders outside the list, so the
   *  search never filters it. */
  renderItemMenu?: (item: PresetPickerItem) => ReactNode
  /** Adds a "+ New" button beside the search field. */
  onCreate?: () => void
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /studio
 * panel: a Select whose list is searchable, with plain rows — a swatch dot and
 * the preset's name. Popover on desktop, drawer on mobile.
 *
 * `withPreview` adds a detached flyout card — a big tooltip in the previewed
 * preset's own surface — that opens beside the popover after a short hover
 * delay and previews whatever row the pointer or the keyboard highlight is on
 * (see PresetPreviewFlyout).
 */
export function PresetPicker({
  children,
  sections,
  selectedId,
  onPick,
  isOpen: isOpenProp,
  onOpenChange,
  placement = "bottom start",
  previewMode,
  withPreview = false,
  onPreview,
  renderItemMenu,
  onCreate,
}: PresetPickerProps) {
  // The Select renders its children twice: once hidden, to build its
  // collection, and the rows keep that pass's props. So every piece of state
  // the rows touch lives here, above the Select, where both passes share it.
  const [isOpen, setOpen] = useControlledState(isOpenProp, false, onOpenChange)
  // Autocomplete owns the filtering; we mirror the query only to keep the
  // section counts honest and to drop a section whose matches all filtered out
  // (its header is our child, so the collection can't hide it for us). Reading
  // it off the field's `onChange` (Esc clears through it too) leaves the
  // value under Autocomplete's control.
  const [query, setQuery] = useState("")
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })
  // The row whose ⋯ menu is open.
  const [menu, setMenu] = useState<string | null>(null)
  const menuTriggerRef = useRef<HTMLElement | null>(null)
  const openMenu = (id: string, trigger: Element) => {
    menuTriggerRef.current = trigger as HTMLElement
    setMenu(id)
  }
  const closeMenu = () => {
    const search = menuTriggerRef.current
      ?.closest("[data-command]")
      ?.querySelector<HTMLInputElement>("[data-search-field] input")
    setMenu(null)
    // Two frames: after the popover's own focus restore. Focus must never be
    // lost to the body, or the picker closes: back to the search, or to the
    // drawer itself.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const active = document.activeElement
        if (active && active !== document.body) return
        if (search?.closest("[data-drawer]"))
          search.closest<HTMLElement>("[data-drawer]")?.focus()
        else search?.focus()
      }),
    )
  }
  // Which preset the flyout previews: the last row the pointer entered or the
  // keyboard highlight landed on, whichever signalled most recently, else the
  // selection. Focus only counts once the user has actually navigated (arrows
  // or typing) — the Select highlights the selected row on open.
  const navigatedRef = useRef(false)
  // The design preview follows the highlight only once up/down arrows move
  // it: typing moves it too, onto a first match the user never pointed at.
  const arrowedRef = useRef(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
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
  // The rows' handlers are stable, so they read the latest callback.
  const onPreviewRef = useRef(onPreview)
  useEffect(() => {
    onPreviewRef.current = onPreview
  }, [onPreview])
  // Each open starts fresh.
  useEffect(() => {
    if (!isOpen) return
    return () => {
      if (openTimerRef.current != null) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current != null) clearTimeout(closeTimerRef.current)
      openTimerRef.current = closeTimerRef.current = null
      activeRowRef.current = null
      navigatedRef.current = arrowedRef.current = false
      setQuery("")
      setMenu(null)
      setPreviewId(null)
      setEngaged(false)
      onPreviewRef.current?.(null)
    }
  }, [isOpen])
  const showPreview = useCallback((id: string, via: "hover" | "focus") => {
    if (via === "focus" && !navigatedRef.current) return
    activeRowRef.current = id
    setPreviewId(id)
    onPreviewRef.current?.(via === "hover" || arrowedRef.current ? id : null)
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
      onPreviewRef.current?.(null)
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
    allItems.find((item) => item.id === (previewId ?? selectedId)) ??
    allItems[0]
  const menuItem = menu ? allItems.find((item) => item.id === menu) : undefined
  const rowIds = visible.flatMap((section) => section.items.map((i) => i.id))
  const menuContent = menuItem && renderItemMenu?.(menuItem)

  // A row the search filtered out unmounts without letting go of the preview.
  useEffect(() => {
    const active = activeRowRef.current
    if (active && closeTimerRef.current == null && !rowIds.includes(active))
      hidePreview(active)
  })

  // Shift+F10 or the ContextMenu key opens the highlighted row's menu.
  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      !renderItemMenu ||
      !((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu")
    )
      return
    const active = e.currentTarget.getAttribute("aria-activedescendant")
    const row = active ? document.getElementById(active) : null
    const trigger = row?.querySelector("[data-row-menu]")
    const key = row?.dataset.key
    if (!trigger || !key) return
    e.preventDefault()
    openMenu(key, trigger)
  }

  function pick(key: Key | null) {
    if (isRowMenuPress()) return
    const item = allItems.find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    swallowDoubleClick()
  }

  const list = (surface: "popover" | "drawer") => (
    <>
      {/* The search row drops the Command's hairline and sits on the same
          inset as the rows below; the New button, when any, shares it. */}
      <div className="mx-(--command-inset) flex items-center gap-2">
        <SearchField
          // No search autofocus on mobile — the keyboard would cover the list.
          autoFocus={surface === "popover"}
          aria-label="Search design systems"
          onChange={setQuery}
          className="flex-1 border-b-0! px-0!"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input
              onKeyDown={onSearchKeyDown}
              placeholder="Search"
              onInput={() => {
                // Typing moves the highlight to the first match, so from here on
                // the pane follows it.
                navigatedRef.current = true
                arrowedRef.current = false
              }}
            />
          </InputGroup>
        </SearchField>
        {onCreate && (
          <Button
            variant="secondary"
            size="md"
            className="mt-(--command-inset) shrink-0"
            onPress={onCreate}
          >
            <PlusIcon />
            New
          </Button>
        )}
      </div>
      <CommandContent
        aria-label="Design systems"
        shouldFocusWrap
        // App-only utilities (fine here, www-side): hide the scrollbar and
        // fade the rows out at the scroll edges instead of clipping them hard.
        className="no-scrollbar scroll-fade-y scroll-fade-4"
        // Scrolling rides inline: the Command wrapper forces `overflow-visible`
        // on us through descendant selectors that any class of ours would lose to.
        style={{
          // Relative so the rows' offsetTop reads against the scroller.
          position: "relative",
          maxHeight: surface === "popover" ? 320 : "60vh",
          // Shrink below the content when the inherited max-height is tighter
          // than the 420 cap.
          minHeight: 0,
          overflowY: "auto",
        }}
        renderEmptyState={() => (
          <div className="py-6 text-center text-sm text-fg-muted">
            No design systems found
          </div>
        )}
      >
        {visible.map((section) => (
          <CommandSection key={section.id}>
            <CommandSectionHeader className="flex items-center justify-between">
              {section.title}
              <span className="tabular-nums">{section.items.length}</span>
            </CommandSectionHeader>
            {section.items.map((item) => (
              <CommandItem key={item.id} id={item.id} textValue={item.name}>
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
                    onShow={surface === "popover" ? showPreview : undefined}
                    onHide={surface === "popover" ? hidePreview : undefined}
                    onMenu={
                      renderItemMenu && item.hasMenu
                        ? (trigger) => openMenu(item.id, trigger)
                        : undefined
                    }
                  />
                )}
              </CommandItem>
            ))}
          </CommandSection>
        ))}
      </CommandContent>
    </>
  )

  return (
    <>
      <Select
        aria-label="Design system"
        selectedKey={selectedId ?? null}
        onSelectionChange={pick}
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (open || !isRowMenuPress()) setOpen(open)
        }}
        className="contents"
      >
        {children}
        <Responsive
          render={(isMobile) =>
            isMobile ? (
              // Instant too: an exiting drawer would cover the page and eat
              // the next tap.
              <Drawer className="transition-none!">
                <Command>{list("drawer")}</Command>
              </Drawer>
            ) : (
              // The popover always sizes to the list column — the preview,
              // when on, floats outside it as a detached flyout.
              // Instant, like the panel chrome it belongs to.
              <Popover
                placement={placement}
                className="transition-none will-change-auto"
              >
                <Command
                  className="max-h-[inherit] w-65 overflow-hidden"
                  onKeyDownCapture={(e) => {
                    if (e.key.startsWith("Arrow")) navigatedRef.current = true
                    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
                    // The arrow takes over the typed highlight, even where it
                    // can't move.
                    if (!arrowedRef.current && activeRowRef.current)
                      onPreviewRef.current?.(activeRowRef.current)
                    arrowedRef.current = true
                  }}
                >
                  {list("popover")}
                </Command>
                {withPreview && previewItem && (
                  <PresetPreviewFlyout
                    item={previewItem}
                    // A row the search filtered out previews nothing.
                    isVisible={engaged && rowIds.includes(previewItem.id)}
                    forcedMode={previewMode}
                  />
                )}
              </Popover>
            )
          }
        />
      </Select>
      {/* Outside the Select, whose contexts would otherwise reach the menu. */}
      <MenuContext.Provider value={{ onClose: closeMenu, autoFocus: "first" }}>
        <Popover
          triggerRef={menuTriggerRef}
          isOpen={!!menuContent}
          onOpenChange={(isOpen) => !isOpen && closeMenu()}
          placement="bottom end"
          className="transition-none will-change-auto"
        >
          {menuContent}
        </Popover>
      </MenuContext.Provider>
    </>
  )
}

/** A Select picks the option a press is released on, wherever it started —
 *  including a press on the row's own ⋯ button, which must neither pick the
 *  row nor close the list. */
function isRowMenuPress() {
  const target = window.event?.target
  return target instanceof Element && !!target.closest("[data-row-menu]")
}

const PRESS_TYPES = [
  "pointerdown",
  "mousedown",
  "pointerup",
  "mouseup",
  "click",
  "dblclick",
]

/** Drops the second press of a double click that picked a row: the picker
 *  closes on the first, and the second would land on whatever was under
 *  it. Presses elsewhere, or later, go through. */
function swallowDoubleClick() {
  const first = window.event
  if (!(first instanceof MouseEvent)) return
  const swallow = (e: Event) => {
    if (
      !(e instanceof MouseEvent) ||
      Math.hypot(e.clientX - first.clientX, e.clientY - first.clientY) > 8
    )
      return
    e.stopPropagation()
    e.preventDefault()
    if (e.type === "dblclick") stop()
  }
  const stop = () => {
    clearTimeout(timer)
    for (const type of PRESS_TYPES)
      window.removeEventListener(type, swallow, true)
  }
  for (const type of PRESS_TYPES) window.addEventListener(type, swallow, true)
  const timer = setTimeout(stop, 500)
}

const ROW_MENU_HINT = "Press Shift+F10 for actions"

/** One option: the preset's swatch and its name, in the site's own theme. */
function PresetOptionRow({
  item,
  isSelected,
  isFocused,
  isHovered,
  onShow,
  onHide,
  onMenu,
}: {
  item: PresetPickerItem
  isSelected: boolean
  isFocused: boolean
  isHovered: boolean
  onShow?: (id: string, via: "hover" | "focus") => void
  onHide?: (id: string) => void
  onMenu?: (trigger: Element) => void
}) {
  // Route this row to the flyout: the pointer and the keyboard highlight both
  // land here, and whichever spoke last wins. Losing both signals the flyout
  // to close — unless another row claims it first.
  useEffect(() => {
    if (isHovered) onShow?.(item.id, "hover")
    else if (isFocused) onShow?.(item.id, "focus")
    else onHide?.(item.id)
  }, [isHovered, isFocused, item.id, onShow, onHide])

  // Center the selected row when it enters the list out of view: focus stays
  // in the search, so RAC never scrolls to it on open. A visible row stays
  // put, keeping the sections above it in view.
  // Offset math, not scrollIntoView — the popover's entering scale skews rects.
  const rowRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isSelected) return
    const option = rowRef.current?.closest<HTMLElement>("[data-listbox-item]")
    const scroller = option?.offsetParent
    if (!option || !(scroller instanceof HTMLElement)) return
    const top = option.offsetTop - scroller.scrollTop
    if (top >= 0 && top + option.offsetHeight <= scroller.clientHeight) return
    scroller.scrollTop =
      option.offsetTop - (scroller.clientHeight - option.offsetHeight) / 2
  }, [isSelected])

  // Rows are no Tab stops: screen readers say the keyboard way in.
  const hasMenu = !!onMenu
  useEffect(() => {
    const option = rowRef.current?.closest<HTMLElement>("[data-listbox-item]")
    if (!option || !hasMenu || window.matchMedia("(pointer: coarse)").matches)
      return
    option.setAttribute("aria-description", ROW_MENU_HINT)
    return () => option.removeAttribute("aria-description")
  }, [hasMenu])

  return (
    <>
      <Swatch ref={rowRef} color={item.swatch} />
      <span dir="auto" className="min-w-0 flex-1 truncate">
        {item.name}
      </span>
      {onMenu && (
        <Tooltip>
          {/* A press here never picks the row (see isRowMenuPress). */}
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            data-row-menu=""
            aria-label={`Actions for ${item.name}`}
            onPress={(e) => onMenu(e.target)}
            className="-my-1 -mr-1 shrink-0 text-fg-muted pointer-coarse:size-11!"
          >
            <MoreHorizontalIcon />
          </Button>
          <TooltipContent>Actions · Shift+F10</TooltipContent>
        </Tooltip>
      )}
    </>
  )
}

/**
 * The detached preview: a big tooltip floating right of the popover, top
 * aligned with it and sized to its content, drawn entirely on the previewed
 * preset's own surface. The body is the landing showcase's Controls card — the
 * same sampler the marketing grid opens with — so the preview and the landing
 * agree on what a design system looks like. It shows once (after the hover
 * delay upstream) and then never moves; swapping presets swaps its content
 * outright — the highlight moves tens of times per open, and animating any
 * of it would only slow it down.
 */
function PresetPreviewFlyout({
  item,
  isVisible,
  forcedMode,
}: {
  item: PresetPickerItem
  isVisible: boolean
  forcedMode?: "light" | "dark"
}) {
  const designSystem = useMemo(() => item.resolve(), [item])
  // Desktop-only, so the mobile swap is pinned: swapping it would remount a
  // Select's hidden popover arrow into the picker's arrow context.
  const params = useMemo(
    () => ({
      ...designSystem.componentParams,
      popover: { ...designSystem.componentParams.popover, mobile: "drawer" },
    }),
    [designSystem],
  )

  return (
    <DesignSystemProvider
      scoped
      params={params}
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
          // Instant, like the rest of the panel chrome.
          !isVisible && "hidden",
        )}
      >
        <div className="flex shrink-0 flex-col gap-1 border-b p-3.5">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 truncate font-heading text-base leading-tight font-semibold text-fg">
              {item.name}
            </p>
            <Swatch color={item.swatch} />
          </div>
          {item.description && (
            <p className="text-sm text-fg-muted">{item.description}</p>
          )}
          {item.inspiredBy && (
            <p className="text-xs text-fg-muted">
              Inspired by {item.inspiredBy}. Not affiliated with{" "}
              {item.inspiredBy}.
            </p>
          )}
        </div>
        <Controls
          inert
          className="rounded-none border-0 bg-transparent shadow-none select-none"
        />
      </div>
    </DesignSystemProvider>
  )
}

function Swatch({ ref, color }: { ref?: Ref<HTMLSpanElement>; color: string }) {
  return (
    <span
      ref={ref}
      aria-hidden
      // The hairline keeps a near-white or near-black swatch from vanishing
      // into the surface it sits on.
      className="size-2.5 shrink-0 rounded-full ring-1 ring-fg/10 ring-inset"
      style={{ background: color }}
    />
  )
}

export type { PresetPickerSection }
