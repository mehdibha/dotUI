"use client"

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode, Ref, RefObject } from "react"
import {
  CheckIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import type { Key } from "react-aria-components"
import { useFilter } from "react-aria-components/Autocomplete"
import { ListStateContext } from "react-aria-components/ListBox"
import type { ListState } from "react-aria-components/ListBox"
import {
  MenuContext,
  RootMenuTriggerStateContext,
} from "react-aria-components/Menu"
import { PopoverContext } from "react-aria-components/Popover"

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
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import type { PopoverProps } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Controls } from "@/components/showcase/controls"
import type { DesignSystem } from "@/modules/studio/preset"

interface PresetPickerItem {
  id: string
  name: string
  /** The row's dot. */
  swatch: string
  description?: string
  /** The brand a preset recreates, disclaimed under its description. */
  inspiredBy?: string
  /** A short status after the name, e.g. "Draft". */
  badge?: string
  /** Themes the flyout — called only for the previewed item. */
  resolve: () => DesignSystem
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
  /** Pin the flyout to one mode (docs previews pin light/dark). */
  previewMode?: "light" | "dark"
  /** Show the hover flyout beside the popover on desktop. Off by default. */
  withPreview?: boolean
  /** A row's ⋯ menu, as a MenuContent. It renders outside the list, so the
   *  search never filters it. `afterClose` runs an action that removes the
   *  row once the menu has closed and focus has moved to the next row. */
  renderItemMenu?: (
    item: PresetPickerItem,
    afterClose: (run: () => void) => void,
  ) => ReactNode
  /** Adds a "+ New" button beside the search field. */
  onCreate?: () => void
  /** The picker's own ⋯ menu, beside New. */
  moreMenu?: ReactNode
  /** Shown instead of the list, e.g. Recently deleted. */
  pane?: ReactNode
  /** F2 in the search field. */
  onRenameKey?: () => void
  /** The row being renamed in place, if any. */
  renamingId?: string
  /** Ends the rename: the typed name, or null when cancelled; `submit` when
   *  it ended with Enter. */
  onRenameEnd?: (id: string, name: string | null, submit: boolean) => void
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel: a searchable list of plain rows — a swatch dot and the preset's name.
 * Popover on desktop, drawer on mobile.
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
  isOpen,
  onOpenChange,
  placement = "bottom start",
  previewMode,
  withPreview = false,
  ...rest
}: PresetPickerProps) {
  const content = (surface: "popover" | "drawer") => (
    <DialogContent
      aria-label="Design systems"
      // `max-h-[inherit]` chains the popover's computed max-height (set inline
      // by react-aria from the available space) down to the list, so the
      // search field stays pinned and the list owns all the overflow — the
      // surface then always fits the space react-aria positioned it for.
      className="flex max-h-[inherit] flex-col gap-0 rounded-[inherit] p-0"
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
          {...rest}
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
            // Instant, like the panel chrome it belongs to.
            <Popover
              placement={placement}
              className="transition-none will-change-auto"
            >
              {content("popover")}
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
  renderItemMenu,
  onCreate,
  moreMenu,
  pane,
  onRenameKey,
  renamingId,
  onRenameEnd,
}: Omit<PresetPickerProps, "children" | "isOpen" | "onOpenChange"> & {
  close: () => void
  surface: "popover" | "drawer"
  withPreview: boolean
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
  // The open ⋯ menu: a row's, or the picker's own (id null).
  const [menu, setMenu] = useState<{ id: string | null } | null>(null)
  const menuTriggerRef = useRef<HTMLElement | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const openMenu = (id: string | null, trigger: Element) => {
    menuTriggerRef.current = trigger as HTMLElement
    setMenu({ id })
  }
  const listRef = useRef<ListState<unknown> | null>(null)
  // A row-removing action and the row that takes focus from it.
  const pendingRef = useRef<{ run: () => void; next?: string } | null>(null)
  // Moves focus to a row: the popover's search keeps focus and highlights it;
  // on the drawer its ⋯ takes focus, so the keyboard stays down. With no row,
  // the search or the drawer itself.
  const focusRow = (id: string | undefined) => {
    const highlight = () => {
      if (id === undefined) return
      listRef.current?.selectionManager.setFocused(true)
      listRef.current?.selectionManager.setFocusedKey(id)
    }
    const search = searchRef.current
    if (surface === "popover") {
      search?.focus()
      // After the search's own focus handling, which restores the old one.
      queueMicrotask(highlight)
      return
    }
    // Before focusing, which would otherwise highlight the first row.
    highlight()
    const dialog = search?.closest<HTMLElement>("[role=dialog]")
    const rowMenu = id
      ? dialog?.querySelector<HTMLElement>(
          `[data-key="${CSS.escape(id)}"] [data-row-menu]`,
        )
      : null
    ;(rowMenu ?? dialog)?.focus()
  }
  const closeMenu = () => {
    setMenu(null)
    // Two frames: after the popover's own focus restore. Focus must never be
    // lost to the body, or the picker closes.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const pending = pendingRef.current
        pendingRef.current = null
        if (pending) {
          focusRow(pending.next)
          pending.run()
          return
        }
        const active = document.activeElement
        if (!active || active === document.body) focusRow(undefined)
      }),
    )
  }
  // Which preset the flyout previews: the last row the pointer entered or the
  // keyboard highlight landed on, whichever signalled most recently. Focus only
  // counts once the user has actually navigated (arrows or typing) — the
  // collection may highlight a row on open, and until then the flyout should
  // show the current selection, not the first row.
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
  const menuItem = menu?.id
    ? allItems.find((item) => item.id === menu.id)
    : undefined
  const rowIds = visible.flatMap((section) => section.items.map((i) => i.id))
  const afterClose = (id: string) => (run: () => void) => {
    const i = rowIds.indexOf(id)
    pendingRef.current = { run, next: rowIds[i + 1] ?? rowIds[i - 1] }
  }
  const menuContent =
    menu &&
    (menu.id === null
      ? moreMenu
      : menuItem && renderItemMenu?.(menuItem, afterClose(menuItem.id)))

  // Shift+F10 or the ContextMenu key opens the highlighted row's menu.
  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "F2" && onRenameKey) {
      e.preventDefault()
      onRenameKey()
      return
    }
    if (
      !renderItemMenu ||
      !((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu")
    )
      return
    const active = e.currentTarget.getAttribute("aria-activedescendant")
    const row = active ? document.getElementById(active) : null
    const key = row?.dataset.key
    if (!row || !key) return
    e.preventDefault()
    openMenu(key, row.querySelector("[data-row-menu]") ?? row)
  }

  function pick(key: Key) {
    const item = allItems.find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    close()
  }

  const list = (
    <>
      {/* The search row drops the Command's hairline and sits on the same
          inset as the rows below; the New button, when any, shares it. */}
      <div className="mx-2 flex items-center gap-2">
        <SearchField
          // No search autofocus on mobile — the keyboard would cover the list;
          // nor over a row being renamed.
          autoFocus={surface === "popover" && !renamingId}
          aria-label="Search design systems"
          className="flex-1 border-b-0! px-0!"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input
              ref={searchRef}
              onKeyDown={onSearchKeyDown}
              placeholder="Search"
              onInput={(e) => {
                setQuery(e.currentTarget.value)
                // Typing moves the highlight to the first match, so from here on
                // the pane follows it.
                navigatedRef.current = true
              }}
            />
          </InputGroup>
        </SearchField>
        {onCreate && (
          <Button
            variant="secondary"
            size="md"
            className="mt-2 shrink-0"
            onPress={onCreate}
          >
            <PlusIcon />
            New
          </Button>
        )}
        {moreMenu && (
          <Button
            variant="quiet"
            size="md"
            isIconOnly
            aria-label="More"
            className="mt-2 shrink-0 text-fg-muted"
            onPress={(e) => openMenu(null, e.target)}
          >
            <MoreHorizontalIcon />
          </Button>
        )}
      </div>
      <CommandContent
        aria-label="Design systems"
        onAction={pick}
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
              <CommandItem
                key={item.id}
                id={item.id}
                textValue={item.name}
                className={cn(renderItemMenu && "pr-9")}
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
                    listRef={listRef}
                    onShow={surface === "popover" ? showPreview : undefined}
                    onHide={surface === "popover" ? hidePreview : undefined}
                    onMenu={
                      renderItemMenu
                        ? (trigger) => openMenu(item.id, trigger)
                        : undefined
                    }
                    rename={
                      item.id === renamingId && onRenameEnd
                        ? (name, submit) => {
                            onRenameEnd(item.id, name, submit)
                            // Back to the search, which drives the list.
                            if (!submit && surface === "popover")
                              requestAnimationFrame(() =>
                                searchRef.current?.focus(),
                              )
                          }
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

  // Outside the Autocomplete, whose contexts would otherwise reach the menu.
  const rowMenu = (
    <PopoverContext.Provider value={null}>
      <RootMenuTriggerStateContext.Provider value={null}>
        <MenuContext.Provider
          value={{ onClose: closeMenu, autoFocus: "first" }}
        >
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
      </RootMenuTriggerStateContext.Provider>
    </PopoverContext.Provider>
  )

  if (surface === "drawer")
    return (
      <>
        {pane ?? <Command>{list}</Command>}
        {rowMenu}
      </>
    )

  return (
    <>
      {pane ? (
        <div className="flex max-h-[inherit] w-65 flex-col">{pane}</div>
      ) : (
        <Command
          className="max-h-[inherit] w-65 overflow-hidden"
          onKeyDownCapture={(e) => {
            if (e.key.startsWith("Arrow")) navigatedRef.current = true
          }}
        >
          {list}
        </Command>
      )}
      {rowMenu}
      {flyout && previewItem && (
        <PresetPreviewFlyout
          item={previewItem}
          // Hidden, not unmounted, under a pane: its demos' hidden popovers
          // would otherwise take over the picker's arrow on remount.
          isVisible={engaged && !pane}
          forcedMode={previewMode}
        />
      )}
    </>
  )
}

/** One option: the preset's swatch and its name, in the site's own theme. */
function PresetOptionRow({
  item,
  isSelected,
  isFocused,
  isHovered,
  onShow,
  onHide,
  onMenu,
  rename,
  listRef,
}: {
  item: PresetPickerItem
  isSelected: boolean
  isFocused: boolean
  isHovered: boolean
  onShow?: (id: string, via: "hover" | "focus") => void
  onHide?: (id: string) => void
  onMenu?: (trigger: Element) => void
  rename?: (name: string | null, submit: boolean) => void
  listRef: RefObject<ListState<unknown> | null>
}) {
  // Hands the list's state up, to move its highlight after a delete.
  const list = useContext(ListStateContext)
  useEffect(() => {
    listRef.current = list
  }, [list, listRef])

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
  const rowRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isSelected) return
    const option = rowRef.current?.closest<HTMLElement>("[data-listbox-item]")
    const scroller = option?.offsetParent
    if (!option || !(scroller instanceof HTMLElement)) return
    scroller.scrollTop =
      option.offsetTop - (scroller.clientHeight - option.offsetHeight) / 2
  }, [isSelected])

  return (
    <>
      <Swatch ref={rowRef} color={item.swatch} />
      {rename ? (
        <RenameField name={item.name} onEnd={rename} />
      ) : (
        <span dir="auto" className="min-w-0 flex-1 truncate">
          {item.name}
        </span>
      )}
      {item.badge && (
        <span className="shrink-0 rounded-sm bg-fg/6 px-1 text-[0.6875rem] leading-4 text-fg-muted">
          {item.badge}
        </span>
      )}
      {isSelected && <CheckIcon className="size-3.5 shrink-0" />}
      {onMenu && (
        // A press here never reaches the row, so it doesn't pick it.
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          data-row-menu=""
          aria-label={`Actions for ${item.name}`}
          onPress={(e) => onMenu(e.target)}
          className="absolute top-1/2 right-1 -translate-y-1/2 text-fg-muted pointer-coarse:size-11"
        >
          <MoreHorizontalIcon />
        </Button>
      )}
    </>
  )
}

/**
 * The row's name as an input. A plain input, so the surrounding collection's
 * contexts don't reach it, and its events stop here so the row neither
 * selects nor type-selects while the user types. Enter or blur commits, Esc
 * cancels.
 */
function RenameField({
  name,
  onEnd,
}: {
  name: string
  onEnd: (name: string | null, submit: boolean) => void
}) {
  const ended = useRef(false)
  const end = (value: string | null, submit: boolean) => {
    if (ended.current) return
    ended.current = true
    onEnd(value, submit)
  }
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()

  return (
    <input
      aria-label="Design system name"
      defaultValue={name}
      maxLength={64}
      autoFocus
      onFocus={(e) => {
        stop(e)
        e.currentTarget.select()
      }}
      onBlur={(e) => end(e.currentTarget.value, false)}
      onKeyDown={(e) => {
        stop(e)
        if (e.key === "Enter") end(e.currentTarget.value, true)
        if (e.key === "Escape") end(null, false)
      }}
      onKeyUp={stop}
      onPointerDown={stop}
      onPointerUp={stop}
      onMouseDown={stop}
      onClick={stop}
      className="-my-1 h-6 min-w-0 flex-1 rounded-sm bg-transparent px-1 focus-reset inset-ring-1 inset-ring-fg/15 focus-visible:focus-ring"
    />
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

export type { PresetPickerItem, PresetPickerSection }
