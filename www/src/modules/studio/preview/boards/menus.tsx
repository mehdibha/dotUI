"use client"

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"

import { DesignSystemContext, useComponentParams } from "@/lib/styles"
import {
  BellIcon,
  BoldIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  ItalicIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  MailIcon,
  MessageSquareIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  ShareIcon,
  TrashIcon,
  UnderlineIcon,
  VolumeOffIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card } from "@/registry/ui/card"
import { useStyles as useCommandStyles } from "@/registry/ui/command/styles"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { Input } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import { useStyles as useMenuStyles } from "@/registry/ui/menu/styles"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import {
  Board,
  BoardSection,
  StateRow,
  useBoardFocus,
  useRootTokens,
} from "./board"

/* --------------------------------- Frozen --------------------------------- */

/** A menu row under the pointer: react-aria marks it focused and hovered. */
const POINTED = {
  "data-rac": "",
  "data-focused": "true",
  "data-hovered": "true",
}

/** A list row reached with the arrow keys. */
const KEYED = {
  "data-rac": "",
  "data-focused": "true",
  "data-focus-visible": "true",
}

const ROW = { "data-rac": "" }

/** An open overlay's tip, as react-aria's OverlayArrow places it. */
function Tip({
  className,
  placement,
  size,
  left,
}: {
  className: string
  placement: "top" | "bottom"
  size: number
  left: number | string
}) {
  return (
    <div
      data-placement={placement}
      className={className}
      style={{
        position: "absolute",
        [placement]: "100%",
        left,
        transform: "translateX(-50%)",
      }}
    >
      <svg aria-hidden width={size} height={size} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </div>
  )
}

/** The anchor's centre and bottom edge, in px from the frame's top-left corner. */
function useAnchor(
  anchor: RefObject<HTMLElement | null>,
  frame: RefObject<HTMLElement | null>,
) {
  const [point, setPoint] = useState<{ x: number; y: number }>()
  useLayoutEffect(() => {
    const a = anchor.current
    const f = frame.current
    if (!a || !f) return
    const measure = () => {
      const ar = a.getBoundingClientRect()
      const fr = f.getBoundingClientRect()
      setPoint({ x: ar.left + ar.width / 2 - fr.left, y: ar.bottom - fr.top })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(a)
    observer.observe(f)
    return () => observer.disconnect()
  }, [anchor, frame])
  return point
}

/** Replays every `[data-entrance]` overlay's real entrance while the panel edits menu motion. */
function useEntranceReplay() {
  const { axis } = useBoardFocus()
  const { params } = useContext(DesignSystemContext)
  const tokens = useRootTokens()
  useEffect(() => {
    if (axis !== "menuMotion") return
    for (const el of document.querySelectorAll<HTMLElement>(
      "[data-entrance]",
    )) {
      // Jump to react-aria's `entering` state, then release it to animate in.
      el.style.transition = "none"
      el.setAttribute("data-entering", "")
      void el.offsetWidth
      el.style.transition = ""
      el.removeAttribute("data-entering")
    }
  }, [axis, params, tokens])
}

/** Avatars and role chips: colour for a glass popover to blur. */
const PEOPLE = [
  {
    name: "Maya Chen",
    role: "Owner",
    variant: "accent",
    tint: "bg-accent-muted text-fg-accent",
  },
  {
    name: "Leo Park",
    role: "Editor",
    variant: "info",
    tint: "bg-info-muted text-fg-info",
  },
  {
    name: "Ana Ruiz",
    role: "Editor",
    variant: "info",
    tint: "bg-success-muted text-fg-success",
  },
  {
    name: "Sam Ito",
    role: "Viewer",
    variant: "neutral",
    tint: "bg-warning-muted text-fg-warning",
  },
  {
    name: "Noor Haddad",
    role: "Editor",
    variant: "info",
    tint: "bg-danger-muted text-fg-danger",
  },
  {
    name: "Jonas Weber",
    role: "Viewer",
    variant: "neutral",
    tint: "bg-accent-muted text-fg-accent",
  },
] as const

const PERSON_ROW = 52

/** A row height near `row` that ends a whole row exactly at the popover's bottom, so none peeks out half-covered. */
function useRowHeight(
  list: RefObject<HTMLElement | null>,
  popover: RefObject<HTMLElement | null>,
  row: number,
  open = true,
) {
  const [height, setHeight] = useState<number>()
  useLayoutEffect(() => {
    const l = list.current
    const p = popover.current
    if (!l || !p) return
    const measure = () => {
      const room =
        p.getBoundingClientRect().bottom - l.getBoundingClientRect().top
      setHeight(room / Math.max(1, Math.round(room / row)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(p)
    return () => observer.disconnect()
  }, [list, popover, row, open])
  return open ? height : undefined
}

function People({
  ref,
  height = PERSON_ROW,
}: {
  ref: RefObject<HTMLUListElement | null>
  height?: number
}) {
  return (
    <ul ref={ref} className="col-start-1 row-start-1 flex flex-col self-start">
      {PEOPLE.map((person) => (
        <li
          key={person.name}
          style={{ height }}
          className="flex shrink-0 items-center gap-3 border-b px-6 text-sm last:border-b-0 max-sm:px-4"
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
              person.tint,
            )}
          >
            {person.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <span className="truncate">{person.name}</span>
          <Badge variant={person.variant} className="ml-auto">
            {person.role}
          </Badge>
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------- Menu ---------------------------------- */

const FILES = [
  {
    icon: <FileTextIcon />,
    label: "Guidelines.pdf",
    meta: "2.4 MB",
    tint: "bg-accent-muted text-fg-accent",
  },
  {
    icon: <ImageIcon />,
    label: "Logo.svg",
    meta: "24 KB",
    tint: "bg-warning-muted text-fg-warning",
  },
  {
    icon: <ImageIcon />,
    label: "Hero photo.jpg",
    meta: "3.1 MB",
    tint: "bg-success-muted text-fg-success",
  },
  {
    icon: <FileCodeIcon />,
    label: "tokens.json",
    meta: "8 KB",
    tint: "bg-info-muted text-fg-info",
  },
  {
    icon: <FileIcon />,
    label: "Launch deck.key",
    meta: "18 MB",
    tint: "bg-danger-muted text-fg-danger",
  },
  {
    icon: <FolderIcon />,
    label: "Press kit",
    meta: "12 files",
    tint: "bg-muted text-fg-muted",
  },
  {
    icon: <ImageIcon />,
    label: "Banner.png",
    meta: "1.2 MB",
    tint: "bg-accent-muted text-fg-accent",
  },
  {
    icon: <FileTextIcon />,
    label: "Tone of voice.md",
    meta: "6 KB",
    tint: "bg-success-muted text-fg-success",
  },
]

/** Tinted thumbnails, so glass has colour to blur; the column under the menu is left empty. */
function Gallery() {
  return (
    <ul className="col-start-1 row-start-1 grid grid-cols-2 gap-x-4 gap-y-5 p-6 max-sm:p-4 sm:grid-cols-[repeat(2,minmax(0,1fr))_14rem] lg:grid-cols-[repeat(3,minmax(0,1fr))_14rem] max-sm:[&>li:nth-child(-n+4):nth-child(even)]:invisible max-lg:[&>li:nth-child(n+7)]:hidden">
      {FILES.map((file) => (
        <li key={file.label} className="flex min-w-0 flex-col gap-2">
          <span
            className={cn(
              "flex h-28 items-center justify-center rounded-(--studio-radius-surface) sm:h-36 [&_svg]:size-6",
              file.tint,
            )}
          >
            {file.icon}
          </span>
          <span className="flex flex-col text-sm">
            <span className="truncate">{file.label}</span>
            <span className="text-xs text-fg-muted tabular-nums">
              {file.meta}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function MenuSpecimen() {
  const { popover, arrow } = usePopoverStyles()()
  const {
    root,
    item,
    indicator,
    submenuIndicator,
    itemLabel,
    section,
    sectionTitle,
  } = useMenuStyles()()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const anchor = useAnchor(trigger, panel)

  const check = (selected: boolean) => (
    <span className={indicator()}>{selected && <CheckIcon />}</span>
  )

  return (
    <div inert className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-3 max-sm:px-4">
        <FolderIcon className="size-4 text-fg-muted" />
        <span className="text-sm font-medium">Brand assets</span>
        <Button
          ref={trigger}
          variant="quiet"
          isIconOnly
          aria-label="More"
          className="ml-auto"
        >
          <MoreHorizontalIcon />
        </Button>
      </div>
      <div className="grid">
        <Gallery />
        <div
          ref={panel}
          data-popover=""
          data-trigger="MenuTrigger"
          data-placement="bottom"
          data-entrance=""
          className={popover({
            className:
              "relative col-start-1 row-start-1 -mt-1 mr-6 mb-6 w-56 self-start justify-self-end max-sm:mr-4",
          })}
        >
          <div role="menu" className={root()}>
            <section className={section()}>
              <header className={sectionTitle()}>File</header>
              <div {...ROW} className={item()}>
                <PencilIcon />
                <span className={itemLabel()}>Rename</span>
                <Kbd>⌘R</Kbd>
              </div>
              <div {...POINTED} className={item()}>
                <CopyIcon />
                <span className={itemLabel()}>Duplicate</span>
                <Kbd>⌘D</Kbd>
              </div>
              <div {...ROW} data-has-submenu="true" className={item()}>
                <ShareIcon />
                <span className={itemLabel()}>Share</span>
                <span className={submenuIndicator()}>
                  <ChevronRightIcon className="size-4" />
                </span>
              </div>
            </section>
            <Separator />
            <section className={section()}>
              <header className={sectionTitle()}>View as</header>
              <div
                {...ROW}
                data-selection-mode="single"
                data-selected="true"
                className={item()}
              >
                {check(true)}
                <LayoutGridIcon />
                <span className={itemLabel()}>Grid</span>
              </div>
              <div {...ROW} data-selection-mode="single" className={item()}>
                {check(false)}
                <ListIcon />
                <span className={itemLabel()}>List</span>
              </div>
            </section>
            <Separator />
            <div {...ROW} data-variant="danger" className={item()}>
              <TrashIcon />
              <span className={itemLabel()}>Delete</span>
              <Kbd>⌘⌫</Kbd>
            </div>
          </div>
          {anchor && (
            <Tip
              className={arrow()}
              placement="bottom"
              size={12}
              left={anchor.x}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- List box -------------------------------- */

function ListBoxSpecimen() {
  return (
    <Card className="w-60 gap-0 py-0">
      <ListBox
        aria-label="Notify me about"
        selectionMode="single"
        defaultSelectedKeys={["mentions"]}
        disallowEmptySelection
      >
        <ListBoxItem id="all" textValue="All activity">
          <BellIcon />
          All activity
        </ListBoxItem>
        <ListBoxItem id="mentions" textValue="Mentions only">
          <MessageSquareIcon />
          Mentions only
        </ListBoxItem>
        <ListBoxItem id="digest" textValue="Daily digest">
          <MailIcon />
          Daily digest
        </ListBoxItem>
        <ListBoxItem id="nothing" textValue="Nothing">
          <VolumeOffIcon />
          Nothing
        </ListBoxItem>
      </ListBox>
    </Card>
  )
}

const ROW_STATES = ["rest", "hover", "selected", "disabled"] as const

function ListRowStates() {
  const { root, item, indicator, itemLabel } = useListStyles()()
  return (
    <StateRow states={ROW_STATES}>
      {(props, state) => (
        <div className={root({ className: "w-40" })}>
          <div {...props} data-selection-mode="single" className={item()}>
            <span className={indicator()}>
              {state === "selected" && <CheckIcon />}
            </span>
            <MessageSquareIcon />
            <span className={itemLabel()}>Mentions</span>
          </div>
        </div>
      )}
    </StateRow>
  )
}

/* --------------------------------- Popover -------------------------------- */

function PopoverSpecimen() {
  const { popover, arrow } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const anchor = useAnchor(trigger, panel)
  const list = useRef<HTMLUListElement>(null)
  const height = useRowHeight(list, panel, PERSON_ROW)
  return (
    <div inert className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-3 max-sm:px-4">
        <span className="text-sm font-medium">Acme Web</span>
        <Button ref={trigger} variant="secondary" className="ml-auto">
          <ShareIcon data-icon="inline-start" />
          Share
        </Button>
      </div>
      <div className="grid">
        <People ref={list} height={height} />
        <div
          ref={panel}
          data-popover=""
          data-trigger="DialogTrigger"
          data-placement="bottom"
          data-entrance=""
          className={popover({
            className:
              "relative col-start-1 row-start-1 mx-4 -mt-1 mb-6 w-72 max-w-[calc(100%-2rem)] self-start justify-self-end",
          })}
        >
          <div className={content()}>
            <DialogHeader>
              <DialogTitle>Invite to Acme Web</DialogTitle>
              <DialogDescription>
                Collaborators can edit and comment.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <TextField aria-label="Email" className="min-w-0 flex-1">
                <Input placeholder="Email" />
              </TextField>
              <Button variant="primary">Invite</Button>
            </div>
          </div>
          {anchor && (
            <Tip
              className={arrow()}
              placement="bottom"
              size={12}
              left={anchor.x}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Tooltip -------------------------------- */

function TooltipSpecimen() {
  const { content, arrow } = useTooltipStyles()()
  const trigger = useRef<HTMLButtonElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const anchor = useAnchor(trigger, frame)
  return (
    <div ref={frame} inert className="relative flex flex-1 flex-col">
      <div className="flex items-center gap-1 border-b px-4 py-2">
        <ToggleButton variant="quiet" isIconOnly aria-label="Bold" isSelected>
          <BoldIcon />
        </ToggleButton>
        <ToggleButton variant="quiet" isIconOnly aria-label="Italic">
          <ItalicIcon />
        </ToggleButton>
        <ToggleButton variant="quiet" isIconOnly aria-label="Underline">
          <UnderlineIcon />
        </ToggleButton>
        <Button ref={trigger} variant="quiet" isIconOnly aria-label="Link">
          <LinkIcon />
        </Button>
      </div>
      <p className="px-6 pt-5 pb-10 text-sm/relaxed text-fg-muted">
        Ship the new onboarding by Friday. Link the research doc and loop in
        design before the review on Thursday.
      </p>
      {anchor && (
        <div
          className="absolute -translate-x-1/2"
          // The tooltip's 10px offset, as react-aria places it.
          style={{ left: anchor.x, top: anchor.y + 10 }}
        >
          <div
            data-placement="bottom"
            data-entrance=""
            className={content({ className: "relative whitespace-nowrap" })}
          >
            Add link <span className="opacity-60">⌘K</span>
            <Tip className={arrow()} placement="bottom" size={8} left="50%" />
          </div>
        </div>
      )}
    </div>
  )
}

/* --------------------------------- Command -------------------------------- */

function CommandSpecimen() {
  const { modal } = useModalStyles()()
  const command = useCommandStyles()
  const { root, item, itemLabel, section, sectionTitle } = useListStyles()()
  const rows = (
    entries: { icon: React.ReactNode; label: string; kbd?: string }[],
    keyed?: number,
  ) =>
    entries.map((entry, i) => (
      <div
        key={entry.label}
        data-listbox-item=""
        {...(i === keyed ? KEYED : ROW)}
        className={item()}
      >
        {entry.icon}
        <span className={itemLabel()}>{entry.label}</span>
        {entry.kbd && <Kbd>{entry.kbd}</Kbd>}
      </div>
    ))
  return (
    <div
      inert
      data-modal=""
      className={modal({ className: "w-full sm:max-w-lg" })}
    >
      <div data-command="" className={command()}>
        <SearchField aria-label="Search" placeholder="Search or jump to…" />
        <div data-listbox="" className={root()}>
          <section data-listbox-section="" className={section()}>
            <header data-listbox-section-header="" className={sectionTitle()}>
              Suggestions
            </header>
            {rows(
              [
                { icon: <PlusIcon />, label: "New issue", kbd: "C" },
                { icon: <SettingsIcon />, label: "Open settings", kbd: "⌘," },
                { icon: <MoonIcon />, label: "Switch theme" },
              ],
              0,
            )}
          </section>
          <Separator />
          <section data-listbox-section="" className={section()}>
            <header data-listbox-section-header="" className={sectionTitle()}>
              Projects
            </header>
            {rows([
              { icon: <FolderIcon />, label: "Acme Web" },
              { icon: <FolderIcon />, label: "Mobile app" },
            ])}
          </section>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Mobile --------------------------------- */

const ORDER_ROW = 45

const SORTS = ["Newest first", "Oldest first", "Price: low to high"]

const ORDERS = [
  { label: "#1042 · Maya Chen", meta: "$248.00" },
  { label: "#1041 · Leo Park", meta: "$96.50" },
  { label: "#1040 · Ana Ruiz", meta: "$1,120.00" },
  { label: "#1039 · Sam Ito", meta: "$64.00" },
  { label: "#1038 · Noor Haddad", meta: "$310.00" },
]

function SortRows() {
  const { root, item, indicator, itemLabel } = useListStyles()()
  return (
    <div data-listbox="" className={root()}>
      {SORTS.map((label, i) => (
        <div
          key={label}
          data-listbox-item=""
          {...ROW}
          data-selection-mode="single"
          data-selected={i === 0 || undefined}
          className={item()}
        >
          <span className={indicator()}>{i === 0 && <CheckIcon />}</span>
          <span className={itemLabel()}>{label}</span>
        </div>
      ))}
    </div>
  )
}

/** A phone: the page with its picker open, as a drawer or anchored. */
function PhoneSpecimen() {
  const mobile = useComponentParams("popover").mobile ?? "drawer"
  const { popover, arrow } = usePopoverStyles()()
  const list = useRef<HTMLUListElement>(null)
  const picker = useRef<HTMLDivElement>(null)
  const height =
    useRowHeight(list, picker, ORDER_ROW, mobile === "anchored") ?? ORDER_ROW
  const { overlay, backdrop, popup, handle } = useDrawerStyles()({
    placement: "bottom",
  })
  return (
    <div
      inert
      className="relative isolate flex h-96 w-72 max-w-full flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-fg/10 bg-bg sm:h-120"
    >
      <div className="flex flex-col gap-4 px-4 pt-10">
        <span className="text-lg font-medium">Orders</span>
        <Select
          aria-label="Sort"
          defaultSelectedKey="newest"
          className="w-full"
        >
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="newest">Newest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 grid">
        <ul ref={list} className="col-start-1 row-start-1 flex flex-col px-5">
          {ORDERS.map((order) => (
            <li
              key={order.label}
              style={{ height }}
              className="flex shrink-0 items-center gap-3 border-b text-sm last:border-b-0"
            >
              <span className="truncate">{order.label}</span>
              <span className="ml-auto text-fg-muted tabular-nums">
                {order.meta}
              </span>
            </li>
          ))}
        </ul>
        {mobile === "anchored" && (
          <div
            ref={picker}
            data-popover=""
            data-trigger="Select"
            data-placement="bottom"
            data-entrance=""
            className={popover({
              className:
                "relative col-start-1 row-start-1 mx-4 self-start overflow-visible",
            })}
          >
            <SortRows />
            <Tip className={arrow()} placement="bottom" size={12} left="50%" />
          </div>
        )}
      </div>
      {mobile === "drawer" && (
        <div className={overlay({ className: "absolute z-10" })}>
          {/* Its blur escapes the phone's clip unless it carries the screen's radius. */}
          <div
            className={backdrop({ className: "rounded-[calc(2.5rem-6px)]" })}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col">
            <div data-drawer="" className={popup()}>
              <div data-orientation="horizontal" className={handle()} />
              <SortRows />
              {/* The phone's home-indicator inset. */}
              <div className="h-3 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------- Board --------------------------------- */

const ROW_KEYS = [
  "menuHighlight",
  "menuInset",
  "roleItem",
  "menuIndicator",
  "menuSelectedRow",
  "menuRows",
]

/** A stage: the specimen fills the box, its overlay over the content behind. */
const STAGE =
  "flex-col flex-nowrap items-stretch justify-start gap-0 overflow-hidden p-0 max-sm:p-0"

/** List box over Tooltip, beside the taller phone, once both columns fit. */
const SPLIT = "grid grid-cols-1 gap-10 lg:grid-cols-2"

export default function MenusBoard() {
  useEntranceReplay()
  return (
    <Board id="menus">
      <BoardSection
        member="menu"
        title="Menu"
        axes={[...ROW_KEYS, "surfaceGlass", "menuMotion"]}
        className={STAGE}
      >
        <MenuSpecimen />
      </BoardSection>

      <div className={SPLIT}>
        <BoardSection
          member="list-box"
          title="List box"
          axes={ROW_KEYS}
          className="flex-1 flex-col gap-10"
        >
          <ListBoxSpecimen />
          <div className="max-w-md">
            <ListRowStates />
          </div>
        </BoardSection>
        {/* First to hold menuArrows: its tip sits near its top, in view when docked. */}
        <BoardSection
          member="tooltip"
          title="Tooltip"
          axes={["tooltipStyle", "menuArrows", "surfaceGlass", "menuMotion"]}
          className={cn(STAGE, "flex-1")}
        >
          <TooltipSpecimen />
        </BoardSection>
        <div className="grid lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <BoardSection
            member="mobile"
            title="Mobile"
            axes={["mobilePickers"]}
            className="flex-1"
          >
            <PhoneSpecimen />
          </BoardSection>
        </div>
      </div>

      <BoardSection
        member="popover"
        title="Popover"
        axes={["menuArrows", "surfaceGlass", "menuMotion"]}
        className={STAGE}
      >
        <PopoverSpecimen />
      </BoardSection>

      <BoardSection
        member="command"
        title="Command"
        axes={["menuSearch", "menuScale"]}
      >
        <CommandSpecimen />
      </BoardSection>
    </Board>
  )
}
