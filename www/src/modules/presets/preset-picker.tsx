"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { CheckIcon, PlusIcon, SearchIcon } from "lucide-react"
import type { Key } from "react-aria-components"
import { useFilter } from "react-aria-components/Autocomplete"

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
  /** Extra classes on the desktop popover (e.g. the panel's instant motion). */
  popoverClassName?: string
  /** Pin the previews to one mode (docs previews pin light/dark). */
  previewMode?: "light" | "dark"
  /** Show the hover flyout beside the popover on desktop. Off by default. */
  withPreview?: boolean
  /** Trailing controls on a row (e.g. a saved preset's actions menu). */
  renderItemActions?: (item: PresetPickerItem) => ReactNode
  /** Adds a "+ New" button beside the search field; pressing it closes the picker first. */
  onCreate?: () => void
}

/**
 * The one preset picker, used by both the docs preview toolbar and the /create
 * panel: a searchable list of plain rows — an accent dot and the preset's name.
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
  popoverClassName,
  previewMode,
  withPreview = false,
  renderItemActions,
  onCreate,
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
          renderItemActions={renderItemActions}
          onCreate={onCreate}
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
            <Popover placement={placement} className={popoverClassName}>
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
  renderItemActions,
  onCreate,
}: {
  sections: PresetPickerSection[]
  selectedId?: string
  onPick: (item: PresetPickerItem) => void
  close: () => void
  surface: "popover" | "drawer"
  previewMode?: "light" | "dark"
  withPreview: boolean
  renderItemActions?: (item: PresetPickerItem) => ReactNode
  onCreate?: () => void
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

  function pick(key: Key) {
    const item = allItems.find((candidate) => candidate.id === key)
    if (!item) return
    onPick(item)
    close()
  }

  const list = (
    <>
      {/* With a New button beside it the search field gives up its own
          hairline; the row sits on the same inset as the rows below. */}
      <div className={cn("flex items-center", onCreate && "mx-2 gap-2")}>
        <SearchField
          // No search autofocus on mobile — the keyboard would cover the list.
          autoFocus={surface === "popover"}
          aria-label="Search design systems"
          className={cn(onCreate && "flex-1 border-b-0! px-0!")}
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input
              placeholder="Search..."
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
            onPress={() => {
              close()
              onCreate()
            }}
          >
            <PlusIcon />
            New
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
          maxHeight: surface === "popover" ? 420 : "60vh",
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
                className={cn(renderItemActions && "pr-9")}
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

  if (surface === "drawer") return <Command>{list}</Command>

  return (
    <>
      <Command
        className="max-h-[inherit] w-[260px] overflow-hidden"
        onKeyDownCapture={(e) => {
          if (e.key.startsWith("Arrow")) navigatedRef.current = true
        }}
      >
        {list}
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

/**
 * One option: the preset's accent as a dot and its name. The scope only themes
 * the dot — the row itself is the site's, so hover and highlight come from the
 * list like any other command item.
 */
function PresetOptionRow({
  item,
  isSelected,
  isFocused,
  isHovered,
  onShow,
  onHide,
  forcedMode,
  actions,
}: {
  item: PresetPickerItem
  isSelected: boolean
  isFocused: boolean
  isHovered: boolean
  onShow?: (id: string, via: "hover" | "focus") => void
  onHide?: (id: string) => void
  forcedMode?: "light" | "dark"
  actions?: ReactNode
}) {
  const { designSystem } = item

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
      <DesignSystemProvider
        scoped
        params={designSystem.componentParams}
        tokens={designSystem.tokens}
        density={designSystem.density}
        color={designSystem.color}
        icons={designSystem.icons}
        forcedMode={forcedMode}
      >
        <span
          ref={rowRef}
          aria-hidden
          // The hairline keeps a near-white or near-black accent from
          // vanishing into the row it sits on.
          className="size-2.5 shrink-0 rounded-full bg-accent ring-1 ring-fg/10 ring-inset"
        />
      </DesignSystemProvider>
      <span className="min-w-0 flex-1 truncate">{item.name}</span>
      {isSelected && <CheckIcon className="size-3.5 shrink-0" />}
      {/* Site chrome, deliberately outside the preset scope: the actions menu
          belongs to the site, not to the system it acts on. */}
      {actions ? (
        <span className="absolute top-1/2 right-1 -translate-y-1/2">
          {actions}
        </span>
      ) : null}
    </>
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
          <p className="min-w-0 flex-1 truncate font-heading text-base leading-tight font-semibold text-fg">
            {item.name}
          </p>
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full bg-accent ring-1 ring-fg/10 ring-inset"
          />
        </div>
        <Controls
          inert
          className="rounded-none border-0 bg-transparent shadow-none select-none"
        />
      </div>
    </DesignSystemProvider>
  )
}

export type { PresetPickerItem, PresetPickerSection }
